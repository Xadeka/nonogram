import { render, cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Grid } from "./Grid";

// The grid cells have test IDs set as "columnIndex:rowIndex".
// For example, top left cell has `data-testid="0:0"`

let renderGrid = (height: number, width: number) => {
  return render(
    <Grid height={height} width={width} state={{}} onCellChange={() => {}} />
  );
};

afterEach(cleanup);

test("On initial focus, shift focus to first cell", async () => {
  renderGrid(5, 5);

  let cell = screen.getByTestId("0:0");

  // Ensure that the first cell is not focused initially.
  expect(cell).not.toHaveFocus();

  // Tab to the grid which sets focus internally.
  userEvent.tab();
  expect(cell).toHaveFocus();
});

test("On refocus, shift focus to last focused cell", async () => {
  renderGrid(5, 5);

  let cell = screen.getByTestId("3:3");

  // Focus a paticular cell with click.
  userEvent.click(cell);
  expect(cell).toHaveFocus();

  // Tabbing away from the grid.
  userEvent.tab();
  expect(cell).not.toHaveFocus();

  // Tab cycles goes back to the grid which focuses the last cell.
  userEvent.tab();
  expect(cell).toHaveFocus();
});
