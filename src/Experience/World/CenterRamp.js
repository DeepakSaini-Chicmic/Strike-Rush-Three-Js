import { Color } from "three";
import Experience from "../Experience";
import { getPhysicsBody } from "../Utils/PhycisBodyHelper";
import { ShapeType } from "three-to-cannon";
import { Vec3 } from "cannon-es";

export default class CenterRamp {
  constructor(rampMaterial, position) {
    this.experience = new Experience();
    const { resources, scene, physicsWorld } = this.experience;
    this.resources = resources;
    this.scene = scene;
    this.physicsWorld = physicsWorld;
    this.rampModel = resources.items.CenterRamp.children[0];
    this.rampModelTexture = resources.items.CenterRampTexture;
    this.rampMaterial = rampMaterial;
    this.setModel(position);
  }

  setModel(position) {
    this.scene.add(this.rampModel);
    this.rampModel.material.map = this.rampModelTexture;
    this.rampModel.material.color = new Color(0xf1eb9c);
    this.rampBody = getPhysicsBody(
      this.rampModel,
      ShapeType.HULL,
      this.rampMaterial,
      0
    );
    const rotationAxis = new Vec3(1, 0, 0);
    this.rampBody.quaternion.setFromAxisAngle(rotationAxis, -Math.PI / 2);
    this.rampBody.position.copy(position);
    this.rampModel.position.copy(this.rampBody.position);
    this.rampModel.quaternion.copy(this.rampBody.quaternion);
    this.physicsWorld.addBody(this.rampBody);
  }
}
