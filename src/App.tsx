import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { animate, motion, useMotionValue, type PanInfo } from 'framer-motion'
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

function SlotTitle({ text }: { text: string }) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const previousScrollYRef = useRef(0)
  const scrollDirectionRef = useRef<'down' | 'up'>('down')
  const wasVisibleRef = useRef(false)
  const [playKey, setPlayKey] = useState(0)
  const [direction, setDirection] = useState<'down' | 'up'>('down')

  useEffect(() => {
    const root = rootRef.current

    if (!root) {
      return
    }

    previousScrollYRef.current = window.scrollY

    const syncScrollDirection = () => {
      const currentScrollY = window.scrollY
      scrollDirectionRef.current = currentScrollY >= previousScrollYRef.current ? 'down' : 'up'
      previousScrollYRef.current = currentScrollY
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !wasVisibleRef.current) {
          setDirection(scrollDirectionRef.current)
          setPlayKey((current) => current + 1)
          wasVisibleRef.current = true
        }

        if (!entry.isIntersecting) {
          wasVisibleRef.current = false
        }
      },
      { threshold: 0.35, rootMargin: '-8% 0px -8% 0px' },
    )

    observer.observe(root)
    window.addEventListener('scroll', syncScrollDirection, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', syncScrollDirection)
    }
  }, [])

  return (
    <span ref={rootRef} className={`slot-title slot-title--${direction}`} aria-label={text}>
      <span className="slot-title__run" key={playKey}>
        {Array.from(text).map((character, index) => {
          const glyph = character === ' ' ? '\u00A0' : character

          return (
            <span className="slot-title__char" style={{ '--slot-index': index } as CSSProperties} aria-hidden="true" key={`${character}-${index}`}>
              <span className="slot-title__face slot-title__face--ghost">{glyph}</span>
              <span className="slot-title__face slot-title__face--live">{glyph}</span>
            </span>
          )
        })}
      </span>
    </span>
  )
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
  { label: 'Claude', src: '/assets/about/claude.svg', className: 'about-logo__img--claude' },
  { label: 'React', src: '/assets/about/react.svg', className: 'about-logo__img--wide' },
  { label: 'Notion', src: '/assets/about/notion.svg', className: 'about-logo__img--notion' },
  { label: 'GitHub', src: '/assets/about/github.svg', className: 'about-logo__img--github' },
  { label: 'Framer', src: '/assets/about/framer.svg', className: 'about-logo__img--framer', itemClassName: 'about-logo--framer' },
  { label: 'Motion', src: '/assets/about/motion.svg', className: 'about-logo__img--motion', tone: 'yellow' },
  { label: 'CSS', src: '/assets/about/css.svg', className: 'about-logo__img--css', itemClassName: 'about-logo--css' },
  { label: 'Photoshop', src: '/assets/about/photoshop-bg.svg', className: 'about-logo__img--ps', overlay: '/assets/about/photoshop-ps.svg' },
  { label: 'Illustrator', src: '/assets/about/illustrator.svg', className: 'about-logo__img--illustrator' },
  { label: 'Perplexity', src: '/assets/about/perplexity.svg', className: 'about-logo__img--perplexity' },
  { label: 'Gemini', src: '/assets/about/gemini.svg', className: 'about-logo__img--claude' },
  { label: 'VS Code', src: '/assets/about/vscode.svg', className: 'about-logo__img--claude' },
  { label: 'Gemini mark', src: '/assets/about/gemini-circle.svg', full: true },
  { label: 'Midjourney', src: '/assets/about/midjourney.svg', className: 'about-logo__img--midjourney' },
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
    '(진행중)',
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
    image: '/assets/work/gunit/cover.png',
    imageAlt: 'Gunit project visual',
    proposalUrl: 'https://drive.google.com/file/d/1pSF6r5A6qwhJNI1KfHGi6M_ZCTvOqqls/view?usp=sharing',
    websiteUrl: 'https://airsoft-nine.vercel.app/',
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
    image: '/assets/work/mmca/cover.png',
    imageAlt: 'MMCA project visual',
    proposalUrl: 'https://drive.google.com/file/d/1o59_qzZYSmNiajSqSAL2pU9f4IRpUK0M/view?usp=sharing',
    websiteUrl: 'https://angbaebultti.github.io/mmca/',
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
      '(진행중)',
    ],
    image: '/assets/work/monotrip/thumb3.png',
    imageAlt: 'MonoTrip project visual',
    proposalUrl: 'https://drive.google.com/file/d/1kMOjJEuQHTjxTXG73ANyANYp3tlY0XAF/view?usp=sharing',
  },
]

