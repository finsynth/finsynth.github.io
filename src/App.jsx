import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Support from './pages/Support'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/support" element={<Support />} />
    </Routes>
  )
}

export default App
