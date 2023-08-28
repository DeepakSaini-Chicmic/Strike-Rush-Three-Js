import Experience from "../Experience.js";
import Environment from "./Environment.js";
import GameTrack from "./TrackPath.js";
import AnimatedObstacle from "./Obstacles/AnimatedObstacle.js";
import { Vector3 } from "three";
import EndBlock from "./EndBlock.js";
import BallPinsObstacle from "./Obstacles/BallPinsObstacle.js";
import { ContactMaterial, Material, Vec3 } from "cannon-es";
import Ramps from "./Obstacles/Ramps.js";
import SideWalls from "./SideWalls.js";
import GemsBlock from "./GemsBlock.js";
import HealthBallsBlock from "./HealthBallsBlock.js";
import Player from "./Player.js";
import CenterRamp from "./CenterRamp.js";
import { COLLISION_BODIES } from "../Utils/Constants.js";
import HUD from "./HUD.js";

const COLLISION_GROUPS = {
  PLAYER_GROUP: 1,
  GEMS_GROUP: 2,
};

export default class SceneWorld {
  constructor() {
    this.experience = new Experience();
    const { scene, resources, physicsWorld } = this.experience;
    this.scene = scene;
    this.resources = resources;
    this.physicsWorld = physicsWorld;
    this.objectsToUpdate = [];
    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      this.environment = new Environment();
      this.playerMaterial = new Material(COLLISION_BODIES.PLAYER);
      this.healthMaterial = new Material(COLLISION_BODIES.HEALTH);
      this.pathMaterial = new Material(COLLISION_BODIES.PATH);
      this.wallMaterial = new Material(COLLISION_BODIES.WALL);
      this.sideWallMaterial = new Material(COLLISION_BODIES.SIDEWALL);
      this.centerRampMaterial = new Material(COLLISION_BODIES.CENTERRAMP);
      this.rampMaterial = new Material(COLLISION_BODIES.ENDRAMP);
      this.gemMaterial = new Material(COLLISION_BODIES.GEM);
      this.spinnerMaterial = new Material(COLLISION_BODIES.SPINNER);
      this.obstacleMaterial = new Material(COLLISION_BODIES.OBSTACLE);
      this.scoreBoxMaterial = new Material(COLLISION_BODIES.SCOREBOX);

      const trackLength = 26;
      this.playerContactPathMaterial = new ContactMaterial(
        this.playerMaterial,
        this.pathMaterial,
        {
          friction: 0,
          restitution: 0,
        }
      );
      this.playerContactObstacleMaterial = new ContactMaterial(
        this.playerMaterial,
        this.obstacleMaterial,
        {
          friction: 1,
          restitution: 0,
        }
      );
      this.spinnerContactMaterial = new ContactMaterial(
        this.playerMaterial,
        this.spinnerMaterial,
        {
          restitution: 1,
          friction: 0,
        }
      );
      this.pathObstacleMaterial = new ContactMaterial(
        this.obstacleMaterial,
        this.pathMaterial,
        {
          friction: 0.2,
          restitution: 0.5,
        }
      );
      this.midRampContactMaterial = new ContactMaterial(
        this.playerMaterial,
        this.centerRampMaterial,
        {
          restitution: 0,
          friction: 100,
        }
      );
      this.playerContactRampMaterial = new ContactMaterial(
        this.playerMaterial,
        this.rampMaterial,
        {
          friction: 0,
          restitution: 0,
        }
      );
      this.endWallPlayerContact = new ContactMaterial(
        this.playerMaterial,
        this.wallMaterial,
        {
          restitution: 0,
          friction: 10,
        }
      );

      this.physicsWorld.addContactMaterial(this.playerContactPathMaterial);
      this.physicsWorld.addContactMaterial(this.playerContactObstacleMaterial);
      this.physicsWorld.addContactMaterial(this.pathObstacleMaterial);
      this.physicsWorld.addContactMaterial(this.playerContactRampMaterial);
      this.physicsWorld.addContactMaterial(this.midRampContactMaterial);
      this.physicsWorld.addContactMaterial(this.endWallPlayerContact);
      this.physicsWorld.addContactMaterial(this.spinnerContactMaterial);

      this.hud = new HUD();
      this.ballPinObs1 = new BallPinsObstacle(
        1,
        new Vector3(-2.5, 0, -trackLength * 2),
        new Vector3(0.009, 0.009, 0.009),
        this.obstacleMaterial,
        this.pathObstacleMaterial
      );

      this.ballPinObs2 = new BallPinsObstacle(
        2,
        new Vector3(2.5, 0, -trackLength * 2),
        new Vector3(0.009, 0.009, 0.009),
        this.obstacleMaterial,
        this.pathObstacleMaterial
      );

      this.gemsBlock1 = new GemsBlock(
        5,
        this.gemMaterial,
        -trackLength * 4,
        {
          filterGroup: COLLISION_GROUPS.GEMS_GROUP,
          filterMask: COLLISION_GROUPS.PLAYER_GROUP,
        },
        new Vec3(0, 0.25, 0)
      );

      this.obstacle5 = new AnimatedObstacle(
        this.resources.items.SpinnerObstacle,
        new Vector3(-5.2, -0.1, -6 * trackLength),
        new Vector3(0.009, 0.009, 0.009),
        this.obstacleMaterial
      );

      this.healthBlock = new HealthBallsBlock(
        this.healthMaterial,
        new Vec3(-2.5, 0.5, -8 * trackLength),
        2
      );

      this.centerRamp = new CenterRamp(
        this.centerRampMaterial,
        new Vec3(2.5, -0.5, -8 * trackLength)
      );

      this.rampGem1 = new GemsBlock(
        1,
        this.gemMaterial,
        -trackLength * 8,
        {
          filterGroup: COLLISION_GROUPS.GEMS_GROUP,
          filterMask: COLLISION_GROUPS.PLAYER_GROUP,
        },
        new Vec3(6.5, 0.25, 20)
      );
      this.rampGem2 = new GemsBlock(
        1,
        this.gemMaterial,
        -trackLength * 8,
        {
          filterGroup: COLLISION_GROUPS.GEMS_GROUP,
          filterMask: COLLISION_GROUPS.PLAYER_GROUP,
        },
        new Vec3(6.5, 2, 15)
      );
      this.rampGem3 = new GemsBlock(
        1,
        this.gemMaterial,
        -trackLength * 8,
        {
          filterGroup: COLLISION_GROUPS.GEMS_GROUP,
          filterMask: COLLISION_GROUPS.PLAYER_GROUP,
        },
        new Vec3(6.5, 2.5, 10)
      );
      this.rampGem4 = new GemsBlock(
        1,
        this.gemMaterial,
        -trackLength * 8,
        {
          filterGroup: COLLISION_GROUPS.GEMS_GROUP,
          filterMask: COLLISION_GROUPS.PLAYER_GROUP,
        },
        new Vec3(6.5, 2.5, 5)
      );
      this.rampGem5 = new GemsBlock(
        1,
        this.gemMaterial,
        -trackLength * 8,
        {
          filterGroup: COLLISION_GROUPS.GEMS_GROUP,
          filterMask: COLLISION_GROUPS.PLAYER_GROUP,
        },
        new Vec3(6.5, 2.5, 0)
      );
      this.rampGem6 = new GemsBlock(
        1,
        this.gemMaterial,
        -trackLength * 8,
        {
          filterGroup: COLLISION_GROUPS.GEMS_GROUP,
          filterMask: COLLISION_GROUPS.PLAYER_GROUP,
        },
        new Vec3(6.5, 2, -5)
      );
      this.rampGem7 = new GemsBlock(
        1,
        this.gemMaterial,
        -trackLength * 8,
        {
          filterGroup: COLLISION_GROUPS.GEMS_GROUP,
          filterMask: COLLISION_GROUPS.PLAYER_GROUP,
        },
        new Vec3(6.5, 0.25, -10)
      );

      this.ballPinObs3 = new BallPinsObstacle(
        4,
        new Vector3(-1.6, 0, -10 * trackLength),
        new Vector3(0.009, 0.009, 0.009),
        this.obstacleMaterial,
        this.pathObstacleMaterial
      );

      this.gemsBlock2 = new GemsBlock(
        5,
        this.gemMaterial,
        -trackLength * 12,
        {
          filterGroup: COLLISION_GROUPS.GEMS_GROUP,
          filterMask: COLLISION_GROUPS.PLAYER_GROUP,
        },
        new Vec3(0, 0.25, 0)
      );

      this.obstacle4 = new AnimatedObstacle(
        this.resources.items.ObstacleArmLiverHammer,
        new Vector3(-5.1, 0.3, -14 * trackLength),
        new Vector3(0.001, 0.001, 0.001),
        this.obstacleMaterial
      );

      this.gemsBlock3 = new GemsBlock(
        5,
        this.gemMaterial,
        -trackLength * 16,
        {
          filterGroup: COLLISION_GROUPS.GEMS_GROUP,
          filterMask: COLLISION_GROUPS.PLAYER_GROUP,
        },
        new Vec3(0, 0.25, 0)
      );

      this.healthBlock = new HealthBallsBlock(
        this.healthMaterial,
        new Vec3(0, 0.5, -18 * trackLength),
        1
      );

      this.gemsBlock4 = new GemsBlock(
        5,
        this.gemMaterial,
        -trackLength * 20,
        {
          filterGroup: COLLISION_GROUPS.GEMS_GROUP,
          filterMask: COLLISION_GROUPS.PLAYER_GROUP,
        },
        new Vec3(0, 0.25, 0)
      );

      this.ramp = new Ramps(
        this.resources.items.Ramp1,
        new Vector3(0.05, 0.05, 0.05),
        -23 * trackLength,
        this.rampMaterial
      );

      this.PlayerObj = new Player(
        this.playerMaterial,
        {
          filterGroup: COLLISION_GROUPS.PLAYER_GROUP,
          filterMask: COLLISION_GROUPS.GEMS_GROUP,
        },
        -trackLength * 26 + 7
      );

      this.endBlock = new EndBlock(
        -trackLength * 26 + 7,
        this.endWallPlayerContact,
        this.scoreBoxMaterial,
        this.spinnerMaterial
      );

      this.sideWall = new SideWalls(-trackLength * 26, this.sideWallMaterial);
      this.track = new GameTrack(trackLength, this.pathMaterial);

      // Simulate the Physics World
      this.objectsToUpdate.push(this.obstacle4);
      this.objectsToUpdate.push(this.obstacle5);
      this.objectsToUpdate.push(this.gemsBlock1);
      this.objectsToUpdate.push(this.gemsBlock2);
      this.objectsToUpdate.push(this.gemsBlock3);
      this.objectsToUpdate.push(this.gemsBlock4);
      this.objectsToUpdate.push(this.gemsBlock5);
      this.objectsToUpdate.push(this.ballPinObs1);
      this.objectsToUpdate.push(this.ballPinObs2);
      this.objectsToUpdate.push(this.ballPinObs3);
      this.objectsToUpdate.push(this.rampGem1);
      this.objectsToUpdate.push(this.rampGem2);
      this.objectsToUpdate.push(this.rampGem3);
      this.objectsToUpdate.push(this.rampGem4);
      this.objectsToUpdate.push(this.rampGem5);
      this.objectsToUpdate.push(this.rampGem6);
      this.objectsToUpdate.push(this.rampGem7);
    });
  }

  update() {
    if (this.controls) this.controls.update();
    if (this.PlayerObj) this.PlayerObj.update();
    for (const obstacle in this.objectsToUpdate) {
      if (this.objectsToUpdate[obstacle]) {
        this.objectsToUpdate[obstacle].update();
      }
    }
    if (this.endBlock) this.endBlock.update();
  }
}
