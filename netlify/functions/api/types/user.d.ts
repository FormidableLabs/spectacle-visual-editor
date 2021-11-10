export type User = {
  _id?: number;
  _ref?: FaunaRef;
  _ts?: number;
  id?: string;
  name: string;
  email?: string;
  provider?: string;
  avatarUrl?: string;
  lastSeen?: number;
  admin?: boolean;
};
