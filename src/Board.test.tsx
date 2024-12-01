import { expect, test, afterEach } from "vitest";
import {
  render,
  cleanup,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Board } from "./Board";

afterEach(cleanup);

test("On initial grid focus, move focus to first cell", async () => {
  renderBoard({ row: [[], [], [], [], []], column: [[], [], [], [], []] });

  let cell = screen.getByTestId("0:0");

  // Ensure that the first cell is not focused initially.
  expect(cell).not.toHaveFocus();

  // Tab to the grid which sets focus internally.
  await userEvent.tab();
  await waitFor(() => expect(cell).toHaveFocus());
});

test("Clicking a cell focuses that cell", async () => {
  let { getCell } = renderBoard({
    row: [[], [], [], [], []],
    column: [[], [], [], [], []],
  });

  let cell = getCell({ row: 2, column: 3 });

  expect(cell).not.toHaveFocus();
  await userEvent.click(getCell({ row: 2, column: 3 }));
  await waitFor(() => expect(cell).toHaveFocus());
});

test("On grid refocus, shift focus to last focused cell", async () => {
  renderBoard({ row: [[], [], [], [], []], column: [[], [], [], [], []] });

  let cell = screen.getByTestId("3:3");

  // Focus a particular cell with click.
  await userEvent.click(cell);
  expect(cell).toHaveFocus();

  // Tabbing away from the grid.
  await userEvent.tab();
  expect(cell).not.toHaveFocus();

  // Tab cycles goes back to the grid which focuses the last cell.
  await userEvent.tab();
  await waitFor(() => expect(cell).toHaveFocus());
});

test("Can use arrow keys for board navigation", async () => {
  let { pressKey, getCell } = renderBoard({
    row: [[], [], [], [], []],
    column: [[], [], [], [], []],
  });

  await userEvent.click(getCell({ row: 2, column: 2 }));

  pressKey("ArrowUp");
  await waitFor(() => expect(getCell({ row: 1, column: 2 })).toHaveFocus());

  pressKey("ArrowRight");
  await waitFor(() => expect(getCell({ row: 1, column: 3 })).toHaveFocus());

  pressKey("ArrowDown");
  await waitFor(() => expect(getCell({ row: 2, column: 3 })).toHaveFocus());

  pressKey("ArrowLeft");
  await waitFor(() => expect(getCell({ row: 2, column: 2 })).toHaveFocus());
});

test("When navigating against an edge of the grid, focus wraps to the opposite side", async () => {
  let { pressKey, getCell } = renderBoard({
    row: [[], [], [], [], []],
    column: [[], [], [], [], []],
  });

  await userEvent.click(getCell({ row: 0, column: 0 }));

  // Wrap from top to bottom...
  pressKey("ArrowUp");
  await waitFor(() => expect(getCell({ row: 4, column: 0 })).toHaveFocus());

  // ...and back to top.
  pressKey("ArrowDown");
  await waitFor(() => expect(getCell({ row: 0, column: 0 })).toHaveFocus());

  // Then to the left...
  pressKey("ArrowLeft");
  await waitFor(() => expect(getCell({ row: 0, column: 4 })).toHaveFocus());

  // ...and back to right.
  pressKey("ArrowRight");
  await waitFor(() => expect(getCell({ row: 0, column: 0 })).toHaveFocus());
});

test("Configurable keyboard navigation", async () => {
  let { pressKey, getCell } = renderBoard(
    { row: [[], [], [], [], []], column: [[], [], [], [], []] },
    { up: "w", left: "a", down: "s", right: "d" },
  );

  await userEvent.click(getCell({ row: 2, column: 2 }));
  await waitFor(() => expect(getCell({ row: 2, column: 2 })).toHaveFocus());

  pressKey("w");
  await waitFor(() => expect(getCell({ row: 1, column: 2 })).toHaveFocus());

  pressKey("d");
  await waitFor(() => expect(getCell({ row: 1, column: 3 })).toHaveFocus());

  pressKey("s");
  await waitFor(() => expect(getCell({ row: 2, column: 3 })).toHaveFocus());

  pressKey("a");
  await waitFor(() => expect(getCell({ row: 2, column: 2 })).toHaveFocus());
});

test("Display clues in the headers", () => {
  let { getHeader } = renderBoard({
    row: [[3], [1, 2, 3]],
    column: [[1, 1], [], [4]],
  });

  // TODO: Is aria-label sufficent?
  expect(getHeader(0, "row")).toHaveAttribute("aria-label", "3");
  expect(getHeader(1, "row")).toHaveAttribute("aria-label", "1 2 3");
  expect(getHeader(0, "column")).toHaveAttribute("aria-label", "1 1");
  expect(getHeader(1, "column")).toHaveAttribute("aria-label", "0");
  expect(getHeader(2, "column")).toHaveAttribute("aria-label", "4");
});

function renderBoard(clues: BoardClues, config?: GridControlsConfig) {
  render(<Board clues={clues} controlsConfig={config} />);

  let grid = screen.getByRole("grid");

  return {
    // The grid cells have test IDs set as "rowIndex:columnIndex".
    // For example, top middle cell of a 5x5 grid has `data-testid="0:2"`
    getCell: (position: GridPosition) => {
      return screen.getByTestId(`${position.row}:${position.column}`);
    },
    getHeader: (index: number, direction: "row" | "column") => {
      return screen.getByTestId(`${direction}header:${index}`);
    },
    pressKey: (key: string) => {
      fireEvent.keyDown(grid, { key });
    },
  };
}
