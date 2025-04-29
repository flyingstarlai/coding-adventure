export type GameEvents = {
    PlayStart: void;
    PlayStop: void;
    LevelCompleted: void;
    LevelFailed: void;
    EnergyCollected: { amount: number };
  };
  