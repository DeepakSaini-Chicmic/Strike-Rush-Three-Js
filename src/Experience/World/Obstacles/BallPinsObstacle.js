import Experience from "../../Experience.js";
import { getPhysicsBody } from "../../Utils/PhycisBodyHelper.js";
import { ShapeType } from "three-to-cannon";

import {
  Color,
  MeshBasicMaterial,
  MeshPhongMaterial,
  MeshStandardMaterial,
} from "three";

export default class BallPinsObstacle {
  constructor(
    size,
    modelPosition,
    modelScaling,
    obstacleMaterial,
    pathObstacleMaterial
  ) {
    this.experience = new Experience();
    const { scene, resources, time, debug, physicsWorld } = this.experience;
    this.scene = scene;
    this.resources = resources;
    this.time = time;
    this.debug = debug;
    this.physicsWorld = physicsWorld;
    this.obstacleMaterial = obstacleMaterial;
    this.positionX = modelPosition.x;
    this.positionY = modelPosition.y + 1;
    this.positionZ = modelPosition.z;
    this.size = size;
    this.pathObstacleMaterial = pathObstacleMaterial;
    this.resource = resources.items.ObstacleBowlingPin.scene;
    this.resource.material = new MeshBasicMaterial({});
    this.setUpBallPinsObstacle(modelScaling);
  }

  setUpBallPinsObstacle(modelScaling) {
    this.ballPinMeshes = this.createBallingPins(10, modelScaling);
    this.ballPinRigids = this.addPhysicsToBallPins(this.ballPinMeshes);
    this.makePyramidPattern(this.size);
  }

  createBallingPins(noOfBallPins, modelScaling) {
    const ballPinsArr = [];
    const ballPinModel = this.resource.children[0];
    ballPinModel.material = new MeshPhongMaterial({});
    for (let ballPinCnt = 0; ballPinCnt < noOfBallPins; ballPinCnt++) {
      ballPinsArr.push(ballPinModel.clone());
    }
    ballPinsArr.forEach((model) => {
      model.castShadow = true;
      model.material.color = new Color(0xffff00);
      model.scale.copy(modelScaling);
    });
    return ballPinsArr;
  }

  makePyramidPattern(size) {
    const rows = size;
    let cols = size;
    const gapX = 1;
    const gapY = 0.5;
    let startX = this.positionX;
    let startY = this.positionZ;
    let rowSideGap = 0;
    let idx = this.ballPinRigids.length - 1;
    for (let row = 0; row < rows; row++) {
      let tempX = startX + rowSideGap;
      for (let col = 0; col < cols; col++) {
        const pin = this.ballPinRigids[idx];
        const pinPosition = pin.position;
        pinPosition.set(tempX, this.positionY, startY);
        this.ballPinMeshes[idx].position.copy(pinPosition);
        this.ballPinMeshes[idx].quaternion.copy(pin.quaternion);
        this.scene.add(this.ballPinMeshes[idx]);
        this.physicsWorld.addBody(pin);
        tempX += gapX;
        idx--;
      }
      cols--;
      startY += gapY;
      rowSideGap += 0.5;
    }
  }

  addPhysicsToBallPins(ballPinArr) {
    const ballPinRigids = [];
    ballPinArr.forEach((ballPin) => {
      const rigidBody = getPhysicsBody(
        ballPin,
        ShapeType.BOX,
        this.obstacleMaterial,
        0.001
      );
      ballPinRigids.push(rigidBody);
    });
    return ballPinRigids;
  }

  update() {
    for (const [i, ballPinRigid] of this.ballPinRigids.entries()) {
      const ballPinMesh = this.ballPinMeshes[i];
      ballPinMesh.position.copy(ballPinRigid.position);
      ballPinMesh.quaternion.copy(ballPinRigid.quaternion);
    }
  }
}
