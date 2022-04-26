import { createInterface } from "readline";
import { stdin } from "process";
// prettier-ignore
import { ContextMenuId, UserInput, ContextMenuRun, ContextMenuRun as Listener, ContextMenuConfig, ContextMenu } from "./contextMenu";

export type Identifier = string;
export type Children = { [key: Identifier]: ContextMenuId };
export type State = { [key: PropertyKey]: unknown };

export interface Selected {
  id: ContextMenuId;
  run: ContextMenuRun;
  children: Readonly<Children>;
}

export class Builder {
  private static readonly contextMenus: ContextMenu[] = [];
  private static selected: Readonly<Selected> | null = null;
  private static state: Readonly<State> = {};
  private static frozen: boolean = false;
  private static readonly DEFAULT_CONTEXT_MENU_ID: ContextMenuId = "main";

  public static createContextMenu(contextMenuConfig: ContextMenuConfig): ContextMenu {
    const contextMenu = new ContextMenu(contextMenuConfig);
    this.contextMenus.push(contextMenu);
    return contextMenu;
  }

  public static select(contextMenuId: ContextMenuId): ContextMenu | null {
    const contextMenu = this.contextMenus.find((contextMenu) => contextMenu.getId() === contextMenuId);
    if (contextMenu) {
      this.selected = {
        id: contextMenuId,
        run: contextMenu.getRun(),
        children: this.formatContextMenus(
          this.contextMenus.filter((contextMenu) => contextMenu.getParentId() === contextMenuId)
        )
      };
      return contextMenu;
    }
    return null;
  }

  public static build(): void {
    if (this.selected === null && this.select(this.DEFAULT_CONTEXT_MENU_ID) === null) {
      return;
    }

    this.listener(null);
    this.listenForUserInput(this.listener);
  }

  public static getState(): Readonly<State> {
    return this.state;
  }

  public static setState(state: State): void {
    this.state = state;
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
