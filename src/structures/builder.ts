import { createInterface } from "readline";
import { stdin } from "process";
import { ContextMenu } from "./contextMenu";
import {
  BuilderSelected,
  BuilderState,
  ContextMenuId,
  ContextMenuConfig,
  State,
  UserInput,
  ContextMenuChildren,
  ContextMenuIdentifier,
  Listener
} from "../types";

export class Builder {
  private static readonly contextMenus: ContextMenu[] = [];
  private static selected: Readonly<BuilderSelected> | null = null;
  private static state: Readonly<BuilderState> = {};
  private static frozen: boolean = false;
  private static readonly DEFAULT_CONTEXT_MENU_ID: ContextMenuId = "main";

  public static createContextMenu(contextMenuConfig: Readonly<ContextMenuConfig>): ContextMenu {
    if (contextMenuConfig === undefined) {
      throw new Error("contextMenuConfig is missing.");
    }

    if (typeof contextMenuConfig !== "object") {
      throw new Error("contextMenuConfig is not of type object.");
    }

    if (contextMenuConfig.id === undefined) {
      throw new Error("contextMenuConfig.id is missing.");
    }

    if (typeof contextMenuConfig.id !== "string") {
      throw new Error("contextMenuConfig.id is not of type string.");
    }

    if (
      typeof contextMenuConfig.parentId !== "string" &&
      contextMenuConfig.parentId !== null &&
      contextMenuConfig.parentId !== undefined
    ) {
      throw new Error("contextMenuConfig.parentId is not of type string, null or undefined.");
    }

    if (contextMenuConfig.run === undefined) {
      throw new Error("contextMenuConfig.run is missing.");
    }

    if (typeof contextMenuConfig.run !== "function") {
      throw new Error("contextMenuConfig.run is not of type function.");
    }

    const contextMenu = new ContextMenu(contextMenuConfig);
    Builder.contextMenus.push(contextMenu);
    return contextMenu;
  }

  public static select(contextMenuId: ContextMenuId): ContextMenu {
    if (typeof contextMenuId !== "string") {
      throw new Error("contextMenuId is not of type string.");
    }

    const contextMenu = Builder.contextMenus.find((contextMenu) => contextMenu.getId() === contextMenuId);
    if (contextMenu === undefined) {
      throw new Error(`could not find context menu with id: ${contextMenuId}.`);
    }

    Builder.selected = {
      id: contextMenuId,
      run: contextMenu.getRun(),
      children: Builder.formatContextMenus(
        Builder.contextMenus.filter((contextMenu) => contextMenu.getParentId() === contextMenuId)
      )
    };

    return contextMenu;
  }

  public static build(): void {
    if (Builder.selected === null) {
      try {
        Builder.select(Builder.DEFAULT_CONTEXT_MENU_ID);
      } catch {
        throw new Error(
          `no context menu had been selected and none could be found with default id: ${Builder.DEFAULT_CONTEXT_MENU_ID}.`
        );
      }
    }

    Builder.listener(null);
    Builder.listenForUserInput(Builder.listener);
  }

  public static getState(): Readonly<State> {
    return Builder.state;
  }

  public static setState(state: State): void {
    if (typeof state !== "object") {
      throw new Error("state is not of type object.");
    }
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
