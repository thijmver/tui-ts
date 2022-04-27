# About

"tui-ts" is a package that makes it extremely easy to build [text-based user interfaces](https://en.wikipedia.org/wiki/Text-based_user_interface) using [context menus](https://en.wikipedia.org/wiki/Context_menu).

# Installation

Using NPM:

```
npm i tui-ts
```

# Example

```ts
import { createContextMenu, build } from "tui-ts";

createContextMenu({
  id: "main",
  run: () => {
    console.log("this is the main menu!");
  }
});

createContextMenu({
  parentId: "main",
  id: "some-other-menu",
  run: (userInput: string | null) => {
    console.log(userInput);
    console.log("this is another menu.");
  }
});

build();
```
