import Footer from '../components/Footer.jsx'
import Hexagons from '../components/Hexagons.jsx'
import { TortoiseIcon, SnakeIcon, ChameleonIcon } from '../components/Icons.jsx'
import { BANK, CONTACT, NPC_NUMBER, RESCUE_ROAST_URL } from '../data/site.js'
import '../css/landing.css'

import hero from '../assets/hero.jpg'
import wordmark from '../assets/logo-wordmark.png'
import gallery1 from '../assets/photos/gallery-1.jpg'
import gallery2 from '../assets/photos/gallery-2.jpg'
import gallery3 from '../assets/photos/gallery-3.jpg'
import gallery4 from '../assets/photos/gallery-4.jpg'
import rescueRoast from '../assets/rescue-roast.png'
import wcha from '../assets/sponsors/wcha.png'
import f10 from '../assets/sponsors/f10.png'
import lodgeBuilders from '../assets/sponsors/lodge-builders.png'
import chelonian from '../assets/sponsors/chelonian.png'
import kacf from '../assets/sponsors/kacf.png'
import mcf from '../assets/sponsors/mcf.png'
import ttpg from '../assets/sponsors/ttpg.png'
import bornWild from '../assets/sponsors/born-wild.png'
import ardentQuest from '../assets/sponsors/ardent-quest.png'
import wijgula from '../assets/sponsors/wijgula.png'

const QUICK_LINKS = [
  { href: '#about', label: 'About us' },
  { href: '#support', label: 'Support us' },
  { href: '#contact', label: 'Contact us' },
]

const ABOUT = [
  {
    title: 'History',
    text: 'TCSA was established in 2024 by Dirk Barnard. Dirk has studied and worked with a multitude of South African Chelonian species since 1999.',
  },
  {
    title: 'Vision',
    text: 'To protect and conserve native reptile species by securing and rezoning land under conservation status: fostering biodiversity and strengthening the connection between communities and the natural world for future generations.',
  },
  {
    title: 'Conservation & Rehabilitation',
    text: 'By securing land under conservation status, we aim to create thriving and protected landscapes where native reptiles can flourish. Additionally, we want to build sanctuaries where injured chelonians can recover – to be released back into the wild once rehabilitated.',
  },
  {
    title: 'SA reptile species',
    text: 'South Africa has the most diverse range of tortoise species out of any country. Of these species, 3 are currently endangered and one is critically endangered.',
  },
]

const GALLERY = [
  { src: gallery1, alt: 'A rescued tortoise being held up in the veld' },
  { src: gallery2, alt: 'A bright green chameleon on a branch' },
  { src: gallery3, alt: 'Dirk Barnard safely removing a snake' },
  { src: gallery4, alt: 'A geometric tortoise in grassland' },
]

const SPONSORS = [
  { src: f10, name: 'F10 Products' },
  { src: lodgeBuilders, name: 'Lodge Builders Botswana' },
  { src: chelonian, name: 'Chelonian Conservation Group', dark: true },
  { src: kacf, name: 'Katie Adamson Conservation Fund' },
  { src: mcf, name: 'MCF' },
  { src: ttpg, name: 'Turtle and Tortoise Preservation Group' },
  { src: bornWild, name: 'Born Wild Gifts' },
  { src: ardentQuest, name: 'Ardent Quest' },
  { src: wijgula, name: 'Wijgula' },
]

const aboutScutesTop = [
  { x: 'calc(100% - 450px)', y: -20, size: 140, rotate: -18 },
  { x: 'calc(100% - 320px)', y: -90, size: 230, rotate: 0 },
  { x: 'calc(100% - 140px)', y: 80, size: 150, rotate: 6 },
]
const aboutScutesBottom = [
  { x: -40, y: 'calc(100% - 250px)', size: 160, rotate: 10 },
  { x: -50, y: 'calc(100% - 90px)', size: 140, rotate: -12 },
  { x: 110, y: 'calc(100% - 100px)', size: 150, rotate: 4 },
]
const supportScutes = [
  { x: 'calc(100% - 270px)', y: 50, size: 150, rotate: 12 },
  { x: 'calc(100% - 120px)', y: 52, size: 54, rotate: -4 },
]
const dividerScutes = [
  { x: '0%', y: 30, size: 220, rotate: -20 },
  { x: '18%', y: 70, size: 100, rotate: 10 },
  { x: '25%', y: 130, size: 90, rotate: -8 },
  { x: '27%', y: 40, size: 40, rotate: 0 },
  { x: '32%', y: 50, size: 150, rotate: -12 },
  { x: '45%', y: 130, size: 100, rotate: 14 },
  { x: '49%', y: 60, size: 80, rotate: 0 },
  { x: '55%', y: 150, size: 46, rotate: 4 },
  { x: '57%', y: 40, size: 60, rotate: 8 },
  { x: '60%', y: 190, size: 30, rotate: 0 },
  { x: '63%', y: 60, size: 160, rotate: 0 },
  { x: '76%', y: 40, size: 46, rotate: 0 },
  { x: '76%', y: 150, size: 64, rotate: 10 },
  { x: '81%', y: 20, size: 210, rotate: -14 },
]

