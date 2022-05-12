export type ContextMenuParentId = string | null | undefined;

export type ContextMenuId = string;

export type ContextMenuIdentifier = string | undefined;

export type UserInput = string | null;

export type ContextMenuRun = (userInput: UserInput) => void | Promise<void>;

export type Identifier = string;

export type BuilderState = State;

export type Listener = ContextMenuRun;

export interface ContextMenuConfig {
  parentId?: ContextMenuParentId;
  id: ContextMenuId;
  identifier?: ContextMenuIdentifier;
  run: ContextMenuRun;
}

export interface ContextMenuChildren {
  [key: Identifier]: ContextMenuId;
}

export interface State {
  [key: PropertyKey]: unknown;
}

export interface BuilderSelected {
  id: ContextMenuId;
  run: ContextMenuRun;
  children: Readonly<ContextMenuChildren>;
}
