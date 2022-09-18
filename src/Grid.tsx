import React from "react";
// import "./Grid.css";
import "./Grid2.css";

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
    <div className="nonogram">
      <div role="grid" onKeyDown={onKeyDown} onFocus={onFocus} onBlur={onBlur}>
        {children}
      </div>
    </div>
  );
};

const GridRow = ({ children }: React.PropsWithChildren<{}>) => {
  return <div role="row">{children}</div>;
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
    <div role="gridcell">
      <button
        id={id}
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
    </div>
  );
};
Grid.Cell = GridCell;
(Grid.Cell as React.FunctionComponent).displayName = "Grid.Cell";

interface GridHeaderProps {
  scope: "row" | "col";
  clues: number[]; // TODO: Type this better.
  testId: string;
}

const GridHeaderCell = ({ scope, clues, testId }: GridHeaderProps) => {
  let label = clues.join(" ");
  if (label.length === 0) {
    label = "0";
  }

  return (
    <div
      className="clues-header"
      data-scope={scope}
      data-testid={testId}
      // I intended this to be read by the screen reader.
      // VoiceOver currently reads row headers but not columns.
      // Check if the aria-label is actually working. Maybe VO is reading the list.
      // Possibly consider adding a label with sr-only?
      aria-label={label}
    >
      <ol>
        {clues.map((clue, clueIndex) => {
          return <li key={clueIndex}>{clue}</li>;
        })}
        {clues.length === 0 ? <li>0</li> : null}
      </ol>
    </div>
  );
};
Grid.HeaderCell = GridHeaderCell;
(Grid.HeaderCell as React.FunctionComponent).displayName = "Grid.HeaderCell";

const GridCornerCell = () => {
  // TODO: This possibly needs to be a th?
  return <div></div>;
};
Grid.CornerCell = GridCornerCell;
(Grid.CornerCell as React.FunctionComponent).displayName = "Grid.CornerCell";
