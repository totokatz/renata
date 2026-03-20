import { useRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Warmer, richer wood tones
const WOOD_COLOR = '#B8845A'
const WOOD_DARK = '#8B6340'
const LIGHT_EMISSION = '#FFF0D4'

export default function LamparaModel({
  scrollProgress = 0,
  mode = 'scroll-rotate',
  modelPath,
}) {
  const { scene } = useGLTF(modelPath)
  const groupRef = useRef()

  const { clonedScene, initialPositions } = useMemo(() => {
    const clone = scene.clone(true)

    clone.traverse((child) => {
      if (child.isMesh) {
        const name = child.name.toLowerCase()

        // Hide the leftover Blender cube
        if (name === 'cube') {
          child.visible = false
          return
        }

        if (name.includes('luz')) {
          // Light piece — warm wood with glow
          child.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(WOOD_COLOR),
            roughness: 0.45,
            metalness: 0.02,
            emissive: new THREE.Color(LIGHT_EMISSION),
            emissiveIntensity: 0.15,
            clearcoat: 0.3,
            clearcoatRoughness: 0.4,
            sheen: 0.2,
            sheenColor: new THREE.Color('#D4A76A'),
          })
        } else {
          // Body/support — richer wood
          child.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(WOOD_COLOR),
            roughness: 0.5,
            metalness: 0.02,
            clearcoat: 0.25,
            clearcoatRoughness: 0.5,
            sheen: 0.15,
            sheenColor: new THREE.Color(WOOD_DARK),
          })
        }

        child.castShadow = true
        child.receiveShadow = true
      }
    })

    // Auto-center and auto-scale
    const box = new THREE.Box3().setFromObject(clone)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 3 / maxDim

    clone.scale.setScalar(scale)
    clone.position.set(-center.x * scale, -center.y * scale, -center.z * scale)

    // Store initial transforms for explode mode
    const positions = {}
    clone.traverse((child) => {
      if (child.isMesh && child.visible) {
        positions[child.name] = {
          position: child.position.clone(),
          rotation: child.rotation.clone(),
        }
      }
    })

    return { clonedScene: clone, initialPositions: positions }
  }, [scene])

  useFrame(() => {
    if (!groupRef.current) return

    if (mode === 'scroll-rotate') {
      groupRef.current.rotation.y = scrollProgress * Math.PI * 2
    }

    if (mode === 'explode') {
      const explodeAmount = Math.max(0, Math.min(1, (scrollProgress - 0.1) / 0.7))
      const eased = explodeAmount * explodeAmount * (3 - 2 * explodeAmount)

      clonedScene.traverse((child) => {
        if (!child.isMesh || !child.visible || !initialPositions[child.name]) return

        const initial = initialPositions[child.name]
        const name = child.name.toLowerCase()

        if (name.includes('luz')) {
          child.position.y = initial.position.y + eased * 1.5
          child.rotation.z = initial.rotation.z + eased * 0.15
        } else if (name.includes('soporte')) {
          child.position.y = initial.position.y - eased * 1.2
          child.rotation.x = initial.rotation.x + eased * 0.12
        }
      })

      groupRef.current.rotation.y = scrollProgress * Math.PI * 0.6
    }
  })

  return (
    <group ref={groupRef} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  )
}
