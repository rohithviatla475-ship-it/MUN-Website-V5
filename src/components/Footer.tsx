export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="footer-brand-name">Ambitus MUN</div>
          <p className="footer-text">
            A premier Model United Nations conference dedicated to fostering diplomacy, leadership, and global awareness among the next generation of changemakers.
          </p>
        </div>
        <div>
          <div className="footer-heading">Conference</div>
          <a className="footer-link" href="#about">About</a>
          <a className="footer-link" href="#committees">Committees</a>
          <a className="footer-link" href="#register">Register</a>
        </div>
        <div>
          <div className="footer-heading">Connect</div>
          <a className="footer-link" href="#register">Contact Us</a>
          <a className="footer-link" href="#register">Apply Now</a>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Ambitus MUN. All rights reserved.
      </div>
    </footer>
  )
}
