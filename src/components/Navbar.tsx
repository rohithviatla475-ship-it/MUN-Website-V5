import { useState } from 'react'

export default function Navbar({ scrolled }: { scrolled: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const scrollTo = (id: string) => {
    setMobileOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="navbar-logo">
        <div className="navbar-logo-mark">A</div>
        <span className="navbar-logo-text">Ambitus MUN</span>
      </div>
      <div className="navbar-links">
        <a className="navbar-link" onClick={() => scrollTo('about')}>About</a>
        <a className="navbar-link" onClick={() => scrollTo('committees')}>Committees</a>
        <a className="navbar-link" onClick={() => scrollTo('register')}>Register</a>
        <a className="navbar-cta" onClick={() => scrollTo('register')}>Apply Now</a>
      </div>
      <div className="navbar-burger" onClick={() => setMobileOpen(!mobileOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  )
}
