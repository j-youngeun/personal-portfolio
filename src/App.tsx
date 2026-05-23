import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import CustomCursor from './components/CustomCursor'
import CountUpNumber from './components/CountUpNumber'
import { useWorkCardMetaInView } from './hooks/useWorkCardMetaInView'
import './App.css'

const navItems = ['WORK', 'ABOUT', 'CONTACT']
const titleLead = 'Create with'
const titleAccent = 'focus'
type AboutItem = {
  name: string
  date: string
  description?: string
}
type AboutCardData = {
  title: string
  items: AboutItem[]
  subTitle?: string
  subItems?: AboutItem[]
}

const aboutCards: AboutCardData[] = [
  {
    title: 'WORK HISTORY',
    items: [
      {
        name: '대한무역투자진흥공사(KOTRA)',
        date: '2024.03~2025.03',
        description: '그래픽 디자인 · 공사 행정 업무',
      },
      {
        name: '서울특별시미디어재단 TBS',
        date: '2021.06~2023.01',
        description: '영상 촬영편집 · 유튜브 업로드',
      },
    ],
  },
  {
    title: 'CERTIFICATION',
    items: [
      { name: '한국사능력검정시험1급', date: '2023.08' },
      { name: '컴퓨터그래픽스운용기능사', date: '2022.04' },
      { name: 'GTQ(그래픽기술자격) 1급', date: '2021.08' },
      { name: '컴퓨터활용능력 2급', date: '2020.08' },
    ],
  },
  {
    title: 'EDUCATION',
    items: [
      {
        name: '이젠아카데미DX교육센터 수료',
        date: '2025.12~2026.06',
        description: 'UXUI디자인&웹기획 프론트엔드',
      },
      {
        name: '중앙대학교(안성) 졸업',
        date: '2016.03~2021.08',
        description: '사진학과',
      },
    ],
    subTitle: 'EXPERIENCE',
    subItems: [{ name: '호주 워킹홀리데이', date: '2025.03~2025.12' }],
  },
]
const toolLogos = [
  { label: 'ChatGPT', src: '/assets/about/chatgpt.png', className: 'about-logo__img--xl' },
  { label: 'Figma', src: '/assets/about/figma.svg', className: 'about-logo__img--figma' },
  { label: 'Claude', src: '/assets/about/claude.svg', className: 'about-logo__img--lg' },
  { label: 'React', src: '/assets/about/react.svg', className: 'about-logo__img--wide' },
  { label: 'Notion', src: '/assets/about/notion.svg' },
  { label: 'GitHub', src: '/assets/about/github.svg', className: 'about-logo__img--lg' },
  { label: 'Framer', src: '/assets/about/framer.svg', className: 'about-logo__img--figma' },
  { label: 'Motion', src: '/assets/about/motion.svg', className: 'about-logo__img--motion', tone: 'yellow' },
  { label: 'CSS', src: '/assets/about/css.svg', className: 'about-logo__img--css' },
  { label: 'Photoshop', src: '/assets/about/photoshop-bg.svg', className: 'about-logo__img--ps', overlay: '/assets/about/photoshop-ps.svg' },
  { label: 'Illustrator', src: '/assets/about/illustrator.svg', className: 'about-logo__img--ps' },
  { label: 'Perplexity', src: '/assets/about/perplexity.svg', className: 'about-logo__img--lg' },
  { label: 'Gemini', src: '/assets/about/gemini.svg', className: 'about-logo__img--lg' },
  { label: 'VS Code', src: '/assets/about/vscode.svg', className: 'about-logo__img--lg' },
  { label: 'Gemini mark', src: '/assets/about/gemini-circle.svg', full: true },
  { label: 'Midjourney', src: '/assets/about/midjourney.svg', className: 'about-logo__img--wide' },
  { label: 'JavaScript', src: '/assets/about/javascript.svg', className: 'about-logo__img--xl' },
  { label: 'Vercel', src: '/assets/about/vercel.svg' },
]
const gunitDescription = [
  '에어소프트 입문자의 정보 탐색 장벽을 낮추고, 팬덤형 커뮤니티를 통해',
  '지속적인 참여를 유도하는 AI 챗봇 기반 커뮤니티 앱 개발 팀 프로젝트',
]
const projectDescriptions: Record<string, string[]> = {
  Gunit: gunitDescription,
  MMCA: [
    '국립현대미술관 웹사이트의 정보 구조를 개선하여',
    '해외 방문자가 정보를 직관적으로 탐색할 수 있도록 진행한 영문 웹사이트 리뉴얼 팀 프로젝트',
  ],
  MonoTrip: [
    '1인 여행자를 위한 맞춤형 여행 경험을 제공하는 서비스로',
    '안전하고 효율적인 여행 계획을 지원하는 앱 개발 개인 프로젝트',
  ],
}
const projects = [
  {
    badge: 'Team Project',
    title: 'Gunit',
    meta: [
      { label: 'Planning', value: 20, accent: false },
      { label: 'Design', value: 30, accent: false },
      { label: 'Frontend', value: 50, accent: true },
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
      { label: 'Planning', value: 20, accent: false },
      { label: 'Design', value: 70, accent: true },
      { label: 'Frontend', value: 10, accent: false },
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
      { label: 'Planning', value: 100, accent: false },
      { label: 'Design', value: 100, accent: false },
      { label: 'Frontend', value: 100, accent: false },
    ],
    description: [
      '1인 여행자를 위한 맞춤형 여행 경험을 제공하는 서비스로',
      '안전하고 효율적인 여행 계획을 지원하는 앱 개발 개인 프로젝트',
    ],
    image: '/assets/work/monotrip.png',
    imageAlt: 'MonoTrip project visual',
  },
]

