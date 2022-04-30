import { ContextMenuParentId, ContextMenuId, ContextMenuRun, ContextMenuConfig } from "../types";

export class ContextMenu {
  private readonly parentId: ContextMenuParentId;
  private readonly id: ContextMenuId;
  private readonly run: ContextMenuRun;

  public constructor(contextMenuConfig: Readonly<ContextMenuConfig>) {
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
