export type { IResolvers } from '@graphql-tools/utils';

import type createDbAdapter from '../lib/faunadb';

export type Context = {
  db: typeof createDbAdapter.dbAdapter;
  userRoles: string[];
  userIdentity: User | undefined;
};

export type * from './deck';
export type * from './faunadb';
export type * from './user';
