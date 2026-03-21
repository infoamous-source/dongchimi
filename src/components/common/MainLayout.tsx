import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'
import TopHeader from './TopHeader'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-dc-cream">
      <TopHeader />
      <main className="has-bottom-nav">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
