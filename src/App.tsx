import { useState } from "react";
import { Grid, GridState } from "./Grid";

function App() {
  // Should this state be managed here? I'm not thrilled with the name of `state` prop.
  // Consider a `defaultState` on <Grid> if we need to initalize it.
  // But maybe the <Grid> should handle state internally.
  const [gridState, setGridState] = useState<GridState>({
    "cell-2-1": "filled",
    "cell-3-2": "filled",
    "cell-1-3": "filled",
    "cell-2-3": "filled",
    "cell-3-3": "filled",
  });

  return (
    // Temporary container to center the grid.
    <main className="flex justify-center p-5">
      <Grid
        height={5}
        width={5}
        state={gridState}
        onCellChange={(cellId, value) => {
          setGridState({ ...gridState, [cellId]: value });
        }}
      />
    </main>
  );
}

export default App;
