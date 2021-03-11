import { render, cleanup, screen, waitFor } from "@testing-library/react";
import { Grid } from "./Grid";

const waitForWithCapturedStackTrace = async (
  callback: () => void | Promise<void>,
  callerReference: Function
) => {
  // Create an error object to throw if the assertion in waitFor fails.
  // This error will include the stack trace we want Jest to use for
  // the code frame. I'm not sure why but, if we create the error and
  // capture the stack trace in the catch, it doesn't include the caller
  // of assertRecievesFocus. This article shows how to control the stack
  // trace for synchronous test helpers.
  // https://kentcdodds.com/blog/improve-test-error-messages-of-your-abstractions
  let possibleError = new Error();
  Error.captureStackTrace(possibleError, callerReference);

  try {
    await waitFor(callback);
  } catch (error) {
    // Copy the formatted error message from testing-library.
    possibleError.message = error.message;
    throw possibleError;
  }
};

const assertRecievesFocus = async (node: HTMLElement) => {
  await waitForWithCapturedStackTrace(() => {
    expect(document.activeElement).toBe(node);
  }, assertRecievesFocus);
};

const waitForFocus = async (node: HTMLElement, options?: FocusOptions) => {
  node.focus(options);

  await waitForWithCapturedStackTrace(
    () => expect(document.activeElement).toBe(node),
    waitForFocus
  );
};

// The grid cells have test IDs set as "columnIndex:rowIndex".
// For example, top left cell has `data-testid="0:0"`

afterEach(cleanup);

test("On initial focus, shift focus to first cell", async () => {
  render(<Grid height={5} width={5} state={{}} onCellChange={() => {}} />);
  await waitForFocus(screen.getByRole("grid"));
  await assertRecievesFocus(screen.getByTestId("0:0"));
});
