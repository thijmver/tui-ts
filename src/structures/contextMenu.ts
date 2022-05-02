import { ContextMenuParentId, ContextMenuId, ContextMenuRun, ContextMenuConfig } from "../types";

export class ContextMenu {
  private readonly parentId: ContextMenuParentId;
  private readonly id: ContextMenuId;
  private readonly run: ContextMenuRun;

  public constructor(contextMenuConfig: Readonly<ContextMenuConfig>) {
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

    this.parentId = contextMenuConfig.parentId;
    this.id = contextMenuConfig.id;
    this.run = contextMenuConfig.run;
  }

  public getParentId(): ContextMenuParentId {
    return this.parentId;
  }

  public getId(): ContextMenuId {
    return this.id;
  }

  public getRun(): ContextMenuRun {
    return this.run;
  }
}
