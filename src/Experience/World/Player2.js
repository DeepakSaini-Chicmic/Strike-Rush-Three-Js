import {
    Mesh,
    SphereGeometry,
    MeshBasicMaterial
} from "three";
import * as THREE from 'three'
import Experience from "../Experience.js";

import {
    getPhysicsBody
} from "../Utils/PhycisBodyHelper.js";
import {
    ShapeType
} from "three-to-cannon";
import {
    Vec3,
} from "cannon-es";
// import CANNON from "cannon";
import { gsap } from "gsap";


export default class Player2 {
    constructor(playerMaterial, options) {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.debug = this.experience.debug;
        this.physicsWorld = this.experience.physicsWorld;
        this.obstacleMaterial = playerMaterial
        this.camera = this.experience.camera.instance;


        this.RigidBodiesArr = [];
        this.bodyMeshesArr = [];
        this.sphereRadius = 0.3;
        this.headBody = null;


        let size = 0.4;
        this.mass = 100;
        let space = 1 * size;
        let n = 8;
        let last;

        // Create Mesh for rigidbodies
        const sphereGeometry = new SphereGeometry(0.5, 32, 32);
        const sphereMaterial = new MeshBasicMaterial({
            color: 0xff0000
        });
        const sphereMesh = new Mesh(sphereGeometry, sphereMaterial);


        // Create this.RigidBodiesArr and connect them with hinge constraints
        for (let i = 0; i < n; i++) {
            let spMsh = sphereMesh.clone()
            const sphereBody = getPhysicsBody(spMsh, ShapeType.SPHERE, this.obstacleMaterial, this.mass);

            // sphereBody.collisionFilterGroup = options.filterGroup;
            // sphereBody.collisionFilterMask = options.filterMask; 
            console.log("sphereBody filters ", options.filterGroup, options.filterMask)

            sphereBody.linearDamping = 0;
            sphereBody.angularDamping = 0;
            // sphereBody.collisionResponse = 0;
            // sphereBody.angularVelocity = 0;
            
            sphereBody.position.set(0, 2, -((n - i) * (size * 2 + 2 * space) + size * 2 + space)+1)
            console.log("space: ", -(n - i) * (size * 2 + 2 * space) + size * 2 + space)

            this.bodyMeshesArr.push(spMsh);
            this.RigidBodiesArr.push(sphereBody);
            
            // Visulaize the bodies
            this.scene.add(spMsh);
            this.physicsWorld.addBody(sphereBody);

        }
        
        // Set initial this.direction
        this.direction = new THREE.Vector3(0, 0, 0);
        this.headBody = this.RigidBodiesArr[0];
        this.registerEvents();
        this.checkCollision();
    
    }
    
    
    registerEvents() {

        window.addEventListener('mousemove', (event) => {
            // Calculate mouse position in normalized device coordinates (-1 to 1)
            const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            // console.log("mouse moving: ")


            // Update this.direction based on mouse movement
            // this.RigidBodiesArr[0].velocity.copy(new Vec3(0, 0, -1))
            this.headBody.position.x = mouseX*3;
            this.RigidBodiesArr.forEach((body, index)=>{
                if(index>0){
                    gsap.to(this.RigidBodiesArr[index].position, {duration: 0.1, x: this.RigidBodiesArr[index-1].position.x}).then(console.log("hiii", this.RigidBodiesArr[index-1].position, this.RigidBodiesArr[index].position))
                }
            })
            this.direction.set(mouseX, mouseY, 0).normalize();
        });
    }

    checkCollision() {
        
        this.RigidBodiesArr.forEach((rigidBody)=>{
            rigidBody.addEventListener("collide", (collide)=>{
                const bodyType = collide.body.material.name;
                console.log("collisions**************", bodyType);
                switch (bodyType) {
                    case 'health':{
                        console.log("score added", collide.body)
                        collide.body.collisionFilterMask = 0;
                        this.addPlayerBalls(collide.body.myData.score);
                        break;
                    }
                    case 'gem':{
                        console.log("bodytype: ", collide.body)
                        // Play Gem Collect Animation
                        gsap.to(collide.body.position, { duration: 0.3, y: 7 });
                        gsap.to(collide.body.position, { delay: 1, duration: 10, x: window.innerWidth - 500, y: window.innerHeight })
                        break;
                    }
                    case 'obstacle':{
                        if(this.RigidBodiesArr.length){
                            this.removePlayerBalls() // Subtracting Player's Health by removing the balls
                        }
                        else {console.log("*********** Game Stopped ************")}
                        break;
                    }
                    default:
                        break;
                }
            })
        })
        
    }

