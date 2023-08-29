import { TextureLoader, CubeTextureLoader, AudioLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import EventEmitter from "./EventEmitter.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

export default class Resources extends EventEmitter {
  constructor(sources) {
    super();

    this.sources = sources;

    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;
    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.dracoLoader = new DRACOLoader();
    this.loaders.fbxLoader = new FBXLoader();
    this.loaders.textureLoader = new TextureLoader();
    this.loaders.cubeTextureLoader = new CubeTextureLoader();
    this.loaders.fontLoader = new FontLoader();
    this.loaders.audioLoader = new AudioLoader();
  }

  startLoading() {
    // Load each source
    for (const source of this.sources) {
      if (source.type === "gltfModel") {
        this.loaders.dracoLoader.setDecoderPath("/draco/gltf/");
        this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);
        this.loaders.gltfLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "fbxModel") {
        this.loaders.fbxLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "texture") {
        this.loaders.textureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "cubeTexture") {
        this.loaders.cubeTextureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "font") {
        this.loaders.fontLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "audio") {
        this.loaders.audioLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      }
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file;

    this.loaded++;

    if (this.loaded === this.toLoad) {
      this.trigger("ready");
    }
  }
}
