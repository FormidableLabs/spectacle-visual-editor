// Netlify Build Plugins must be CJS - ESM/TypeScript not supported
/* eslint-disable @typescript-eslint/no-var-requires */
const faunadb = require('faunadb');
const { writeFile } = require('fs').promises;

module.exports = {
  onPreBuild: async ({ utils, constants }) => {
    const faunaDBSecret = process.env.FAUNADB_ADMIN_SECRET;
    if (!faunaDBSecret) {
      return utils.build.failBuild(
        `Missing FaunaDB admin secret env variable.  Is FaunaDB plugin installed?`
      );
    }
    const adminClient = new faunadb.Client({
      secret: faunaDBSecret
    });

    const dbName =
      'spectacle-visual-editor-' +
      (process.env.CONTEXT === 'production' ? 'prod' : 'dev');
    const q = faunadb.query;

    // Create the database if it does not exist
    const dbExists = await adminClient.query(q.Exists(q.Database(dbName)));
    console.log(
      dbExists
        ? `Database ${dbName} exists`
        : `Database ${dbName} does not exist, creating it`
    );
    if (!dbExists) {
      try {
        await adminClient.query(q.CreateDatabase({ name: dbName }));
      } catch (err) {
        console.log(err);
        return utils.build.failBuild(
          `Failed to create faunaDB database ${dbName}: ${err}`
        );
      }
    }

    let serverKey;
    // Create a server key for this database
    try {
      serverKey = await adminClient.query(
        q.CreateKey({ database: q.Database(dbName), role: 'server' })
      );
      console.log(`Created new server key for ${dbName}`);
    } catch (err) {
      console.log(err);
      return utils.build.failBuild(
        `Failed to create faunaDB server key for ${dbName}: ${err}`
      );
    }

    if (!constants.IS_LOCAL) {
      // On Netlify, replace this file with our inlined env variables
      try {
        await writeFile(
          'netlify/env-inline.ts',
          `/* eslint-disable @typescript-eslint/no-inferrable-types */
  export const DBSECRET = '${serverKey.secret}';
  export const CONTEXT: string = '${process.env.CONTEXT}';
  `
        );
      } catch (err) {
        return utils.build.failBuild(
          `Failed to write database key for ${dbName} to inline env file`
        );
      }
    } else {
      // On Dev, leave it alone and ask us to put it in a .env file instead
      // otherwise it makes it far too easy to accidentally commit our secrets
      console.log(`
=========================

Add the following line to your .env file

DBSECRET=${serverKey.secret}

=========================
      `);
    }
    // Create the collections if they do not exist
    const collections = ['Decks', 'Users'];
    const serverClient = new faunadb.Client({ secret: serverKey.secret });

    for (const collection of collections) {
      const colExists = await serverClient.query(
        q.Exists(q.Collection(collection))
      );
      if (colExists) {
        console.log(`Collection ${collection} exists`);
      } else {
        try {
          await serverClient.query(q.CreateCollection({ name: collection }));
          console.log(`Created collection ${collection}`);
        } catch (err) {
          console.log(err);
          return utils.build.failBuild(
            `Failed to create faunaDB collection for ${collection}: ${err}`
          );
        }
      }
    }

    // Create indexes (this does not validate if they have changed)
    const indexes = [
      {
        name: 'decks_unique_name_per_owner',
        source: q.Collection('Decks'),
        terms: [{ field: ['data', 'owner'] }, { field: ['data', 'name'] }],
        unique: true
      },
      {
        name: 'decks_all',
        source: q.Collection('Decks')
      },
      {
        name: 'decks_by_owner',
        source: q.Collection('Decks'),
        terms: [{ field: ['data', 'owner'] }]
      },
      {
        name: 'decks_by_id',
        source: q.Collection('Decks'),
        terms: [{ field: ['data', 'id'] }],
        unique: true
      },
      {
        name: 'decks_by_collaborator',
        source: q.Collection('Decks'),
        terms: [{ field: ['data', 'collaborators'] }]
      },
      {
        name: 'decks_by_publicurl',
        source: q.Collection('Decks'),
        terms: [{ field: ['data', 'publicUrl'] }],
        unique: true
      },
      {
        name: 'decks_by_collaburl',
        source: q.Collection('Decks'),
        terms: [{ field: ['data', 'collabUrl'] }],
        unique: true
      },
      {
        name: 'users_all',
        source: q.Collection('Users')
      },
      {
        name: 'users_by_id',
        source: q.Collection('Users'),
        terms: [{ field: ['data', 'id'] }],
        unique: true
      },
      {
        name: 'users_by_email',
        source: q.Collection('Users'),
        terms: [{ field: ['data', 'email'] }]
      }
    ];

    for (const index of indexes) {
      const indexExists = await serverClient.query(
        q.Exists(q.Index(index.name))
      );
      if (indexExists) {
        console.log(`Index ${index.name} exists`);
      } else {
        try {
          await serverClient.query(q.CreateIndex(index));
          console.log(`Created index ${index.name}`);
        } catch (err) {
          console.log(err);
          return utils.build.failBuild(
            `Failed to create faunaDB index for ${index.name}: ${err}`
          );
        }
      }
    }

    // Succsesfully completed
    console.log(`Successfully migrated faunadb`);
    return;
  }
};