    // Subtracting Player Health by removing the player balls
    removePlayerBalls() {
        this.headBody = this.RigidBodiesArr[1];
        const rigidBody = this.RigidBodiesArr.shift();
        const mesh = this.bodyMeshesArr.shift();

        // Remove the mesh from the Three.js scene
        this.scene.remove(mesh);

        // Remove the rigid body from the Cannon.js physics world
        // this.physicsWorld.removeBody(rigidBody);
        console.log("remove : ", this.RigidBodiesArr, rigidBody)
        rigidBody.position.y += 10
        rigidBody.position.x += 100
        console.log("rmoved", rigidBody)

        // New head
        this.headBody = this.RigidBodiesArr[0];

        // Dispose of the mesh's geometry and material to free up resources
        mesh.geometry.dispose();
        mesh.material.dispose();
        
    }

    createBodyMesh(){
        // Create Mesh for rigidbodies
        const sphereGeometry = new SphereGeometry(0.5, 32, 32);
        const sphereMaterial = new MeshBasicMaterial({color: 0xff0000});
        const sphereMesh = new Mesh(sphereGeometry, sphereMaterial);
        return sphereMesh;
    }
    addPhysicsToBodyMesh(bodyMesh){
        let spMsh = bodyMesh;
        const sphereBody = getPhysicsBody(spMsh, ShapeType.SPHERE, this.obstacleMaterial, this.mass);

        sphereBody.linearDamping = 0;
        sphereBody.angularDamping = 0;
        // sphereBody.angularVelocity = 0;
        
        return sphereBody;
    }
    addPlayerBalls(noOfBallsToAdd){
        
        for(let i=0; i<noOfBallsToAdd; i++){
            let bodyMesh = this.createBodyMesh();
            let rigidBody = this.addPhysicsToBodyMesh(bodyMesh)

            gsap.to(rigidBody.position, { duration: 0.3, x: this.headBody.position.x });
            // gsap.to(collide.body.position, { delay: 1, duration: 10, x: window.innerWidth - 500, y: window.innerHeight })            

            this.bodyMeshesArr.push(bodyMesh);
            this.RigidBodiesArr.push(rigidBody);
            
            // Visulaize the bodies
            this.scene.add(bodyMesh);
            this.physicsWorld.addBody(rigidBody);
        }
    }

    update() {

        // Update snake's head position based on this.direction
        // const headBody = this.RigidBodiesArr[0];
        if(this.headBody){
            this.headBody.velocity.z = -10;
        }
        // this.headBody.position.y = 2;
        for(let body=1; body<this.RigidBodiesArr.length; body++){
            // console.log("***********************************************************")
            this.RigidBodiesArr[body].position.z = this.RigidBodiesArr[body-1].position.z+2;
            // this.RigidBodiesArr[body].position.y = 2;
            // this.RigidBodiesArr[body].angularVelocity;
            // this.RigidBodiesArr[body].angularDamping = 0;
            // this.RigidBodiesArr[body].position.x = this.headBody.position.x;
            // console.log(this.RigidBodiesArr[body-1].position, this.RigidBodiesArr[body].position);
            // console.log("***********************************************************")
        }
        

        // Update Three.js sphere positions based on physics simulation
        for (let i = 0; i < this.RigidBodiesArr.length; i++) {
            const sphereBody = this.RigidBodiesArr[i];
            const sphereMesh = this.bodyMeshesArr[i];
            sphereMesh.position.copy(sphereBody.position);
            sphereMesh.quaternion.copy(sphereBody.quaternion);
        }

        if(this.RigidBodiesArr.length){
            this.camera.position.set(0, this.RigidBodiesArr[this.RigidBodiesArr.length-1].position.y+20, this.RigidBodiesArr[this.RigidBodiesArr.length-1].position.z +60)
            this.camera.lookAt(0, this.RigidBodiesArr[this.RigidBodiesArr.length-1].position.y, this.RigidBodiesArr[this.RigidBodiesArr.length-1].position.z)
        }

    }

}