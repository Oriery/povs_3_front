<template>
  <div ref="canvasParent"></div>
</template>

<script setup lang="ts">
import { onUnmounted, ref, onMounted } from 'vue';
import { useJoystickStore } from '../stores/joystick.js'
const joystickStore = useJoystickStore()
import * as THREE from 'three'

const canvasParent = ref<HTMLCanvasElement | null>(null)
let interval : number | undefined = undefined

let renderer: THREE.WebGLRenderer | null = null
let scene : THREE.Scene | null = null
let camera : THREE.Camera | null = null

onMounted(() => {
  if (!canvasParent.value) throw new Error('canvasParent is null')

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  canvasParent.value.appendChild(renderer.domElement)

  const geometry = new THREE.BoxGeometry( 1, 3, 1 );
  const material = new THREE.MeshPhongMaterial( { color: 0x505050 } );
  material.shininess = 20
  material.specular = new THREE.Color(0xffffff)
  
  const cube = new THREE.Mesh( geometry, material );
  scene.add( cube );

  const light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.set(0, 10, 10)
  light.target.position.set(0, 0, 0)
  scene.add(light)

  const lightAmbient = new THREE.AmbientLight(0xffffff, 0.2)
  scene.add(lightAmbient)

  camera.position.z = 5;

  // add joystick position
  const zeroPosOfJoystick = new THREE.Vector3(3, 0, 0)
  const joystickBox = new THREE.BoxGeometry(0.1, 0.1, 0.01)
  const joystickMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 })
  const joystickMesh = new THREE.Mesh(joystickBox, joystickMaterial)
  joystickMesh.position.copy(zeroPosOfJoystick)
  scene.add(joystickMesh)
  // add joystick bg
  const joystickBgBox = new THREE.BoxGeometry(2.1, 2.1, 0.01)
  const joystickBgMaterial = new THREE.MeshPhongMaterial({ color: 0x300000 })
  const joystickBgMesh = new THREE.Mesh(joystickBgBox, joystickBgMaterial)
  joystickBgMesh.position.copy(zeroPosOfJoystick)
  joystickBgMesh.position.z -= 0.01
  scene.add(joystickBgMesh)


  interval = setInterval(() => {
    if (!renderer || !scene || !camera) return

    renderer.render(scene, camera)

    // rotate cube in local space
    cube.rotation.x -= joystickStore.joystickPosition.y / 10
    cube.rotation.y += joystickStore.joystickPosition.x / 10

    // clamp rotation x 
    cube.rotation.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, cube.rotation.x))
    
    // move joystick position
    joystickMesh.position.copy(zeroPosOfJoystick)
    joystickMesh.position.x += joystickStore.joystickPosition.x
    joystickMesh.position.y += joystickStore.joystickPosition.y
  }, 1000 / 60)
})

onUnmounted(() => {
  if (renderer) {
    renderer.domElement.remove()
  }
  if (interval) {
    clearInterval(interval)
  }
})

</script>
