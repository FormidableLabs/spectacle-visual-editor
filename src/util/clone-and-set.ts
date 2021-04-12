import { cloneDeep, set } from 'lodash-es';

export const cloneAndSet: typeof set = (
  obj: Parameters<typeof set>[0],
  path: Parameters<typeof set>[1],
  val: Parameters<typeof set>[2]
) => set(cloneDeep(obj), path, val);
