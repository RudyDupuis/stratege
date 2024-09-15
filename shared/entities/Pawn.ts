export class Pawn {
  public readonly owner: string;
  public remainingMode: number;
  public orientation: "N" | "S" | "E" | "W";
  public isAlive: boolean;

  constructor(owner: string, orientation: "N" | "S" | "E" | "W") {
    this.owner = owner;
    this.remainingMode = 2;
    this.orientation = orientation;
    this.isAlive = true;
  }
}
