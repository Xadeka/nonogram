import { Grid } from "./Grid";

function App() {
  return (
    // Temporary container to center the grid.
    <main className="flex justify-center p-5">
      <Grid
        rows={[
          ["empty", "filled", "empty"],
          ["empty", "empty", "filled"],
          ["filled", "filled", "filled"],
        ]}
      />
    </main>
  );
}

export default App;
