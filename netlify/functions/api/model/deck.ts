/* eslint @typescript-eslint/no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */
import type * as Api from '../types/main';
import { gql, ForbiddenError, UserInputError } from 'apollo-server-lambda';
import { requiresRole } from '../lib/auth';
import { User } from './user';
import { v4 as uuidv4 } from 'uuid';

export const deckTypes = gql`
  extend type Query {
    "Return all decks. Requires Admin user role"
    allDecks: [Deck]

    "Return all decks beloning to a logged-in user"
    allMyDecks: [Deck]

    "Get the name and contents of a deck by its public URL. Requires no authentication"
    deckByPublicUrl(publicUrl: String!): Deck

    "Get a Deck by its collaborator invite URL"
    deckByCollabUrl(collabUrl: String!): Deck
  }

  extend type Mutation {
    "Create a new deck, requires contents JSON and a unique name amongst owner's decks."
    createDeck(name: String!, contents: String!): Deck

    "Update name of a deck, based on its ID. Must be owner of deck and name must be unique for owner."
    updateDeckName(id: ID!, name: String!): Deck

    "Update contents of a deck based on ID, saves new modified date/user. Must be owner or collaborator."
    updateDeckContents(id: ID!, contents: String!): Deck

    "Delete a deck (must be owner)"
    deleteDeck(id: ID!): Deck

    "Create a public URL for deck, if URL is not specified a random UUIDv4 will be used"
    createDeckPublicUrl(id: ID!, publicUrl: String): Deck

    "Remove a public URL for a deck (sets it to null)"
    deleteDeckPublicUrl(id: ID!): Deck

    "Create a new collab URL. Expiry will be set to 7 days from now"
    createDeckCollabUrl(id: ID!): Deck

    "Removes the current collab URL (sets it and the expiry to null)"
    deleteDeckCollabUrl(id: ID!): Deck

    "Assign the current user to a deck by its collabUrl, then expire that URL."
    assignDeckCollaborator(collabUrl: String!): Deck

    "Remove a user from the specified deck. Deck owner can remove any, collab users can only remove themselves."
    removeDeckCollaborator(deckId: ID!, userId: ID!): Deck
  }

  "A slide deck for Spectacle Visual Editor"
  type Deck {
    "Internally-generated UUIDv4"
    id: ID!

    "Owner User of this deck"
    owner: User!

    "Array of collaborators Users to this deck.  Collaborators can update contents"
    collaborators: [User]

    "Name of the slide deck (must be unique per owner)"
    name: String!

    "Timestamp when Deck was created"
    created: FaunaTime!

    "Timestamp when Deck was last modified"
    lastModified: FaunaTime!

    "User that last modified this deck"
    lastModifiedBy: User

    "If set, a public URL that unauthenticated users can use to retrieve it"
    publicUrl: String

    "If set, a URL that can be used to invite users to become collaborators"
    collabUrl: String

    "Time that the collab URL will expire if not used"
    collabUrlExpiry: FaunaTime

    "JSON object containing the slide deck"
    contents: String!
  }
`;

