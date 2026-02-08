import * as THREE from 'three'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js'

export class DataViz {
  constructor(container, map) {
    this.container = container
    this.map = map
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000)
    this.camera.position.z = 5
    
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    this.renderer.setClearColor(0x000000, 0)
    container.appendChild(this.renderer.domElement)
    
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05
    this.controls.autoRotate = true
    this.controls.autoRotateSpeed = 2
    
    this.lastAzimuth = this.controls.getAzimuthalAngle()
    
    this.currentViz = null
    this.animate()
  }

  createBookViz() {
    const group = new THREE.Group()
    for (let i = 0; i < 5; i++) {
      const geo = new THREE.BoxGeometry(2, 0.3, 1.5)
      const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.y = i * 0.35 - 0.7
      group.add(mesh)
    }
    return group
  }

  createImageViz() {
    const group = new THREE.Group()
    const geo = new THREE.PlaneGeometry(3, 2)
    const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
    const mesh = new THREE.Mesh(geo, mat)
    group.add(mesh)
    
    const frame = new THREE.EdgesGeometry(new THREE.BoxGeometry(3.2, 2.2, 0.2))
    const frameMat = new THREE.LineBasicMaterial({ color: 0x00ff00 })
    const frameMesh = new THREE.LineSegments(frame, frameMat)
    group.add(frameMesh)
    return group
  }

  createConceptViz() {
    const group = new THREE.Group()
    const geo = new THREE.IcosahedronGeometry(1.5, 0)
    const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
    const mesh = new THREE.Mesh(geo, mat)
    group.add(mesh)
    
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.TorusGeometry(2 + i * 0.3, 0.02, 16, 100)
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      const ringMesh = new THREE.Mesh(ring, ringMat)
      ringMesh.rotation.x = Math.PI / 2 + i * 0.3
      group.add(ringMesh)
    }
    return group
  }

  createPersonViz() {
    const group = new THREE.Group()
    const head = new THREE.SphereGeometry(0.5, 8, 8)
    const headMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
    const headMesh = new THREE.Mesh(head, headMat)
    headMesh.position.y = 1.5
    group.add(headMesh)
    
    const body = new THREE.CylinderGeometry(0.3, 0.5, 1.5, 8)
    const bodyMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
    const bodyMesh = new THREE.Mesh(body, bodyMat)
    bodyMesh.position.y = 0.5
    group.add(bodyMesh)
    return group
  }

  createSectionViz() {
    const group = new THREE.Group()
    for (let i = 0; i < 8; i++) {
      const geo = new THREE.BoxGeometry(2.5, 0.1, 0.1)
      const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.y = i * 0.3 - 1.2
      mesh.rotation.z = Math.sin(i * 0.5) * 0.1
      group.add(mesh)
    }
    return group
  }

  createLocationViz() {
    const group = new THREE.Group()
    const geo = new THREE.SphereGeometry(1.2, 16, 16)
    const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
    const mesh = new THREE.Mesh(geo, mat)
    group.add(mesh)
    
    const marker = new THREE.ConeGeometry(0.3, 1, 4)
    const markerMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const markerMesh = new THREE.Mesh(marker, markerMat)
    markerMesh.position.y = 1.5
    markerMesh.rotation.z = Math.PI
    group.add(markerMesh)
    return group
  }

  createEventViz() {
    const group = new THREE.Group()
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2
      const geo = new THREE.BoxGeometry(0.2, 1, 0.2)
      const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.x = Math.cos(angle) * 1.5
      mesh.position.z = Math.sin(angle) * 1.5
      group.add(mesh)
    }
    return group
  }

  createDefaultViz() {
    const group = new THREE.Group()
    const geo = new THREE.OctahedronGeometry(1.5, 0)
    const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
    const mesh = new THREE.Mesh(geo, mat)
    group.add(mesh)
    return group
  }

  setType(type) {
    if (this.currentViz) {
      this.scene.remove(this.currentViz)
    }

    const types = type?.split(',')[0] || 'default'
    
    switch(types) {
      case 'book': this.currentViz = this.createBookViz(); break
      case 'image': this.currentViz = this.createImageViz(); break
      case 'concept': this.currentViz = this.createConceptViz(); break
      case 'person': this.currentViz = this.createPersonViz(); break
      case 'section': this.currentViz = this.createSectionViz(); break
      case 'location': this.currentViz = this.createLocationViz(); break
      case 'event': this.currentViz = this.createEventViz(); break
      case 'art_movement': this.currentViz = this.createConceptViz(); break
      case 'artist': this.currentViz = this.createPersonViz(); break
      case 'narrative': this.currentViz = this.createSectionViz(); break
      case 'text': this.currentViz = this.createBookViz(); break
      default: this.currentViz = this.createDefaultViz()
    }
    
    this.scene.add(this.currentViz)
  }

  animate() {
    requestAnimationFrame(() => this.animate())
    
    this.controls.update()
    
    const currentAzimuth = this.controls.getAzimuthalAngle()
    const delta = currentAzimuth - this.lastAzimuth
    
    if (Math.abs(delta) > 0.001 && this.map) {
      const currentBearing = this.map.getBearing()
      this.map.setBearing(currentBearing - (delta * 30))
    }
    
    this.lastAzimuth = currentAzimuth
    
    if (this.currentViz) {
      this.currentViz.rotation.y += 0.005
    }
    
    this.renderer.render(this.scene, this.camera)
  }

  resize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
  }
}
