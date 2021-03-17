import React from "react";

interface GridProps {
  onKeyDown?: React.KeyboardEventHandler;
  onFocus?: React.FocusEventHandler;
  onBlur?: React.FocusEventHandler;
}

export const Grid = ({
  children,
  onKeyDown,
  onFocus,
  onBlur,
}: React.PropsWithChildren<GridProps>) => {
  return (
    <table
      role="grid"
      className="bg-gray-300 rounded-md p-0.5 block"
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <tbody>{children}</tbody>
    </table>
  );
};

const GridRow = ({ children }: React.PropsWithChildren<{}>) => {
  return <tr role="row">{children}</tr>;
};
Grid.Row = GridRow;
(Grid.Row as React.FunctionComponent).displayName = "Grid.Row";

interface GridCellProps {
  id: string;
  value: CellValue;
  tabIndex: number;
  onClick: React.MouseEventHandler;
  testId: string;
}

const GridCell = ({ id, value, tabIndex, onClick, testId }: GridCellProps) => {
  let pressed = value === "filled";

  return (
    <td role="gridcell" className="p-0.5">
      <button
        id={id}
        className={`block h-7 w-7 ${
          pressed ? "bg-gray-900" : "bg-gray-50"
        } rounded focus:outline-none focus:ring-4 focus:ring-red-500 focus:z-10 relative`}
        onClick={onClick}
        tabIndex={tabIndex}
        // The button pressed state will represent "filled".
        // Since we will be controlling these values in state,
        //   we will set the aria attribute ourselves.
        aria-pressed={pressed}
        data-testid={testId}
      >
        {/*
         * TODO: What would be an accessible name for the cell buttons?
         *       Would aria-label be better?
         * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role#basic_buttons
         */}
        <span className="sr-only">TODO</span>
      </button>
    </td>
  );
};
Grid.Cell = GridCell;
(Grid.Cell as React.FunctionComponent).displayName = "Grid.Cell";

interface GridHeaderProps {
  scope: "row" | "col";
  clues: number[]; // TODO: Type this better.
  testId: string;
}

const GridHeader = ({ scope, clues, testId }: GridHeaderProps) => {
  return (
    <th scope={scope} data-testid={testId}>
      <span className="font-normal">{clues.join(" ")}</span>
    </th>
  );
};
Grid.Header = GridHeader;
(Grid.Header as React.FunctionComponent).displayName = "Grid.Header";

const GridCornerCell = () => {
  return <td></td>;
};
Grid.CornerCell = GridCornerCell;
(Grid.CornerCell as React.FunctionComponent).displayName = "Grid.CornerCell";