export const deckResolvers: Api.IResolvers = {
  Query: {
    allDecks: async (_, __, context) => {
      requiresRole(context, 'admin');
      return await getAllDecks(context);
    },
    allMyDecks: async (_, __, context) => {
      requiresRole(context, 'user');
      const user = context.userIdentity as Api.User;
      return await getDecksByOwner(context, user._ref);
    },
    deckByPublicUrl: async (_, args: { publicUrl: string }, context) => {
      requiresRole(context, 'guest');
      return await getDeckByPublicUrl(context, args.publicUrl);
    },
    deckByCollabUrl: async (_, args: { collabUrl: string }, context) => {
      requiresRole(context, 'user');
      return await getDeckByCollabUrl(context, args.collabUrl);
    }
  },
  Mutation: {
    createDeck: async (
      _,
      args: { name: string; contents: string },
      context
    ) => {
      requiresRole(context, 'user');
      return await createDeck(context, args.name, args.contents);
    },
    updateDeckName: async (_, args: { id: string; name: string }, context) => {
      requiresRole(context, 'user');
      return await updateDeckName(context, args.id, args.name);
    },
    updateDeckContents: async (
      _,
      args: { id: string; contents: string },
      context
    ) => {
      requiresRole(context, 'user');
      return await updateDeckContents(context, args.id, args.contents);
    },
    deleteDeck: async (_, args: { id: string }, context) => {
      requiresRole(context, 'user');
      return await deleteDeck(context, args.id);
    },
    createDeckPublicUrl: async (
      _,
      args: { id: string; publicUrl: string },
      context
    ) => {
      requiresRole(context, 'user');
      return await updateDeckPublicUrl(context, args.id, args.publicUrl);
    },
    deleteDeckPublicUrl: async (_, args: { id: string }, context) => {
      requiresRole(context, 'user');
      return await updateDeckPublicUrl(context, args.id, null);
    },
    createDeckCollabUrl: async (_, args: { id: string }, context) => {
      requiresRole(context, 'user');
      return await updateDeckCollabUrl(context, args.id, false);
    },
    deleteDeckCollabUrl: async (_, args: { id: string }, context) => {
      requiresRole(context, 'user');
      return await updateDeckCollabUrl(context, args.id, true);
    },
    assignDeckCollaborator: async (_, args: { collabUrl: string }, context) => {
      requiresRole(context, 'user');
      return await assignDeckCollaborator(context, args.collabUrl);
    },
    removeDeckCollaborator: async (
      _,
      args: { deckId: string; userId: string },
      context
    ) => {
      requiresRole(context, 'user');
      return await removeDeckCollaborator(context, args.deckId, args.userId);
    }
  },
  Deck: {
    owner: async (parent, _, context) => {
      requiresRole(context, 'user');
      return await User.getUserByRef(context, parent.owner);
    },
    collaborators: async (parent, _, context) => {
      requiresRole(context, 'user');
      return await User.getUsersByRefList(context, parent.collaborators);
    },
    lastModifiedBy: async (parent, _, context) => {
      requiresRole(context, 'user');
      return await User.getUserByRef(context, parent.lastModifiedBy);
    }
  }
};

const getAllDecks = async (context: Api.Context): Promise<Api.Deck[]> => {
  const result: unknown[] = await context.db.getDocumentsByIndex('decks_all');
  return result.map((d) =>
    filterDeckByRole(context, d as Api.Deck)
  ) as Api.Deck[];
};

const getDecksByOwner = async (
  context: Api.Context,
  owner: Api.Ref
): Promise<Api.Deck[]> => {
  const result: unknown[] = await context.db.getDocumentsByIndex(
    'decks_by_owner',
    owner
  );
  return result.map((d) =>
    filterDeckByRole(context, d as Api.Deck)
  ) as Api.Deck[];
};

const getDecksByCollaborator = async (
  context: Api.Context,
  collaborator: Api.Ref
): Promise<Api.Deck[]> => {
  const result: unknown[] = await context.db.getDocumentsByIndex(
    'decks_by_collaborator',
    collaborator
  );
  return result.map((d) =>
    filterDeckByRole(context, d as Api.Deck)
  ) as Api.Deck[];
};

const getDeckByPublicUrl = async (
  context: Api.Context,
  public_url: string
): Promise<Api.Deck | null> => {
  const result = await context.db.getDocumentByIndex(
    'decks_by_publicurl',
    public_url
  );
  return result ? filterDeckByRole(context, result as Api.Deck) : null;
};

const getDeckById = async (
  context: Api.Context,
  id: string
): Promise<Api.Deck> => {
  const result = await context.db.getDocumentByIndex('decks_by_id', id);
  const existDeck = result
    ? filterDeckByRole(context, result as Api.Deck)
    : null;
  if (!existDeck || !existDeck.id || !existDeck.owner) {
    throw new UserInputError('Invalid deck ID');
  }
  return existDeck;
};

