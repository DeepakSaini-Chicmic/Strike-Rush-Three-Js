import Experience from "../Experience.js";

import { Mesh, MeshStandardMaterial, Group, BoxGeometry, Color } from "three";
import { ShapeType } from "three-to-cannon";
import { getPhysicsBody } from "../Utils/PhycisBodyHelper.js";
import { Body, Box, Shape, Vec3 } from "cannon-es";

export default class HealthBallsBlock {
  constructor(healthMaterial, blockPosition, noOfBallToPlace) {
    this.experience = new Experience();
    const { scene, resources, time, debug, physicsWorld } = this.experience;
    this.scene = scene;
    this.resources = resources;
    this.time = time;
    this.debug = debug;
    this.physicsWorld = physicsWorld;
    this.resource = resources.items.HealthBall;
    this.healthMaterial = healthMaterial;
    this.material = new MeshStandardMaterial({
      color: 0x0065ff,
      map: this.resources.items.PlayerBall,
      roughness: 1,
    });
    this.creaditPoints = noOfBallToPlace; // The score user will get
    this.healthBlockGroup = new Group();
    this.healthBlockGroup.name = "Health-Add";
    const scoreBlock = this.createHealthBallsBlock(
      noOfBallToPlace,
      blockPosition
    );
    // The socreBlock position should always set like below, bcoz group and rigid bodies are two different objects
    this.healthBlockGroup.position.x =
      this.healthBlockGroup.position.x + blockPosition.x;
    scoreBlock.position.x = scoreBlock.position.x + blockPosition.x;
    this.healthBlockGroup.position.z =
      this.healthBlockGroup.position.z + blockPosition.z;
    scoreBlock.position.z = scoreBlock.position.z + blockPosition.z;
  }

  createBalls() {
    let model = this.resource.clone().children.shift();
    model.material = this.material;
    model.scale.set(0.01, 0.01, 0.01);
    this.healthBlockGroup.add(model);
    return model;
  }

  createHealthBallsBlock(size, positionToSetOn) {
    const gridSize = size; // Number of rows and columns
    const gap = 1; // Gap between spheres

    let startX = 0.5 - size / 2;
    let startY = positionToSetOn.y;
    let startZ = 0.5 - size / 2;

    for (let row = 0; row < gridSize; row++) {
      let tempx = startX;
      for (let col = 0; col < gridSize; col++) {
        const sphere = this.createBalls();
        sphere.position.set(tempx, startY, startZ);
        tempx += gap;
      }
      startZ += gap;
    }

    // Calculate the size of the grid based on spheres' positions
    const maxX = (gridSize - 1) * gap + 0.5;
    const maxY = 0.5; // Half of the sphere's diameter
    const maxZ = (gridSize - 1) * gap + 0.5;

    const scoreColliderShape = new Box(new Vec3(maxX / 2, maxY / 2, maxZ / 2));
    const scoreCollider = new Body({
      shape: scoreColliderShape,
      mass: 0,
      material: this.healthMaterial,
    });
    scoreCollider.position.copy(this.healthBlockGroup.position);
    scoreCollider.position.y = positionToSetOn.y;
    scoreCollider.collisionResponse = 0;

    // Allocating the score for this block
    scoreCollider.myData = {
      score: this.creaditPoints * this.creaditPoints,
      scoreBlock: this.healthBlockGroup,
    };

    // Add to the worlds
    this.physicsWorld.addBody(scoreCollider);
    this.scene.add(this.healthBlockGroup);

    return scoreCollider;
  }
}
