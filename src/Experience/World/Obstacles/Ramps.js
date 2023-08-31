import Experience from "../../Experience.js";
import { ShapeType } from "three-to-cannon";
import { getPhysicsBody } from "../../Utils/PhycisBodyHelper.js";

import { Vec3 } from "cannon-es";
import {
  BoxGeometry,
  Color,
  Mesh,
  MeshStandardMaterial,
  SRGBColorSpace,
  sRGBEncoding,
} from "three";
import { COLLISION_BODIES } from "../../Utils/Constants.js";

export default class Ramps {
  constructor(rampType, modelScaling, positionZ, rampMaterial) {
    this.experience = new Experience();
    const { scene, resources, time, debug, physicsWorld } = this.experience;
    this.scene = scene;
    this.resources = resources;
    this.time = time;
    this.debug = debug;
    this.physicsWorld = physicsWorld;
    this.finishLine = resources.items.FinishLine;
    this.rampMaterial = rampMaterial;
    this.resource = rampType;
    this.setModel(modelScaling, positionZ);
  }

  setModel(modelScaling, positionZ) {
    this.model = this.resource;
    const childMesh = this.model.children[0];
    childMesh.scale.set(modelScaling.x, modelScaling.y - 0.02, modelScaling.z);
    this.model.traverse((child) => {
      if (child.isMesh) {
        child.material = new MeshStandardMaterial({
          map: this.resources.items.CenterRampTexture,
        });
        child.material.map.flipY = true;
      }
    });
    childMesh.material.map.colorSpace = SRGBColorSpace;
    const rigidBody = getPhysicsBody(
      childMesh,
      ShapeType.HULL,
      COLLISION_BODIES.CENTERRAMP,
      0
    );
    rigidBody.quaternion.setFromAxisAngle(new Vec3(0, 1, 0), Math.PI);
    rigidBody.position.z = positionZ;
    childMesh.material.color = new Color(0xeffd5f);
    childMesh.position.copy(rigidBody.position);
    childMesh.quaternion.copy(rigidBody.quaternion);
    this.physicsWorld.addBody(rigidBody);
    this.finishLine.scale.set(0.0145, 0.0145, 0.0145);
    this.finishLine.rotation.x = (-Math.PI / 180) * 80;
    this.finishLine.position.set(this.finishLine.position.x, 3, positionZ + 12);
    this.scene.add(this.model, this.finishLine);
    this.createHiddenRampJumper(positionZ);
  }

  createHiddenRampJumper(positionZ) {
    const boxMesh = new Mesh(
      new BoxGeometry(10, 4, 8),
      new MeshStandardMaterial({ color: 0xfca510 })
    );
    const boxBody = getPhysicsBody(
      boxMesh,
      ShapeType.BOX,
      this.rampMaterial,
      0
    );
    boxBody.position.y = 1.4;
    boxBody.position.z = positionZ - 5;
    this.physicsWorld.addBody(boxBody);
  }
}