const getDeckByCollabUrl = async (
  context: Api.Context,
  collab_url: string,
  assigning = false
): Promise<Api.Deck> => {
  const result = await context.db.getDocumentByIndex(
    'decks_by_collaburl',
    collab_url
  );
  if (!result || !result.id || !result.owner) {
    throw new UserInputError('Deck collab URL not found');
  }
  if (
    !result.collabUrlExpiry ||
    Date.parse(result.collabUrlExpiry) < Date.now()
  ) {
    throw new UserInputError('Deck collab URL has expired');
  }
  // If we are in the process of assigning this deck to a collaborator, do not filter it.
  return assigning ? result : filterDeckByRole(context, result as Api.Deck);
};

const createDeck = async (
  context: Api.Context,
  name: string,
  contents: string
): Promise<Api.Deck | null> => {
  const user = context.userIdentity as Api.User;

  const newDeck: Api.Deck = {
    id: uuidv4(),
    owner: user._ref,
    collaborators: [],
    name: name,
    created: context.db.query.Now(),
    lastModified: context.db.query.Now(),
    lastModifiedBy: user._ref,
    publicUrl: null,
    collabUrl: null,
    collabUrlExpiry: null,
    contents: contents
  };

  return await context.db.createDocument('Decks', newDeck);
};

const updateDeckName = async (
  context: Api.Context,
  id: string,
  name: string
): Promise<Api.Deck | null> => {
  const user = context.userIdentity as Api.User;
  const existDeck = await getDeckById(context, id);
  if (!amIDeckOwner(context, existDeck)) {
    throw new ForbiddenError('Must be owner of deck to rename');
  }
  return await context.db.updateDocumentByIndex('decks_by_id', id, {
    name,
    lastModified: context.db.query.Now(),
    lastModifiedBy: user._ref
  } as Api.Deck);
};

const updateDeckContents = async (
  context: Api.Context,
  id: string,
  contents: string
): Promise<Api.Deck | null> => {
  const user = context.userIdentity as Api.User;
  const existDeck = await getDeckById(context, id);
  if (
    !amIDeckOwner(context, existDeck) &&
    !amIDeckCollaborator(context, existDeck)
  ) {
    throw new ForbiddenError(
      'Must be owner or collaborator of deck to update contents'
    );
  }
  return await context.db.updateDocumentByIndex('decks_by_id', id, {
    contents,
    lastModified: context.db.query.Now(),
    lastModifiedBy: user._ref
  } as Api.Deck);
};

const deleteDeck = async (
  context: Api.Context,
  id: string
): Promise<Api.Deck | null> => {
  const existDeck = await getDeckById(context, id);
  if (!amIDeckOwner(context, existDeck)) {
    throw new ForbiddenError('Must be owner of deck to delete');
  }
  return await context.db.deleteDocumentByRef(existDeck._ref);
};

const updateDeckPublicUrl = async (
  context: Api.Context,
  id: string,
  url?: string | null
): Promise<Api.Deck | null> => {
  const user = context.userIdentity as Api.User;
  const existDeck = await getDeckById(context, id);
  if (!amIDeckOwner(context, existDeck)) {
    throw new ForbiddenError('Must be owner of deck to change public URL');
  }
  // This can be chosen or randomly generated.
  let publicUrl;
  if (typeof url !== 'undefined') {
    publicUrl = url;
  } else {
    publicUrl = uuidv4();
  }
  return await context.db.updateDocumentByIndex('decks_by_id', id, {
    publicUrl,
    lastModified: context.db.query.Now(),
    lastModifiedBy: user._ref
  } as Api.Deck);
};

