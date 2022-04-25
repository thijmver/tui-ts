import { createInterface } from "readline";
import { stdin } from "process";
// prettier-ignore
import { ContextMenuId, UserInput, ContextMenuRun, ContextMenuRun as Listener, ContextMenuConfig, ContextMenu } from "./contextMenu";

export type Identifier = string;
export type Children = { [key: Identifier]: ContextMenuId };

export interface Selected {
  readonly id: ContextMenuId;
  readonly run: ContextMenuRun;
  readonly children: Children;
}

export class Builder {
  private static readonly contextMenus: ContextMenu[] = [];
  private static selected: Selected | null = null;

  public static createContextMenu(contextMenuConfig: ContextMenuConfig): ContextMenu {
    const contextMenu = new ContextMenu(contextMenuConfig);
    Builder.contextMenus.push(contextMenu);
    return contextMenu;
  }

  public static select(contextMenuId: ContextMenuId): ContextMenu | null {
    const contextMenu = Builder.contextMenus.find((contextMenu) => contextMenu.getId() === contextMenuId);
    if (contextMenu) {
      Builder.selected = {
        id: contextMenuId,
        run: contextMenu.getRun(),
        children: Builder.formatContextMenus(
          Builder.contextMenus.filter((contextMenu) => contextMenu.getParentId() === contextMenuId)
        )
      };
      return contextMenu;
    }
    return null;
  }

  public static build(): void {
    if (Builder.selected === null) {
      return;
    }

    Builder.listener(null);
    Builder.listenForUserInput(Builder.listener);
  }

  private static listener(userInput: UserInput): void {
    if (Builder.selected === null) {
      return;
    }

    console.clear();

    if (userInput !== null && Object.keys(Builder.selected.children).includes(userInput)) {
      Builder.select(Builder.selected.children[userInput]);
      userInput = null;
    }

    const selectedId = Builder.selected.id;

    Builder.selected.run(userInput);

    if (Builder.selected.id !== selectedId) {
      Builder.listener(null);
      return;
    }

    const text = Object.entries(Builder.selected.children).reduce((res, [identifier, contextMenuId]) => {
      return res + `(${identifier}) ${contextMenuId}; `;
    }, "");

    if (text) {
      console.log(text);
    }
  }

  private static formatContextMenus(contextMenus: ContextMenu[]): Children {
    const children: Children = {};

    const createIdentifier = (contextMenuId: ContextMenuId, identifier?: Identifier): Identifier => {
      identifier = identifier === undefined ? contextMenuId[0] : identifier + contextMenuId[identifier.length];
      if (Object.keys(children).includes(identifier)) {
        return createIdentifier(contextMenuId, identifier);
      }
      return identifier;
    };

    for (const contextMenu of contextMenus) {
      const identifier = createIdentifier(contextMenu.getId());
      children[identifier] = contextMenu.getId();
    }

    return children;
  }

  private static listenForUserInput(listener: Listener): void {
    const rl = createInterface({ input: stdin });
    rl.on("line", listener);
  }
}
