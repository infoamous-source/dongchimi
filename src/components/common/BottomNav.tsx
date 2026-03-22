import { NavLink } from 'react-router-dom'
import { Info, BookOpen, Briefcase, MessageCircle } from 'lucide-react'

const navItems = [
  { to: '/senior/about', icon: Info, label: '학교소개' },
  { to: '/senior/learn', icon: BookOpen, label: '배움터' },
  { to: '/senior/work', icon: Briefcase, label: '일터' },
  { to: '/senior/ai', icon: MessageCircle, label: 'AI비서' },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `bottom-nav-item ${isActive ? 'active' : ''}`
          }
        >
          <Icon />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
