import {assert} from "chai";
import {RoleRegistry} from "../../src/CreepTypes"
import {Game, Memory} from "./mock"

describe("CreepTypes", () => {
  before(() => {
    // runs before all test in this block
  });

  beforeEach(() => {
    // runs before each test in this block
    // @ts-ignore : allow adding Game to global
    global.Game = _.clone(Game);
    // @ts-ignore : allow adding Memory to global
    global.Memory = _.clone(Memory);
  });

  it("RoleRegistry should not contain base", () => {
    console.log("Registry contents:");
    console.log(Array.from(RoleRegistry.keys()));
    assert.isFalse(RoleRegistry.has("base"));
  });

  it("RoleRegistry should contain harvester", () => {
    console.log("Registry contents:");
    console.log(Array.from(RoleRegistry.keys()));
    assert.isTrue(RoleRegistry.has("harvester"));
  });

});
