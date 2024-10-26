export enum Action {
  Move = 'move',
  Kill = 'kill',
  Rotate = 'rotate',
  Push = 'push',
  Pull = 'pull'
}

export enum ReceivedAction {
  IsPushed = 'isPushed',
  IsPulled = 'isPulled',
  IsKilled = 'isKilled'
}
