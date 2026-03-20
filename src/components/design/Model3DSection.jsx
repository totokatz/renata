import { useRef, useState, Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import LamparaModel from './LamparaModel'
import { useScrollLock } from '../../hooks/useScrollLock'

const ease = [0.22, 1, 0.36, 1]

function ScrollRotateScene({ model, scrollProgress }) {
  return (
    <>
      <ambientLight intensity={0.5} color="#FFF8F0" />
      <directionalLight
        position={[5, 8, 3]}
        intensity={1.4}
        color="#FFF5E0"
        castShadow
      />
      <directionalLight
        position={[-3, 4, -2]}
        intensity={0.4}
        color="#E8DDD0"
      />
      <spotLight
        position={[0, 6, 0]}
        intensity={0.7}
        angle={0.5}
        penumbra={0.8}
        color="#FFFAF0"
      />
      <Environment preset="studio" environmentIntensity={0.3} />
      <ContactShadows
        position={[0, -1.8, 0]}
        opacity={0.35}
        scale={8}
        blur={2.5}
        far={4}
      />
      <LamparaModel
        modelPath={model}
        scrollProgress={scrollProgress}
        mode="scroll-rotate"
      />
    </>
  )
}

function ExplodeScene({ model, scrollProgress }) {
  return (
    <>
      <ambientLight intensity={0.5} color="#FFF8F0" />
      <directionalLight
        position={[4, 8, 4]}
        intensity={1.2}
        color="#FFF5E0"
        castShadow
      />
      <directionalLight
        position={[-4, 3, -3]}
        intensity={0.35}
        color="#E8DDD0"
      />
      <Environment preset="studio" environmentIntensity={0.3} />
      <ContactShadows
        position={[0, -2.5, 0]}
        opacity={0.25}
        scale={10}
        blur={3}
        far={5}
      />
      <LamparaModel
        modelPath={model}
        scrollProgress={scrollProgress}
        mode="explode"
      />
    </>
  )
}

function InteractiveScene({ model }) {
  return (
    <>
      <ambientLight intensity={0.5} color="#FFF8F0" />
      <directionalLight
        position={[5, 8, 3]}
        intensity={1.3}
        color="#FFF5E0"
        castShadow
      />
      <directionalLight
        position={[-3, 4, -2]}
        intensity={0.4}
        color="#E8DDD0"
      />
      <spotLight
        position={[0, 6, 0]}
        intensity={0.6}
        angle={0.5}
        penumbra={0.8}
        color="#FFFAF0"
      />
      <Environment preset="studio" environmentIntensity={0.3} />
      <ContactShadows
        position={[0, -1.8, 0]}
        opacity={0.35}
        scale={8}
        blur={2.5}
        far={4}
      />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate
        autoRotateSpeed={1.2}
        minDistance={3}
        maxDistance={8}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.8}
        dampingFactor={0.05}
        enableDamping
      />
      <LamparaModel
        modelPath={model}
        scrollProgress={0}
        mode="interactive"
      />
    </>
  )
}

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border border-outline/30 rounded-full border-t-primary animate-spin" />
        <span className="font-label text-[10px] uppercase tracking-[0.4em] text-outline">
          Cargando modelo 3D
        </span>
      </div>
    </div>
  )
}

export default function Model3DSection({ model, mode = 'scroll-rotate', caption }) {
  const containerRef = useRef(null)
  const captionRef = useRef(null)
  const captionInView = useInView(captionRef, { once: true, margin: '-50px' })
  const [scrollVal, setScrollVal] = useState(0)

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const isScrollLocked = mode === 'scroll-rotate'
  const isExplode = mode === 'explode'
  const sectionHeight = isExplode ? (isMobile ? '200vh' : '250vh') : '100vh'

  // Scroll-lock para rotación 360°
  const { progress } = useScrollLock(containerRef, {
    enabled: isScrollLocked,
    reEngageAfterForward: true,
  })

  // Framer Motion scroll solo para modo explode
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  useEffect(() => {
    if (!isExplode) return
    const unsubscribe = scrollYProgress.on('change', (v) => setScrollVal(v))
    return unsubscribe
  }, [scrollYProgress, isExplode])

  return (
    <section
      ref={containerRef}
      className="relative w-full"
      style={{ height: sectionHeight }}
    >
      <div
        className={`${isExplode ? 'sticky top-0' : 'relative'} h-screen w-full`}
      >
        {/* Canvas background — matches site surface */}
        <div className="absolute inset-0 bg-surface model-3d-canvas">
          <Suspense fallback={<LoadingFallback />}>
            <Canvas
              camera={{ position: [0, 2, 6], fov: isMobile ? 50 : 40 }}
              dpr={isMobile ? [1, 1.5] : [1, 2]}
              style={{ background: 'transparent' }}
              gl={{ antialias: true, alpha: true }}
            >
              {mode === 'scroll-rotate' && (
                <ScrollRotateScene model={model} scrollProgress={progress} />
              )}
              {mode === 'explode' && (
                <ExplodeScene model={model} scrollProgress={scrollVal} />
              )}
              {mode === 'interactive' && (
                <InteractiveScene model={model} />
              )}
            </Canvas>
          </Suspense>
        </div>

        {/* Caption overlay */}
        {caption && (
          <div
            ref={captionRef}
            className="absolute bottom-10 md:bottom-16 left-0 right-0 px-6 md:px-12 max-w-[1920px] mx-auto"
          >
            <motion.p
              className="font-headline italic text-lg md:text-2xl text-on-surface-variant/60 font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={captionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease }}
            >
              {caption}
            </motion.p>
          </div>
        )}

        {/* Scroll hint for interactive mode */}
        {mode === 'interactive' && (
          <div className="absolute bottom-10 right-6 md:bottom-16 md:right-12 flex flex-col items-center gap-2">
            <span className="font-label text-[9px] uppercase tracking-[0.4em] text-outline/50">
              Explorá el modelo
            </span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-outline/40">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill="currentColor" />
              <path d="M8 12l4 4 4-4M8 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
        )}

        {/* Scroll-driven counter for scroll modes */}
        {(isScrollLocked || isExplode) && (
          <div className="absolute bottom-8 right-6 md:bottom-12 md:right-12 z-10">
            <span className="font-label text-xs text-outline/50 tracking-widest">
              {Math.round((isScrollLocked ? progress : scrollVal) * 100)}%
            </span>
          </div>
        )}
      </div>
    </section>
  )
}
