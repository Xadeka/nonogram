import { useState } from "react";
import { Grid } from "./Grid";

function App() {
  const [gridRows, setGridRows] = useState([
    ["empty", "filled", "empty"],
    ["empty", "empty", "filled"],
    ["filled", "filled", "filled"],
  ]);
  return (
    // Temporary container to center the grid.
    <main className="flex justify-center p-5">
      <Grid
        rows={gridRows}
        onCellChange={({ column, row }, value) => {
          let updatedGrid = [...gridRows];
          let updatedRow = [...gridRows[row]];
          updatedRow[column] = value;
          updatedGrid[row] = updatedRow;

          setGridRows(updatedGrid);
        }}
      />
    </main>
  );
}

export default App;
