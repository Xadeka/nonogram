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
      className="nonogram"
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
    <td role="gridcell">
      <button
        id={id}
        className="button-cell"
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
  let label = clues.join(" ");
  if (label.length === 0) {
    label = "0";
  }

  return (
    <th
      scope={scope}
      className="clues-header"
      data-testid={testId}
      // I intended this to be read by the screen reader.
      // VoiceOver currently reads row headers but not columns.
      // Check if the aria-label is actually working. Maybe VO is reading the list.
      // Possibly consider adding a label with sr-only?
      aria-label={label}
    >
      <ol className="font-normal font-mono">
        {clues.map((clue, clueIndex) => {
          return (
            <li key={clueIndex} className="text-gray-900">
              {clue}
            </li>
          );
        })}
        {clues.length === 0 ? <li className="text-gray-400">0</li> : null}
      </ol>
    </th>
  );
};
Grid.Header = GridHeader;
(Grid.Header as React.FunctionComponent).displayName = "Grid.Header";

const GridCornerCell = () => {
  // TODO: This possibly needs to be a th?
  return <td></td>;
};
Grid.CornerCell = GridCornerCell;
(Grid.CornerCell as React.FunctionComponent).displayName = "Grid.CornerCell";
