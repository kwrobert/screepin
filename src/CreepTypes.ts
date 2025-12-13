interface CreepRole {
  role: string;
  run(): void;
}

class RoleBase implements CreepRole {
  role: string = "base"

  constructor(public creep: Creep) {
    console.log(`Assigning role ${this.role} to creep ${creep.name}`);
    creep.memory.role = this.role
  }

  run(): void {
    console.log(`Inside runner for creep ${this.creep.name} with role ${this.role}`)
  }
}


class RoleHarvester extends RoleBase {
  role = "harvester"

  run(): void {
    if (this.creep.store.getFreeCapacity() > 0) {
      // first element will be the closest source to the creep
      var active_sources = find_active_sources_by_distance(this.creep.room, this.creep)
      if (this.creep.harvest(active_sources[0]) == ERR_NOT_IN_RANGE) {
        this.creep.moveTo(active_sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
      }
    }
    else {
      var targets = find_loadable_structures(this.creep.room)
      if (targets.length > 0) {
        if (this.creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          this.creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }
    }
  }

}
