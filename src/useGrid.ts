import React, { useState, useLayoutEffect } from "react";

interface UseGridParam {
  height: number;
  width: number;
  getCellId: (position: GridPosition) => string;
  config?: GridControlsConfig;
}

export function useGrid<T extends HTMLElement>({
  height,
  width,
  getCellId,
  config = {
    up: "ArrowUp",
    left: "ArrowLeft",
    down: "ArrowDown",
    right: "ArrowRight",
  },
}: UseGridParam) {
  const [gridHasFocus, setGridHasFocus] = useState(false);
  const [focusedPosition, setFocusedPosition] = useState<GridPosition>({
    // Initial focus will be the first (top left) cell.
    row: 0,
    column: 0,
  });

  // Compute the focused cell's ID so that the useEffect below
  // doesn't care if getCellId's reference changes.
  let focusedCellId = getCellId(focusedPosition);

  // When active cell changes, focus that element.
  // Note: Using useLayoutEffect because useEffect caused
  // the focus ring to flicker before finally moving focus.
  useLayoutEffect(() => {
    // Don't focus children if the component hasn't been focused first.
    if (!gridHasFocus) {
      return;
    }

    let elementReceivingFocus = document.getElementById(focusedCellId);

    if (elementReceivingFocus !== null) {
      elementReceivingFocus.focus();
    }
  }, [gridHasFocus, focusedCellId]);

  // This handles keyboard input to move to the next cell.
  // It will wrap around to the opposite side if we reached the end of the current row or column.
  let handleNavigationKeyDown = (key: string) => {
    // Move down or right
    // This will wrap to the start if we reach the end.
    const moveNext = (index: number, length: number) => {
      if (index < length - 1) {
        return index + 1;
      } else {
        return 0;
      }
    };

    // Move up or left
    // This will wrap to the end if we reach the start.
    const movePrevious = (index: number, length: number) => {
      if (index > 0) {
        return index - 1;
      } else {
        return length - 1;
      }
    };

    // Update row and column to their next value.
    // Default to their current postiion.
    let row = focusedPosition.row;
    let column = focusedPosition.column;

    switch (key) {
      case config.up:
        row = movePrevious(row, height);
        break;
      case config.right:
        column = moveNext(column, width);
        break;
      case config.down:
        row = moveNext(row, height);
        break;
      case config.left:
        column = movePrevious(column, width);
        break;
      default:
        break;
    }

    setFocusedPosition({ row, column });
  };

  return {
    focusedPosition,
    setFocusedPosition,
    // Prevent key interactions if the grid does not have focus.
    onKeyDown: gridHasFocus
      ? (e: React.KeyboardEvent<T>) => handleNavigationKeyDown(e.key)
      : undefined,
    onFocus: (e: React.FocusEvent<T>) => setGridHasFocus(true),
    onBlur: (e: React.FocusEvent<T>) => setGridHasFocus(false),
  };
}
