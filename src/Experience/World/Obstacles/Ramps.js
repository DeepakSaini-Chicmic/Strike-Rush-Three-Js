import Experience from "../../Experience.js";
import { ShapeType } from "three-to-cannon";
import { getPhysicsBody } from "../../Utils/PhycisBodyHelper.js";

import { BoxGeometry, Color, Mesh, MeshStandardMaterial } from "three";
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
    this.finishLine = resources.items.FinishLine.scene;
    this.rampMaterial = rampMaterial;
    this.resource = rampType;
    this.setModel(modelScaling, positionZ);
  }

  setModel(modelScaling, positionZ) {
    this.model = this.resource;
    const childMesh = this.model.scene.children[0];
    console.log(this.model);
    childMesh.rotation.set(Math.PI / 2, 0, Math.PI);
    childMesh.scale.set(0.045, 0.05, 0.025);
    // childMesh.scale.set(modelScaling.x, modelScaling.y - 0.02, modelScaling.z);
    this.model.scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new MeshStandardMaterial({
          map: this.resources.items.CenterRampTexture,
        });
        child.material.map.flipY = false;
      }
    });
    const rigidBody = getPhysicsBody(
      childMesh,
      ShapeType.HULL,
      COLLISION_BODIES.CENTERRAMP,
      0
    );
    // rigidBody.quaternion.setFromAxisAngle(new Vec3(0, 0, 0), Math.PI);
    rigidBody.position.z = positionZ;
    childMesh.material.color = new Color(0xdddd00);
    childMesh.position.copy(rigidBody.position);
    childMesh.quaternion.copy(rigidBody.quaternion);
    this.physicsWorld.addBody(rigidBody);
    // this.finishLine.scale.set(0.0145, 0.0145, 0.0145);
    this.finishLine.rotation.x = (Math.PI / 180) * 30;
    this.finishLine.scale.set(1.35, 1, 1);
    this.finishLine.position.y = 2.1;
    this.finishLine.position.z = positionZ + 11;

    this.scene.add(childMesh, this.finishLine);
    this.createHiddenRampJumper(positionZ);
  }

  createHiddenRampJumper(positionZ) {
    const boxMesh = new Mesh(
      new BoxGeometry(10, 3.3, 15),
      new MeshStandardMaterial({ color: 0xfca510 })
    );
    const boxBody = getPhysicsBody(
      boxMesh,
      ShapeType.BOX,
      this.rampMaterial,
      0
    );
    boxBody.position.y = 1.4;
    boxBody.position.z = positionZ - 8.5;
    this.physicsWorld.addBody(boxBody);
  }
}
