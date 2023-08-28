import Experience from "../Experience.js";
import { getPhysicsBody } from "../Utils/PhycisBodyHelper.js";
import { ShapeType } from "three-to-cannon";

import {
  BoxGeometry,
  MeshStandardMaterial,
  Mesh,
  SRGBColorSpace,
  RepeatWrapping,
  Color,
  Vector3,
  Quaternion,
  Euler,
  Matrix4,
} from "three";
import { InstancedMesh } from "three";

export default class GameTrack {
  constructor(trackLength = 5, pathMaterial) {
    this.experience = new Experience();
    const { scene, resources, physicsWorld } = this.experience;
    this.scene = scene;
    this.resources = resources;
    this.physicsWorld = physicsWorld;
    this.pathMaterial = pathMaterial;
    this.setTextures();
    this.width = 10;
    this.geometry = this.setGeometry();
    this.material = this.setMaterial();
    this.setUpTrack(trackLength);
  }

  setTextures() {
    this.groundTexture = this.resources.items.groundTexture;
    this.groundTexture.colorSpace = SRGBColorSpace;
  }

  setGeometry() {
    const height = 1;
    const depth = 26;
    return new BoxGeometry(this.width, height, depth);
  }

  setMaterial() {
    const material = new MeshStandardMaterial({
      map: this.groundTexture,
    });
    return material;
  }

  setUpTrack(noOfTiles) {
    this.trackTiles = [];
    const tileGeometry = this.geometry;
    const tileMaterial = this.material;
    const tileMesh = new InstancedMesh(tileGeometry, tileMaterial, noOfTiles);
    tileMesh.receiveShadow = true;
    this.scene.add(tileMesh);
    for (let i = 0; i < noOfTiles; i++) {
      const position = new Vector3(0, 0 - 0.5, -noOfTiles * i);
      const quaternion = new Quaternion();
      quaternion.setFromEuler(new Euler(0, 0, 0));
      const matrix = new Matrix4();
      matrix.makeRotationFromQuaternion(quaternion);
      matrix.setPosition(position);
      tileMesh.setMatrixAt(i, matrix);
    }
    let tileRigidBody = getPhysicsBody(
      tileMesh,
      ShapeType.BOX,
      this.pathMaterial,
      0
    );
    tileRigidBody.position.copy(tileMesh.position);
    tileRigidBody.quaternion.copy(tileMesh.quaternion);
    this.physicsWorld.addBody(tileRigidBody);
  }
}
