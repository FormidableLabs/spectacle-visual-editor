/* eslint @typescript-eslint/no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */
import type * as Api from '../types/main';
import { gql, ForbiddenError, UserInputError } from 'apollo-server-lambda';
import { requiresRole } from '../lib/auth';
import { Deck } from './deck';

export const userTypes = gql`
  extend type Query {
    "Returns all Users. Must have Admin role"
    allUsers: [User]

    "Returns the details for the logged-in user"
    myUser: User
  }

  type User {
    "User ID as provided by Netlify Identity"
    id: ID!

    "Display name for the user (provided on signup or by third party metadata)"
    name: String!

    "Email for the user"
    email: String!

    "Optional avatar URL for the user (usually provided by third party login)"
    avatarUrl: String

    "Timestamp of last user interaction we have seen"
    lastSeen: FaunaTime

    "All Decks owned by the logged-in user"
    decksOwned: [Deck]

    "All Decks that the logged-in user is a collaborator on"
    decksCollaborated: [Deck]
  }
`;

export const userResolvers: Api.IResolvers = {
  Query: {
    allUsers: async (_, __, context) => {
      requiresRole(context, 'admin');
      return await getAllUsers(context);
    },
    myUser: async (_, __, context) => {
      requiresRole(context, 'user');
      const user = context.userIdentity as Api.User;
      return user.id ? await getUserByRef(context, user._ref) : null;
    }
  },
  User: {
    decksOwned: async (parent, _, context) => {
      requiresRole(context, 'user');
      return await Deck.getDecksByOwner(context, parent._ref);
    },
    decksCollaborated: async (parent, _, context) => {
      requiresRole(context, 'user');
      return await Deck.getDecksByCollaborator(context, parent._ref);
    }
  }
};

const getAllUsers = async (context: Api.Context): Promise<Api.User[]> => {
  const result: unknown[] = await context.db.getDocumentsByIndex('users_all');
  return result as Api.User[];
};

const getUserById = async (
  context: Api.Context,
  userId: string
): Promise<Api.User> => {
  const result: unknown = await context.db.getDocumentByIndex(
    'users_by_id',
    userId
  );
  if (!result) {
    throw new UserInputError('Invalid user ID');
  }
  return filterUserByRole(context, result as Api.User);
};

const getUserByRef = async (
  context: Api.Context,
  userRef: Api.Ref
): Promise<Api.User | null> => {
  const result: unknown = await context.db.getDocumentByRef(userRef);
  return filterUserByRole(context, result as Api.User);
};

const getUsersByRefList = async (
  context: Api.Context,
  userRefs: Api.Ref[]
): Promise<Api.User[] | null> => {
  const result: unknown[] = await context.db.getDocumentsByRefList(userRefs);
  return result
    ? (result.map((u) =>
        filterUserByRole(context, u as Api.User)
      ) as Api.User[])
    : null;
};

const filterUserByRole = (context: Api.Context, user: Api.User): Api.User => {
  if (context.userIdentity && user.id === context.userIdentity.id) {
    // This is me, return the whole user object
    return user;
  } else {
    // Is not me
    if (context.userRoles.includes('admin')) {
      // Admin can see everything
      return user;
    } else if (context.userRoles.includes('user')) {
      // Users can see some fields only
      const { _ref, id, name, avatarUrl } = user;
      return { _ref, id, name, avatarUrl };
    }
  }
  throw new ForbiddenError('This role cannot look up users');
};

export const User = {
  getAllUsers,
  getUserByRef,
  getUserById,
  getUsersByRefList
};
