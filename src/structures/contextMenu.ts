import { ContextMenuParentId, ContextMenuId, ContextMenuIdentifier, ContextMenuRun, ContextMenuConfig } from "../types";

export class ContextMenu {
  private readonly parentId: ContextMenuParentId;
  private readonly id: ContextMenuId;
  private readonly identifier: ContextMenuIdentifier;
  private readonly run: ContextMenuRun;

  public constructor(contextMenuConfig: Readonly<ContextMenuConfig>) {
    if (typeof contextMenuConfig !== "object") {
      throw new Error("contextMenuConfig is not of type object.");
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

    if (typeof contextMenuConfig.identifier !== "string" && contextMenuConfig.identifier !== undefined) {
      throw new Error("contextMenuConfig.identifier is not of type string or undefined.");
    }

    if (typeof contextMenuConfig.run !== "function") {
      throw new Error("contextMenuConfig.run is not of type function.");
    }

    this.parentId = contextMenuConfig.parentId;
    this.id = contextMenuConfig.id;
    this.identifier = contextMenuConfig.identifier;
    this.run = contextMenuConfig.run;
  }

  public getParentId(): ContextMenuParentId {
    return this.parentId;
  }

  public getId(): ContextMenuId {
    return this.id;
  }

  public getIdentifier(): ContextMenuIdentifier {
    return this.identifier;
  }

  public getRun(): ContextMenuRun {
    return this.run;
  }
}
