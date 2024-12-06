import React from "react";

interface GridProps {
  onKeyDown?: React.KeyboardEventHandler;
  onFocus?: React.FocusEventHandler;
  onBlur?: React.FocusEventHandler;
}

export const Grid = (props: React.PropsWithChildren<GridProps>) => {
  const { children, onBlur, onFocus, onKeyDown } = props;
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

const GridRow = (props: React.PropsWithChildren) => {
  const { children } = props;
  return (
    <tr role="row" className="group/row">
      {children}
    </tr>
  );
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

const GridCell = (props: GridCellProps) => {
  const { tabIndex, value, testId, onClick, id } = props;

  let pressed = value === "filled";

  return (
    <td
      role="gridcell"
      className="bg-gray-300 p-0.5 last:pr-1 first-of-type:pl-1 group-last/row:pb-1 group-last/row:last:rounded-br-md group-last/row:first-of-type:rounded-bl-md group-[&:nth-child(2)]/row:pt-1 group-[&:nth-child(2)]/row:last:rounded-tr-md group-[&:nth-child(2)]/row:first-of-type:rounded-tl-md"
    >
      <button
        id={id}
        className="block h-7 w-7 rounded bg-gray-50 focus:relative focus:z-10 focus:outline-none focus:ring-4 focus:ring-red-500 aria-pressed:bg-gray-900"
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

const GridHeader = (props: GridHeaderProps) => {
  const { scope, testId, clues } = props;

  let label = clues.join(" ");
  if (label.length === 0) {
    label = "0";
  }

  return (
    <th
      scope={scope}
      className="group/th [&[scope=col]]:align-bottom [&[scope=row]]:pr-2"
      data-testid={testId}
      // I intended this to be read by the screen reader.
      // VoiceOver currently reads row headers but not columns.
      // Check if the aria-label is actually working. Maybe VO is reading the list.
      // Possibly consider adding a label with sr-only?
      aria-label={label}
    >
      <ol className="font-mono font-normal group-[&[scope=row]]/th:flex group-[&[scope=row]]/th:justify-end group-[&[scope=row]]/th:gap-2">
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
