// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell }      from '@/components/AppShell'
import DashboardPage     from '@/pages/DashboardPage'
import SortingPage       from '@/pages/SortingPage'
import PathfindingPage   from '@/pages/PathfindingPage'
import GraphsPage        from '@/pages/GraphsPage'
import TreesPage         from '@/pages/TreesPage'
import DPPage            from '@/pages/DPPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index              element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"   element={<DashboardPage />} />
          <Route path="sorting"     element={<SortingPage />} />
          <Route path="pathfinding" element={<PathfindingPage />} />
          <Route path="graphs"      element={<GraphsPage />} />
          <Route path="trees"       element={<TreesPage />} />
          <Route path="dp"          element={<DPPage />} />
          <Route path="*"           element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
