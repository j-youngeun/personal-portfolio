import { useEffect, useRef, type CSSProperties, type PointerEvent } from 'react'
import CustomCursor from './components/CustomCursor'
import './App.css'

const navItems = ['WORK', 'ABOUT', 'CONTACT']
const titleLead = 'Create with'
const projects = [
  {
    badge: 'Team Project',
    title: 'Gunit',
    meta: [
      { text: 'Planning 20%' },
      { text: 'Design 30%' },
      { text: 'Frontend 50%', accent: true },
    ],
    description: [
      '에어소프트 입문자의 정보 탐색 장벽을 낮추고, 팬덤형 커뮤니티를 통해',
      '지속적인 참여를 유도하는 AI 챗봇 기반 커뮤니티 앱 개발 팀 프로젝트',
    ],
    image: '/assets/work/gunit.png',
    imageAlt: 'Gunit project visual',
  },
  {
    badge: 'Team Project',
    title: 'MMCA',
    meta: [
      { text: 'Planning 20%' },
      { text: 'Design 70%', accent: true },
      { text: 'Frontend 10%' },
    ],
    description: [
      '국립현대미술관 웹사이트의 정보 구조를 개선하여',
      '해외 방문자가 정보를 직관적으로 탐색할 수 있도록 진행한 영문 웹사이트 리뉴얼 팀 프로젝트',
    ],
    image: '/assets/work/mmca.png',
    imageAlt: 'MMCA project visual',
  },
  {
    badge: 'Personal Project',
    title: 'MonoTrip',
    meta: [
      { text: 'Planning 100%' },
      { text: 'Design 100%' },
      { text: 'Frontend 100%' },
    ],
    description: [
      '1인 여행자를 위한 맞춤형 여행 경험을 제공하는 서비스로',
      '안전하고 효율적인 여행 계획을 지원하는 앱 개발 개인 프로젝트',
    ],
    image: '/assets/work/monotrip.png',
    imageAlt: 'MonoTrip project visual',
  },
]

function App() {
  const heroRef = useRef<HTMLElement>(null)
  const lensRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]')

      if (!anchor) {
        return
      }

      const hash = anchor.getAttribute('href')

      if (!hash || hash === '#') {
        return
      }

      const target = document.querySelector<HTMLElement>(hash)

      if (!target) {
        return
      }

      event.preventDefault()
      target.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      })
      window.history.pushState(null, '', hash)
    }

    document.addEventListener('click', handleAnchorClick)

    return () => {
      document.removeEventListener('click', handleAnchorClick)
    }
  }, [])

  useEffect(() => {
    let animationFrame = 0

    const syncLensScale = () => {
      const scrollRange = Math.max(window.innerHeight * 0.95, 1)
      const progress = Math.min(window.scrollY / scrollRange, 1)
      const titleProgress = Math.min(progress * 1.75, 1)
      const easedTitleProgress = 1 - Math.pow(1 - titleProgress, 3)
      const titleScale = 1 - easedTitleProgress * 0.58
      const titleTranslateY = easedTitleProgress * 168
      const titleOpacity = 1 - easedTitleProgress * 0.54
      const lensOpacity = Math.max(1 - Math.pow(progress, 1.35) * 0.92, 0.08)
      const scrollCueOpacity = Math.max(1 - Math.pow(progress, 1.25) * 0.96, 0)

      heroRef.current?.style.setProperty('--title-scroll-scale', titleScale.toFixed(4))
      heroRef.current?.style.setProperty('--title-scroll-y', `${titleTranslateY.toFixed(2)}px`)
      heroRef.current?.style.setProperty('--title-scroll-opacity', titleOpacity.toFixed(4))
      heroRef.current?.style.setProperty('--scroll-cue-opacity', scrollCueOpacity.toFixed(4))
      lensRef.current?.style.setProperty('--lens-scroll-opacity', lensOpacity.toFixed(4))
      animationFrame = 0
    }

    const requestSync = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(syncLensScale)
      }
    }

    syncLensScale()
    window.addEventListener('scroll', requestSync, { passive: true })
    window.addEventListener('resize', requestSync)

    return () => {
      window.removeEventListener('scroll', requestSync)
      window.removeEventListener('resize', requestSync)

      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame)
      }
    }
  }, [])

  const handleTitlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - bounds.left
    const y = event.clientY - bounds.top

    event.currentTarget.style.setProperty('--title-x', `${x}px`)
    event.currentTarget.style.setProperty('--title-y', `${y}px`)
  }

  return (
    <>
      <CustomCursor />
      <main className="portfolio-home" aria-label="Youngeun Jeong portfolio home">
        <header className="site-header">
          <a className="site-header__brand" href="#top" aria-label="Youngeun Jeong home">
            YOUNGEUN JEONG
          </a>

          <nav className="site-header__nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`}>
                {item}
              </a>
            ))}
          </nav>
        </header>

        <section ref={heroRef} className="hero" id="top">
          <div
            className="hero__copy"
            aria-label="Create with focus"
            onPointerMove={handleTitlePointerMove}
            onPointerEnter={handleTitlePointerMove}
          >
            <span className="hero__title hero__title--base">
              <span className="hero__title-sequence" aria-hidden="true">
                {titleLead.split('').map((letter, index) => (
                  <span
                    className="hero__title-letter"
                    key={`${letter}-${index}`}
                    style={{ '--letter-index': index } as CSSProperties}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </span>
                ))}
              </span>
              <span className="sr-only">Create with</span>
              <strong>focus</strong>
            </span>
            <span className="hero__title hero__title--blur" aria-hidden="true">
              Create with <strong>focus</strong>
            </span>
            <span className="hero__title hero__title--reveal" aria-hidden="true">
              Create with <strong>focus</strong>
            </span>
            <span className="hero__title-frame" aria-hidden="true" />
          </div>

          <div className="lens-wrap" aria-hidden="true">
            <img ref={lensRef} className="lens" src="/assets/graphics/lens.svg" alt="" />
          </div>

          <a className="scroll-cue" href="#work" aria-label="Scroll down to work">
            <span>SCROLL&nbsp;&nbsp;DOWN</span>
            <img src="/assets/icons/arrow_down.svg" alt="" aria-hidden="true" />
          </a>
        </section>

        <section className="work-section" id="work" aria-labelledby="work-title">
          <div className="work-section__header">
            <h2 id="work-title">WORK</h2>
          </div>

          <div className="work-list">
            {projects.map((project, index) => {
              const isFeatured = index === 0

              return (
                <article
                  className={`work-card${isFeatured ? ' work-card--featured' : ''}`}
                  key={project.title}
                >
                  <div className="work-card__inner">
                    <div className="work-card__content">
                      <div className="work-card__text">
                        <span className="work-card__badge">{project.badge}</span>
                        <h3>{project.title}</h3>
                        <p className="work-card__meta">
                          {project.meta.map((item, metaIndex) => (
                            <span className={item.accent ? 'is-accent' : undefined} key={item.text}>
                              {item.text}
                              {metaIndex < project.meta.length - 1 ? '  I  ' : ''}
                            </span>
                          ))}
                        </p>
                        <p className="work-card__description">
                          {project.description.map((line) => (
                            <span key={line}>{line}</span>
                          ))}
                        </p>
                      </div>

                      <div className="work-card__actions" aria-label={`${project.title} links`}>
                        <a href="#work">Proposal</a>
                        <a className="is-primary" href="#work">
                          Website
                        </a>
                      </div>
                    </div>

                    <div className="work-card__image">
                      <img src={project.image} alt={project.imageAlt} />
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </main>
    </>
  )
}

export default App
