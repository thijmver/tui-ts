export type ContextMenuParentId = string | null | undefined;
export type ContextMenuId = string;
export type UserInput = string;
export type ContextMenuRun = (userInput: UserInput) => void | Promise<void>;

export interface ContextMenuConfig {
  readonly parentId?: ContextMenuParentId;
  readonly id: ContextMenuId;
  readonly run: ContextMenuRun;
}

export class ContextMenu {
  private readonly parentId: ContextMenuParentId;
  private readonly id: ContextMenuId;
  private readonly run: ContextMenuRun;

  public constructor(contextMenuConfig: ContextMenuConfig) {
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
