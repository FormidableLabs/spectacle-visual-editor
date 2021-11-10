import { Handler } from '@netlify/functions';
import { ApolloServer, gql } from 'apollo-server-lambda';
import { merge } from 'lodash';
import faunadb from 'faunadb';

import { DBSECRET, CONTEXT } from '../../env-inline';
import { createDbAdapter, faunaTimeScalar } from './lib/faunadb';
import { authenticateUser } from './lib/auth';
import { getTempFrontend } from './lib/temp-frontend';

import { deckTypes, deckResolvers } from './model/deck';
import { userTypes, userResolvers } from './model/user';

// For dev, use local process.env instead of inlined
const ENV_DB_SECRET = DBSECRET === 'none' ? process.env.DBSECRET : DBSECRET;
const ENV_CONTEXT = CONTEXT === 'none' ? process.env.CONTEXT : CONTEXT;

if (!ENV_DB_SECRET || ENV_DB_SECRET === 'none') {
  throw 'FaunaDB database secret not set';
}

// Netlify does not set NODE_ENV, we can use our inlined one
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = ENV_CONTEXT;
}

// Initialize empty so we can extend in files per model
const emptyType = gql`
  scalar FaunaTime
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;

const typeDefs = [emptyType, deckTypes, userTypes];
const resolvers = merge(deckResolvers, userResolvers, {
  FaunaTime: faunaTimeScalar
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ context }) => {
    // FaunaDB's docs say to instantiate this in the handler, they do not
    // recommend long-running memoized connections
    const faunaClient = new faunadb.Client({ secret: ENV_DB_SECRET });

    let userIdentity;
    try {
      userIdentity = await authenticateUser(context, faunaClient);
    } catch (err) {
      throw `Authentication error: ${err}`;
    }

    const userRoles = userIdentity ? ['user', 'guest'] : ['guest'];

    // For the moment this is only set by hand in the FaunaDB UI
    if (userIdentity?.admin) {
      userRoles.push('admin');
    }

    const db = createDbAdapter(faunaClient);

    return { db, userRoles, userIdentity };
  },
  introspection: ENV_CONTEXT !== 'production'
});

const apolloHandler = server.createHandler();

export const handler: Handler = async (event, context, ...args) => {
  // This is a temporary page to allow us to test the Netlify Identity functions
  // before they are implemented in the frontend.
  if (event.rawQuery === 'identitytest=') {
    return { statusCode: 200, body: getTempFrontend(event.rawUrl) };
  }

  return apolloHandler(
    {
      ...event,
      requestContext: context
    },
    // This is necessary to make Netlify happy with apollo-server-lambda
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context as any,
    ...args
  );
};
