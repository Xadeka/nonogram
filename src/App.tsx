import { Grid } from "./Grid";

function App() {
  return (
    <Grid
      rows={[
        ["empty", "filled", "empty"],
        ["empty", "empty", "filled"],
        ["filled", "filled", "filled"],
      ]}
    />
  );
}

export default App;
