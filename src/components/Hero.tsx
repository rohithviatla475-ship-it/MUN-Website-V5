export default function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero">
      <div className="hero-bg"></div>
      <div className="hero-pattern"></div>
      <div className="hero-content">
        <div className="hero-eyebrow">Model United Nations Conference</div>
        <h1 className="hero-title">
          Ambitus <span className="accent">MUN</span>
        </h1>
        <p className="hero-subtitle">
          A premier diplomatic simulation bringing together passionate delegates to debate global challenges, forge alliances, and shape the future of international cooperation.
        </p>
        <div className="hero-meta">
          <div className="hero-meta-item">
            <div className="hero-meta-label">Registration Fee</div>
            <div className="hero-meta-value">₹2,500</div>
          </div>
          <div className="hero-meta-item">
            <div className="hero-meta-label">Format</div>
            <div className="hero-meta-value">In-Person</div>
          </div>
          <div className="hero-meta-item">
            <div className="hero-meta-label">Delegates</div>
            <div className="hero-meta-value">All Levels</div>
          </div>
        </div>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => scrollTo('register')}>Register Now</button>
          <button className="btn-outline" onClick={() => scrollTo('committees')}>View Committees</button>
        </div>
      </div>
      <div className="hero-scroll">Scroll to explore</div>
    </section>
  )
}
