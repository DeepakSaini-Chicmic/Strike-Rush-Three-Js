import Experience from "../Experience.js";

import { Vec3 } from "cannon-es";
import { ShapeType } from "three-to-cannon";
import { getPhysicsBody } from "../Utils/PhycisBodyHelper.js";
import { SRGBColorSpace } from "three";

export default class GemsBlock {
  constructor(noOfGemLines, gemMaterial, positionZ, options, position) {
    this.experience = new Experience();
    const { scene, resources, time, debug, physicsWorld } = this.experience;
    this.scene = scene;
    this.resources = resources;
    this.time = time;
    this.debug = debug;
    this.physicsWorld = physicsWorld;
    this.resource = resources.items.GemBall;
    this.gemMaterial = gemMaterial;
    this.positionZ = positionZ;
    this.diamondsMeshes = [];
    this.diamondsBodies = [];
    this.options = options;
    this.createGemBlock(noOfGemLines, position);
  }

  createGemBalls(modelPosition) {
    const clonedModel = this.resource.clone();
    const model = clonedModel.children.shift();
    model.castShadow = true;
    this.diamondsMeshes.push(model);
    model.scale.set(0.007, 0.007, 0.007);
    model.position.copy(modelPosition);
    const rigidBody = getPhysicsBody(
      model,
      ShapeType.HULL,
      this.gemMaterial,
      0
    );
    rigidBody.collisionResponse = false;
    const rotationAxis = new Vec3(1, 0, 0);
    rigidBody.quaternion.setFromAxisAngle(rotationAxis, -Math.PI * 0.5);
    model.quaternion.copy(rigidBody.quaternion);
    rigidBody.quaternion.copy(model.quaternion);
    this.diamondsBodies.push(rigidBody);
    this.scene.add(model);
    this.physicsWorld.addBody(rigidBody);
    return rigidBody;
  }

  createGemBlock(size, positionToSetOn) {
    const gapX = 1; // Horizontal Gap between rows
    const gapZ = 4; // Vertical Gap between columns
    let startX = positionToSetOn.x - 5;
    const startY = positionToSetOn.y;
    let startZ = positionToSetOn.z - 5 + this.positionZ;
    for (let row = 1; row <= size; row++) {
      let rowX = startX;
      for (let col = 1; col <= size; col++) {
        const pos = new Vec3(rowX + gapX, startY, startZ);
        this.createGemBalls(pos);
        rowX = pos.x + gapX;
      }
      startZ += gapZ;
    }
  }

  update() {
    for (let i = 0; i < this.diamondsMeshes.length; i++) {
      this.diamondsMeshes[i].position.copy(this.diamondsBodies[i].position);
      this.diamondsMeshes[i].quaternion.copy(this.diamondsBodies[i].quaternion);
    }
  }
}
