import { ErrorMapper } from "utils/ErrorMapper";
import { RoleHarvester, RoleRegistry, get_role_counts } from "CreepTypes";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  const target_role_counts: Record<string, number> = { "harvester": 2 };
  let current_role_counts = get_role_counts();
  // Create role counts
  console.log("Target role counts:");
  console.log(JSON.stringify(target_role_counts))
  console.log("Existing role counts:");
  console.log(JSON.stringify(current_role_counts))
  // Create creeps until role count is met
  console.log("Starting creep creation routine")
  // for (const role_name in target_role_counts) {
  //   let target_role_count = target_role_counts[role_name];
  //   let actual_role_count = current_role_counts[role_name] ?? 0
  //   console.log(`Actual Role Count = ${actual_role_count}`)
  //   const role_class = RoleRegistry.get(role_name) ?? RoleHarvester
  //   const role_body_config = role_class.body_config;
  //   while (actual_role_count !== target_role_count) {
  //     console.log(`Target Role Count = ${target_role_count}`)
  //     console.log(`Attempting to spawn creep with role ${role_name}`)
  //     current_role_counts = get_role_counts();
  //     actual_role_count = current_role_counts[role_name] ?? 0
  //     //TODO: Get first spawn with available energyt
  //     const spawn = Game.spawns["Spawn1"];
  //     const room = spawn.room;
  //     const num_creeps: number = Object.keys(Game.creeps).length;
  //     const creep_num: number = num_creeps + 1;
  //     let creep_name = `creep_${creep_num}`;
  //     let result = spawn.spawnCreep(role_body_config, creep_name, { "memory": { "role": role_name, "room": room.name, "working": true } })
  //     if (result !== OK) {
  //       console.log(`Unable to spawn creep. Result = ${result}`)
  //       break
  //     }
  //     console.log("Spawn result:");
  //     console.log(result)
  //   }
  // }
  // console.log("Starting creep role execution routine")
  // for (let name in Game.creeps) {
  //   let creep = Game.creeps[name];
  //   const RoleClass = RoleRegistry.get(creep.memory.role)
  //   if (RoleClass !== undefined) {
  //     console.log(`Running role ${RoleClass.name} for creep ${creep.name} role memory ${creep.memory.role}`)
  //     let role = new RoleClass(creep)
  //     role.run();
  //   }
  // }

  // Automatically delete memory of missing treeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});
