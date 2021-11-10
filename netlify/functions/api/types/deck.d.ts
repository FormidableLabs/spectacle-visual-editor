import { FaunaRef } from './main';

export type Deck = {
  _id?: number;
  _ref?: FaunaRef;
  _ts?: number;
  id?: string;
  owner?: FaunaRef;
  collaborators?: Array<FaunaRef>;
  name: string;
  created?: string;
  lastModified?: string;
  lastModifiedBy?: string;
  publicUrl?: string | null;
  collabUrl?: string | null;
  collabUrlExpiry?: string | null;
  contents: string;
};
