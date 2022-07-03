This package has been deleted from [NPM](https://www.npmjs.com/) and this repository will be archived.

# About

"tui-ts" is a package that makes it extremely easy to build [text-based user interfaces](https://en.wikipedia.org/wiki/Text-based_user_interface) using [context menus](https://en.wikipedia.org/wiki/Context_menu).

# Installation

Using NPM:

```
npm i tui-ts
```

Using Yarn:

```
yarn add tui-ts
```

# Example

```ts
// import the functions and the "UserInput" type.
import { createContextMenu, UserInput, build } from "tui-ts";

// create the first context menu.
createContextMenu({
  id: "main",
  run: () => {
    console.log("this is the main menu!");
  }
});

// create the second context menu.
createContextMenu({
  // by defining "main" as the parentId,
  // this context menu becomes a child of the first created context menu.
  parentId: "main",
  id: "some-other-menu",
  run: (userInput: UserInput) => {
    console.log(userInput);
    console.log("this is another menu.");
  }
});

// build the application.
build();
```

# Documentation

### build(): void

```ts
// example:
import { build } from "tui-ts";

build();
```

### createContextMenu(contextMenuConfig: Readonly\<ContextMenuConfig>): ContextMenu

```ts
// example:
import { createContextMenu, UserInput } from "tui-ts";

createContextMenu({
  id: "foo",
  run: (userInput: UserInput) => {
    console.log(userInput);
  }
});
```

### getState(): Readonly\<State>

```ts
// example:
import { getState } from "tui-ts";

const state = getState();
console.log(state["foo"]);
```

### select(contextMenuId: ContextMenuId): ContextMenu

```ts
// example:
import { select } from "tui-ts";

select("foo");
```

### setState(state: State): void

```ts
// example:
import { getState, setState } from "tui-ts";

const state = getState();
setState({ ...state, foo: "bar" });
```
