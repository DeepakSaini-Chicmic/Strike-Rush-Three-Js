import Experience from "../Experience.js";

import {
  AmbientLight,
  DirectionalLight,
  SRGBColorSpace,
  MeshStandardMaterial,
  Mesh,
  Color,
  DoubleSide,
  MeshBasicMaterial,
  NearestFilter,
  NearestMipMapLinearFilter,
  NearestMipMapNearestFilter,
} from "three";

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("environment");
    }

    this.setSunLight();
    this.setEnvironment();
    // this.setEnvironmentMap();
  }

  setSunLight() {
    this.ambient = new AmbientLight("#ffffff", 1);
    this.scene.add(this.ambient);
    this.sunLight = new DirectionalLight("#ffffff", 4);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(3.5, 2, -1.25);
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

  setEnvironmentMap() {
    this.environmentMap = {};
    this.environmentMap.intensity = 15;
    this.environmentMap.texture = this.resources.items.environmentMapTexture;
    this.environmentMap.texture.colorSpace = SRGBColorSpace;
    console.log("THIS IS ENVIORNMENT MAP", this.environmentMap);
    // this.environmentMap.color = new Color(0xe70fffff);
    this.environmentMap.emission = 15;

    this.scene.environment = this.environmentMap.texture;

    this.environmentMap.updateMaterials = () => {
      this.scene.traverse((child) => {
        if (
          child instanceof Mesh &&
          child.material instanceof MeshStandardMaterial
        ) {
          child.material.envMap = this.environmentMap.texture;
          child.material.envMapIntensity = this.environmentMap.intensity;
          child.material.needsUpdate = true;
        }
      });
    };
    this.environmentMap.updateMaterials();

    // Debug
    if (this.debug.active) {
      this.debugFolder
        .add(this.environmentMap, "intensity")
        .name("envMapIntensity")
        .min(0)
        .max(4)
        .step(0.001)
        .onChange(this.environmentMap.updateMaterials);
    }
  }

  setEnvironment() {
    this.buildings = [];
    this.envMap = this.resources.items.environmentMapTexture;
    this.envMap.magFilter = NearestFilter;
    this.envMap.minFilter = NearestFilter;
    this.scene.background = this.resources.items.environmentMapTexture;
    this.building = this.resources.items.Buildings;
    const noOfBuildings = 500;
    for (let i = 0; i < noOfBuildings; i++) {
      const building = this.building.clone();
      this.building.traverse((child) => {
        if (child.isMesh) {
          child.material = new MeshBasicMaterial({});
          child.material.map = this.resources.items.BuildingsTexture;
          child.material.color = new Color(0xe70fff);
        }
      });
      building.scale.set(0.02, Math.random() / 10, 0.03);
      building.rotation.x = -Math.PI / 2;
      building.position.set(
        (Math.random() - 0.5) * 3000,
        -700 - Math.random() * 1000,
        (Math.random() - 1) * 5000
      );
      this.scene.add(building);
      this.buildings.push(building);
    }
  }
}
