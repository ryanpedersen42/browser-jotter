import { Dispatch } from "redux";
import { Action } from "../actions";
import { ActionType } from "../action-types";
import { saveCells } from "../action-creators";
import { RootState } from "../reducers";

export const persistMiddleware = ({
  dispatch,
  getState
}: {
  dispatch: Dispatch<Action>;
  getState: () => RootState
}) => {
  let timer: any;
  return (next: (action: Action) => void) => {
    return (action: Action) => {
      next(action);

      if (
        [
          ActionType.MOVE_CELL,
          ActionType.UPDATE_CELL,
          ActionType.INSERT_CELL_AFTER,
          ActionType.DELETE_CELL,
        ].includes(action.type) // return true if actiontype matches one of the four
      ) {
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
          saveCells()(dispatch, getState) // function calling next function immediately bc of thunk setup

        }, 250)
      }
    };
  };
};
