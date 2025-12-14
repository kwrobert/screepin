import { find_loadable_structures, find_active_sources_by_distance } from "utils/search"

var RoleRegistry = new Map<string, typeof CreepRoleBase>();

abstract class CreepRoleBase {
  static role: string = "base"
  static body_config: Array<BodyPartConstant> = [];

  constructor(public creep: Creep) {
    this.creep = creep
    console.log(`Assigning role ${this.getRole()} to creep ${creep.name}`);
    creep.memory.role = this.getRole()
  }

  getRole(): string {
    return (this.constructor as typeof CreepRoleBase).role;
  }

  getBodyConfig(): Array<BodyPartConstant> {
    return (this.constructor as typeof CreepRoleBase).body_config;
  }

  run(): void {
    console.log(`Inside runner for creep ${this.creep.name} with role ${this.getRole()}`)
  }
}


class RoleHarvester extends CreepRoleBase {
  static override role = "harvester"
  static override body_config = [WORK, CARRY, MOVE]

  run(): void {
    if (this.creep.store.getFreeCapacity() > 0) {
      // first element will be the closest source to the creep
      let active_sources = find_active_sources_by_distance(this.creep.room, this.creep)
      if (this.creep.harvest(active_sources[0]) == ERR_NOT_IN_RANGE) {
        this.creep.moveTo(active_sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
      }
    }
    else {
      let targets = find_loadable_structures(this.creep.room)
      if (targets.length > 0) {
        if (this.creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          this.creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }
    }
  }

}

RoleRegistry.set("harvester", RoleHarvester)

function get_role_counts(): Record<string, number> {

  let role_counts: Record<string, number> = {};
  // Set up default counts for roles in the role registry
  for (let role_name in Object.keys(RoleRegistry)) {
    role_counts[role_name] = 0;
  }
  console.log("Role counts in get_role_counts before:")
  console.log(role_counts)
  console.log("Game creeps:")
  console.log(Game.creeps)
  for (var creep_name in Game.creeps) {
    var creep = Game.creeps[creep_name]
    console.log("Creep memory:")
    console.log(creep.memory)
    let creep_role = creep.memory.role
    if ( creep_role in role_counts) {
      console.log(`Found creep with expected creep role ${creep_role}`)
      role_counts[creep.memory.role] = role_counts[creep.memory.role] + 1
    } else {
      console.log(`Found creep with UNEXPECTED creep role ${creep_role}`)
      role_counts[creep.memory.role] = 1
    }
  }
  console.log("Role counts in get_role_counts after:")
  console.log(role_counts)
  return role_counts
}

export { RoleRegistry, RoleHarvester, get_role_counts };
