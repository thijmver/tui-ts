import { createInterface } from "readline";
import { stdin } from "process";
// prettier-ignore
import { ContextMenuId, UserInput, ContextMenuRun, ContextMenuRun as Listener, ContextMenuConfig, ContextMenu } from "./contextMenu";

export type ContextMenuIdentifier = string;
export type State = BuilderState;

export interface ContextMenuChildren {
  [key: ContextMenuIdentifier]: ContextMenuId;
}

export interface BuilderState {
  [key: PropertyKey]: unknown;
}

export interface BuilderSelected {
  id: ContextMenuId;
  run: ContextMenuRun;
  children: Readonly<ContextMenuChildren>;
}

export class Builder {
  private static readonly contextMenus: ContextMenu[] = [];
  private static selected: Readonly<BuilderSelected> | null = null;
  private static state: Readonly<BuilderState> = {};
  private static frozen: boolean = false;
  private static readonly DEFAULT_CONTEXT_MENU_ID: ContextMenuId = "main";

  public static createContextMenu(contextMenuConfig: Readonly<ContextMenuConfig>): ContextMenu {
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
    if (Builder.selected === null && Builder.select(Builder.DEFAULT_CONTEXT_MENU_ID) === null) {
      return;
    }

    Builder.listener(null);
    Builder.listenForUserInput(Builder.listener);
  }

  public static getState(): Readonly<State> {
    return Builder.state;
  }

  public static setState(state: State): void {
    Builder.state = state;
  }

  private static async listener(userInput: UserInput): Promise<void> {
    // TODO: clear new lines when frozen.
    if (Builder.selected === null || Builder.frozen === true) {
      return;
    }

    Builder.frozen = true;
    console.clear();

    if (userInput !== null && Object.keys(Builder.selected.children).includes(userInput)) {
      Builder.select(Builder.selected.children[userInput]);
      userInput = null;
    }

    const selectedId = Builder.selected.id;

    await Builder.selected.run(userInput);

    Builder.frozen = false;

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

  // TODO: implement proper algorithm.
  private static formatContextMenus(contextMenus: Readonly<ContextMenu[]>): ContextMenuChildren {
    const children: ContextMenuChildren = {};

    // prettier-ignore
    const createIdentifier = (contextMenuId: ContextMenuId, identifier?: ContextMenuIdentifier): ContextMenuIdentifier => {
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
