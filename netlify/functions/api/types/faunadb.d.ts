import type faunadb from 'faunadb';
export type FaunaArrayResult = { data: FaunaResultObject[] };
export type FaunaResult = FaunaResultObject;

export type FaunaResultObject = {
  ref: FaunaRef;
  ts: number;
  data: unknown;
};

export interface FaunaInlineObject extends object {
  _ts: number;
  _ref: FaunaRef;
}

export type Ref = faunadb.Expr;

export type FaunaRef = {
  id: number;
  collection: faunadb.Expr;
};
