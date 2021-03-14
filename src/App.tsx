import { Grid } from "./Grid";

// This is temporary.
// TODO: Revise format of state
// I believe it would be better if it didn't depend on
// the actual ID of the cell. If implementation of the Grid
// changes, then so does this state.
let intialGridState = {
  "cell-2-1": "filled",
  "cell-3-2": "filled",
  "cell-1-3": "filled",
  "cell-2-3": "filled",
  "cell-3-3": "filled",
};

function App() {
  return (
    // Temporary container to center the grid.
    <main className="flex justify-center p-5">
      <Grid
        height={5}
        width={5}
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
