import type * as Api from '../types/main';
import type { Context } from '@netlify/functions/src/function/context';
import { faunaToInline } from './faunadb';
import faunadb from 'faunadb';
import { ForbiddenError } from 'apollo-server-errors';

export const authenticateUser = async (
  context: Context,
  faunaClient: faunadb.Client
): Promise<Api.User | undefined> => {
  // Netlify handles the actual authentication, so we are just checking if
  // the identity object exists and getting our internal _id ref

  const user = context?.clientContext?.user;
  if (!user) {
    // Return undefined, guest users are still valid for some requests
    return;
  }

  const q = faunadb.query;

  const identity = {
    id: user.sub,
    name: user?.user_metadata?.full_name || user.email,
    email: user.email,
    provider: user?.app_metadata?.provider || 'local',
    avatarUrl: user?.user_metadata?.avatar_url || null,
    lastSeen: q.Now()
  } as Api.User;

  if (!identity.id || !identity.email) {
    throw 'Could not find ID or email';
  }

  // Update existing user, create if not exist, return doc with ref
  const identityDoc: Api.FaunaResultObject = await faunaClient.query(
    q.Let(
      {
        match: q.Match(q.Index('users_by_id'), identity.id),
        identity: { data: identity }
      },
      q.If(
        q.Exists(q.Var('match')),
        q.Update(q.Select('ref', q.Get(q.Var('match'))), q.Var('identity')),
        q.Create(q.Collection('Users'), q.Var('identity'))
      )
    )
  );

  return faunaToInline(identityDoc) as Api.User;
};

export const requiresRole = (context: Api.Context, role: string): void => {
  if (context.userRoles && context.userRoles.includes(role)) {
    return;
  }
  throw new ForbiddenError(
    `Requires "${role}" role, user only has "${context.userRoles.join(' ')}"`
  );
};
