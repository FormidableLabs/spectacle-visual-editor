import { Dispatch, SetStateAction } from 'react';

/**
 * The `React.useState` hook returns a tuple, `[state, setState]`.
 * This util gives the type of the `setState` function.
 * Pass it the type of state being managed.
 */
export type UseStateSetter<StateType> = Dispatch<SetStateAction<StateType>>;
