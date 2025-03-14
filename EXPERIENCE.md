# Display

The LLM sees the current state of its workspace in its system prompt, including:

* Focused window
  * Selection or cursor state
* Other open windows

## Window

TODO What does a window look like?

Additionally, text under each window:

* Shows line numbering of the current window
  * e.g. "Showing lines 1 through 100 of 1024 (1-based)"

And, under the focused window, text:

* Describes the selection or cursor position
  * "Selected line 5, character 3 through line 7, character 8: Exam...ple"
  * "Cursor at line 6, character 3, just before: Examp..."

# Commands

## `/after() { target }`

Positions the cursor in the focused window after the text matching the target.

## `/before() { target }`

Positions the cursor in the focused window before the text matching the target.

## `/close(file)`

Closes the specified file.

## `/drag(inclusive) { target }`

Select text, starting at the current cursor position, and ending at the first occurrence of the specified target, inclusively.

## `/edit() { content }`

In the focused file: When there is a selection, replace that with the specified content. Otherwise, insert that content at the specified cursor position.

## `/focus(file)`

Focuses the specified file (opening if it necessary).

## `/open(file)`

Opens the specified file, focusing it by default.

## `/scroll(lines)`

Scrolls the window up or down by the specified number of lines (negative values scroll up).

## `/select(start, end)`

Set the selection, from the first occurrence of "start" in the focused window, to the first occurrence of "end" (inclusive).

