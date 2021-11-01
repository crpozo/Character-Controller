import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r123/three.module.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

class BasicWorldDemo {
    constructor() {
        this._Initialize();
    }

    _Initialize () {
        // Display 3D graphics in screen
        this._threejs = new THREE.WebGLRenderer({
            antialias: true,
        });
        // Shadows, Ratio, and Screen size
        this._threejs.shadowMap.enabled = true;
        this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
        this._threejs.setPixelRatio( window.devicePixelRatio );
        this._threejs.setSize( window.innerWidth, window.innerHeight );

        document.body.appendChild(this._threejs.domElement);

        window.addEventListener( 'resize', () => {
            this._OnWindowResize();
        }, false );

        // Settings camera
        const fov = 60;
        const aspect = 1920 / 1080;
        const near = 1.0;
        const far = 1000.0;
        this._camera = new THREE.PerspectiveCamera( fov, aspect, near, far ); 
        this._camera.position.set( 75, 20, 0);

        // Create scene
        this._scene = new THREE.Scene();

        // Scene light
        let light = new THREE.DirectionalLight( 0xFFFFFF );
        light.position.set( 100, 100, 100 );
        light.target.position.set( 0, 0, 0 );
        light.castShadow = true;
        light.shadow.bias = -0.01;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.near = 1.0;
        light.shadow.camera.far = 500;
        light.shadow.camera.left = 200;
        light.shadow.camera.right = 200;
        light.shadow.camera.top = 200;
        light.shadow.camera.bottom = 200;
        this._scene.add( light );

        // Ambient light
        light = new THREE.AmbientLight( 0x404040 );
        this._scene.add( light );

        const controls = new OrbitControls(
            this._camera, this._threejs.domElement);
          controls.target.set(0, 20, 0);
          controls.update();

        // Load skybox
        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load( [
            './assets/px.png',
            './assets/nx.png',
            './assets/py.png',
            './assets/ny.png',
            './assets/pz.png',
            './assets/nz.png'
        ] );
        this._scene.background = texture;

        this._LoadModel();
        this._RAF();
    }

    _LoadModel() {
        const loader = new GLTFLoader();
        loader.load('./assets/raven.gltf', (gltf) => {
            gltf.scene.traverse(c => {
                c.castShadow = true;
            });
            this._scene.add(gltf.scene);
        })
    }

    // Add responsiveness
    _OnWindowResize() {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._threejs.setSize( window.innerwidth, window.innerHeight );
    }

    // Request Animation Frame
    _RAF() {
        requestAnimationFrame( () => {
            this._threejs.render(this._scene, this._camera);
            this._RAF();
        });
    }
}

let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new BasicWorldDemo();
});