interface SourceSorter {
  (source1: Source, source2: Source): number;
}

interface PositionedObject {
  pos: RoomPosition
}

function distance(a: PositionedObject, b: PositionedObject): number {
  return Math.sqrt((a.pos.x - b.pos.x) ** 2 + (a.pos.y - b.pos.y) ** 2)
}

function find_active_sources_sorted(room: Room, sorter: SourceSorter): Array<Source> {
  var sources = room.find(FIND_SOURCES);
  var sorted_sources = [...sources].sort(sorter)
  return sorted_sources
}

function find_active_sources_by_distance(room: Room, object: PositionedObject): Array<Source> {

  function sorter(source: Source, object: PositionedObject) {
    return distance(source, object)
  }
  var sources = room.find(FIND_SOURCES_ACTIVE);
  var sorted_sources = [...sources].sort(sorter)
  return sorted_sources
}

function find_loadable_structures(room: Room): Array<Structure> {
  var targets = room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return (structure.structureType == STRUCTURE_EXTENSION ||
        structure.structureType == STRUCTURE_SPAWN ||
        structure.structureType == STRUCTURE_TOWER) &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    }
  });
  return targets
}

export {find_active_sources_by_distance, find_loadable_structures };
