// import './style.css'
// import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import * as dat from 'dat.gui'

// Debug
// const gui = new dat.GUI()
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Texture Loader

const loader = new THREE.TextureLoader()
const texture = loader.load('/static/img/texture.png')
const height = loader.load('/static/img/image.jpg')
const alpha = loader.load('/static/img/alpha2.png')

// Scene
const scene = new THREE.Scene()

const geometry = new THREE.PlaneBufferGeometry(4, 4, 128, 128)
const material = new THREE.MeshStandardMaterial({
    color: 'gray',
    map: texture,
    displacementMap: height,
    displacementScale: 0.6,
    alphaMap: alpha,
    transparent: true,
    depthTest: false
})

const plane = new THREE.Mesh(geometry, material);

scene.add(plane)

plane.rotation.x = 181

// Lights

const pointLight = new THREE.PointLight('#48050C', 2)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

const col = { color : 'blue'}


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 3
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.setClearColor('#f4eae1');

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // sphere.rotation.y = .5 * elapsedTime

    plane.rotation.z = .2*elapsedTime

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()