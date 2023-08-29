import { Color, MeshBasicMaterial, SRGBColorSpace } from "three";
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
    this.rampModel = resources.items.CenterRamp.scene.children[0];
    this.rampModel.material = new MeshBasicMaterial({});
    this.rampModel.scale.set(0.015, 0.015, 0.03);
    this.rampModelTexture = resources.items.CenterRampTexture;
    this.rampModelTexture.colorSpace = SRGBColorSpace;
    this.rampMaterial = rampMaterial;
    this.setModel(position);
  }

  setModel(position) {
    this.scene.add(this.rampModel);
    this.rampModel.material.map = this.rampModelTexture;
    this.rampModel.material.color = new Color(0xfdca00);
    this.rampBody = getPhysicsBody(
      this.rampModel,
      ShapeType.HULL,
      this.rampMaterial,
      0
    );
    this.rampBody.position.copy(position);
    this.rampModel.position.copy(this.rampBody.position);
    this.rampModel.quaternion.copy(this.rampBody.quaternion);
    this.physicsWorld.addBody(this.rampBody);
  }
}
