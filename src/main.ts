import { ErrorMapper } from "utils/ErrorMapper";
import { SpawnControllerMachine } from "SpawnActor";
import { type ActorRefFrom, createActor } from 'xstate'
import { RoleHarvester, RoleRegistry, get_role_counts } from "CreepTypes";

type SpawnControllerActorRef = ActorRefFrom<typeof SpawnControllerMachine>

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {

  console.log(`Current game tick is ${Game.time}`);

  let spawn_actors: Array<SpawnControllerActorRef> = []
  for (var spawn_id in Game.spawns) {
    console.log(`Initializing spawn ID ${spawn_id}`)
    var SpawnControllerActor;
    var SpawnControllerState;
    if (Memory.spawn_states){
      SpawnControllerState = Memory.spawn_states[spawn_id]
    } else {
      SpawnControllerState = undefined
    }
    console.log(`Type of SpawnControllerState from Memory ${typeof (SpawnControllerState)}`)
    if (SpawnControllerState) {
      console.log("Restoring actor state")
      SpawnControllerActor = createActor(SpawnControllerMachine, {
        state: SpawnControllerState,
        input: { spawn_id: spawn_id }
      });
    } else {
      console.log("Creating new actor")
      SpawnControllerActor = createActor(SpawnControllerMachine, { input: { spawn_id: spawn_id } })
    }
    SpawnControllerActor.start();
    console.log(`Starting in state ${SpawnControllerActor.getSnapshot().value}`);
    spawn_actors.push(SpawnControllerActor)
  }


  spawn_actors.forEach(actor => {
    console.log(`State: ${actor.getSnapshot().value}`)
    if (Game.time == 10) {
      actor.send({ type: "spawn" , body_config: [WORK, CARRY, MOVE], creep_name: "test-creep" })
      console.log("Log after send")
      console.log(`State: ${actor.getSnapshot().value}`)
      console.log(`State: ${actor.getSnapshot().value}`)
    }
  })

  console.log("Storing memory")

  if (!Memory.spawn_states){
    Memory.spawn_states = {}
  }
  spawn_actors.forEach(actor => {
    const persistedState = actor.getPersistedSnapshot();
    Memory.spawn_states[spawn_id] = persistedState

    // const target_role_counts: Record<string, number> = { "harvester": 2 };
    // let current_role_counts = get_role_counts();
  })
  // // Create role counts
  // console.log("Target role counts:");
  // console.log(JSON.stringify(target_role_counts))
  // console.log("Existing role counts:");
  // console.log(JSON.stringify(current_role_counts))
  // // Create creeps until role count is met
  // console.log("Starting creep creation routine")
  // for (let role_name in target_role_counts) {
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
  //     let result = spawn.spawnCreep(role_body_config, creep_name, { memory: { role: role_name, room: room.name, working: false } })
  //     console.log("Spawn result:");
  //     console.log(result)
  //     if (result !== OK) {
  //       break
  //     }
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
