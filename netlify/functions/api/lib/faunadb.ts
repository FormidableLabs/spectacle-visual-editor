import faunadb, { errors as FaunaErrors } from 'faunadb';
import { GraphQLScalarType, Kind } from 'graphql';
import { UserInputError } from 'apollo-server-lambda';
import type * as Api from '../types/main';

export const createDbAdapter = (faunaDbClient: faunadb.Client) => {
  const dbAdapter = () => {
    const client = faunaDbClient;
    const query = faunadb.query;

    const createDocument = async (
      collection: string,
      document: unknown
    ): Promise<unknown> => {
      const q = faunadb.query;
      let result;
      try {
        result = (await client.query(
          q.Create(q.Collection(collection), { data: document })
        )) as Api.FaunaResult;
      } catch (err) {
        if (
          err instanceof FaunaErrors.FaunaError &&
          err.description === 'document is not unique.'
        ) {
          throw new UserInputError('Duplicate value for a unique index');
        } else {
          throw err;
        }
      }
      return faunaToInline(result);
    };

    const updateDocumentByIndex = async (
      indexname: string,
      arg: string | number,
      updates: unknown
    ): Promise<Api.FaunaInlineObject | null> => {
      const q = faunadb.query;
      let result;
      try {
        result = (await client.query(
          q.Update(q.Select('ref', q.Get(q.Match(q.Index(indexname), arg))), {
            data: updates
          })
        )) as Api.FaunaResult;
      } catch (err) {
        if (
          err instanceof FaunaErrors.FaunaError &&
          err.description === 'document is not unique.'
        ) {
          throw new UserInputError('Duplicate value for a unique index');
        } else {
          throw err;
        }
      }
      return faunaToInline(result);
    };

    const getDocumentsByIndexList = async (
      indexname: string,
      arglist: string[] | number[]
    ): Promise<Api.FaunaInlineObject[] | null> => {
      const q = faunadb.query;
      // TODO: implement pagination handler
      const result = (await client.query(
        q.Map(
          q.Paginate(
            q.Union(
              q.Map(
                arglist,
                q.Lambda('result', q.Match(q.Index(indexname), q.Var('result')))
              )
            )
          ),
          q.Lambda('X', q.Get(q.Var('X')))
        )
      )) as Api.FaunaArrayResult;
      return faunaArrayToInline(result.data);
    };

    const getDocumentsByIndex = async (
      indexname: string,
      arg: string | number
    ): Promise<Api.FaunaInlineObject[] | null> => {
      const q = faunadb.query;
      // TODO: implement pagination handler
      const result = (await client.query(
        q.Map(
          q.Paginate(q.Match(q.Index(indexname), arg)),
          q.Lambda('X', q.Get(q.Var('X')))
        )
      )) as Api.FaunaArrayResult;
      return faunaArrayToInline(result.data);
    };

    const getDocumentByIndex = async (
      indexname: string,
      arg: string | number
    ): Promise<Api.FaunaInlineObject | undefined> => {
      return (await getDocumentsByIndex(indexname, arg))?.[0];
    };

    const getDocumentByRef = async (
      ref: faunadb.Expr
    ): Promise<Api.FaunaInlineObject | null> => {
      const q = faunadb.query;
      const result: Api.FaunaResult = await client.query(q.Get(q.Ref(ref)));
      return faunaToInline(result);
    };

    const getDocumentsByRefList = async (
      reflist: faunadb.Expr[]
    ): Promise<Api.FaunaInlineObject[] | null> => {
      if (reflist.length === 0) {
        return [];
      }
      const q = faunadb.query;
      const result = (await client.query(
        q.Map(reflist, q.Lambda('X', q.Get(q.Var('X'))))
      )) as Api.FaunaResultObject[];
      return faunaArrayToInline(result);
    };

    const deleteDocumentByRef = async (ref: faunadb.Expr) => {
      const q = faunadb.query;
      const result: Api.FaunaResult = await client.query(q.Delete(q.Ref(ref)));
      return faunaToInline(result);
    };

    const appendToDocumentArray = async (
      docref: faunadb.Expr,
      arrayname: string,
      newitems: faunadb.Expr[]
    ): Promise<Api.FaunaInlineObject | null> => {
      const q = faunadb.query;
      const result = (await client.query(
        q.Let(
          { doc: q.Get(docref) },
          q.Update(q.Select(['ref'], q.Var('doc')), {
            data: {
              [arrayname]: q.Append(
                q.Select(['data', arrayname], q.Var('doc')),
                newitems
              )
            }
          })
        )
      )) as Api.FaunaResult;
      return faunaToInline(result);
    };

    const removeFromDocumentArray = async (
      docref: faunadb.Expr,
      arrayname: string,
      removeitems: faunadb.Expr[]
    ): Promise<Api.FaunaInlineObject | null> => {
      const q = faunadb.query;
      const result = (await client.query(
        q.Let(
          { doc: q.Get(docref) },
          q.Update(q.Select(['ref'], q.Var('doc')), {
            data: {
              [arrayname]: q.Difference(
                q.Select(['data', arrayname], q.Var('doc')),
                removeitems
              )
            }
          })
        )
      )) as Api.FaunaResult;
      return faunaToInline(result);
    };

    return {
      createDocument,
      deleteDocumentByRef,
      updateDocumentByIndex,
      getDocumentsByIndex,
      getDocumentByIndex,
      getDocumentsByIndexList,
      getDocumentByRef,
      getDocumentsByRefList,
      appendToDocumentArray,
      removeFromDocumentArray,
      query
    };
  };
  return dbAdapter();
};

export const faunaTimeScalar = new GraphQLScalarType({
  name: 'FaunaTime',
  description: 'FaunaDB Internal Timestamp',
  serialize(value) {
    const newVal = value as { value: string };
    return newVal.value;
  },
  parseValue(value) {
    return faunadb.query.Time(value as string);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return faunadb.query.Time(ast.value as string);
    }
    return null;
  }
});

export const faunaToInline = (
  result: Api.FaunaResultObject
): Api.FaunaInlineObject | null => {
  // inlines the ref ID and the timestamp into the data object to simplify access to them
  if (!result) {
    return null;
  }
  const data = result.data as object;
  return {
    ...data,
    _ts: result.ts,
    _ref: result.ref
  };
};

export const faunaArrayToInline = (
  result: Api.FaunaResultObject[]
): Api.FaunaInlineObject[] | null => {
  // inlines the ref ID and the timestamp into the data object to simplify access to them
  if (!result) {
    return null;
  }

  return result.map((d) => {
    const data = d.data as object;
    return { _ts: d.ts, _ref: d.ref, ...data };
  });
};