type Project = (typeof projects)[number]
type ToolLogo = (typeof toolLogos)[number]
type PastWorkCard = {
  label: string
  image?: string
}
const pastWorkTopCards: PastWorkCard[] = [
  { label: 'Past work 01', image: '/assets/past-works/Group 1917.jpg' },
  { label: 'Past work 02', image: '/assets/past-works/Group 1919.jpg' },
  { label: 'Past work 03', image: '/assets/past-works/Group 1921.jpg' },
  { label: 'Past work 04', image: '/assets/past-works/Group 1922.jpg' },
  { label: 'Past work 05', image: '/assets/past-works/Group 1924.jpg' },
  { label: 'Past work 06', image: '/assets/past-works/Group 1926.jpg' },
  { label: 'Past work 07', image: '/assets/past-works/Group 1930.jpg' },
  { label: 'Past work 08', image: '/assets/past-works/Group 1933.png' },
]
const pastWorkCarouselCards = pastWorkTopCards

function WorkCardMeta({ project, revealIndex }: { project: Project; revealIndex: number }) {
  const metaRef = useRef<HTMLParagraphElement>(null)
  const metaInView = useWorkCardMetaInView(metaRef)
  const metaNodeIds: Record<string, string> = {
    Gunit: '40002018:3892',
    MMCA: '40002032:320',
    MonoTrip: '40002032:338',
  }

  return (
    <p
      ref={metaRef}
      className="work-card__meta"
      data-node-id={metaNodeIds[project.title]}
      data-work-reveal
      style={{ '--work-reveal-index': revealIndex } as CSSProperties}
    >
      {project.meta.map((item, metaIndex) => (
        <span className={item.accent ? 'is-accent' : undefined} key={item.label}>
          {item.label} <CountUpNumber start={metaInView} to={item.value} delay={metaIndex * 0.14} duration={1.85} />%
          {metaIndex < project.meta.length - 1 ? <span className="work-card__meta-separator">  I  </span> : null}
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
    <li className={`about-logo${logo.tone ? ` about-logo--${logo.tone}` : ''}${logo.itemClassName ? ` ${logo.itemClassName}` : ''}`}>
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
  const introRef = useRef<HTMLDivElement>(null)
  const introTextRef = useRef<HTMLDivElement>(null)
  const revealScopeRef = useRef<HTMLElement>(null)
  const logoGroups = [toolLogos.slice(0, 8), toolLogos.slice(8, 16), toolLogos.slice(16)]
  const marqueeGroups = [...logoGroups, ...logoGroups]

  useEffect(() => {
    const introElement = introRef.current
    const textElement = introTextRef.current

    if (!introElement || !textElement) {
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
      const rect = introElement.getBoundingClientRect()
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const start = viewportHeight * 0.48
      const end = -viewportHeight * 0.08
      const rawProgress = (start - rect.top) / Math.max(start - end, 1)
      const progress = Math.min(Math.max(rawProgress, 0), 1)
      const lineStarts = [0.02, 0.28, 0.54]
      const lineDuration = 0.36

      textElement.style.setProperty('--about-text-progress', progress.toFixed(4))
      ;[0, 1, 2].forEach((lineIndex) => {
        const lineProgress = Math.min(Math.max((progress - lineStarts[lineIndex]) / lineDuration, 0), 1)
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

  useEffect(() => {
    const scope = revealScopeRef.current

    if (!scope) {
      return
    }

    const targets = Array.from(scope.querySelectorAll<HTMLElement>('[data-about-reveal]'))

    if (!targets.length) {
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach((target) => target.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement

          if (entry.isIntersecting) {
            target.classList.add('is-visible')
            return
          }

          const isWaitingBelowViewport = entry.boundingClientRect.top > window.innerHeight
          const isStableProfile = target.classList.contains('about-person')

          if (isStableProfile && !isWaitingBelowViewport) {
            return
          }

          target.classList.remove('is-visible')
        })
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    )

    targets.forEach((target) => observer.observe(target))

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section ref={revealScopeRef} className="about-section" id="about" aria-labelledby="about-title">
      <div className="about-section__header">
        <h2 id="about-title">
          <SlotTitle text="ABOUT" />
        </h2>
      </div>

      <div ref={introRef} className="about-intro">
        <div className="about-person" aria-hidden="true" data-about-reveal>
          <span className="about-person__shape about-person__shape--pill" />
          <span className="about-person__shape about-person__shape--outline" />
          <span className="about-person__shape about-person__shape--bar" />
          <span className="about-person__shape about-person__shape--base" />
          <img src="/assets/about/profile.png" alt="" width={374} height={407} decoding="async" />
        </div>

        <div className="about-intro__copy" data-about-reveal>
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
          </div>
        </div>
      </div>

      <div className="about-card-grid">
        {aboutCards.map((card) => (
          <div data-about-reveal key={card.title}>
            <AboutCard card={card} />
          </div>
        ))}
      </div>

      <div className="about-logo-marquee" aria-label="Tools and skills" data-about-reveal>
        <div className="about-logo-track">
          {marqueeGroups.map((group, groupIndex) => (
            <ul className="about-logo-group" key={groupIndex}>
              {group.map((logo) => (
                <ToolLogoItem logo={logo} key={`${logo.label}-${groupIndex}`} />
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}

function PastWorksSection() {
  const carouselCards = pastWorkTopCards
  const cardAngle = 360 / carouselCards.length
  const cardDepth = 620
  const rotationValue = useMotionValue(0)
  const accumulatedDrag = useRef(0)

  useEffect(() => {
    const animation = animate(rotationValue, 360, {
      duration: 32,
      repeat: Infinity,
      ease: 'linear',
    })

    return () => animation.stop()
  }, [rotationValue])

  const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    accumulatedDrag.current -= info.delta.x * 0.18
    rotationValue.set(accumulatedDrag.current)
  }

  return (
    <section className="past-works-section" aria-labelledby="past-works-title">
      <div className="past-works-section__header">
        <h2 id="past-works-title">
          <SlotTitle text="PAST WORKS" />
        </h2>
      </div>

      <div className="past-works-carousel" aria-label="Past works carousel">
        <motion.div
          className="past-works-carousel__track"
          style={{ rotateY: rotationValue }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          dragMomentum={false}
          onDrag={handleDrag}
        >
          {carouselCards.map((card, index) => (
            <article
              className="past-work-card"
              aria-label={card.label}
              key={`top-${card.label}-${index}`}
              style={{
                '--card-rotation': `${cardAngle * index}deg`,
                '--card-depth': `${cardDepth}px`,
              } as CSSProperties}
            >
              {card.image ? <img className="past-work-card__image" src={encodeURI(card.image)} alt="" loading="lazy" decoding="async" /> : null}
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function TimelineSection() {
  const timelineRef = useRef<HTMLElement>(null)
  const timelineTicks = Array.from({ length: 97 }, (_, index) => index)
  const [isTimelineIntroVisible, setIsTimelineIntroVisible] = useState(false)

  useEffect(() => {
    const section = timelineRef.current

    if (!section) {
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      section.style.setProperty('--timeline-progress', '0')
      return
    }

    let timelineProgress = 0
    let animationFrame = 0
    let snapLocked = false
    let snapTimer = 0
    let alignLocked = false
    let alignTimer = 0
    let contactScrollFrame = 0
    let previousRootScrollBehavior: string | null = null
    let timelineExitWheelCount = 0
    let timelineExitLocked = false
    let timelineExitTimer = 0
    const timelineExitWheelThreshold = 3

    const applyTimelineProgress = () => {
      section.style.setProperty('--timeline-progress', timelineProgress.toFixed(4))
      animationFrame = 0
    }

    const requestSync = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(applyTimelineProgress)
      }
    }

    const stopContactScroll = () => {
      if (contactScrollFrame) {
        window.cancelAnimationFrame(contactScrollFrame)
        contactScrollFrame = 0
      }

      if (previousRootScrollBehavior !== null) {
        document.documentElement.style.scrollBehavior = previousRootScrollBehavior
        previousRootScrollBehavior = null
      }
    }

    const setDirectScrollBehavior = () => {
      if (previousRootScrollBehavior === null) {
        previousRootScrollBehavior = document.documentElement.style.scrollBehavior
      }

      document.documentElement.style.scrollBehavior = 'auto'
    }

    const scrollToContact = () => {
      const contactSection = document.getElementById('contact')

      if (!contactSection) {
        return
      }

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const targetTop = Math.round(contactSection.getBoundingClientRect().top + window.scrollY)
      const startTop = window.scrollY
      const distance = targetTop - startTop

      stopContactScroll()
      setDirectScrollBehavior()

      if (prefersReducedMotion || Math.abs(distance) <= 1) {
        window.scrollTo({ top: targetTop, behavior: 'auto' })
        stopContactScroll()
        return
      }

      const startTime = performance.now()
      const duration = 620

      const animateContactScroll = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1)
        const easedProgress = 1 - Math.pow(1 - progress, 3)

        window.scrollTo({
          top: Math.round(startTop + distance * easedProgress),
          behavior: 'auto',
        })

        if (progress < 1) {
          contactScrollFrame = window.requestAnimationFrame(animateContactScroll)
          return
        }

        window.scrollTo({ top: targetTop, behavior: 'auto' })
        stopContactScroll()
      }

      contactScrollFrame = window.requestAnimationFrame(animateContactScroll)
    }

    const skipTimeline = () => {
      timelineProgress = 8
      timelineExitWheelCount = 0
      timelineExitLocked = false
      window.clearTimeout(timelineExitTimer)
      requestSync()
      scrollToContact()
    }

    const resetTimeline = () => {
      timelineProgress = 0
      timelineExitWheelCount = 0
      timelineExitLocked = false
      snapLocked = false
      alignLocked = false
      stopContactScroll()
      window.clearTimeout(snapTimer)
      window.clearTimeout(alignTimer)
      window.clearTimeout(timelineExitTimer)
      requestSync()
    }

    const requestTimelineExit = () => {
      if (timelineExitLocked) {
        return
      }

      timelineExitWheelCount += 1
      timelineExitLocked = true
      window.clearTimeout(timelineExitTimer)
      timelineExitTimer = window.setTimeout(() => {
        timelineExitLocked = false
      }, 320)

      if (timelineExitWheelCount >= timelineExitWheelThreshold) {
        timelineExitWheelCount = 0
        timelineExitLocked = false
        window.clearTimeout(timelineExitTimer)
        scrollToContact()
      }
    }

    const isTimelineFramed = () => {
      const rect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight

      return Math.abs(rect.top) <= 2 && Math.abs(rect.bottom - viewportHeight) <= 2
    }

    const alignTimeline = () => {
      if (alignLocked) {
        return
      }

      alignLocked = true
      window.scrollTo({
        top: section.offsetTop,
        behavior: 'smooth',
      })
      window.clearTimeout(alignTimer)
      alignTimer = window.setTimeout(() => {
        alignLocked = false
      }, 560)
    }

    const handleWheel = (event: WheelEvent) => {
      const rect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const isTimelineVisible = rect.top < viewportHeight && rect.bottom > 0
      const isTimelineActive = isTimelineVisible
      const isTimelineFullyFramed = isTimelineFramed()

      if (event.deltaY < 0 || timelineProgress < 8) {
        timelineExitWheelCount = 0
        timelineExitLocked = false
        window.clearTimeout(timelineExitTimer)
      }

      if (!isTimelineActive) {
        return
      }

      if (timelineProgress === 0 && event.deltaY < 0) {
        return
      }

      if (timelineProgress === 8 && event.deltaY > 0) {
        if (isTimelineVisible) {
          event.preventDefault()
          requestTimelineExit()
        }

        return
      }

      if (!isTimelineFullyFramed) {
        if (isTimelineVisible || timelineProgress > 0) {
          event.preventDefault()
          alignTimeline()
        }

        return
      }

      // timelineProgress가 0이고 위로 스크롤: About으로 이동 허용
      if (timelineProgress === 0 && event.deltaY < 0) {
        return
      }

      // timelineProgress가 8이고 아래로 스크롤: Contact로 이동 허용
      if (timelineProgress === 8 && event.deltaY > 0) {
        event.preventDefault()
        requestTimelineExit()
        return
      }

      // 타임라인 내에서의 스크롤: 기본 동작 방지
      event.preventDefault()

      if (snapLocked) {
        return
      }

      const shouldRewindTimeline = event.deltaY < 0 && timelineProgress > 0
      const shouldAdvanceTimeline = event.deltaY > 0 && timelineProgress < 8

      if (shouldRewindTimeline || shouldAdvanceTimeline) {
        const direction = event.deltaY > 0 ? 1 : -1
        const nextProgress = Math.min(Math.max(timelineProgress + direction, 0), 8)

        if (nextProgress !== timelineProgress) {
          timelineProgress = nextProgress
          timelineExitWheelCount = 0
          timelineExitLocked = false
          window.clearTimeout(timelineExitTimer)
          requestSync()
          snapLocked = true
          window.clearTimeout(snapTimer)
          snapTimer = window.setTimeout(() => {
            snapLocked = false
          }, 240)
        }
      }
    }

    applyTimelineProgress()
    section.addEventListener('timeline:skip', skipTimeline)
    section.addEventListener('timeline:reset', resetTimeline)
    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      section.removeEventListener('timeline:skip', skipTimeline)
      section.removeEventListener('timeline:reset', resetTimeline)
      window.removeEventListener('wheel', handleWheel)

      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame)
      }

      window.clearTimeout(snapTimer)
      window.clearTimeout(alignTimer)
      window.clearTimeout(timelineExitTimer)
      stopContactScroll()
    }
  }, [])

  useEffect(() => {
    const section = timelineRef.current

    if (!section) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsTimelineIntroVisible(entry.intersectionRatio >= 0.98)
      },
      { threshold: [0, 0.98, 1] },
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section ref={timelineRef} className={`timeline-section${isTimelineIntroVisible ? ' is-intro-visible' : ''}`} aria-labelledby="timeline-title">
      <div className="timeline-sticky">
        <div className="timeline-section__header">
          <h2 id="timeline-title">
            <SlotTitle text="TIMELINE" />
          </h2>
          <p>AT EZEN ACADEMY</p>
        </div>

        <div className="timeline-stage" aria-label="Ezen academy learning timeline">
          <div className="timeline-orb timeline-orb--one" aria-hidden="true">
            <img className="timeline-orb__shadow" src="/assets/about/timeline-ellipse-shadow.svg" alt="" />
            <img className="timeline-orb__image" src="/assets/about/timeline-ellipse.png" alt="" />
            <img className="timeline-orb__pointer" src="/assets/about/timeline-pointer.svg" alt="" />
          </div>
          <div className="timeline-scroll-hint" aria-hidden="true">
            <span className="timeline-scroll-hint__mouse">
              <span className="timeline-scroll-hint__wheel" />
            </span>
            <span className="timeline-scroll-hint__chevron" />
          </div>
          <div className="timeline-orb timeline-orb--two" aria-hidden="true">
            <img className="timeline-orb__shadow" src="/assets/about/timeline-ellipse-2-shadow.svg" alt="" />
            <img className="timeline-orb__image" src="/assets/about/timeline-ellipse-2.png" alt="" />
            <img className="timeline-orb__pointer" src="/assets/about/timeline-pointer.svg" alt="" />
          </div>
          <div className="timeline-orb timeline-orb--three" aria-hidden="true">
            <img className="timeline-orb__shadow" src="/assets/about/timeline-ellipse-3-shadow.svg" alt="" />
            <img className="timeline-orb__image" src="/assets/about/timeline-ellipse-3.png" alt="" />
            <img className="timeline-orb__pointer" src="/assets/about/timeline-pointer.svg" alt="" />
          </div>
          <div className="timeline-orb timeline-orb--four" aria-hidden="true">
            <img className="timeline-orb__shadow" src="/assets/about/timeline-ellipse-4.png" alt="" />
            <img className="timeline-orb__image" src="/assets/about/timeline-ellipse-4.png" alt="" />
            <img className="timeline-orb__pointer" src="/assets/about/timeline-pointer.svg" alt="" />
          </div>
          <div className="timeline-orb timeline-orb--five" aria-hidden="true">
            <img className="timeline-orb__shadow" src="/assets/about/timeline-ellipse-5-shadow.png" alt="" />
            <img className="timeline-orb__image" src="/assets/about/timeline-ellipse-5.png" alt="" />
            <img className="timeline-orb__pointer" src="/assets/about/timeline-pointer.svg" alt="" />
          </div>
          <div className="timeline-orb timeline-orb--six" aria-hidden="true">
            <img className="timeline-orb__shadow" src="/assets/about/timeline-ellipse-6-shadow.png" alt="" />
            <img className="timeline-orb__image" src="/assets/about/timeline-ellipse-6.png" alt="" />
            <img className="timeline-orb__pointer" src="/assets/about/timeline-pointer.svg" alt="" />
          </div>
          <div className="timeline-orb timeline-orb--seven" aria-hidden="true">
            <img className="timeline-orb__shadow" src="/assets/about/timeline-ellipse-7-shadow.png" alt="" />
            <img className="timeline-orb__image" src="/assets/about/timeline-ellipse-7.png" alt="" />
            <img className="timeline-orb__pointer" src="/assets/about/timeline-pointer.svg" alt="" />
          </div>
          <div className="timeline-orb timeline-orb--eight timeline-orb--empty" aria-hidden="true">
            <img className="timeline-orb__pointer" src="/assets/about/timeline-pointer.svg" alt="" />
          </div>
          <div className="timeline-orb timeline-orb--nine timeline-orb--empty" aria-hidden="true">
            <img className="timeline-orb__pointer" src="/assets/about/timeline-pointer.svg" alt="" />
          </div>

          <div className="timeline-rail" aria-hidden="true">
            {timelineTicks.map((tick) => (
              <span className={tick % 12 === 0 ? 'timeline-rail__tick timeline-rail__tick--major' : 'timeline-rail__tick'} key={tick} />
            ))}
          </div>

          <p className="timeline-event timeline-event--one">
            <time dateTime="2025-12-18">2025.12.18</time>
            <span>
              Web/Mobile UX/UI 프론트엔드 Level1 (HTML/CSS)
              <br />
              UI 퍼블리싱 및 웹 기초 학습 시작
            </span>
          </p>
          <p className="timeline-event timeline-event--two">
            <time dateTime="2025-12-30">2025.12.30</time>
            <span>
              Web/Mobile UX/UI 프론트엔드 Level2 (JavaScript)
              <br />
              인터랙션 및 동적 웹 구현 학습
            </span>
          </p>
          <p className="timeline-event timeline-event--three">
            <time dateTime="2026-02-09">2026.02.09</time>
            <span>
              미니프로젝트1 / Web/Mobile UX/UI 클론코딩
              <br />
              PAWINHAND 웹 리뉴얼 개인 프로젝트 진행
            </span>
          </p>
          <p className="timeline-event timeline-event--four">
            <time dateTime="2026-02-24">2026.02.24</time>
            <span>
              Web/Mobile UX/UI 프론트엔드 Level3 (TypeScript)
              <br />
              타입 기반 프론트엔드 개발 학습 및 MonoTrip 개인 앱 개발 진행
            </span>
          </p>
          <p className="timeline-event timeline-event--five">
            <time dateTime="2026-02-24">2026.02.24</time>
            <span>K-Brand Contents Web/Mobile UX/UI 팀 프로젝트</span>
          </p>
          <p className="timeline-event timeline-event--six">
            <time dateTime="2026-04-07">2026.04.07</time>
            <span>
              Web/Mobile UX/UI 프론트엔드 Level4 (React / AWS 배포)
              <br />
              React 기반 프론트엔드 및 배포 프로세스 학습
            </span>
          </p>
          <p className="timeline-event timeline-event--seven">
            <time dateTime="2026-04-22">2026.04.22</time>
            <span>AI챗봇 지원 팬덤 커뮤니티 Mobile UX/UI 팀 프로젝트</span>
          </p>
          <p className="timeline-event timeline-event--eight">
            <time dateTime="2026-06-01">2026.06.01</time>
            <span>개인 앱 및 포트폴리오 발표</span>
          </p>
          <p className="timeline-event timeline-event--nine">
            <time dateTime="2026-06-04">2026.06.04</time>
            <span>종강 및 수료</span>
          </p>
        </div>

        <button
          className="timeline-skip"
          type="button"
          onClick={() => {
            timelineRef.current?.dispatchEvent(new Event('timeline:skip'))
          }}
        >
          skip
        </button>

      </div>
    </section>
  )
}

function ContactSection() {
  const contactRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = contactRef.current

    if (!section) {
      return
    }

    const targets = Array.from(section.querySelectorAll<HTMLElement>('[data-contact-reveal]'))

    if (!targets.length) {
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach((target) => target.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        targets.forEach((target) => {
          target.classList.toggle('is-visible', entry.isIntersecting)
        })
      },
      { threshold: 0.42 },
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section ref={contactRef} className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="contact-section__header">
        <h2 id="contact-title">
          <SlotTitle text="CONTACT" />
        </h2>
      </div>

      <div className="contact-section__content">
        <div className="contact-info">
          <p data-contact-reveal>Email Address</p>
          <a href="mailto:yxungeun@gmail.com" data-contact-reveal>yxungeun@gmail.com</a>
        </div>
      </div>
    </section>
  )
}

function App() {
  const heroRef = useRef<HTMLElement>(null)
  const lensRef = useRef<HTMLImageElement>(null)
  const workRevealRef = useRef<HTMLDivElement>(null)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [isTopButtonVisible, setIsTopButtonVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

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
      document.querySelector<HTMLElement>('.timeline-section')?.dispatchEvent(new Event('timeline:reset'))

      const targetTop = Math.round(target.getBoundingClientRect().top + window.scrollY)

      window.scrollTo({
        top: targetTop,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
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

  useEffect(() => {
    let animationFrame = 0

    const syncScrollProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      const nextProgress = scrollableHeight > 0 ? Math.min(Math.max(scrollTop / scrollableHeight, 0), 1) : 0
      const workSection = document.getElementById('work')
      const workStart = workSection ? workSection.offsetTop - 1 : window.innerHeight

      setScrollProgress(nextProgress)
      setIsTopButtonVisible(scrollTop >= workStart)
      animationFrame = 0
    }

    const requestSync = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(syncScrollProgress)
      }
    }

    syncScrollProgress()
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
    const scope = workRevealRef.current

    if (!scope) {
      return
    }

    const cards = Array.from(scope.querySelectorAll<HTMLElement>('.work-card'))

    if (!cards.length) {
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cards.forEach((card) => card.classList.add('is-work-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-work-visible', entry.isIntersecting)
        })
      },
      { threshold: 0.28, rootMargin: '0px 0px -10% 0px' },
    )

    cards.forEach((card) => observer.observe(card))

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const scope = workRevealRef.current
    const workSection = scope?.closest<HTMLElement>('.work-section')

    if (!scope || !workSection) {
      return
    }

    const cards = Array.from(scope.querySelectorAll<HTMLElement>('.work-card'))

    if (!cards.length) {
      return
    }

    let snapLocked = false
    let snapTimer = 0

    const getDocumentTop = (element: HTMLElement) => {
      const scrollY = window.scrollY || document.documentElement.scrollTop

      return element.getBoundingClientRect().top + scrollY
    }

    const getNearestCardIndex = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop

      return cards.reduce((nearestIndex, card, index) => {
        const currentDistance = Math.abs(getDocumentTop(card) - scrollY)
        const nearestDistance = Math.abs(getDocumentTop(cards[nearestIndex]) - scrollY)

        return currentDistance < nearestDistance ? index : nearestIndex
      }, 0)
    }

    const snapToSection = (target: HTMLElement) => {
      snapLocked = true
      window.clearTimeout(snapTimer)
      window.scrollTo({
        top: Math.round(getDocumentTop(target)),
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      })
      snapTimer = window.setTimeout(() => {
        snapLocked = false
      }, 760)
    }

    const handleWorkWheel = (event: WheelEvent) => {
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const workRect = workSection.getBoundingClientRect()
      const isWorkVisible = workRect.top < viewportHeight && workRect.bottom > 0

      if (!isWorkVisible || Math.abs(event.deltaY) < 8) {
        return
      }

      event.preventDefault()

      if (snapLocked) {
        return
      }

      const direction = event.deltaY > 0 ? 1 : -1
      const scrollY = window.scrollY || document.documentElement.scrollTop
      const workTop = getDocumentTop(workSection)
      const lastCard = cards[cards.length - 1]
      const lastCardTop = getDocumentTop(lastCard)
      const isReturningFromAfterWork = direction < 0 && scrollY > lastCardTop + viewportHeight * 0.65
      const currentIndex = getNearestCardIndex()
      const target =
        isReturningFromAfterWork
          ? lastCard
          : direction > 0
          ? scrollY < workTop - 2
            ? cards[0]
            : cards[currentIndex + 1] ?? document.getElementById('about')
          : currentIndex > 0
            ? cards[currentIndex - 1]
            : document.getElementById('top')

      if (target) {
        snapToSection(target)
      }
    }

    window.addEventListener('wheel', handleWorkWheel, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWorkWheel)
      window.clearTimeout(snapTimer)
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

        <button
          className={`floating-top${isTopButtonVisible ? ' is-visible' : ''}`}
          type="button"
          aria-label="Back to top"
          aria-hidden={!isTopButtonVisible}
          tabIndex={isTopButtonVisible ? 0 : -1}
          style={{ '--scroll-progress': scrollProgress } as CSSProperties}
          onClick={() => {
            document.querySelector<HTMLElement>('.timeline-section')?.dispatchEvent(new Event('timeline:reset'))
            window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
          }}
        >
          <svg className="floating-top__progress" viewBox="0 0 48 48" aria-hidden="true">
            <circle className="floating-top__track" cx="24" cy="24" r="21" />
            <circle className="floating-top__bar" cx="24" cy="24" r="21" />
          </svg>
          <span className="floating-top__arrow">↑</span>
        </button>

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
            <h2 id="work-title">
              <SlotTitle text="WORK" />
            </h2>
          </div>

          <div className="work-list" ref={workRevealRef}>
            {projects.map((project, index) => (
                <article
                  className="work-card"
                  key={project.title}
                >
                  <div className="work-card__inner">
                    <div className="work-card__content">
                      <div className="work-card__text">
                        <h3 data-work-reveal style={{ '--work-reveal-index': 1 } as CSSProperties}>
                          {project.title}
                        </h3>
                        <WorkCardMeta project={project} revealIndex={2} />
                        <p
                          className="work-card__description"
                          data-work-reveal
                          style={{ '--work-reveal-index': 3 } as CSSProperties}
                        >
                          {(projectDescriptions[project.title] ?? project.description).join(' ')}
                        </p>
                      </div>

                      <div className="work-card__actions" aria-label={`${project.title} links`}>
                        <a
                          href={project.proposalUrl ?? '#work'}
                          target={project.proposalUrl ? '_blank' : undefined}
                          rel={project.proposalUrl ? 'noreferrer' : undefined}
                          data-work-reveal
                          style={{ '--work-reveal-index': 4 } as CSSProperties}
                        >
                          <span>Proposal</span>
                          <img src="/assets/icons/work-arrow.svg" alt="" aria-hidden="true" />
                        </a>
                        <a
                          className="is-primary"
                          href={project.websiteUrl ?? '#work'}
                          target={project.websiteUrl ? '_blank' : undefined}
                          rel={project.websiteUrl ? 'noreferrer' : undefined}
                          data-work-reveal
                          style={{ '--work-reveal-index': 5 } as CSSProperties}
                        >
                          <span>Project</span>
                          <img src="/assets/icons/work-arrow.svg" alt="" aria-hidden="true" />
                        </a>
                      </div>
                    </div>

                    <div className="work-card__image" data-work-reveal style={{ '--work-reveal-index': 0 } as CSSProperties}>
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

        <PastWorksSection />

        <TimelineSection />

        <ContactSection />
      </main>
    </>
  )
}

export default App
