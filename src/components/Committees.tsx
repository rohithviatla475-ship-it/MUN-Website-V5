import { COMMITTEES } from '../lib/types'

export default function Committees() {
  return (
    <section className="section" id="committees">
      <div className="section-header">
        <div className="section-eyebrow">Committees & Agendas</div>
        <h2 className="section-title">Explore Our Committees</h2>
        <p className="section-subtitle">
          Select from a diverse range of committees. During registration, you will be asked to rank your top three preferences.
        </p>
      </div>
      <div className="committees-grid">
        {COMMITTEES.map((c) => (
          <div className="committee-card" key={c.id}>
            <div className="committee-card-header">
              <h3 className="committee-card-name">{c.name}</h3>
            </div>
            <div className="committee-card-body">
              <p className="committee-card-desc">{c.description}</p>
              <div className="committee-card-agenda-label">Agenda</div>
              <div className="committee-card-agenda">{c.agenda}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
