import Experience from "../Experience";
import { getPhysicsBody } from "../Utils/PhycisBodyHelper";
import { ShapeType } from "three-to-cannon";

import { BoxGeometry, DoubleSide, Mesh, MeshStandardMaterial } from "three";

export default class SideWalls {
  constructor(tracklength, wallMaterial) {
    this.experience = new Experience();
    const { physicsWorld, scene } = this.experience;
    this.physicsWorld = physicsWorld;
    this.scene = scene;
    this.trackLength = tracklength;
    this.wallPhysicsMaterial = wallMaterial;
    this.width = 0.5;
    this.wallGeometry = new BoxGeometry(this.width, 1, this.trackLength);
    this.wallMaterial = new MeshStandardMaterial({
      color: 0xe459d2,
      side: DoubleSide,
    });
    this.constructSideWalls();
  }

  constructSideWalls() {
    const pathWidth = 10;
    let wallsBody = [];
    for (let i = 0; i < 2; i++) {
      const wall = this.constructWallMesh();
      const physicsBody = getPhysicsBody(
        wall,
        ShapeType.BOX,
        this.wallPhysicsMaterial
      );
      const currentObj = {
        object: wall,
        physicsBody: physicsBody,
      };
      wallsBody.push(currentObj);
      this.physicsWorld.addBody(physicsBody);
      this.scene.add(wall);
    }
    wallsBody[0].physicsBody.position.set(
      -pathWidth / 2 - this.width / 2,
      -0.1,
      10 + this.trackLength / 2
    );
    wallsBody[1].physicsBody.position.set(
      pathWidth / 2 + this.width / 2,
      -0.1,
      10 + this.trackLength / 2
    );
    wallsBody[0].object.position.copy(wallsBody[0].physicsBody.position);
    wallsBody[1].object.position.copy(wallsBody[1].physicsBody.position);
  }

  constructWallMesh(width, height, depth) {
    const wall = new Mesh(this.wallGeometry, this.wallMaterial);
    wall.receiveShadow = true;
    return wall;
  }
}
