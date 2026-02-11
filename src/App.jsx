import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard/Dashboard'
import Assets from './pages/Assets/Assets'
import WorkOrders from './pages/WorkOrders/WorkOrders'
import Technicians from './pages/Technicians/Technicians'
import Schedules from './pages/Schedules/Schedules'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="assets" element={<Assets />} />
        <Route path="work-orders" element={<WorkOrders />} />
        <Route path="technicians" element={<Technicians />} />
        <Route path="schedules" element={<Schedules />} />
      </Route>
    </Routes>
  )
}

export default App