function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-hero" style={{ backgroundImage: `url(${hero})` }}>
        <div className="landing-topbar">
          <img className="landing-left-logo" src={wordmark} alt="TCSA" />
          <nav className="landing-nav-right" aria-label="On this page">
            {QUICK_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="landing-navbutton">
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="landing-hero-content">
          <h1 className="shared-display landing-hero-title">
            Protect today,
            <br />
            Preserve tomorrow
          </h1>
          <p className="landing-hero-subtitle">
            We are passionate about the conservation of reptiles in South Africa, with a specific focus on Chelonians!
          </p>
        </div>
        <p className="landing-npc-number">Registered NPC since {NPC_NUMBER}</p>
      </header>

      <section className="landing-about" id="about">
        <Hexagons items={aboutScutesTop} className="landing-desktop-only" />
        <Hexagons items={aboutScutesBottom} />

        <div className="landing-container">
          <h2 className="shared-display landing-section-title">About us</h2>

          <div className="landing-columns-about">
            {ABOUT.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>

          <div className="landing-species-banner">
            <TortoiseIcon size={114} className="landing-species-icon" />
            <p>
              Tortoises are our main focus, but we work with many South African reptile species. We also aid with safe
              snake removals from communities, and give educational talks to the public.
            </p>
            <div className="landing-right-icons">
              <SnakeIcon size={66} className="landing-species-icon" />
              <ChameleonIcon size={86} className="landing-species-icon" />
            </div>
          </div>
        </div>
      </section>

      <div className="landing-photostrip">
        {GALLERY.map((photo) => (
          <img key={photo.alt} src={photo.src} alt={photo.alt} loading="lazy" />
        ))}
      </div>

      <section className="landing-support" id="support">
        <Hexagons items={supportScutes} color="var(--hex-grey)" outline="#9aa496" />

        <div className="landing-container landing-support-grid">
          <div>
            <h2 className="shared-display landing-section-title">Support us</h2>

            <div className="landing-support-block">
              <h3>Local donations</h3>
              <p>
                Bank: {BANK.bank}
                <br />
                Account name: {BANK.accountName}
                <br />
                Cheque account: {BANK.chequeAccount}
                <br />
                Branch code: {BANK.branchCode}
              </p>
            </div>

            <div className="landing-support-block">
              <h3>International donations</h3>
              <p>
                If you wish to make donations from outside of South Africa please{' '}
                <a href="#contact">reach out to us</a> first so that we can try get the best exchange rate with the
                bank, as the rand is unfortunately volatile.
              </p>
            </div>

            <div className="landing-support-block">
              <h3>Rescue Roast</h3>
              <p>
                Support us by drinking <strong>Rescue Roast coffee</strong>. With every purchase, you can enjoy great
                coffee while helping support the rescue, rehabilitation, and conservation of tortoises. You can order
                directly on{' '}
                <a href={RESCUE_ROAST_URL} target="_blank" rel="noreferrer">
                  www.rescueroast.co.za
                </a>{' '}
                and remember to pick any variant with a tortoise.
              </p>
            </div>

            <div className="landing-support-block">
              <h3>Tortoise food</h3>
              <p>
                <strong>In need of tortoise food?</strong>
              </p>
              <p>
                We supply dry food formulated for tortoises, supporting their nutritional needs as part of responsible
                care.
              </p>
              <a className="landing-foodlink" href={CONTACT.whatsappLink} target="_blank" rel="noreferrer">
                Contact Dirk about tortoise food →
              </a>
            </div>
          </div>

          <div className="landing-right-coffee">
            <img src={rescueRoast} alt="Rescue Roast coffee bags" loading="lazy" />
          </div>
        </div>
      </section>

      <div className="landing-shell-divider">
        <Hexagons items={dividerScutes} color="var(--hex-grey)" outline="#9aa496" />
      </div>

      <section className="landing-partners">
        <div className="landing-container landing-columns-partners">
          <div>
            <h2 className="shared-display landing-partners-title">Proudly endorsed by</h2>
            <div className="landing-endorser-box">
              <img src={wcha} alt="Western Cape Herpetological Association" loading="lazy" />
            </div>
          </div>

          <div>
            <h2 className="shared-display landing-partners-title">Sponsored by</h2>
            <ul className="landing-sponsor-grid">
              {SPONSORS.map((s) => (
                <li key={s.name} className={s.dark ? 'is-dark' : ''}>
                  <img src={s.src} alt={s.name} title={s.name} loading="lazy" />
                </li>
              ))}
            </ul>
            <a className="landing-foodlink" href={CONTACT.whatsappLink} target="_blank" rel="noreferrer">
                Should you wish to join our sponsors, please contact
              </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LandingPage
