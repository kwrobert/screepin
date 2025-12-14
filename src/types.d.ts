// Global type extensions for Screeps
declare global {
  interface CreepMemory {
    role: string;
    room: string;
    working: boolean;
  }

  interface Memory {
    uuid: number;
    log: any;
  }
}

export {};
