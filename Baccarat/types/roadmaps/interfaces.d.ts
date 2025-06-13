import { GameResult } from "..";

/*
  beadPlate = [
                {"result":{"outcome":"banker","natural":"banker8","pair":"none"},"column":0,"row":0},
                {"result":{"outcome":"tie","natural":"none","pair":"none"},"column":0,"row":1},
                {"result":{"outcome":"banker","natural":"none","pair":"none"},"column":0,"row":2},
                {"result":{"outcome":"banker","natural":"banker9","pair":"none"},"column":0,"row":3},
                {"result":{"outcome":"player","natural":"none","pair":"none"},"column":0,"row":4}
              ]
*/
export interface Bead {
  gameResult: GameResult;
  column: number;
  row: number;
}
export interface BeadPlate {
  beads: Bead[];
}
export interface BeadPlateConfig {
  columns: number;
  rows: number;
}

/*
  bigRoad = [
              {
                "row":0,"column":0,"logicalColumn":0,
                  "ties":[
                      {"outcome":"tie","natural":"none","pair":"none"}
                    ],"result":{"outcome":"banker","natural":"banker8","pair":"none"}},
                {"row":1,"column":0,"logicalColumn":0,"ties":[],"result":{"outcome":"banker","natural":"none","pair":"none"}},
                {"row":2,"column":0,"logicalColumn":0,"ties":[],"result":{"outcome":"banker","natural":"banker9","pair":"none"}},
                {"row":0,"column":1,"logicalColumn":1,"ties":[],"result":{"outcome":"player","natural":"none","pair":"none"}}]
*/
export interface BigRoadItem {
  row: number;
  column: number;
  logicalColumn: number;
  ties: GameResult[];
  result: GameResult;
}
export interface BigRoad {
  items: BigRoadItem[];
}
export interface BigRoadConfig {
  columns: number;
  rows: number;
  scroll: boolean;
}

export enum GameResultOutcomes {
  Player = "player",
  Banker = "banker",
  Tie = "tie",
}
/*
  columnDictionary =  {
    "32":{"logicalColumn":32,"logicalColumnDepth":1,"outcome":"player"},
    "33":{"logicalColumn":33,"logicalColumnDepth":2,"outcome":"banker"},
    "34":{"logicalColumn":34,"logicalColumnDepth":1,"outcome":"player"},
    "35":{"logicalColumn":35,"logicalColumnDepth":4,"outcome":"banker"},
    "36":{"logicalColumn":36,"logicalColumnDepth":4,"outcome":"banker"},
    "37":{"logicalColumn":37,"logicalColumnDepth":1,"outcome":"banker"},
    "38":{"logicalColumn":38,"logicalColumnDepth":2,"outcome":"player"},
  }
*/
export interface ColumnDictionary {
  [k: string]: {
    logicalColumn: number;
    logicalColumnDepth: number;
    outcome: GameResultOutcomes;
  };
}

export enum DerivedRoadItem {
  Red = "red",
  Blue = "blue",
}
export interface DerivedRoad {
  items: DerivedRoadItem[];
}
export type BigEyeRoad = DerivedRoad;
export type SmallRoad = DerivedRoad;
export type CockroachPigRoad = DerivedRoad;
