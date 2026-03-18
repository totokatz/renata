import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import ArtworkDetail from './pages/ArtworkDetail'
import Collections from './pages/Collections'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="popLayout">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/artwork/:id" element={<ArtworkDetail />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}
