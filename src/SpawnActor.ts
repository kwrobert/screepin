import { setup, fromPromise } from 'xstate'

type BodyConfig = Array<BodyPartConstant>

function spawnCreep(spawn_id: string, body_config: BodyConfig, creep_name: string) {
  console.log(`Spawning creep ${creep_name} with body ${body_config}`);
  let spawn = Game.spawns[spawn_id]
  let result = spawn.spawnCreep(body_config, creep_name) // , { memory: { role: role_name, room: room.name, working: false } })
  console.log("Spawn result:");
  console.log(result)
  if (result !== OK) {
    console.log("ERROR SPAWNING CREEP");
  }
}

export const SpawnControllerMachine = setup({
  types: {
    events: {} as { type: "spawn"; body_config: Array<BodyPartConstant>, creep_name: string },
    input: {} as { spawn_id: string },
  },
  actions: {
    spawnCreep: (_, params: { spawn_id: string, body_config: BodyConfig, creep_name: string }) => {
      spawnCreep(params.spawn_id, params.body_config, params.creep_name);
    },
  },
  actors: {
    SpawnAwaiter: fromPromise(async ({ input }: { input: { spawn_id: string } }) => {
      let spawn = Game.spawns[input.spawn_id]
      while (spawn.spawning){
        console.log(`Ticks remaining on spawn: ${spawn.spawning.remainingTime}`)
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      console.log("Spawn complete!")
    })
  },
}).createMachine({
  context: ({ input }) => ({
    spawn_id: input.spawn_id,
  }),
  id: "SpawnController",
  initial: "Idle",
  states: {
    Idle: {
      on: {
        spawn: {
          target: "Spawning",
          actions: [
            {
              type: "spawnCreep", params: ({ context, event }) => ({
                spawn_id: context.spawn_id,
                body_config: event.body_config,
                creep_name: event.creep_name
              })
            }
          ]
        }
      }
    },
    Spawning: {
      invoke: {
        id: "SpawnAwaiter",
        src: "SpawnAwaiter",
        input: ({ context }) => ({ spawn_id: context.spawn_id }),
        onDone: {
          target: "Idle"
        },
      }
    }
  }
})
