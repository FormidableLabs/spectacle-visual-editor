# GraphQL Backend API

### Dev Environment Setup

- Ensure your netlify dev environment is properly linked to a netlify site that has the FaunaDB and Netlify Identity plugins enabled
- Run `yarn netlify build --context=dev` to create the dev database if necessary, or to create a new key to the existing dev database.  This only has to be done once unless you change the indexes or anything that affects the server-hosted schema (ie. things in `create-faunadb/index.js`)
- From the build script, add the `DBSECRET` given to your `.env` file.
- Run `yarn netstart` to launch the locally hosted functions.
- The GraphQL endpoint in dev is located at http://localhost:8081/.netlify/functions/api/ and should expose a Studio link with introspection enabled.

### Logging into Netlify Identity within Dev Encironment

- As a temporary measure until Netlify Identity logins are supported by the actual frontend, a page is available at http://localhost:8081/.netlify/functions/api/?identitytest that will allow you to sign in and test user roles.

The [Netlify Identity Widget](https://github.com/netlify/netlify-identity-widget) page has a list of options for how to set things up on the frontend, from pre-made React bindings down to low-level interaction with their "GoTrue" library.

The backend API handles no part of the user authentication process, it assumes that any validated identity context passed to it by Netlify's function context represents a logged-in user.

Production and dev both share the same user database for logins (Netlify has no way of splitting these), but the FaunaDB databases will be separate.

Authorization is currently split into three roles, "guest" which can only access the `publicUrl` object, "user" which can access most things that belong to them or that they are collaborating on, and "admin" which can access everything.  The admin role is currently assigned manually by editing the user document within FaunaDB.