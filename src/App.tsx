import { Board } from "./Board";
import { createBoardState } from "./utils";

// This is temporary.
let height = 5;
let width = 5;
let intialGridState = createBoardState(height, width);
intialGridState[1][2] = "filled";
intialGridState[2][3] = "filled";
intialGridState[3][1] = "filled";
intialGridState[3][2] = "filled";
intialGridState[3][3] = "filled";

let clues = {
  row: [[], [1], [1], [3], []],
  column: [[], [1], [1, 1], [2], []],
};

function App() {
  return (
    // Temporary container to center the grid.
    <main className="flex justify-center p-5">
      <Board
        clues={clues}
        initialState={intialGridState}
        controlsConfig={{
          up: "w",
          left: "a",
          down: "s",
          right: "d",
        }}
      />
    </main>
  );
}

export default App;
