import { Audio, AudioListener } from "three";
import Experience from "../Experience";

export default class AudioManager {
  constructor() {
    this.experience = new Experience();
    const { camera, scene } = this.experience;
    this.camera = camera.instance;
    this.scene = scene;
    this.addAudioListener();
  }

  addAudioListener() {
    // instantiate a listener
    this.audioListener = new AudioListener();
    // add the listener to the camera
    this.camera.add(this.audioListener);
  }

  playAudio(sound) {
    const audio = new Audio(this.audioListener);
    this.scene.add(audio);
    audio.setVolume(0.5);
    audio.setBuffer(sound);
    audio.play();
  }
}