type Project = (typeof projects)[number]
type ToolLogo = (typeof toolLogos)[number]

function WorkCardMeta({ project }: { project: Project }) {
  const metaRef = useRef<HTMLParagraphElement>(null)
  const metaInView = useWorkCardMetaInView(metaRef)

  return (
    <p ref={metaRef} className="work-card__meta">
      {project.meta.map((item, metaIndex) => (
        <span className={item.accent ? 'is-accent' : undefined} key={item.label}>
          {item.label}{' '}
          <CountUpNumber start={metaInView} to={item.value} delay={metaIndex * 0.14} duration={1.85} />%
          {metaIndex < project.meta.length - 1 ? '  I  ' : ''}
        </span>
      ))}
    </p>
  )
}

function AboutCard({ card }: { card: AboutCardData }) {
  return (
    <article className="about-card">
      <h3>{card.title}</h3>
      <div className="about-card__list">
        {card.items.map((item) => (
          <div className="about-card__item" key={`${card.title}-${item.name}`}>
            <div className="about-card__row">
              <strong>{item.name}</strong>
              <span>{item.date}</span>
            </div>
            {item.description ? <p>{item.description}</p> : null}
          </div>
        ))}
      </div>
      {card.subTitle && card.subItems ? (
        <div className="about-card__group">
          <h3>{card.subTitle}</h3>
          <div className="about-card__list">
            {card.subItems.map((item) => (
              <div className="about-card__item" key={`${card.subTitle}-${item.name}`}>
                <div className="about-card__row">
                  <strong>{item.name}</strong>
                  <span>{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  )
}

function ToolLogoItem({ logo }: { logo: ToolLogo }) {
  return (
    <li className={`about-logo${logo.tone ? ` about-logo--${logo.tone}` : ''}`}>
      {logo.full ? (
        <img className="about-logo__full" src={logo.src} alt={logo.label} loading="lazy" decoding="async" />
      ) : (
        <span className="about-logo__inner">
          <img
            className={`about-logo__img${logo.className ? ` ${logo.className}` : ''}`}
            src={logo.src}
            alt={logo.label}
            loading="lazy"
            decoding="async"
          />
          {logo.overlay ? (
            <img
              className="about-logo__overlay"
              src={logo.overlay}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
            />
          ) : null}
        </span>
      )}
    </li>
  )
}

function AboutSection() {
  const introTextRef = useRef<HTMLDivElement>(null)
  const marqueeLogos = [...toolLogos, ...toolLogos]

  useEffect(() => {
    const textElement = introTextRef.current

    if (!textElement) {
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      textElement.style.setProperty('--about-text-progress', '1')
      ;[0, 1, 2].forEach((lineIndex) => {
        textElement.style.setProperty(`--about-line-${lineIndex}`, '1')
      })
      return
    }

    let animationFrame = 0

    const syncTextProgress = () => {
      const rect = textElement.getBoundingClientRect()
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const start = viewportHeight * 0.82
      const end = viewportHeight * 0.34
      const rawProgress = (start - rect.top) / Math.max(start - end, 1)
      const progress = Math.min(Math.max(rawProgress * 0.72, 0), 1)

      textElement.style.setProperty('--about-text-progress', progress.toFixed(4))
      ;[0, 1, 2].forEach((lineIndex) => {
        const lineProgress = Math.min(Math.max((progress - lineIndex * 0.24) / 0.42, 0), 1)
        textElement.style.setProperty(`--about-line-${lineIndex}`, lineProgress.toFixed(4))
      })
      animationFrame = 0
    }

    const requestSync = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(syncTextProgress)
      }
    }

    syncTextProgress()
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

  return (
    <section className="about-section" id="about" aria-labelledby="about-title">
      <div className="about-section__header">
        <h2 id="about-title">ABOUT</h2>
      </div>

      <div className="about-intro">
        <div className="about-person" aria-hidden="true">
          <span className="about-person__shape about-person__shape--pill" />
          <span className="about-person__shape about-person__shape--outline" />
          <span className="about-person__shape about-person__shape--bar" />
          <span className="about-person__shape about-person__shape--base" />
          <img src="/assets/about/profile.png" alt="" width={374} height={407} decoding="async" />
        </div>

        <div className="about-intro__copy">
          <div ref={introTextRef} className="about-intro__text">
            <span className="about-intro__line" style={{ '--line-index': 0 } as CSSProperties}>
              AI와 UX 빌드 프로세스를 기반으로
            </span>
            <span className="about-intro__line" style={{ '--line-index': 1 } as CSSProperties}>
              디자인과 프론트엔드 개발을 넘나들며
            </span>
            <span className="about-intro__line" style={{ '--line-index': 2 } as CSSProperties}>
              몰입감 있는 디지털 경험을 만듭니다.
            </span>
            <p>
              AI와 UX 빌드 프로세스를 기반으로
              <br />
              디자인과 프론트엔드 개발을 넘나들며{' '}
            </p>
            <p>몰입감 있는 디지털 경험을 만듭니다.</p>
          </div>
        </div>
      </div>

      <div className="about-card-grid">
        {aboutCards.map((card) => (
          <AboutCard card={card} key={card.title} />
        ))}
      </div>

      <div className="about-logo-marquee" aria-label="Tools and skills">
        <ul className="about-logo-track">
          {marqueeLogos.map((logo, index) => (
            <ToolLogoItem logo={logo} key={`${logo.label}-${index}`} />
          ))}
        </ul>
      </div>
    </section>
  )
}

function App() {
  const heroRef = useRef<HTMLElement>(null)
  const lensRef = useRef<HTMLImageElement>(null)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)

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
      const isHeaderNavigation = Boolean(anchor.closest('.site-header__nav'))
      target.scrollIntoView({
        behavior:
          isHeaderNavigation || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
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

  useEffect(() => {
    let previousScrollY = window.scrollY

    const syncHeaderVisibility = () => {
      const nextScrollY = window.scrollY
      const scrollDelta = nextScrollY - previousScrollY

      if (Math.abs(scrollDelta) < 6) {
        return
      }

      setIsHeaderVisible(scrollDelta > 0)
      previousScrollY = nextScrollY
    }

    window.addEventListener('scroll', syncHeaderVisibility, { passive: true })

    return () => {
      window.removeEventListener('scroll', syncHeaderVisibility)
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
        <header className={`site-header${isHeaderVisible ? '' : ' site-header--hidden'}`}>
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
              <strong aria-hidden="true">
                {titleAccent.split('').map((letter, index) => (
                  <span
                    className="hero__title-letter"
                    key={`${letter}-${index}`}
                    style={{ '--letter-index': titleLead.length + index } as CSSProperties}
                  >
                    {letter}
                  </span>
                ))}
              </strong>
              <span className="sr-only"> focus</span>
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
            {projects.map((project, index) => (
                <article
                  className="work-card"
                  key={project.title}
                  style={{ '--work-card-layer': index + 1 } as CSSProperties}
                >
                  <div className="work-card__inner">
                    <div className="work-card__content">
                      <div className="work-card__text">
                        <h3>{project.title}</h3>
                        <WorkCardMeta project={project} />
                        <p className="work-card__description">
                          {(projectDescriptions[project.title] ?? project.description).map((line) => (
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
                      <img
                        src={project.image}
                        alt={project.imageAlt}
                        width={928}
                        height={560}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                        sizes="(max-width: 560px) calc(100vw - 32px), (max-width: 1024px) calc(100vw - 40px), (max-width: 1280px) 44vw, 928px"
                      />
                    </div>
                  </div>
                </article>
            ))}
          </div>
        </section>

        <AboutSection />
      </main>
    </>
  )
}

export default App
