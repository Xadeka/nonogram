/**
 * Creates a fully initialized BoardState where each cell is undefined.
 *
 * @param height The grid height (or row count)
 * @param width The grid width (or column count)
 * @returns An empty BoardState
 */
// This allows us to access cell values without checking if a row exists first.
export const createBoardState = (height: number, width: number) => {
  let state: BoardState = {};

  for (let row = 0; row < height; row++) {
    state[row] = {};
    for (let column = 0; column < width; column++) {
      state[row][column] = undefined;
    }
  }

  return state;
};
