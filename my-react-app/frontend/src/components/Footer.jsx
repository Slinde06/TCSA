import { Link } from 'react-router-dom'
import Hexagons from './Hexagons.jsx'
import { WhatsAppIcon, GmailIcon, FacebookIcon } from './Icons.jsx'
import { CONTACT } from '../data/site.js'
import badge from '../assets/logo-badge.png'
import './Footer.css'

const year = new Date().getFullYear()

const orangeScutes = [
  { x: 'calc(100% - 96px)', y: 40, size: 110, rotate: 8 },
  { x: 'calc(100% - 130px)', y: 170, size: 104, rotate: -6 },
  { x: 'calc(100% - 250px)', y: 225, size: 96, rotate: 4 },
]

function Footer() {
  return (
    <footer className="landing-footer" id="contact">
      <Hexagons items={orangeScutes} color="var(--orange)" outline="#d8b48a" className="landing-footer-hexagons" />

      <div className="landing-footer-inner">
        <div className="landing-footer-left">
          <h2 className="shared-display landing-footer-title">Contact {CONTACT.name}</h2>

          <ul className="landing-contact-list">
            <li>
              <WhatsAppIcon />
              <span>
                WhatsApp:
                <br />
                <a href={CONTACT.whatsappLink} target="_blank" rel="noreferrer">
                  {CONTACT.whatsappDisplay}
                </a>
              </span>
            </li>
            <li>
              <GmailIcon />
              <span>
                Gmail:
                <br />
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </span>
            </li>
            <li>
              <FacebookIcon />
              <a className="landing-underlined" href={CONTACT.facebook} target="_blank" rel="noreferrer">
                Join our Facebook group
              </a>
            </li>
          </ul>
        </div>

        <div className="landing-footerlogo">
          <img src={badge} alt="Tortoise Conservation South Africa logo" />
        </div>
      </div>

      <div className="landing-footer-bottom">
        <span>© {year} Tortoise Conservation South Africa NPC</span>
        <span className="landing-footer-student">
          This is a student website and is not the official site of Tortoise Conservation South Africa.
        </span>
        <Link to="/login">Owner login</Link>
      </div>
    </footer>
  )
}

export default Footer