const updateDeckCollabUrl = async (
  context: Api.Context,
  id: string,
  remove: boolean
): Promise<Api.Deck | null> => {
  const user = context.userIdentity as Api.User;
  const existDeck = await getDeckById(context, id);
  if (!amIDeckOwner(context, existDeck)) {
    throw new ForbiddenError('Must be owner of deck to change collab URL');
  }
  // Collab URLs can only be randomly generated
  let collabUrl, collabUrlExpiry;
  if (remove) {
    collabUrl = null;
    collabUrlExpiry = null;
  } else {
    const q = context.db.query;
    collabUrl = uuidv4();
    collabUrlExpiry = q.TimeAdd(q.Now(), 7, 'days');
  }
  return await context.db.updateDocumentByIndex('decks_by_id', id, {
    collabUrl,
    collabUrlExpiry,
    lastModified: context.db.query.Now(),
    lastModifiedBy: user._ref
  } as Api.Deck);
};

const assignDeckCollaborator = async (
  context: Api.Context,
  collabUrl: string
): Promise<Api.Deck | null> => {
  const existDeck = await getDeckByCollabUrl(context, collabUrl, true);
  if (amIDeckOwner(context, existDeck)) {
    throw new UserInputError('Owners cannot be collaborators of the same deck');
  }
  if (amIDeckCollaborator(context, existDeck)) {
    throw new UserInputError('User is already collaborator on this deck');
  }
  // Clear the collab URL now that it is used
  await context.db.updateDocumentByIndex('decks_by_id', existDeck.id, {
    collabUrl: null,
    collabUrlExpiry: null
  });
  // Add the current user to the collaborators, return the deck
  const result = await context.db.appendToDocumentArray(
    existDeck._ref,
    'collaborators',
    [context.userIdentity._ref]
  );
  return filterDeckByRole(context, result);
};

const removeDeckCollaborator = async (
  context: Api.Context,
  deckId: string,
  userId: string
): Promise<Api.Deck | null> => {
  const existDeck = await getDeckById(context, deckId);
  if (!amIDeckOwner(context, existDeck) && userId !== context.userIdentity.id) {
    throw new ForbiddenError(
      'Only deck owners can remove collaborators, or collaborators can remove themselves.'
    );
  }
  const targetUser = await User.getUserById(context, userId);
  const collabIds = existDeck.collaborators?.map((c) => c.id);
  if (!targetUser?._ref?.id || !collabIds?.includes(targetUser._ref.id)) {
    throw new UserInputError('User is not a collaborator on this deck');
  }

  // Remove this user from the collaborators, return the deck
  const result = await context.db.removeFromDocumentArray(
    existDeck._ref,
    'collaborators',
    [targetUser._ref]
  );
  return filterDeckByRole(context, result);
};

const amIDeckOwner = (context: Api.Context, deck: Api.Deck): boolean => {
  if (context.userIdentity && deck.owner?.id === context.userIdentity._ref.id) {
    return true;
  }
  return false;
};

const amIDeckCollaborator = (context: Api.Context, deck: Api.Deck): boolean => {
  const user = context.userIdentity as Api.User;
  const collabIds = deck.collaborators?.map((c) => c.id);
  if (collabIds?.includes(user._ref.id)) {
    return true;
  }
  return false;
};

const filterDeckByRole = (context: Api.Context, deck: Api.Deck): Api.Deck => {
  if (amIDeckOwner(context, deck) || context.userRoles.includes('admin')) {
    // If deck belongs to me, or I'm an admin, full access
    return deck;
  } else if (context.userRoles.includes('user')) {
    if (amIDeckCollaborator(context, deck)) {
      // Users can only see other user's decks if they are collaborators on them
      // and we still want to filter the fields they can see
      const {
        id,
        owner,
        name,
        created,
        lastModified,
        lastModifiedBy,
        publicUrl,
        contents
      } = deck;
      return {
        id,
        owner,
        name,
        created,
        lastModified,
        lastModifiedBy,
        publicUrl,
        contents
      };
    } else {
      throw new ForbiddenError(
        'Users can only retrieve decks they own or are collaborators on'
      );
    }
  }
  // Guests can only see name and contents (this should be only accessible by public URL)
  const { name, contents } = deck;
  return { name, contents };
};

export const Deck = {
  getDecksByOwner,
  getDecksByCollaborator
};
