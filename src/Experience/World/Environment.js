import Experience from "../Experience.js";

import {
  AmbientLight,
  DirectionalLight,
  NearestFilter,
  BoxGeometry,
  MeshStandardMaterial,
  Quaternion,
  Euler,
  Matrix4,
  InstancedMesh,
  Vector3,
} from "three";
export default class Environment {
  constructor() {
    this.experience = new Experience();
    const { scene, resources, debug } = this.experience;
    this.scene = scene;
    this.resources = resources;
    this.debug = debug;
    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("environment");
    }

    this.setSunLight();
    this.setEnvironment();
  }

  setSunLight() {
    this.ambient = new AmbientLight("#ffffff", 0.5);
    this.scene.add(this.ambient);
    this.sunLight = new DirectionalLight("#ffffff", 2);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 1000;
    this.sunLight.shadow.camera.left = 50;
    this.sunLight.shadow.camera.right = -50;
    this.sunLight.shadow.camera.top = 600;
    this.sunLight.shadow.camera.bottom = 0;
    this.sunLight.shadow.mapSize.set(2048, 2048);
    this.sunLight.shadow.bias = 0.0001;
    this.sunLight.position.set(0, 100, 0);
    this.scene.add(this.sunLight);

    // Debug
    if (this.debug.active) {
      this.debugFolder
        .add(this.sunLight, "intensity")
        .name("sunLightIntensity")
        .min(0)
        .max(10)
        .step(0.001);

      this.debugFolder
        .add(this.sunLight.position, "x")
        .name("sunLightX")
        .min(-5)
        .max(5)
        .step(0.001);

      this.debugFolder
        .add(this.sunLight.position, "y")
        .name("sunLightY")
        .min(-5)
        .max(5)
        .step(0.001);

      this.debugFolder
        .add(this.sunLight.position, "z")
        .name("sunLightZ")
        .min(-5)
        .max(5)
        .step(0.001);
    }
  }

  setEnvironment() {
    this.buildings = [];
    this.envMap = this.resources.items.environmentMapTexture;
    this.envMap.magFilter = NearestFilter;
    this.envMap.minFilter = NearestFilter;
    const buildingGeometry = new BoxGeometry(200, 3000, 200);
    const buildingMaterial = new MeshStandardMaterial({
      color: 0xe70fff,
      map: this.resources.items.BuildingsTexture,
    });
    buildingMaterial.map.offset.x = -1;
    buildingMaterial.map.offset.y = -0.2;
    //Instacnced Mesh will use same geometry and material for creating multiple meshes.
    const building = new InstancedMesh(
      buildingGeometry,
      buildingMaterial,
      2000
    );
    this.scene.add(building);

    for (let i = 0; i < 1000; i++) {
      const position = new Vector3(
        (Math.random() - 0.5) * 10000,
        -1600 - Math.random() * 3000,
        -Math.random() * 20000
      );
      const quaternion = new Quaternion();
      quaternion.setFromEuler(new Euler(0, 0, 0));
      const matrix = new Matrix4();
      matrix.makeRotationFromQuaternion(quaternion);
      matrix.setPosition(position);
      building.setMatrixAt(i, matrix);
    }
    this.scene.background = this.resources.items.environmentMapTexture;
    this.buildings.push(building);
  }
}
