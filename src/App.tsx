import { Grid } from "./Grid";
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

function App() {
  return (
    // Temporary container to center the grid.
    <main className="flex justify-center p-5">
      <Grid
        height={height}
        width={width}
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
