import Experience from "../Experience";
import { DIAGONAL_WALLS_PROPS, WINBOX_PROPS } from "../Utils/Constants";
import { getPhysicsBody } from "../Utils/PhycisBodyHelper";
import { ShapeType } from "three-to-cannon";

import {
  BoxGeometry,
  Color,
  CylinderGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshStandardMaterial,
} from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Vec3, Material } from "cannon-es";

export default class EndBlock {
  constructor(positionZ, wallMaterial, scoreBoxMaterial, spinnerMaterial) {
    this.experience = new Experience();
    const { time, resources, scene, physicsWorld } = this.experience;
    this.time = time;
    this.resources = resources;
    this.scene = scene;
    this.randomValue = 0.5;
    this.endBlockGroup = new Group();
    this.physicsWorld = physicsWorld;
    this.scoreBoxMaterial = scoreBoxMaterial;
    this.winBoxArray = WINBOX_PROPS;
    this.spinnerMaterial = spinnerMaterial;
    this.physicsObjects = [];
    this.bodiesToUpdate = [];
    this.meshesToUpdate = [];
    this.contructLastBlock(positionZ, wallMaterial);
    this.scene.add(this.endBlockGroup);
  }

  contructLastBlock(positionZ, wallMaterial) {
    this.wallMaterial = wallMaterial;
    const endWall = this.constructEndWall(15, positionZ);
    const walls = this.constructWalls(positionZ);
    const circularHit = this.constructCircularHit(25, positionZ);
    const spinners1 = this.constructSpinners(positionZ, -4.7);
    const spinners2 = this.constructSpinners(positionZ, 4.7);
    this.endBlockGroup.add(endWall, walls, circularHit, spinners1, spinners2);
    this.constructWinBoxes(positionZ);
    this.constructWinBoxBoundry(positionZ);
  }

  constructSpinners(positionZ, positionX) {
    const spinner = this.resources.items.EndSpinner.clone();
    spinner.traverse((child) => {
      if (child.isMesh) {
        const childBody = getPhysicsBody(
          child,
          ShapeType.MESH,
          this.spinnerMaterial,
          0
        );
        child.rotation.x = -Math.PI / 2;
        child.position.z = positionZ;
        child.position.x = positionX;
        child.position.y = 12;
        child.material.color = new Color(0xe70fff);
        this.meshesToUpdate.push(child);
        childBody.position.copy(child.position);
        childBody.quaternion.copy(child.quaternion);
        this.physicsWorld.addBody(childBody);
        this.bodiesToUpdate.push(childBody);
      }
    });
    return spinner;
  }

  constructEndWall(positionY, positionZ) {
    const width = 22;
    const height = 45;
    const depth = 1;
    const endWall = new Mesh(
      new BoxGeometry(width, height, depth),
      new MeshStandardMaterial({ color: 0xe75480 })
    );
    const physicsEndWallBody = getPhysicsBody(
      endWall,
      ShapeType.BOX,
      this.wallMaterial
    );
    physicsEndWallBody.position.y = positionY + 7;
    physicsEndWallBody.position.z = positionZ - 1;

    const physicsHiddenWallBody = getPhysicsBody(
      endWall,
      ShapeType.BOX,
      this.wallMaterial
    );
    physicsHiddenWallBody.position.y = positionY + 15;
    physicsHiddenWallBody.position.z = positionZ - 1;
    this.physicsWorld.addBody(physicsHiddenWallBody);
    endWall.position.copy(physicsEndWallBody.position);
    this.physicsWorld.addBody(physicsEndWallBody);
    return endWall;
  }

  constructCircularHit(positionY, positionZ) {
    const radiusTop = 1.5;
    const radiusBottom = 2.5;
    const height = 4.5;
    const numberOfSegments = 64;
    const circularHit = new Mesh(
      new CylinderGeometry(radiusTop, radiusBottom, height, numberOfSegments),
      new MeshStandardMaterial({ color: 0xe100c9 })
    );
    const physicsCircularHitBody = getPhysicsBody(
      circularHit,
      ShapeType.HULL,
      this.wallMaterial,
      0
    );
    physicsCircularHitBody.quaternion.setFromAxisAngle(
      new Vec3(-1, 0, 0),
      Math.PI * 0.5
    );
    physicsCircularHitBody.position.y = positionY;
    physicsCircularHitBody.position.z = positionZ + 1.5;
    circularHit.position.copy(physicsCircularHitBody.position);
    circularHit.quaternion.copy(physicsCircularHitBody.quaternion);
    this.physicsWorld.addBody(physicsCircularHitBody);
    return circularHit;
  }

  constructWalls(positionZ) {
    const wallsGroup = new Group();
    const leftWall = this.createSideWall(positionZ, -10.5);
    const rightWall = this.createSideWall(positionZ, 10.5);
    const bottomWall = this.createBottomWall(positionZ);
    for (let i = 0; i < DIAGONAL_WALLS_PROPS.length; i++) {
      const diagonalWall = this.createDiagonalWall(
        DIAGONAL_WALLS_PROPS[i].positionX,
        DIAGONAL_WALLS_PROPS[i].positionY,
        DIAGONAL_WALLS_PROPS[i].positionZ + positionZ,
        DIAGONAL_WALLS_PROPS[i].angle,
        DIAGONAL_WALLS_PROPS[i].width,
        DIAGONAL_WALLS_PROPS[i].height,
        DIAGONAL_WALLS_PROPS[i].depth
      );
      wallsGroup.add(diagonalWall);
    }
    wallsGroup.add(leftWall, rightWall, bottomWall);
    return wallsGroup;
  }

