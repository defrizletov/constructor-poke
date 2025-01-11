import * as THREE from './js/three.min.js';
import { GLTFLoader } from './js/addons/GLTFLoader.js';
import ConstructorPoke from './constructor.js';

const scene = new THREE.Scene();
//scene.background = new THREE.Color(1, 0.2, 0.05);

const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 50),
canvas = document.querySelector('canvas'),
renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

window.mesh = null;

const constructor = new ConstructorPoke(),
sections = document.querySelector('#sections');

await initScene();

resizeCanvas();

changeSection(Object.keys(constructor.getIngredients())[0]);

async function initScene() {
    const loader = new GLTFLoader().setPath('./models/');

    await new Promise(r => loader.load('avocado.glb', glb => {
        mesh = glb.scene;

        mesh.rotation.x = -5.75;
        mesh.rotation.y = 5.5;

        mesh.traverse(child => {
            if(child.isMesh) {
                //child.material = new THREE.MeshPhysicalMaterial({ color: 0xfbfbfb, roughness: 0.3, specularIntensity: 0.75 });
                child.receiveShadow = true;
                child.castShadow = true;
            };
        });

        mesh.position.z = 8.5;
        mesh.position.y = -3;

        r(scene.add(mesh));
    }));

    camera.position.z = 17.5;

    const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));

    cube.position.z = 15.5;

    cube.material.visible = false;

    scene.add(cube);

    const light = new THREE.PointLight(0xffffff, 200);

    light.shadow.bias = -0.0006;

    light.castShadow = true;

    cube.add(light);

    scene.add(cube, new THREE.AmbientLight(0xffffff, 1.5));

    constructor.init();

    const ingredients = constructor.getIngredients();

    for (const key in ingredients) {
        console.log(key);

        const element = document.createElement('div');

        element.type = key;

        element.innerText = constructor.localeIngredient(key);

        element.addEventListener('click', ({ target }) => {
            changeSection(target.type);

            toggleSectionsList();
        });

        sections.append(element);

        const objects = ingredients[key].map(createIngredient);

        objects.map(obj => {
            obj.position.x = randomInteger(-5, 5);
            obj.position.y = randomInteger(0, 7);
            //obj.position.z = -5;
            obj.userData.type = key;
            obj.visible = false;
        });
        
        scene.add(...objects);
    };

    renderer.setAnimationLoop(animate);
};

function createIngredient ({ type, color }) {
    return new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color }));
};

function animate() {
	renderer.render(scene, camera);
};

function resizeCanvas() {
    const height = window.innerHeight * 0.95;
    canvas.width = window.innerWidth;
    canvas.height = height;

    renderer.setSize(canvas.width, height);

    camera.aspect = canvas.width / height;
    camera.updateProjectionMatrix();
};

window.addEventListener('resize', resizeCanvas);

let dragging = false;

let currentX = 0,
currentY = 0,
previousX = 0,
previousY =  0;

canvas.addEventListener('pointerover', () => dragging = false);
canvas.addEventListener('pointerup', () => dragging = false);
canvas.addEventListener('pointerdown', ({ pageX, pageY }) => {
    previousX = pageX;
    previousY = pageY;

    dragging = true;
});

['pointer','touch'].map(type => canvas.addEventListener(`${type}move`, event => {
    if(dragging) {
        let clientX, clientY;

        if(type === 'touch') {
            const [touch] = event.touches;

            clientX = touch.pageX;
            clientY = touch.pageY;
        } else {
            clientX = event.pageX;
            clientY = event.pageY;
        };

        currentX = previousX - clientX;
        currentY = previousY - clientY;

        previousX = clientX;
        previousY = clientY;

        mesh.rotation.x += -currentY / 500;
        mesh.rotation.y += -currentX / 500;
    };
}));

function changeSection (type) {
    console.log(type);

    scene.children.map(x => {
        if(x.userData.type) x.visible = x.userData.type === type;
    });

    document.querySelector('#section_text').innerText = constructor.localeIngredient(type);
};

function toggleSectionsList() {
    sections.style.display = sections.style.display === 'none' ? 'flex' : 'none';
};

document.querySelector('#section_circle').addEventListener('click', toggleSectionsList);