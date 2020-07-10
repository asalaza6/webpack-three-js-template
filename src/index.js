import './style/main.css';
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { Vector3 } from 'three'
import image from './resources/grass.jpg';
import flower from './resources/flower.png';
/**
 * Sizes
 */
const sizes = {}
sizes.width = window.innerWidth
sizes.height = window.innerHeight

window.addEventListener('resize', () =>
{
    // Save sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
})

/**
 * Environnements
 */

// load texture
console.log(process.env.PUBLIC_URL);
var texture = new THREE.TextureLoader().load(image);
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 4, 4 );

var planttexture = new THREE.TextureLoader().load(flower);
planttexture.wrapS = THREE.RepeatWrapping;
planttexture.wrapT = THREE.RepeatWrapping;
//planttexture.repeat.set( 4, 4 );
// Scene
const scene = new THREE.Scene()
var color = new THREE.Color(0xadd8e6);
scene.background = color;
// Camera
const camera = new THREE.PerspectiveCamera(300, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 10

camera.up.set(0,0,-1);
scene.add(camera)

// Test
var geometry = new THREE.PlaneGeometry(35,35,10,10);
var material = new THREE.MeshMatcapMaterial( {color: 0xffff00, side: THREE.DoubleSide, map: texture});
var plane = new THREE.Mesh( geometry, material );
console.log("Creating plane at");
console.log(plane.position);
scene.add( plane );
//create plant function
function addPlant(x,y){
    const stem = new THREE.Mesh(new THREE.BoxBufferGeometry(.1, .1, .5), new THREE.MeshMatcapMaterial( {color: 0x008000, side: THREE.FrontSide}));
    stem.position.z = .25;
    stem.position.x = x;
    stem.position.y = y;
    scene.add(stem);
    const top = new THREE.Mesh(new THREE.BoxBufferGeometry(1, .1, 1), new THREE.MeshMatcapMaterial( {side: THREE.FrontSide, map: planttexture}));
    top.position.z = 1;
    top.position.x = x;
    top.position.y = y;
    scene.add(top);
}
addPlant(-5,0);
addPlant(0,1);
addPlant(2,3);

addPlant(10,12);

addPlant(5,6);


// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('.webgl')
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(sizes.width, sizes.height)

/**
 * Loop
 * 
 */
const loop = () =>
{
    // Keep looping
    window.requestAnimationFrame(loop)
    // // Update
    // cube.rotation.y += 0.01

    // Render
    renderer.render(scene, camera)
}

class cameraHandler{
    constructor(){
        //state variables
        this.moving = false;
        this.initialCam = null;
        this.initialMouse = null;
        //remove context menu
        window.addEventListener('contextmenu', (evt)=>{evt.preventDefault();});
        let controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 0.05;
        
        controls.screenSpacePanning = false;
        controls.enableRotate = true;
        controls.enablePan = false;
		controls.minDistance = 5;
        controls.maxDistance = 100;
        
        controls.maxPolarAngle = Math.PI;
        controls.minPolarAngle = (13*Math.PI)/24;
        //setup mousedown listener
        // window.addEventListener('mousedown', (evt)=>{this.startMoving(evt)});
        // //setup mouseup
        // window.addEventListener('mouseup',(evt)=>{this.stopMoving(evt);});
        // //setup mousemotion
        // window.addEventListener('mousemove',(evt)=>{this.handleMoving(evt);})
    }
    moveCamera(mousex,mousey){
        assert(this.initialPos != null);
    }
    handleMoving(evt){
        if(this.moving){
            console.log(this.initialMouse.x-evt.screenX);
            console.log(this.initialMouse.y-evt.screenY);
            console.log(evt);
        }
    }
    stopMoving(evt){
        this.moving = false;
        console.log(evt);
    }
    startMoving(event){
        //record initial position of the camera
        this.initialCam = camera.position;
        this.initialMouse = {x:event.screenX,y:event.screenY}
        this.moving = true;
        // var tempX = camera.position.x;
        // var tempZ = camera.position.z;
        // camera.position.x = camera.position.y;
        // camera.position.z = tempX;
        // camera.position.y = tempZ;
        let handVec = new THREE.Vector3();
        camera.getWorldDirection(handVec);
        camera.lookAt(cube.position);
        camera.updateProjectionMatrix();
        console.log(handVec,camera.position,cube.position);
    }
    //
}

const Handler = new cameraHandler();

loop()