  createSideWall(positionZ, positionX) {
    const width = 1;
    const height = 46;
    const depth = 5.5;
    const wall = new Mesh(
      new BoxGeometry(width, height, depth),
      new MeshStandardMaterial({ color: 0xeff0ef })
    );
    //Physics
    const rigidBody = getPhysicsBody(wall, ShapeType.BOX, this.wallMaterial);
    rigidBody.position.x = positionX;
    rigidBody.position.y = 22;
    rigidBody.position.z = 1.5 + positionZ;
    const hiddenBody = getPhysicsBody(wall, ShapeType.BOX, this.wallMaterial);
    hiddenBody.position.x = positionX;
    hiddenBody.position.y = 29.5;
    hiddenBody.position.z = 1.5 + positionZ;
    wall.position.copy(rigidBody.position);
    this.physicsWorld.addBody(rigidBody);
    this.physicsWorld.addBody(hiddenBody);
    return wall;
  }

  createBottomWall(positionZ) {
    const width = 22;
    const height = 1;
    const depth = 5.5;
    const bottomWall = new Mesh(
      new BoxGeometry(width, height, depth),
      new MeshStandardMaterial({ color: 0xeff0ef })
    );
    const rigidBody = getPhysicsBody(
      bottomWall,
      ShapeType.BOX,
      this.wallMaterial
    );
    rigidBody.position.y = -0.4;
    rigidBody.position.z = 1.5 + positionZ;
    bottomWall.position.copy(rigidBody.position);
    this.physicsWorld.addBody(rigidBody);
    return bottomWall;
  }

  createDiagonalWall(
    positionX,
    positionY,
    positionZ,
    angle,
    width,
    height,
    depth
  ) {
    const diagonalWall = new Mesh(
      new BoxGeometry(width, height, depth),
      new MeshStandardMaterial({ color: 0xeff0ef })
    );
    //Physics
    const rigidBody = getPhysicsBody(
      diagonalWall,
      ShapeType.BOX,
      this.wallMaterial
    );
    rigidBody.quaternion.setFromAxisAngle(new Vec3(0, 0, 1), angle);
    rigidBody.position.set(positionX, positionY, 1.5 + positionZ);
    diagonalWall.position.copy(rigidBody.position);
    diagonalWall.quaternion.copy(rigidBody.quaternion);
    this.physicsWorld.addBody(rigidBody);
    return diagonalWall;
  }

  constructWinBoxes(positionZ) {
    for (let winBox of this.winBoxArray) {
      this.constructWinBlock(
        winBox.isFrontWall,
        positionZ + winBox.positionZ - 0.7,
        winBox.positionY - 0.75,
        winBox.color,
        winBox.positionX,
        winBox.score,
        winBox.rotationY,
        winBox.rotationX
      );
    }
  }

  constructWinBoxBoundry(positionZ) {
    let boxMesh = new Mesh(
      new BoxGeometry(20, 28, 1),
      new MeshStandardMaterial()
    );
    let boxRigidBody = getPhysicsBody(
      boxMesh,
      ShapeType.BOX,
      new Material("default")
    );
    boxRigidBody.position.z = positionZ + 4;
    boxRigidBody.position.y = 13;
    this.physicsWorld.addBody(boxRigidBody);
  }

  constructWinBlock(
    isFrontWall,
    positionZ,
    positionY,
    color,
    positionX,
    score,
    rotationY,
    rotationX
  ) {
    const planeMesh = new Mesh(
      new BoxGeometry(4, 4, 0.3, 2, 2, 2),
      new MeshStandardMaterial({ color: color, side: DoubleSide })
    );

    const boxRigidBody = getPhysicsBody(
      planeMesh,
      ShapeType.BOX,
      this.scoreBoxMaterial,
      0
    );
    this.scene.add(planeMesh);
    this.physicsWorld.addBody(boxRigidBody);
    boxRigidBody.position.x = positionX;
    boxRigidBody.position.y = 2.6 + positionY;
    boxRigidBody.position.z = positionZ + 1.8;
    if (rotationY) {
      boxRigidBody.quaternion.setFromAxisAngle(new Vec3(0, 1, 0), Math.PI / 2);
    }
    if (rotationX) {
      boxRigidBody.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), Math.PI / 2);
    }
    planeMesh.position.copy(boxRigidBody.position);
    planeMesh.quaternion.copy(boxRigidBody.quaternion);
    if (isFrontWall) {
      const textGeometry = new TextGeometry(score, {
        font: this.resources.items.scoreFont,
        size: 1.5,
        height: 0.5,
      });
      textGeometry.center();
      const textMesh = new Mesh(
        textGeometry,
        new MeshStandardMaterial({ color: 0x000000 })
      );
      textMesh.position.copy(planeMesh.position);
      textMesh.position.z += 0.5;
      textMesh.position.y += 0;
      this.scene.add(textMesh);
    }
    boxRigidBody.myData = { score: score };
  }

  update() {
    const deltaTime = this.time.delta;
    if (this.bodiesToUpdate[0]) {
      this.meshesToUpdate[0].rotation.y -=
        (Math.PI / 720) * deltaTime * this.randomValue;
      this.bodiesToUpdate[0].quaternion.copy(this.meshesToUpdate[0].quaternion);
    }
    if (this.bodiesToUpdate[1]) {
      this.meshesToUpdate[1].rotation.y +=
        (Math.PI / 720) * deltaTime * this.randomValue;
      this.bodiesToUpdate[1].quaternion.copy(this.meshesToUpdate[1].quaternion);
    }
  }
}
