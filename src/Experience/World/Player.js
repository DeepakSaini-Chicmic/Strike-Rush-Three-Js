import { Body, Box, ContactMaterial, Material, Sphere, Vec3 } from "cannon-es";
import Experience from "../Experience";
import { SphereGeometry, MeshBasicMaterial, Mesh, Group } from "three";
import { getPhysicsBody } from "../Utils/PhycisBodyHelper";
import { ShapeType } from "three-to-cannon";
export default class Player {
  constructor(playerMaterial, playerContactPathMaterial) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.playerMaterial = playerMaterial;
    this.playerContactPathMaterial = playerContactPathMaterial;
    this.camera = this.experience.camera.instance;
    this.physicsWorld = this.experience.physicsWorld;
    this.physicsWorld.addContactMaterial(this.playerContactPathMaterial);
    this.meshes = [];
    this.rigidBodies = [];
    this.createPlayer();
    // this.setPlayer();
    // this.checkCollision();
  }

  checkCollision() {
    if (this.rigidBodies[0]) {
      console.log("Working");
      this.rigidBodies[0].addEventListener("collide", (collide) => {
        const bodyType = collide.body.material.name;
      });
    }
  }

  moveDirection(e) {
    for (let i = 0; i < this.rigidBodies.length; i++) {
      this.rigidBodies[i].position.x = e.x * 4;
      // this.rigidBodies[i].position.y = 1;
    }
  }
  giveVelocity() {
    for (let i = 0; i < this.rigidBodies.length; i++) {
      this.rigidBodies[i].velocity.z = -2;
    }
  }
  updateTail() {
    const radius = 0.5;
    const widthSegments = 32;
    const heightSegments = 32;
    const newBall = new Mesh(
      new SphereGeometry(radius, widthSegments, heightSegments),
      new MeshBasicMaterial({ color: 0x0086ff })
    );
    const rigidBody = getPhysicsBody(
      newBall,
      ShapeType.SPHERE,
      this.playerMaterial,
      1
    );
    rigidBody.position.z =
      this.rigidBodies[this.rigidBodies.length - 1].position.z + 1.1;
    rigidBody.position.y = 1;
    newBall.position.copy(rigidBody.position);
    this.meshes.push(newBall);
    this.physicsWorld.addBody(rigidBody);
    this.rigidBodies.push(rigidBody);
    this.scene.add(newBall);
  }

  update() {
    for (let i = 0; i < this.meshes.length; i++) {
      this.meshes[i].position.copy(this.rigidBodies[i].position);
    }
    this.giveVelocity();
  }

  createPlayer() {
    const radius = 0.5;
    const widthSegments = 32;
    const heightSegments = 32;
    let firstBall = new Mesh(
      new SphereGeometry(radius, widthSegments, heightSegments),
      new MeshBasicMaterial({ color: 0x0086ff })
    );
    this.meshes.push(firstBall);
    const rigidBody = getPhysicsBody(
      firstBall,
      ShapeType.SPHERE,
      this.playerMaterial,
      1
    );
    this.rigidBodies.push(rigidBody);
    this.scene.add(firstBall);
    rigidBody.position.set(0, 1, 1);
    firstBall.position.copy(rigidBody.position);
    this.physicsWorld.addBody(rigidBody);
  }
}
