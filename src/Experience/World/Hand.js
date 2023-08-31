import { AnimationMixer, Skeleton } from "three";
import Experience from "../Experience";

export default class Hand {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.camera = this.experience.camera.instance;
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.setModel();
  }

  setModel() {
    this.hand = this.cloneGLTFHavingSkinnedMesh();
    this.scene.add(this.hand.scene);
    this.hand.scene.scale.set(0.4, 0.4, 0.4);
    this.hand.scene.position.set(
      this.hand.scene.position.x + 0.7,
      this.hand.scene.position.y - 16,
      this.hand.scene.position.z + 10
    );
    this.hand.scene.rotation.z = -Math.PI / 2;
    this.hand.scene.rotation.x = (-Math.PI / 180) * 80;
    this.playHandAnimation();
  }

  playHandAnimation() {
    const animation = this.hand.animations[0];
    this.mixer = new AnimationMixer(this.hand.scene);
    const action = this.mixer.clipAction(animation);
    action.play();
  }

  cloneGLTFHavingSkinnedMesh() {
    this.handModel = this.resources.items.Hand;
    const clone = {
      animations: this.resources.items.HandAnim.animations,
      scene: this.handModel.clone(true),
    };
    const skinnedMeshes = {};
    this.handModel.traverse((node) => {
      if (node.isSkinnedMesh) skinnedMeshes[node.name] = node;
    });
    const cloneBones = {};
    const cloneSkinnedMeshes = {};
    clone.scene.traverse((node) => {
      if (node.isBone) cloneBones[node.name] = node;
      if (node.isSkinnedMesh) cloneSkinnedMeshes[node.name] = node;
    });
    for (let name in skinnedMeshes) {
      const skinnedMesh = skinnedMeshes[name];
      const skeleton = skinnedMesh.skeleton;
      const cloneSkinnedMesh = cloneSkinnedMeshes[name];
      const orderedCloneBones = [];
      for (let i = 0; i < skeleton.bones.length; ++i) {
        const cloneBone = cloneBones[skeleton.bones[i].name];
        orderedCloneBones.push(cloneBone);
      }
      cloneSkinnedMesh.bind(
        new Skeleton(orderedCloneBones, skeleton.boneInverses),
        cloneSkinnedMesh.matrixWorld
      );
    }
    return clone;
  }

  removeModel() {
    if (this.hand) this.scene.remove(this.hand.scene);
  }

  update() {
    const deltaTimeSeconds = this.time.delta * 0.001;
    if (this.mixer) this.mixer.update(deltaTimeSeconds);
  }
}
