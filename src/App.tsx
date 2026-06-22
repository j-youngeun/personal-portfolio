import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ComponentType,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react'
import {
  animate,
  motion,
  useMotionValue,
  type PanInfo,
} from 'framer-motion'
import { ShaderGradient, ShaderGradientCanvas } from 'shadergradient'
import CountUpNumber from './components/CountUpNumber'
import HamburgerMenu from './components/HamburgerMenu'
import { useWorkCardMetaInView } from './hooks/useWorkCardMetaInView'
import './App.css'

const ContactShaderGradient = ShaderGradient as unknown as ComponentType<Record<string, unknown>>

type NavItem = {
  label: string
  hash: `#${string}`
  hideOnMobile?: boolean
}

const navItems: NavItem[] = [
  { label: 'ABOUT', hash: '#about' },
  { label: 'PROJECT', hash: '#work' },
  { label: 'PAST WORKS', hash: '#past-works' },
  { label: 'AI WORKFLOW', hash: '#ai-workflow' },
  { label: 'CONTACT', hash: '#contact' },
]
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

type AiWorkflowStep = {
  number: string
  title: string
  tool: string
  image: string
  description: string
  detail?: {
    lead: string[]
    items: string[]
    outro: string
    outroBeforeList?: boolean
  }
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

function MailClickIcon() {
  return (
    <span className="mail-click-icon" aria-hidden="true">
      <svg width="24" height="24" viewBox="0 0 24 24" focusable="false">
        <path className="mail-click-icon__ray mail-click-icon__ray--1" d="M3 12H6" />
        <path className="mail-click-icon__ray mail-click-icon__ray--2" d="M12 3V6" />
        <path className="mail-click-icon__ray mail-click-icon__ray--3" d="M7.8 7.8L5.6 5.6" />
        <path className="mail-click-icon__ray mail-click-icon__ray--4" d="M16.2 7.8L18.4 5.6" />
        <path className="mail-click-icon__ray mail-click-icon__ray--5" d="M7.8 16.2L5.6 18.4" />
        <path className="mail-click-icon__cursor" d="M12 12L21 15L17 17L15 21L12 12Z" />
      </svg>
    </span>
  )
}

const aboutCards: AboutCardData[] = [
  {
    title: 'WORK HISTORY',
    items: [
      {
        name: '대한무역투자진흥공사',
        date: '2024-2025',
        description: '그래픽 디자인',
      },
      {
        name: '서울특별시미디어재단티비에스',
        date: '2021-2023',
        description: '영상 촬영편집',
      },
    ],
  },
  {
    title: 'CERTIFICATE',
    items: [
      { name: '한국사능력검정시험1급', date: '2023' },
      { name: '컴퓨터그래픽스운용기능사', date: '2022' },
      { name: 'GTQ(그래픽기술자격) 1급', date: '2021' },
      { name: '컴퓨터활용능력 2급', date: '2020' },
    ],
  },
  {
    title: 'EDUCATION & EXPERIENCE',
    items: [
      {
        name: 'UXUI디자인&웹기획 프론트엔드 교육 수료',
        date: '2026',
        description: '이젠아카데미DX교육센터',
      },
      {
        name: '호주 워킹홀리데이',
        date: '2025',
      },
      {
        name: '중앙대학교(안성) 졸업',
        date: '2021',
        description: '사진학과',
      },
    ],
  },
]
const toolLogos = [
  { label: 'ChatGPT', src: '/assets/about/chatgpt.png', className: 'about-logo__img--chatgpt' },
  { label: 'Gemini', src: '/assets/about/gemini.svg', className: 'about-logo__img--claude' },
  { label: 'Gemini mark', src: '/assets/about/gemini-circle.svg', full: true },
  { label: 'Claude', src: '/assets/about/claude.svg', className: 'about-logo__img--claude-logo' },
  { label: 'Perplexity', src: '/assets/about/perplexity.svg', className: 'about-logo__img--perplexity' },
  { label: 'Midjourney', src: '/assets/about/midjourney.svg', className: 'about-logo__img--midjourney' },
  { label: 'Higgsfield AI', src: '/assets/about/higgsfield.svg', className: 'about-logo__img--lg' },
  { label: 'NotebookLM', src: '/assets/about/notebooklm.svg', className: 'about-logo__img--wide about-logo__img--notebooklm' },
  { label: 'Figma', src: '/assets/about/figma.svg', className: 'about-logo__img--figma' },
  { label: 'Framer', src: '/assets/about/framer.svg', className: 'about-logo__img--framer', itemClassName: 'about-logo--framer' },
  { label: 'Motion', src: '/assets/about/motion.svg', className: 'about-logo__img--motion', tone: 'yellow' },
  { label: 'GSAP', src: '/assets/about/gsap.svg', className: 'about-logo__img--wide' },
  { label: 'Canva', src: '/assets/about/canva.svg', className: 'about-logo__img--xl' },
  { label: 'Photoshop', src: '/assets/about/photoshop-bg.svg', className: 'about-logo__img--ps', overlay: '/assets/about/photoshop-ps.svg' },
  { label: 'Illustrator', src: '/assets/about/illustrator.svg', className: 'about-logo__img--illustrator' },
  { label: 'Premiere Pro', src: '/assets/about/premiere-pro.svg', className: 'about-logo__img--xl' },
  { label: 'VS Code', src: '/assets/about/vscode.svg', className: 'about-logo__img--claude' },
  { label: 'GitHub', src: '/assets/about/github.svg', className: 'about-logo__img--github' },
  { label: 'React', src: '/assets/about/react.svg', className: 'about-logo__img--wide' },
  { label: 'CSS', src: '/assets/about/css.svg', className: 'about-logo__img--css', itemClassName: 'about-logo--css' },
  { label: 'JavaScript', src: '/assets/about/javascript.svg', className: 'about-logo__img--xl' },
  { label: 'Antigravity', src: '/assets/about/antigravity.svg', className: 'about-logo__img--antigravity' },
  { label: 'Cursor', src: '/assets/about/cursor.svg', className: 'about-logo__img--lg' },
  { label: 'Vercel', src: '/assets/about/vercel.svg' },
  { label: 'Notion', src: '/assets/about/notion.svg', className: 'about-logo__img--notion' },
  { label: 'Excel', src: '/assets/about/excel.svg', className: 'about-logo__img--xl' },
  { label: 'PowerPoint', src: '/assets/about/powerpoint.svg', className: 'about-logo__img--xl' },
]
const detailSkillRows = [
  {
    category: 'PLANNING',
    color: '#ff7a1a',
    skills: ['Notion', 'Excel', 'PowerPoint'],
  },
  {
    category: 'AI',
    color: '#a98cff',
    skills: ['ChatGPT', 'Gemini', 'Claude', 'Perplexity', 'Midjourney', 'Higgsfield AI', 'NotebookLM'],
  },
  {
    category: 'DESIGN',
    color: '#6d9cff',
    skills: ['Figma', 'Framer', 'GSAP', 'Canva', 'Photoshop', 'Illustrator', 'Premiere Pro'],
  },
  {
    category: 'FRONTEND',
    color: '#37d985',
    skills: ['VS Code', 'GitHub', 'React', 'HTML/CSS', 'JavaScript', 'Antigravity', 'Cursor', 'Vercel'],
  },
]

const aiWorkflowSteps: AiWorkflowStep[] = [
  {
    number: '01',
    title: '와이어프레임 설계',
    tool: 'ChatGPT + Stitch',
    image: '/assets/ai-workflow/step-01-flow.png',
    description: 'ChatGPT와 Stitch를 활용해 서비스 흐름의 첫 뼈대를 설계합니다. 사용자 조사 결과를 바탕으로 핵심 MVP를 정의하고 구현 가능한 구조로 구체화합니다.',
    detail: {
      lead: [
        'ChatGPT와 Stitch를 활용해',
        '서비스 흐름의 첫 뼈대를 설계합니다.',
        '사용자 조사 결과를 바탕으로',
        '핵심 MVP를 정의하고',
        '구현 가능한 구조로 구체화합니다.',
      ],
      items: [],
      outro: '',
    },
  },
  {
    number: '02',
    title: '인터페이스 구현',
    tool: 'Figma AI',
    image: '/assets/ai-workflow/step-02-flow.png',
    description: 'Figma로 프로토타입을 구현하되 AI가 제안한 구조를 그대로 적용하지 않고 정보 우선순위 재정렬, CTA 위치 최적화, 탐색 흐름 간소화, 시각 계층 정리를 중심으로 화면을 구체화합니다.',
    detail: {
      lead: ['Figma로 프로토타입을 구현하되', 'AI가 제안한 구조를 그대로 적용하지 않고'],
      items: ['정보 우선순위 재정렬', 'CTA 위치 최적화', '탐색 흐름 간소화', '시각 계층 정리'],
      outro: '아래 항목을 중심으로 화면을 구체화합니다.',
      outroBeforeList: true,
    },
  },
  {
    number: '03',
    title: '캐릭터 제작',
    tool: 'ChatGPT + Midjourney',
    image: '/assets/ai-workflow/step-03-character-sheet.png',
    description: 'ChatGPT와 Midjourney를 활용해 다음과 같은 기준으로 마스코트 캐릭터를 생성합니다. 친근감과 신뢰감, 서비스 확장성, 브랜드 일관성, 시각적 차별성을 기준으로 정리합니다.',
    detail: {
      lead: ['ChatGPT와 Midjourney를 활용해', '다음과 같은 기준으로 마스코트 캐릭터를 생성합니다.'],
      items: ['친근감과 신뢰감', '서비스 확장성', '브랜드 일관성', '시각적 차별성'],
      outro: '',
    },
  },
  {
    number: '04',
    title: '개발 및 검증',
    tool: 'AI Coding',
    image: '/assets/ai-workflow/step-04-development.png',
    description: 'AI가 생성한 코드를 실제 서비스에 적용하되 반복적으로 검증하는 단계를 거쳐 기능 동작 테스트, 사용자 흐름 검증, 코드 재사용성, 반응형 및 접근성을 확인하고 유지보수 가능한 구조로 최종완성합니다.',
    detail: {
      lead: ['AI가 생성한 코드를 실제 서비스에 적용하되', '반복적으로 검증하는 단계를 거쳐'],
      items: ['기능 동작 테스트', '사용자 흐름 검증', '코드 재사용성', '반응형 및 접근성'],
      outro: '유지보수 가능한 구조로 최종완성합니다.',
      outroBeforeList: true,
    },
  },
  {
    number: '05',
    title: '실제 배포',
    tool: 'Vercel',
    image: '/assets/ai-workflow/step-05-deploy.png',
    description: 'Vercel을 활용해 실제 서비스 환경에 배포합니다. 배포 URL 연결, 빌드 상태 확인, 유지보수 지속, 사용 환경 테스트를 진행합니다.',
    detail: {
      lead: ['Vercel을 활용해', '실제 서비스 환경에 배포합니다.'],
      items: ['배포 URL 연결', '빌드 상태 확인', '유지보수 지속', '사용 환경 테스트'],
      outro: '',
    },
  },
]
const strengthTabs = [
  {
    key: 'visual',
    label: 'Visual',
    kicker: '01 / Visual Direction',
    title: 'Visual',
    description: [
      [
        { text: '사진을 전공', highlight: true },
        { text: '하며 익힌 구도와 시선, ' },
        { text: '디자인 업무 경험', highlight: true },
        { text: '은 ' },
      ],
      [{ text: '사용자의 흐름을 고려한 비주얼 설계에 강점이 되었습니다' }],
    ],
    image: '/assets/about/optimized/strength-visual-photo-optimized.webp',
    accent: '#ff5100',
  },
  {
    key: 'planning',
    label: 'Planning',
    kicker: '02 / Structure',
    title: 'Planning',
    description: [
      [
        { text: '계획적으로 정리하는 습관', highlight: true },
        { text: '은 ' },
      ],
      [{ text: '프로젝트의 기획과 구조를 잡는 과정에서 강점으로 작용했습니다' }],
    ],
    image: '/assets/about/optimized/strength-planning-optimized.webp',
    accent: '#57c7ff',
  },
  {
    key: 'tools',
    label: 'Tools',
    kicker: '03 / Expanding Range',
    title: 'Tools',
    description: [
      [
        { text: '새로운 툴에 대한 호기심과 추진력', highlight: true },
        { text: '은 ' },
      ],
      [{ text: '디자인을 넘어 프론트엔드까지 직접 구현해보는 원동력이 되었습니다' }],
    ],
    image: '/assets/about/optimized/strength-tools-optimized.webp',
    accent: '#b4ff52',
  },
  {
    key: 'people',
    label: 'People',
    kicker: '04 / Team Energy',
    title: 'People',
    description: [
      [
        { text: '팀원과의 ' },
        { text: '원활한 소통과 협업 능력', highlight: true },
        { text: '은 ' },
      ],
      [{ text: '프로젝트를 완성하는 중요한 강점 중 하나였습니다' }],
    ],
    image: '/assets/about/optimized/strength-people-optimized.webp',
    accent: '#ffcf4d',
  },
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
}
type Project = {
  badge: string
  title: string
  year?: string
  meta: { label: string; value: number; accent: boolean }[]
  overview: {
    title: string
    lines: string[]
    value?: number
  }[]
  description: string[]
  image: string
  imageAlt: string
  proposalUrl: string
  websiteUrl: string
  websiteDisabled?: boolean
}

const projects: Project[] = [
  {
    badge: 'Team Project',
    title: 'Gunit',
    year: '2026',
    meta: [
      { label: 'Planning', value: 20, accent: false },
      { label: 'Design', value: 30, accent: false },
      { label: 'Frontend', value: 50, accent: true },
    ],
    overview: [
      {
        title: '기여도',
        value: 35,
        lines: ['기획 · 개발 · 디자인'],
      },
      {
        title: '문제점',
        lines: ['입문자의 정보 탐색 장벽'],
      },
      {
        title: '개선안',
        lines: ['AI 챗봇과 초보자 가이드 제공'],
      },
    ],
    description: [
      '에어소프트 입문자의 정보 탐색 장벽을 낮추고, 팬덤형 커뮤니티를 통해',
      '지속적인 참여를 유도하는 AI 챗봇 기반 커뮤니티 앱 개발 팀 프로젝트',
    ],
    image: '/assets/work/gunit/cover.png',
    imageAlt: 'Gunit project visual',
    proposalUrl: '/assets/work/gunit/proposal.pdf',
    websiteUrl: 'https://airsoft-nine.vercel.app/',
  },
  {
    badge: 'Team Project',
    title: 'MMCA',
    year: '2026',
    meta: [
      { label: 'Planning', value: 20, accent: false },
      { label: 'Design', value: 70, accent: true },
      { label: 'Frontend', value: 10, accent: false },
    ],
    overview: [
      {
        title: '기여도',
        value: 40,
        lines: ['디자인 팀장'],
      },
      {
        title: '문제점',
        lines: ['복잡한 정보 구조'],
      },
      {
        title: '개선안',
        lines: ['IA 재정비 및 GNB 개선'],
      },
    ],
    description: [
      '국립현대미술관 웹사이트의 정보 구조를 개선하여',
      '해외 방문자가 정보를 직관적으로 탐색할 수 있도록 진행한 영문 웹사이트 리뉴얼 팀 프로젝트',
    ],
    image: '/assets/work/mmca/cover.png',
    imageAlt: 'MMCA project visual',
    proposalUrl: '/assets/work/mmca/proposal.pdf',
    websiteUrl: 'https://angbaebultti.github.io/mmca/',
  },
]

type ToolLogo = (typeof toolLogos)[number]
type DetailSkill = {
  label: string
  logo?: ToolLogo
}
type DetailSkillRow = (typeof detailSkillRows)[number]
type PastWorkCard = {
  label: string
  image?: string
}
type PastWorkShowcase = {
  title: string
  subtitle?: string
  cards: PastWorkCard[]
  variant?: 'portrait'
}

const pastWorkTopCards: PastWorkCard[] = [
  { label: 'Past work 01', image: '/assets/past-works/optimized/Group 1917.webp' },
  { label: 'Past work 02', image: '/assets/past-works/optimized/Group 1919.webp' },
  { label: 'Past work 03', image: '/assets/past-works/optimized/Group 1921.webp' },
  { label: 'Past work 04', image: '/assets/past-works/optimized/Group 1922.webp' },
  { label: 'Past work 05', image: '/assets/past-works/optimized/Group 1924.webp' },
  { label: 'Past work 06', image: '/assets/past-works/optimized/Group 1926.webp' },
  { label: 'Past work 07', image: '/assets/past-works/optimized/Group 1930.webp' },
  { label: 'Past work 08', image: '/assets/past-works/optimized/Group 1933.webp' },
]

const pastWorkTbsCards: PastWorkCard[] = [
  { label: 'TBS FM work 01', image: '/assets/past-works/optimized/tbs/tbs-01.webp' },
  { label: 'TBS FM work 02', image: '/assets/past-works/optimized/tbs/tbs-02.webp' },
  { label: 'TBS FM work 03', image: '/assets/past-works/optimized/tbs/tbs-03.webp' },
  { label: 'TBS FM work 04', image: '/assets/past-works/optimized/tbs/tbs-04.webp' },
  { label: 'TBS FM work 05', image: '/assets/past-works/optimized/tbs/tbs-05.webp' },
  { label: 'TBS FM work 06', image: '/assets/past-works/optimized/tbs/tbs-06.webp' },
  { label: 'TBS FM work 07', image: '/assets/past-works/optimized/tbs/tbs-07.webp' },
]

const pastWorkPhotographyCards: PastWorkCard[] = [
  { label: 'Photography work 01', image: '/assets/past-works/optimized/photography/photography-01.webp' },
  { label: 'Photography work 02', image: '/assets/past-works/optimized/photography/photography-02.webp' },
  { label: 'Photography work 03', image: '/assets/past-works/optimized/photography/photography-03.webp' },
  { label: 'Photography work 04', image: '/assets/past-works/optimized/photography/photography-04.webp' },
  { label: 'Photography work 05', image: '/assets/past-works/optimized/photography/photography-05.webp' },
  { label: 'Photography work 06', image: '/assets/past-works/optimized/photography/photography-06.webp' },
  { label: 'Photography work 07', image: '/assets/past-works/optimized/photography/photography-07.webp' },
  { label: 'Photography work 08', image: '/assets/past-works/optimized/photography/photography-08.webp' },
  { label: 'Photography work 09', image: '/assets/past-works/optimized/photography/photography-09.webp' },
  { label: 'Photography work 10', image: '/assets/past-works/optimized/photography/photography-10.webp' },
  { label: 'Photography work 11', image: '/assets/past-works/optimized/photography/photography-11.webp' },
]

const pastWorkShowcases: PastWorkShowcase[] = [
  {
    title: 'Graphic Design',
    subtitle: '2024-2025 · KOTRA',
    cards: pastWorkTopCards,
  },
  {
    title: 'Video',
    subtitle: '2021-2023 · TBS',
    cards: pastWorkTbsCards,
  },
  {
    title: 'Photography',
    subtitle: '2016-',
    cards: pastWorkPhotographyCards,
    variant: 'portrait',
  },
]

function WorkCardMeta({ project, revealIndex }: { project: Project; revealIndex: number }) {
  const metaRef = useRef<HTMLDivElement>(null)
  const metaInView = useWorkCardMetaInView(metaRef)
  const metaNodeIds: Record<string, string> = {
    Gunit: '40002018:3892',
    MMCA: '40002032:320',
  }

  return (
    <div
      ref={metaRef}
      className="work-card__meta"
      data-node-id={metaNodeIds[project.title]}
      data-work-reveal
      style={{ '--work-reveal-index': revealIndex } as CSSProperties}
    >
      {project.overview.map((item, metaIndex) => (
        <section className="work-card__meta-item" key={item.title}>
          <h4>{item.title}</h4>
          {typeof item.value === 'number' ? (
            <p className="work-card__meta-total">
              총 기여도{' '}
              <span>
                <CountUpNumber start={metaInView} to={item.value} delay={metaIndex * 0.12} duration={1.65} />%
              </span>
            </p>
          ) : null}
          {item.lines.map((line) => (
            <p key={`${item.title}-${line}`}>{line}</p>
          ))}
        </section>
      ))}
    </div>
  )
}

function WorkCardActions({ project, className = '' }: { project: Project; className?: string }) {
  return (
    <div className={`work-card__actions${className ? ` ${className}` : ''}`} aria-label={`${project.title} links`}>
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
      {project.websiteDisabled ? (
        <button
          className="is-primary is-disabled"
          type="button"
          disabled
          aria-label={`${project.title} project is not available yet`}
          data-work-reveal
          style={{ '--work-reveal-index': 5 } as CSSProperties}
        >
          <span>Project</span>
          <img src="/assets/icons/work-arrow.svg" alt="" aria-hidden="true" />
        </button>
      ) : (
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
      )}
    </div>
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

function SkillDetailIcon({ skill }: { skill: DetailSkill }) {
  if (skill.logo) {
    const logo = skill.logo

    return (
      <span className={`about-logo skills-detail__logo${logo.tone ? ` about-logo--${logo.tone}` : ''}${logo.itemClassName ? ` ${logo.itemClassName}` : ''}`}>
        {logo.full ? (
          <img className="about-logo__full" src={logo.src} alt="" loading="lazy" decoding="async" />
        ) : (
          <span className="about-logo__inner">
            <img className={`about-logo__img${logo.className ? ` ${logo.className}` : ''}`} src={logo.src} alt="" loading="lazy" decoding="async" />
            {logo.overlay ? <img className="about-logo__overlay" src={logo.overlay} alt="" loading="lazy" decoding="async" /> : null}
          </span>
        )}
      </span>
    )
  }

  return <span className="about-logo skills-detail__logo skills-detail__logo--empty" aria-hidden="true" />
}

function SkillsDetailSection({
  rows,
  isOpen,
  detailRef,
  hasPlayed,
}: {
  rows: DetailSkillRow[]
  isOpen: boolean
  detailRef: RefObject<HTMLDivElement | null>
  hasPlayed: boolean
}) {
  const skills = rows.map((row) => ({
    ...row,
    skills: row.skills.map((label) => ({
      label,
      logo: toolLogos.find((logo) => logo.label === label || (label === 'HTML/CSS' && logo.label === 'CSS')),
    })),
  }))

  return (
    <div ref={detailRef} className={`skills-detail${isOpen ? ' is-open' : ''}${hasPlayed ? ' has-played' : ''}`} id="skills-detail" aria-hidden={!isOpen}>
      <div className="skills-detail__panel">
        <h3>SKILLS</h3>
        <div className="skills-detail__rows">
          {skills.map((row, rowIndex) => (
            <div
              className={`skills-detail__row skills-detail__row--${row.category.toLowerCase()}`}
              key={row.category}
              style={{ '--skill-row-index': rowIndex } as CSSProperties}
            >
              <strong style={{ '--skill-color': row.color } as CSSProperties}>{row.category}</strong>
              <ul>
                {row.skills.map((skill, skillIndex) => (
                  <li key={skill.label} style={{ '--skill-item-index': skillIndex } as CSSProperties}>
                    <span className={skill.label === 'HTML/CSS' ? 'skills-detail__logo-offset' : undefined}>
                      <SkillDetailIcon skill={skill} />
                    </span>
                    <span>{skill.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AboutSection() {
  const introRef = useRef<HTMLDivElement>(null)
  const revealScopeRef = useRef<HTMLElement>(null)
  const skillsDetailRef = useRef<HTMLDivElement>(null)
  const skillsMarqueeRef = useRef<HTMLDivElement>(null)
  const skillsToggleRef = useRef<HTMLButtonElement>(null)
  const isSkillsOpenRef = useRef(false)
  const hasAutoOpenedSkillsRef = useRef(true)
  const shouldCenterSkillsPanelRef = useRef(false)
  const [isSkillsOpen, setIsSkillsOpen] = useState(false)
  const [hasSkillsPlayed, setHasSkillsPlayed] = useState(false)
  const logoGroups = [toolLogos.slice(0, 8), toolLogos.slice(8, 16), toolLogos.slice(16)]
  const marqueeGroups = [...logoGroups, ...logoGroups]
  const isNavigatingPastSkills = () => document.documentElement.classList.contains('is-anchor-scrolling') && window.location.hash !== '#skills'

  const centerSkillsToggle = () => {
    const toggleElement = skillsToggleRef.current

    if (!toggleElement) {
      return
    }

    const toggleRect = toggleElement.getBoundingClientRect()
    const targetTop = toggleRect.top + window.scrollY + toggleRect.height / 2 - window.innerHeight / 2

    window.scrollTo({
      top: Math.max(0, Math.round(targetTop)),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  useEffect(() => {
    isSkillsOpenRef.current = isSkillsOpen
  }, [isSkillsOpen])

  useEffect(() => {
    const openSkillsFromNav = () => {
      if (isSkillsOpenRef.current) {
        return
      }

      hasAutoOpenedSkillsRef.current = true
      shouldCenterSkillsPanelRef.current = true
      setIsSkillsOpen(true)
    }

    window.addEventListener('skills:open', openSkillsFromNav)

    return () => {
      window.removeEventListener('skills:open', openSkillsFromNav)
    }
  }, [])

  useEffect(() => {
    const toggleElement = skillsToggleRef.current

    if (!toggleElement) {
      return
    }

    let animationFrame = 0
    let autoOpenTimer = 0
    let hasQueuedAutoOpen = false

    const cancelPendingOpen = () => {
      window.clearTimeout(autoOpenTimer)
      autoOpenTimer = 0
      hasQueuedAutoOpen = false
    }

    const checkAutoOpen = () => {
      animationFrame = 0

      if (hasAutoOpenedSkillsRef.current || isSkillsOpenRef.current) {
        cancelPendingOpen()
        return
      }

      if (isNavigatingPastSkills()) {
        cancelPendingOpen()
        return
      }

      const rect = toggleElement.getBoundingClientRect()
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const toggleCenter = rect.top + rect.height / 2
      const viewportCenter = viewportHeight / 2
      const centerDistance = Math.abs(toggleCenter - viewportCenter)
      const isVisible = rect.bottom > 0 && rect.top < viewportHeight
      const isNearCenter = isVisible && centerDistance < Math.min(260, viewportHeight * 0.28)

      if (!isNearCenter || hasQueuedAutoOpen) {
        return
      }

      hasQueuedAutoOpen = true
      autoOpenTimer = window.setTimeout(() => {
        if (isNavigatingPastSkills()) {
          cancelPendingOpen()
          return
        }

        hasAutoOpenedSkillsRef.current = true
        shouldCenterSkillsPanelRef.current = true
        setIsSkillsOpen(true)
        autoOpenTimer = 0
      }, 380)
    }

    const requestCheck = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(checkAutoOpen)
      }
    }

    requestCheck()
    window.addEventListener('scroll', requestCheck, { passive: true })
    window.addEventListener('resize', requestCheck)

    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame)
      }

      cancelPendingOpen()
      window.removeEventListener('scroll', requestCheck)
      window.removeEventListener('resize', requestCheck)
    }
  }, [])

  useEffect(() => {
    if (!isSkillsOpen) {
      return
    }

    if (!shouldCenterSkillsPanelRef.current) {
      return
    }

    shouldCenterSkillsPanelRef.current = false
    document.documentElement.classList.add('is-skills-auto-positioning')

    const centerSkillsPanel = () => {
      if (isNavigatingPastSkills()) {
        return
      }

      const detailElement = skillsDetailRef.current
      const panelElement = detailElement?.querySelector<HTMLElement>('.skills-detail__panel')
      const marqueeElement = skillsMarqueeRef.current

      if (!detailElement || !panelElement) {
        return
      }

      const panelTop = detailElement.getBoundingClientRect().top + window.scrollY
      const panelHeight = panelElement.scrollHeight
      const centerTargetTop = panelTop + panelHeight / 2 - window.innerHeight / 2
      const marqueeClearTop = marqueeElement ? marqueeElement.getBoundingClientRect().bottom + window.scrollY + 16 : 0
      const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight
      const targetTop = Math.min(Math.max(centerTargetTop, marqueeClearTop, 0), Math.max(maxScrollTop, 0))

      window.scrollTo({
        top: targetTop,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      })
    }

    let settleFrame = 0
    let recenterTimer = 0
    let unlockTimer = 0
    const animationFrame = window.requestAnimationFrame(() => {
      settleFrame = window.requestAnimationFrame(() => {
        recenterTimer = window.setTimeout(centerSkillsPanel, 560)
        unlockTimer = window.setTimeout(() => document.documentElement.classList.remove('is-skills-auto-positioning'), 1300)
      })
    })

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.cancelAnimationFrame(settleFrame)
      window.clearTimeout(recenterTimer)
      window.clearTimeout(unlockTimer)
      document.documentElement.classList.remove('is-skills-auto-positioning')
    }
  }, [isSkillsOpen])

  useEffect(() => {
    if (!isSkillsOpen || hasSkillsPlayed) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setHasSkillsPlayed(true)
    }, 900)

    return () => window.clearTimeout(timeoutId)
  }, [hasSkillsPlayed, isSkillsOpen])

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
      { threshold: 0.08, rootMargin: '0px 0px 14% 0px' },
    )

    targets.forEach((target) => observer.observe(target))

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section ref={revealScopeRef} className={`about-section${isSkillsOpen ? ' is-skills-open' : ''}`} id="about" aria-labelledby="about-title">
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

        <div className="about-intro__copy">
          <div className="about-intro__identity" data-about-reveal>
            <strong>정영은</strong>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=yxungeun@gmail.com" target="_blank" rel="noreferrer">
              <span>yxungeun@gmail.com</span>
              <MailClickIcon />
            </a>
          </div>
          <div className="about-intro__text" data-about-reveal>
            <span className="about-intro__line" style={{ '--line-index': 0 } as CSSProperties}>
              기획·개발·디자인을 연결하며
            </span>
            <span className="about-intro__line" style={{ '--line-index': 1 } as CSSProperties}>
              AI로 빠르게 검증합니다
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

      <div ref={skillsMarqueeRef} className="about-logo-marquee" id="skills" aria-label="Tools and skills" data-about-reveal>
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

      <button
        ref={skillsToggleRef}
        className="skills-toggle"
        type="button"
        aria-expanded={isSkillsOpen}
        aria-controls="skills-detail"
        onClick={() => {
          const willClose = isSkillsOpen

          if (!willClose) {
            shouldCenterSkillsPanelRef.current = true
          }

          setIsSkillsOpen((current) => !current)

          if (willClose) {
            window.requestAnimationFrame(() => {
              window.requestAnimationFrame(centerSkillsToggle)
            })
          }
        }}
        data-about-reveal
      >
        <span className="skills-toggle__icon" aria-hidden="true">
          <img className="skills-toggle__glyph skills-toggle__glyph--plus" src="/assets/icons/skills-plus.svg" alt="" />
          <img className="skills-toggle__glyph skills-toggle__glyph--minus" src="/assets/icons/skills-minus.svg" alt="" />
        </span>
        View All Skills
      </button>

      <SkillsDetailSection rows={detailSkillRows} isOpen={isSkillsOpen} detailRef={skillsDetailRef} hasPlayed={hasSkillsPlayed} />
    </section>
  )
}

function AiWorkflowSection() {
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [isWorkflowVisible, setIsWorkflowVisible] = useState(false)
  const sectionRef = useRef<HTMLElement | null>(null)
  const timelineRef = useRef<HTMLDivElement | null>(null)
  const stepRefs = useRef<Array<HTMLElement | null>>([])
  const activeStepIndexRef = useRef(0)
  const activeStepStartedAtRef = useRef(0)
  const isStepScrollingRef = useRef(false)
  const stepScrollTimeoutRef = useRef<number | null>(null)
  const activeStep = aiWorkflowSteps[activeStepIndex] ?? aiWorkflowSteps[0]

  useEffect(() => {
    aiWorkflowSteps.forEach((step) => {
      if (!step.image) return

      const image = new Image()
      image.decoding = 'async'
      image.src = step.image
    })
  }, [])

  useEffect(() => {
    const section = sectionRef.current

    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.68) {
          setIsWorkflowVisible(true)
          observer.disconnect()
        }
      },
      { threshold: [0, 0.68], rootMargin: '0px' },
    )

    observer.observe(section)

    const fallbackTimer = window.setTimeout(() => {
      const rect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)
      const visibleRatio = visibleHeight / Math.min(rect.height, viewportHeight)

      if (visibleRatio >= 0.68) {
        setIsWorkflowVisible(true)
        observer.disconnect()
      }
    }, 700)

    return () => {
      observer.disconnect()
      window.clearTimeout(fallbackTimer)
    }
  }, [])

  useEffect(() => {
    activeStepIndexRef.current = activeStepIndex
    activeStepStartedAtRef.current = window.performance.now()
  }, [activeStepIndex])

  const syncActiveStep = (nextStepIndex: number) => {
    const currentStepIndex = activeStepIndexRef.current

    if (nextStepIndex === currentStepIndex) return

    activeStepIndexRef.current = nextStepIndex
    setActiveStepIndex(nextStepIndex)
  }

  const activateWorkflowStep = (nextStepIndex: number) => {
    const timeline = timelineRef.current
    const nextStep = stepRefs.current[nextStepIndex]

    syncActiveStep(nextStepIndex)

    if (!timeline || !nextStep) return

    const targetLeft =
      nextStepIndex === 0
        ? 0
        : nextStep.offsetLeft - Math.max((timeline.clientWidth - nextStep.clientWidth) / 2, 0)

    timeline.scrollTo({
      left: Math.max(0, Math.round(targetLeft)),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  const skipAiWorkflow = () => {
    document.getElementById('contact')?.scrollIntoView({
      block: 'start',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  useEffect(() => {
    const timeline = timelineRef.current

    if (!timeline) return

    let animationFrame = 0

    timeline.scrollTo({ left: 0, behavior: 'auto' })
    activeStepIndexRef.current = 0
    setActiveStepIndex(0)

    const syncStepFromHorizontalScroll = () => {
      animationFrame = 0

      const timelineRect = timeline.getBoundingClientRect()
      const timelineFocus = timeline.scrollLeft <= 8 ? Number.NEGATIVE_INFINITY : timelineRect.left + timelineRect.width * 0.38
      const nextStepIndex = stepRefs.current.reduce((nearestIndex, step, index) => {
        if (!step) return nearestIndex
        if (timeline.scrollLeft <= 8) return 0

        const stepRect = step.getBoundingClientRect()
        const currentDistance = Math.abs(stepRect.left + stepRect.width / 2 - timelineFocus)
        const nearestStep = stepRefs.current[nearestIndex]
        const nearestRect = nearestStep?.getBoundingClientRect()
        const nearestDistance = nearestRect ? Math.abs(nearestRect.left + nearestRect.width / 2 - timelineFocus) : Number.POSITIVE_INFINITY

        return currentDistance < nearestDistance ? index : nearestIndex
      }, 0)

      syncActiveStep(nextStepIndex)
    }

    const requestSync = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(syncStepFromHorizontalScroll)
      }
    }

    requestSync()
    timeline.addEventListener('scroll', requestSync, { passive: true })
    window.addEventListener('resize', requestSync)

    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame)
      }

      timeline.removeEventListener('scroll', requestSync)
      window.removeEventListener('resize', requestSync)
    }
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const timeline = timelineRef.current

    if (!section || !timeline) return
    const canUseDesktopStepScroll = window.matchMedia('(min-width: 1025px)').matches

    if (!canUseDesktopStepScroll) return

    const lastStepIndex = aiWorkflowSteps.length - 1
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTypingTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false

      return Boolean(target.closest('input, textarea, select, button, a, [contenteditable="true"]'))
    }
    const releaseStepScroll = () => {
      if (stepScrollTimeoutRef.current) {
        window.clearTimeout(stepScrollTimeoutRef.current)
      }

      stepScrollTimeoutRef.current = window.setTimeout(() => {
        isStepScrollingRef.current = false
      }, prefersReducedMotion ? 80 : 420)
    }
    const getSectionScrollState = () => {
      const rect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const pinTolerance = Math.min(28, viewportHeight * 0.028)
      const approachTop = viewportHeight * 0.72
      const approachBottom = viewportHeight * 0.28
      const isInZone =
        rect.top >= -viewportHeight * 0.08 &&
        rect.top <= viewportHeight * 0.34 &&
        rect.bottom >= viewportHeight * 0.62
      const isPinned = Math.abs(rect.top) <= pinTolerance
      const shouldSnapFromAbove = rect.top > pinTolerance && rect.top <= approachTop
      const shouldSnapFromBelow = rect.top < -pinTolerance && rect.bottom >= approachBottom

      return { isInZone, isPinned, shouldSnapFromAbove, shouldSnapFromBelow }
    }
    const pinSection = () => {
      isStepScrollingRef.current = true
      window.scrollTo({
        top: Math.round(section.getBoundingClientRect().top + window.scrollY),
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      })
      releaseStepScroll()
    }
    const canMoveStep = (direction: 1 | -1) => {
      const currentStepIndex = activeStepIndexRef.current
      const nextStepIndex = Math.min(Math.max(currentStepIndex + direction, 0), lastStepIndex)

      return nextStepIndex !== currentStepIndex
    }
    const scrollToAdjacentSection = (direction: 1 | -1) => {
      const pastWorksShowcases = Array.from(document.querySelectorAll<HTMLElement>('.past-works-showcase'))
      const previousTarget = pastWorksShowcases[pastWorksShowcases.length - 1] ?? document.getElementById('past-works')
      const nextTarget = document.getElementById('contact')
      const target = direction > 0 ? nextTarget : previousTarget

      if (!target) return

      isStepScrollingRef.current = true
      window.scrollTo({
        top: Math.round(target.getBoundingClientRect().top + window.scrollY),
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      })
      releaseStepScroll()
    }
    const moveStep = (direction: 1 | -1) => {
      const currentStepIndex = activeStepIndexRef.current
      const nextStepIndex = Math.min(Math.max(currentStepIndex + direction, 0), lastStepIndex)
      const nextStep = stepRefs.current[nextStepIndex]

      if (!nextStep || nextStepIndex === currentStepIndex) return

      const targetLeft =
        nextStepIndex === 0
          ? 0
          : nextStep.offsetLeft - Math.max((timeline.clientWidth - nextStep.clientWidth) / 2, 0)

      isStepScrollingRef.current = true
      syncActiveStep(nextStepIndex)
      timeline.scrollTo({
        left: Math.max(0, Math.round(targetLeft)),
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      })
      releaseStepScroll()
    }
    const handleWheel = (event: WheelEvent) => {
      const wheelDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY

      if (isTypingTarget(event.target) || Math.abs(wheelDelta) < 18) return

      const direction = wheelDelta > 0 ? 1 : -1
      const { isInZone, isPinned, shouldSnapFromAbove, shouldSnapFromBelow } = getSectionScrollState()
      const shouldSnapToSection = direction > 0 ? shouldSnapFromAbove : shouldSnapFromBelow

      if (!isInZone && !shouldSnapToSection) return

      event.preventDefault()

      if (isStepScrollingRef.current) return

      if (!isPinned || shouldSnapToSection) {
        pinSection()
        return
      }

      if (!canMoveStep(direction)) {
        scrollToAdjacentSection(direction)
        return
      }

      moveStep(direction)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      const nextKeys = ['ArrowDown', 'ArrowRight', 'PageDown', ' ']
      const previousKeys = ['ArrowUp', 'ArrowLeft', 'PageUp']
      const direction = nextKeys.includes(event.key) ? 1 : previousKeys.includes(event.key) ? -1 : null

      if (!direction) return

      const { isInZone, isPinned, shouldSnapFromAbove, shouldSnapFromBelow } = getSectionScrollState()
      const shouldSnapToSection = direction > 0 ? shouldSnapFromAbove : shouldSnapFromBelow

      if (isTypingTarget(event.target) || (!isInZone && !shouldSnapToSection)) return

      event.preventDefault()

      if (isStepScrollingRef.current) return

      if (!isPinned || shouldSnapToSection) {
        pinSection()
        return
      }

      if (!canMoveStep(direction)) {
        scrollToAdjacentSection(direction)
        return
      }

      moveStep(direction)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)

      if (stepScrollTimeoutRef.current) {
        window.clearTimeout(stepScrollTimeoutRef.current)
      }
    }
  }, [])

  return (
    <section
      className={`ai-workflow-section${isWorkflowVisible ? ' is-visible' : ''}`}
      id="ai-workflow"
      aria-labelledby="ai-workflow-title"
      ref={sectionRef}
    >
      <div className="ai-workflow-section__inner">
        <div className="ai-workflow-section__header" data-ai-workflow-reveal>
          <h2 id="ai-workflow-title">
            <SlotTitle text="AI WORKFLOW" />
          </h2>
          <strong>
            AI를 도구만이 아닌 <span className="ai-workflow-section__highlight">협업 파트너</span>로 활용해
            <br />
            더 효율적인 프로세스를 구축합니다
          </strong>
        </div>

        <div className="ai-workflow-scroll" aria-label="AI workflow steps">
          <aside className="ai-workflow-preview" aria-live="polite" data-ai-workflow-reveal>
            <div className="ai-workflow-preview__media">
              {activeStep.image ? (
                <img
                  className="ai-workflow-preview__image"
                  src={activeStep.image}
                  alt=""
                  loading="eager"
                  decoding="async"
                />
              ) : (
                <span className="ai-workflow-preview__placeholder" aria-hidden="true" />
              )}
            </div>
          </aside>

          <div className="ai-workflow-timeline" ref={timelineRef} data-ai-workflow-reveal>
            {aiWorkflowSteps.map((step, index) => (
              <article
                className={`ai-workflow-step${index === activeStepIndex ? ' is-active' : ''}`}
                data-step-index={index}
                key={step.number}
                role="button"
                tabIndex={0}
                aria-pressed={index === activeStepIndex}
                onClick={() => activateWorkflowStep(index)}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter' && event.key !== ' ') return

                  event.preventDefault()
                  activateWorkflowStep(index)
                }}
                ref={(node) => {
                  stepRefs.current[index] = node
                }}
              >
                <span className="ai-workflow-step__marker" aria-hidden="true" />
                <div className="ai-workflow-step__content">
                  {step.image ? (
                    <div className={`ai-workflow-step__image-frame ai-workflow-step__image-frame--${step.number}`}>
                      <img
                        className={`ai-workflow-step__image ai-workflow-step__image--${step.number}`}
                        src={step.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ) : null}
                  <span className="ai-workflow-step__eyebrow">STEP {index + 1}</span>
                  <div className="ai-workflow-step__heading">
                    <h3>{step.title}</h3>
                  </div>
                  {step.detail ? (
                    <div
                      className={`ai-workflow-step__description ai-workflow-step__description--structured${step.detail.outroBeforeList ? ' ai-workflow-step__description--outro-first' : ''}`}
                    >
                      <div className="ai-workflow-step__copy">
                        {step.detail.lead.map((line) => (
                          <p key={`${step.number}-${line}`}>{line}</p>
                        ))}
                        {step.detail.outro && step.detail.outroBeforeList ? <p>{step.detail.outro}</p> : null}
                      </div>
                      {step.detail.items.length ? (
                        <ul
                          className={`ai-workflow-step__check-list${step.detail.items.length === 4 ? ' ai-workflow-step__check-list--columns' : ''}`}
                          aria-label={`${step.title} 개선 항목`}
                        >
                          {step.detail.items.map((item) => (
                            <li key={`${step.number}-${item}`}>
                              <span className="ai-workflow-step__check-icon" aria-hidden="true" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {step.detail.outro && !step.detail.outroBeforeList ? <p className="ai-workflow-step__outro">{step.detail.outro}</p> : null}
                    </div>
                  ) : (
                    <p>{step.description}</p>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="ai-workflow-progress" aria-label="AI workflow carousel progress" data-ai-workflow-reveal>
            {aiWorkflowSteps.map((step, index) => (
              <button
                className={`ai-workflow-progress__dot${index === activeStepIndex ? ' is-active' : ''}`}
                type="button"
                key={`workflow-progress-${step.number}`}
                aria-label={`Go to step ${index + 1}`}
                aria-current={index === activeStepIndex ? 'step' : undefined}
                onClick={() => activateWorkflowStep(index)}
              />
            ))}
          </div>
        </div>

        <button className="ai-workflow-skip" type="button" onClick={skipAiWorkflow}>
          SKIP
        </button>
      </div>
    </section>
  )
}

function PastWorksCarousel({ showcase, index: showcaseIndex }: { showcase: PastWorkShowcase; index: number }) {
  const cardAngle = 360 / showcase.cards.length
  const cardDepth = 620
  const rotationValue = useMotionValue(0)
  const accumulatedDrag = useRef(0)
  const rotationDirection = showcase.title === 'Video' ? 360 : showcaseIndex % 2 === 0 ? 360 : -360

  useEffect(() => {
    const animation = animate(rotationValue, rotationDirection, {
      duration: 32,
      repeat: Infinity,
      ease: 'linear',
    })

    return () => animation.stop()
  }, [rotationValue, rotationDirection, showcaseIndex])

  const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    accumulatedDrag.current -= info.delta.x * 0.18
    rotationValue.set(accumulatedDrag.current)
  }

  return (
    <div className={`past-works-showcase${showcase.variant ? ` past-works-showcase--${showcase.variant}` : ''}`}>
      <div className="past-works-showcase__title">
        <h3>{showcase.title}</h3>
        {showcase.subtitle ? <p>{showcase.subtitle}</p> : null}
      </div>

      <div className="past-works-carousel" aria-label={`${showcase.title} past works carousel`}>
        <motion.div
          className="past-works-carousel__track"
          style={{ rotateY: rotationValue }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          dragMomentum={false}
          onDrag={handleDrag}
        >
          {showcase.cards.map((card, cardIndex) => (
            <article
              className="past-work-card"
              aria-label={card.label}
              key={`${showcase.title}-${card.label}-${cardIndex}`}
              style={{
                '--card-rotation': `${cardAngle * cardIndex}deg`,
                '--card-depth': `var(--past-card-depth, ${cardDepth}px)`,
              } as CSSProperties}
            >
              {card.image ? <img className="past-work-card__image" src={encodeURI(card.image)} alt="" loading="lazy" decoding="async" /> : null}
            </article>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

function PastWorksSection() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section ref={sectionRef} className="past-works-section" id="past-works" aria-labelledby="past-works-title">
      <div className="past-works-section__header">
        <h2 id="past-works-title">
          <SlotTitle text="PAST WORKS" />
        </h2>
      </div>

      <div className="past-works-showcases">
        {pastWorkShowcases.map((showcase, index) => (
          <PastWorksCarousel showcase={showcase} index={index} key={showcase.title} />
        ))}
      </div>
    </section>
  )
}

function StrengthSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isStrengthVisible, setIsStrengthVisible] = useState(false)
  const [hasStrengthIntroPlayed, setHasStrengthIntroPlayed] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const activeStrength = strengthTabs[activeTab]
  const activeTabRef = useRef(activeTab)

  useEffect(() => {
    activeTabRef.current = activeTab
  }, [activeTab])

  useEffect(() => {
    strengthTabs.forEach((tab) => {
      const image = new Image()
      image.decoding = 'async'
      image.src = tab.image
    })
  }, [])

  useEffect(() => {
    if (!isStrengthVisible || hasStrengthIntroPlayed) {
      return
    }

    const timer = window.setTimeout(() => {
      setHasStrengthIntroPlayed(true)
    }, 1900)

    return () => {
      window.clearTimeout(timer)
    }
  }, [hasStrengthIntroPlayed, isStrengthVisible])

  useEffect(() => {
    const section = sectionRef.current

    if (!section) {
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const frame = window.requestAnimationFrame(() => setIsStrengthVisible(true))

      return () => {
        window.cancelAnimationFrame(frame)
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsStrengthVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.92 },
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const section = sectionRef.current

    if (!section) {
      return
    }

    let wheelLocked = false
    let wheelTimer = 0
    let alignLocked = false
    let alignTimer = 0
    let exitLocked = false
    let exitTimer = 0

    const getSectionTop = () => Math.round(section.getBoundingClientRect().top + window.scrollY)
    const getDocumentTop = (target: HTMLElement) => Math.round(target.getBoundingClientRect().top + window.scrollY)

    const isSectionVisible = () => {
      const rect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight

      return rect.top < viewportHeight && rect.bottom > 0
    }

    const isContactActive = () => {
      const contact = document.getElementById('contact')

      if (!contact) {
        return false
      }

      const rect = contact.getBoundingClientRect()
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight

      return rect.top <= viewportHeight * 0.45 && rect.bottom >= viewportHeight * 0.25
    }

    const canCaptureSectionWheel = (direction: 1 | -1) => {
      const rect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight

      if (direction < 0 && rect.bottom < viewportHeight * 0.72) {
        return false
      }

      if (direction > 0 && rect.top > viewportHeight * 0.28) {
        return false
      }

      return true
    }

    const isSectionFramed = () => {
      const rect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight

      return Math.abs(rect.top) <= 2 && Math.abs(rect.bottom - viewportHeight) <= 2
    }

    const alignSection = () => {
      if (alignLocked) {
        return
      }

      alignLocked = true
      window.scrollTo({
        top: getSectionTop(),
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      })
      window.clearTimeout(alignTimer)
      alignTimer = window.setTimeout(() => {
        alignLocked = false
      }, 620)
    }

    const scrollToAdjacentSection = (direction: 1 | -1) => {
      if (exitLocked) {
        return
      }

      const pastWorksShowcases = Array.from(document.querySelectorAll<HTMLElement>('.past-works-showcase'))
      const previousTarget = window.matchMedia('(max-width: 1024px)').matches
        ? pastWorksShowcases[pastWorksShowcases.length - 1] ?? document.getElementById('past-works')
        : document.getElementById('ai-workflow')
      const target = direction > 0 ? document.getElementById('contact') : previousTarget

      if (!target) {
        return
      }

      exitLocked = true
      window.scrollTo({
        top: getDocumentTop(target),
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      })
      window.clearTimeout(exitTimer)
      exitTimer = window.setTimeout(() => {
        exitLocked = false
      }, 720)
    }

    const moveTab = (direction: 1 | -1) => {
      const current = activeTabRef.current
      const next = Math.min(Math.max(current + direction, 0), strengthTabs.length - 1)

      if (next === current) {
        return false
      }

      activeTabRef.current = next
      setActiveTab(next)
      return true
    }

    const handleWheel = (event: WheelEvent) => {
      if (isContactActive() || !isSectionVisible() || Math.abs(event.deltaY) < 4) {
        return
      }

      const direction = event.deltaY > 0 ? 1 : -1

      if (!canCaptureSectionWheel(direction)) {
        return
      }

      const current = activeTabRef.current
      const isLeavingSection = (direction < 0 && current === 0) || (direction > 0 && current === strengthTabs.length - 1)

      if (!isSectionFramed()) {
        if (isLeavingSection) {
          event.preventDefault()
          scrollToAdjacentSection(direction)
          return
        }

        event.preventDefault()
        alignSection()
        return
      }

      if (isLeavingSection) {
        event.preventDefault()
        scrollToAdjacentSection(direction)
        return
      }

      event.preventDefault()

      if (wheelLocked) {
        return
      }

      if (moveTab(direction)) {
        wheelLocked = true
        window.clearTimeout(wheelTimer)
        wheelTimer = window.setTimeout(() => {
          wheelLocked = false
        }, 360)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isContactActive() || !isSectionVisible()) {
        return
      }

      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
        return
      }

      const direction = event.key === 'ArrowDown' ? 1 : -1
      const current = activeTabRef.current
      const isLeavingSection = (direction < 0 && current === 0) || (direction > 0 && current === strengthTabs.length - 1)

      if (!isSectionFramed()) {
        event.preventDefault()
        if (isLeavingSection) {
          scrollToAdjacentSection(direction)
          return
        }

        alignSection()
        return
      }

      if (isLeavingSection) {
        event.preventDefault()
        scrollToAdjacentSection(direction)
        return
      }

      event.preventDefault()
      moveTab(direction)
    }

    const wheelOptions: AddEventListenerOptions = { passive: false, capture: true }

    window.addEventListener('wheel', handleWheel, wheelOptions)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('wheel', handleWheel, wheelOptions)
      window.removeEventListener('keydown', handleKeyDown)
      window.clearTimeout(wheelTimer)
      window.clearTimeout(alignTimer)
      window.clearTimeout(exitTimer)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="strength"
      className={`strength-section${isStrengthVisible ? ' is-visible' : ''}${hasStrengthIntroPlayed ? ' has-intro-played' : ''}`}
      aria-labelledby="strength-title"
    >
      <div className="strength-section__inner">
        <div className="strength-section__headline">
          <h2 id="strength-title">
            <SlotTitle text="STRENGTH" />
          </h2>
        </div>

        <article className="strength-showcase" style={{ '--strength-accent': activeStrength.accent } as CSSProperties}>
          <div
            id="strength-panel"
            className="strength-showcase__media"
            role="tabpanel"
            aria-labelledby={`strength-tab-${activeStrength.key}`}
            aria-live="polite"
          >
            <div className={`strength-showcase__image strength-showcase__image--${activeStrength.key}`} key={activeStrength.key}>
              <img src={activeStrength.image} alt="" loading="lazy" decoding="async" />
            </div>
            <div className="strength-showcase__copy" key={`${activeStrength.key}-copy`}>
              <p>
                {activeStrength.description.map((line, lineIndex) => (
                  <span className="strength-showcase__line" key={lineIndex}>
                    {line.map((part) => (
                      <span className={part.highlight ? 'strength-showcase__highlight' : undefined} key={part.text}>
                        {part.text}
                      </span>
                    ))}
                  </span>
                ))}
              </p>
            </div>
          </div>

          <div className="strength-tabs" role="tablist" aria-label="My strength categories">
            {strengthTabs.map((tab, index) => {
              const isActive = index === activeTab

              return (
                <button
                  className={`strength-tabs__item${isActive ? ' is-active' : ''}`}
                  id={`strength-tab-${tab.key}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="strength-panel"
                  onClick={() => setActiveTab(index)}
                  key={tab.key}
                >
                  <span>{tab.label}</span>
                  <i aria-hidden="true" />
                </button>
              )
            })}
          </div>
        </article>
      </div>
    </section>
  )
}

function ContactSection() {
  const contactRef = useRef<HTMLElement>(null)
  const contactVisibleRef = useRef(false)

  useEffect(() => {
    const section = contactRef.current

    if (!section) {
      return
    }

    const targets = Array.from(section.querySelectorAll<HTMLElement>('[data-contact-reveal]'))

    if (!targets.length) {
      return
    }

    let animationFrame = 0
    const syncContactState = (isVisible: boolean) => {
      document.documentElement.classList.toggle('is-contact-active', isVisible)
      section.classList.toggle('is-contact-visible', isVisible)

      contactVisibleRef.current = isVisible
    }

    const syncContactStateFromScroll = () => {
      const rect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const isContactActive = rect.top <= viewportHeight * 0.45 && rect.bottom >= viewportHeight * 0.25

      syncContactState(isContactActive)
      animationFrame = 0
    }

    const requestContactStateSync = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(syncContactStateFromScroll)
      }
    }

    syncContactStateFromScroll()
    window.addEventListener('scroll', requestContactStateSync, { passive: true })
    window.addEventListener('resize', requestContactStateSync)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach((target) => target.classList.add('is-visible'))
      return () => {
        window.removeEventListener('scroll', requestContactStateSync)
        window.removeEventListener('resize', requestContactStateSync)
        if (animationFrame) {
          window.cancelAnimationFrame(animationFrame)
        }
        contactVisibleRef.current = false
        syncContactState(false)
      }
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
      window.removeEventListener('scroll', requestContactStateSync)
      window.removeEventListener('resize', requestContactStateSync)
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame)
      }
      observer.disconnect()
      contactVisibleRef.current = false
      syncContactState(false)
    }
  }, [])

  return (
    <section ref={contactRef} className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="contact-section__shader" aria-hidden="true">
        <ShaderGradientCanvas pixelDensity={1} fov={45} style={{ width: '100%', height: '100%' }}>
          <ContactShaderGradient
            animate="on"
            axesHelper="off"
            brightness={1.2}
            cAzimuthAngle={180}
            cDistance={3.6}
            cPolarAngle={90}
            cameraZoom={1}
            color1="#ff5005"
            color2="#dbba95"
            color3="#d0bce1"
            destination="onCanvas"
            embedMode="off"
            envPreset="city"
            format="gif"
            fov={45}
            frameRate={10}
            gizmoHelper="hide"
            grain="on"
            lightType="3d"
            pixelDensity={1}
            positionX={-1.4}
            positionY={0}
            positionZ={0}
            range="disabled"
            rangeEnd={40}
            rangeStart={0}
            reflection={0.1}
            rotationX={0}
            rotationY={10}
            rotationZ={50}
            shader="defaults"
            type="plane"
            uAmplitude={1}
            uDensity={1.3}
            uFrequency={5.5}
            uSpeed={0.4}
            uStrength={4}
            uTime={0}
            wireframe={false}
          />
        </ShaderGradientCanvas>
      </div>
      <div className="contact-section__header">
        <h2 id="contact-title">
          <SlotTitle text="CONTACT" />
        </h2>
      </div>

      <div className="contact-section__content">
        <div className="contact-info">
          <p data-contact-reveal>Email Address</p>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=yxungeun@gmail.com"
            target="_blank"
            rel="noreferrer"
            data-contact-reveal
          >
            <span>yxungeun@gmail.com</span>
            <MailClickIcon />
          </a>
        </div>
      </div>
    </section>
  )
}

function HireToast({ onDismiss }: { onDismiss: () => void }) {
  return (
    <aside className="hire-toast" aria-label="Hiring availability notice">
      <div className="hire-toast__profile" aria-hidden="true">
        <span className="hire-toast__profile-image">
          <img src="/assets/about/hire-profile-toast.png" alt="" width={160} height={160} decoding="async" />
        </span>
      </div>
      <strong>영은 님 채용 가능</strong>
      <a href="https://mail.google.com/mail/?view=cm&fs=1&to=yxungeun@gmail.com" target="_blank" rel="noreferrer">
        이메일 보내기
      </a>
      <button className="hire-toast__close" type="button" aria-label="채용 가능 팝업 닫기" onClick={onDismiss}>
        ×
      </button>
    </aside>
  )
}

function App() {
  const heroRef = useRef<HTMLElement>(null)
  const lensRef = useRef<HTMLImageElement>(null)
  const workRevealRef = useRef<HTMLDivElement>(null)
  const navPointerHandledRef = useRef(false)
  const hasHireToastTriggeredRef = useRef(false)
  const isHireToastDismissedRef = useRef(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [isTopButtonVisible, setIsTopButtonVisible] = useState(false)
  const [isContactButtonHidden, setIsContactButtonHidden] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isHireToastVisible, setIsHireToastVisible] = useState(false)

  const scrollToHash = (hash: string, behavior: ScrollBehavior = 'smooth') => {
    const target = document.querySelector<HTMLElement>(hash)

    if (!target) {
      return
    }

    document.documentElement.classList.add('is-anchor-scrolling')
    setIsHeaderVisible(true)

    const targetTop = Math.round(target.getBoundingClientRect().top + window.scrollY)

    window.scrollTo({
      top: targetTop,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : behavior,
    })
    window.history.pushState(null, '', hash)

    if (hash === '#skills') {
      window.dispatchEvent(new Event('skills:open'))
    }

    window.setTimeout(() => document.documentElement.classList.remove('is-anchor-scrolling'), behavior === 'smooth' ? 900 : 120)
  }

  const handleNavClick = (event: ReactMouseEvent<HTMLAnchorElement>, hash: string) => {
    event.preventDefault()
    event.stopPropagation()

    if (navPointerHandledRef.current) {
      navPointerHandledRef.current = false
      return
    }

    scrollToHash(hash)
  }

  const handleNavPointerDown = (event: ReactPointerEvent<HTMLAnchorElement>, hash: string) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    navPointerHandledRef.current = true
    scrollToHash(hash)
  }

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    if (!window.location.hash) {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }

    return () => {
      window.history.scrollRestoration = previousScrollRestoration
    }
  }, [])

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
      scrollToHash(hash)
    }

    document.addEventListener('click', handleAnchorClick)

    return () => {
      document.removeEventListener('click', handleAnchorClick)
    }
  }, [])

  useEffect(() => {
    let previousScrollY = window.scrollY
    let animationFrame = 0

    const syncHireToast = () => {
      animationFrame = 0

      if (hasHireToastTriggeredRef.current || isHireToastDismissedRef.current) {
        previousScrollY = window.scrollY
        return
      }

      const workSection = document.getElementById('work')
      const skillsDetail = document.getElementById('skills-detail')
      const aboutSection = document.getElementById('about')

      if (!workSection) {
        previousScrollY = window.scrollY
        return
      }

      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const workTop = workSection.getBoundingClientRect().top + window.scrollY
      const skillsBottom = skillsDetail
        ? skillsDetail.getBoundingClientRect().bottom + window.scrollY
        : aboutSection
          ? aboutSection.getBoundingClientRect().bottom + window.scrollY
          : workTop - viewportHeight * 0.6
      const triggerTop = skillsBottom + Math.max((workTop - skillsBottom) * 0.48, viewportHeight * 0.12)
      const previousViewportPoint = previousScrollY + viewportHeight * 0.45
      const currentViewportPoint = window.scrollY + viewportHeight * 0.45

      if (previousViewportPoint < triggerTop && currentViewportPoint >= triggerTop) {
        hasHireToastTriggeredRef.current = true
        setIsHireToastVisible(true)
      }

      previousScrollY = window.scrollY
    }

    const requestSync = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(syncHireToast)
      }
    }

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
      const contactSection = document.getElementById('contact')
      const contactRect = contactSection?.getBoundingClientRect()
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const isContactActive = contactRect ? contactRect.top <= viewportHeight * 0.45 && contactRect.bottom >= viewportHeight * 0.25 : false

      setScrollProgress(nextProgress)
      setIsTopButtonVisible(scrollTop >= workStart)
      setIsContactButtonHidden(isContactActive)
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

  const handleTitlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - bounds.left
    const y = event.clientY - bounds.top

    event.currentTarget.style.setProperty('--title-x', `${x}px`)
    event.currentTarget.style.setProperty('--title-y', `${y}px`)
  }

  return (
    <>
      <main className="portfolio-home" aria-label="Youngeun Jeong portfolio home">
        {isHireToastVisible ? (
          <HireToast
            onDismiss={() => {
              isHireToastDismissedRef.current = true
              setIsHireToastVisible(false)
            }}
          />
        ) : null}

        <header className={`site-header${isHeaderVisible ? '' : ' site-header--hidden'}`}>
          <a
            className="site-header__brand"
            href="#top"
            aria-label="Youngeun Jeong home"
            onPointerDown={(event) => handleNavPointerDown(event, '#top')}
            onClick={(event) => handleNavClick(event, '#top')}
          >
            YOUNGEUN JEONG
          </a>

          <nav className="site-header__nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a
                key={item.label}
                className={item.hideOnMobile ? 'site-header__nav-link site-header__nav-link--hide-mobile' : 'site-header__nav-link'}
                href={item.hash}
                onPointerDown={(event) => handleNavPointerDown(event, item.hash)}
                onClick={(event) => handleNavClick(event, item.hash)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            className={`site-header__contact-link${isContactButtonHidden ? ' site-header__contact-link--hidden' : ''}`}
            href="#contact"
            aria-hidden={isContactButtonHidden}
            tabIndex={isContactButtonHidden ? -1 : undefined}
            onPointerDown={(event) => handleNavPointerDown(event, '#contact')}
            onClick={(event) => handleNavClick(event, '#contact')}
          >
            CONTACT
          </a>

          <HamburgerMenu items={navItems.filter((item) => item.hash !== '#ai-workflow')} onNavigate={scrollToHash} />
        </header>

        <button
          className={`floating-top${isTopButtonVisible ? ' is-visible' : ''}`}
          type="button"
          aria-label="Back to top"
          aria-hidden={!isTopButtonVisible}
          tabIndex={isTopButtonVisible ? 0 : -1}
          style={{ '--scroll-progress': scrollProgress } as CSSProperties}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
          }}
        >
          <svg className="floating-top__progress" viewBox="0 0 48 48" aria-hidden="true">
            <circle className="floating-top__track" cx="24" cy="24" r="21" />
            <circle className="floating-top__bar" cx="24" cy="24" r="21" />
          </svg>
          <span className="floating-top__arrow">↑</span>
        </button>

        <section ref={heroRef} className="hero hero--hidden" id="top" aria-hidden="true">
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

          <a className="scroll-cue" href="#work" aria-label="Scroll down to project">
            <span>SCROLL&nbsp;&nbsp;DOWN</span>
            <img src="/assets/icons/arrow_down.svg" alt="" aria-hidden="true" />
          </a>
        </section>

        <AboutSection />

        <section className="work-section" id="work" aria-labelledby="work-title">
          <div className="work-section__header">
            <h2 id="work-title">
              <SlotTitle text="PROJECT" />
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
                        <div className="work-card__title-wrapper" data-work-reveal style={{ '--work-reveal-index': 1 } as CSSProperties}>
                          <h3>{project.title}</h3>
                          {project.year && <span className="work-card__year">{project.year}</span>}
                        </div>
                        <p
                          className="work-card__description"
                          data-work-reveal
                          style={{ '--work-reveal-index': 2 } as CSSProperties}
                        >
                          {(projectDescriptions[project.title] ?? project.description).join(' ')}
                        </p>
                        <WorkCardMeta project={project} revealIndex={3} />
                      </div>

                      <WorkCardActions project={project} />
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

        <PastWorksSection />

        <AiWorkflowSection />

        {false ? <StrengthSection /> : null}

        <ContactSection />
      </main>
    </>
  )
}

export default App
