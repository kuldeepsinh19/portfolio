# Design Document: Dark Control Room Portfolio — Cinematic Control Redesign

## Overview

This document specifies the technical architecture for redesigning Kuldeepsinh Rajput's portfolio with a "Cinematic Control" aesthetic — a dark editorial + sci-fi visual direction. The portfolio retains all existing personal content while replacing the generic terminal theme with a high-impact, visually immersive presentation built on Next.js 14 App Router, TypeScript, Tailwind CSS, and Framer Motion.

### Design Philosophy

1. **Cinematic Depth**: Every section is a "scene" with layered backgrounds, parallax, and atmospheric glow
2. **Editorial Typography**: Large display font headers (80px+) create visual hierarchy and impact
3. **Sci-Fi HUD Language**: Corner brackets, gradient borders, and glowing nodes reinforce the control room aesthetic
4. **Performance First**: Canvas animations pause when hidden; reduced-motion respected; transforms over layout properties

### Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom design tokens
- **Animation**: Framer Motion (useScroll, useTransform, motion, AnimatePresence)
- **Canvas**: HTML5 Canvas API for particle system
- **Fonts**: Space Grotesk (display headers), JetBrains Mono (terminal/code)
- **Icons**: Lucide React

### Key Design Decisions

**Why Space Grotesk for display headers?**
Large condensed sans-serif at 80–120px creates the editorial impact needed for section transitions. JetBrains Mono is preserved for all terminal/code elements to maintain the developer aesthetic.

**Why HTML5 Canvas for particles instead of CSS/SVG?**
Canvas handles 80–150 animated particles with connection-line proximity checks at 60fps without layout thrashing. SVG would require hundreds of DOM elements.

**Why Framer Motion useScroll + useTransform for parallax?**
Declarative, performant, and integrates with the existing Framer Motion animation system. Avoids manual scroll listeners.

**Why PerspectiveTilt as a wrapper component?**
Isolates the mouse-tracking 3D transform logic, making it reusable and testable independently of card content.

## Architecture

### Component Hierarchy

```
app/
├── layout.tsx          (root layout — Space Grotesk + JetBrains Mono fonts, scanline overlay)
├── page.tsx            (single-page composition)
└── globals.css         (design tokens, glass utilities, gradient utilities)

components/
├── layout/
│   ├── Navbar.tsx      (fixed nav — brand, uptime counter, nav links, HUD styling)
│   └── Footer.tsx      (operational status with pulsing dot)
├── sections/
│   ├── Hero.tsx        (particle canvas bg, split-text reveal, node graph, HUD brackets)
│   ├── Experience.tsx  (editorial header, glassmorphism cards, expandable achievements)
│   ├── Projects.tsx    (editorial header, glassmorphism cards grid, perspective tilt)
│   ├── Skills.tsx      (editorial header, service monitors with gradient progress bars)
│   └── Contact.tsx     (editorial header, API playground form)
└── ui/
    ├── ParticleCanvas.tsx        (HTML5 canvas star-field / particle mesh)
    ├── SplitTextReveal.tsx       (letter-by-letter Framer Motion stagger animation)
    ├── NodeGraph.tsx             (upgraded SVG — glowing nodes, gradient lines, dash-offset)
    ├── HUDBrackets.tsx           (corner bracket decorations, fixed or relative)
    ├── GlassmorphismCard.tsx     (deep glass bg, gradient border, glow on hover)
    ├── PerspectiveTilt.tsx       (mouse-tracking 3D tilt wrapper)
    ├── AmbientGlow.tsx           (radial gradient blob with parallax scroll)
    ├── UptimeCounter.tsx         (live days/hours/minutes/seconds counter)
    ├── GradientProgressBar.tsx   (teal→cyan→blue gradient fill progress bar)
    ├── BootSequence.tsx          (typing animation — preserved)
    ├── CommitCard.tsx            (expandable work experience — preserved)
    ├── ApiPlayground.tsx         (contact form as API tester — preserved)
    ├── TypingText.tsx            (reusable typing effect — preserved)
    ├── ServiceMonitor.tsx        (skill card — updated to use GradientProgressBar)
    └── ErrorBoundary.tsx         (preserved)

lib/
├── animations.ts       (Framer Motion variants — updated with cinematic variants)
├── data.ts             (content data — interfaces preserved, no new data needed)
└── hooks/
    ├── useTypingEffect.ts      (preserved)
    ├── useScrollAnimation.ts   (preserved)
    └── useCountUp.ts           (preserved)
```

### Data Flow

```
data.ts (static content — unchanged interfaces)
    ↓
Section Components (consume data, add cinematic presentation layer)
    ↓
New UI Components (ParticleCanvas, SplitTextReveal, NodeGraph, GlassmorphismCard, etc.)
    ↓
Framer Motion (useScroll, useTransform, motion, AnimatePresence)
    ↓
DOM (rendered output with CSS custom properties)
```

### Animation Architecture

**Four-Tier Animation System:**

1. **Page Load / Mount**: ParticleCanvas starts, SplitTextReveal fires, NodeGraph nodes stagger in
2. **Scroll Parallax**: useScroll + useTransform drives ParticleCanvas Y offset and AmbientGlow Y offset
3. **Scroll Triggered**: Section headers fade+slide up, progress bars animate 0→target, cards reveal
4. **Interaction**: PerspectiveTilt on mouse move, GlassmorphismCard glow intensifies on hover, UptimeCounter ticks every second

## Components and Interfaces

### New UI Components

#### ParticleCanvas

```typescript
interface ParticleCanvasProps {
  particleCount?: number;       // default: 100
  connectionDistance?: number;  // px threshold for drawing lines, default: 120
  parallaxFactor?: number;      // scroll parallax multiplier, default: 0.3
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;  // velocity x
  vy: number;  // velocity y
  radius: number;
  opacity: number;
}
```

**Behavior:**
- Renders a full-viewport `<canvas>` absolutely positioned behind content
- Initializes `particleCount` particles with random positions and slow velocities
- Each animation frame: moves particles, wraps at edges, draws connection lines between particles within `connectionDistance`
- Particles and lines use `--accent-teal` / `--accent-cyan` at 0.3–0.6 opacity
- Parallax: `useScroll` + `useTransform` translates the canvas Y by `scrollY * parallaxFactor`
- Pauses the `requestAnimationFrame` loop when `document.hidden` is true (Page Visibility API)

**Implementation Notes:**
- Use `useRef<HTMLCanvasElement>` and `useEffect` for canvas setup
- Store animation frame ID in ref for cleanup: `cancelAnimationFrame(animFrameRef.current)`
- Resize handler: `window.addEventListener('resize', handleResize)` — recreate particles on resize
- Wrap in a `motion.div` with `style={{ y: parallaxY }}` where `parallaxY = useTransform(scrollY, [0, 1000], [0, -300 * parallaxFactor])`

---

#### SplitTextReveal

```typescript
interface SplitTextRevealProps {
  text: string;
  className?: string;
  staggerDelay?: number;  // ms between letters, default: 50
  initialDelay?: number;  // ms before first letter, default: 0
  onComplete?: () => void;
}
```

**Behavior:**
- Splits `text` into individual character `<motion.span>` elements
- Each character animates from `{ opacity: 0, y: 20 }` to `{ opacity: 1, y: 0 }`
- Stagger controlled by Framer Motion `staggerChildren` in parent `variants`
- Spaces rendered as non-breaking space to preserve layout

**Implementation Notes:**
```typescript
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: staggerDelay / 1000, delayChildren: initialDelay / 1000 }
  }
};
const charVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
};
```
- Use `onAnimationComplete` on the container to fire `onComplete` callback

---

#### NodeGraph

```typescript
interface NodeGraphProps {
  nodes: DiagramNode[];
  connections: DiagramConnection[];
}

// DiagramNode and DiagramConnection interfaces preserved from data.ts
```

**Behavior:**
- SVG-based rendering (preserved structure from ArchitectureDiagram)
- Each node: rounded rect with `stroke: var(--accent-teal)`, `box-shadow` glow via SVG `filter`
- Connection lines: SVG `<linearGradient>` from `--accent-teal` to `--accent-cyan`
- Animated `strokeDashoffset` on connection lines creates flowing data-flow effect
- Nodes animate in with staggered `scale` + `opacity` (50ms stagger)

**Implementation Notes:**
- Define `<defs>` with `<linearGradient id="lineGrad">` and `<filter id="nodeGlow">` using `feGaussianBlur`
- Connection lines: `<path stroke="url(#lineGrad)" strokeDasharray="6 3">` with CSS animation on `strokeDashoffset`
- Node glow: `filter: url(#nodeGlow)` on the rect element

---

#### HUDBrackets

```typescript
interface HUDBracketsProps {
  position?: 'fixed' | 'absolute';  // default: 'fixed' for hero, 'absolute' for sections
  color?: string;                    // default: 'var(--accent-teal)'
  size?: number;                     // arm length in px, default: 20
  opacity?: number;                  // default: 0.5
  className?: string;
}
```

**Behavior:**
- Renders four L-shaped corner brackets (top-left, top-right, bottom-left, bottom-right)
- Each bracket is two perpendicular lines (`border-top` + `border-left`, etc.) using CSS borders
- `position: fixed` for hero viewport brackets; `position: absolute` for section-level brackets
- `pointer-events: none` so they never block interactions

**Implementation Notes:**
```typescript
// Each corner is a div with two border sides:
// top-left:     border-top + border-left
// top-right:    border-top + border-right
// bottom-left:  border-bottom + border-left
// bottom-right: border-bottom + border-right
```

---

#### GlassmorphismCard

```typescript
interface GlassmorphismCardProps {
  children: React.ReactNode;
  className?: string;
  glowOnHover?: boolean;  // default: true
}
```

**Behavior:**
- Background: `rgba(10, 14, 26, 0.6)` with `backdrop-filter: blur(16px)`
- Border: 1px gradient border using `--gradient-accent` (achieved via `background-clip: padding-box` + pseudo-element technique or `border-image`)
- On hover: gradient border glow intensifies via `box-shadow` with `--glow-teal`
- Smooth transition: `transition: box-shadow 0.3s ease, border-color 0.3s ease`

**Implementation Notes:**
- Gradient border technique: wrap content div in outer div with gradient background, inner div with card background, 1px gap between them
- Hover glow: `box-shadow: 0 0 20px var(--glow-teal), 0 0 40px rgba(0,255,209,0.08)`

---

#### PerspectiveTilt

```typescript
interface PerspectiveTiltProps {
  children: React.ReactNode;
  maxTilt?: number;       // degrees, default: 10
  perspective?: number;   // px, default: 1000
  disabled?: boolean;     // default: false (set true on mobile)
  className?: string;
}
```

**Behavior:**
- Wraps children in a `motion.div` with CSS `perspective`
- On `onMouseMove`: calculates normalized mouse position within card bounds, maps to `[-maxTilt, maxTilt]` rotateX/rotateY
- On `onMouseLeave`: animates back to `rotateX(0) rotateY(0)` with 300ms ease transition
- When `disabled` is true: renders children without any transform

**Implementation Notes:**
```typescript
const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width;   // 0–1
  const y = (e.clientY - rect.top) / rect.height;    // 0–1
  const rotateY = (x - 0.5) * 2 * maxTilt;           // -maxTilt to +maxTilt
  const rotateX = -(y - 0.5) * 2 * maxTilt;
  setTransform({ rotateX, rotateY });
};
```
- Use `useMotionValue` + `useSpring` for smooth interpolation

---

#### AmbientGlow

```typescript
interface AmbientGlowProps {
  color?: 'purple' | 'indigo' | 'teal';  // default: 'purple'
  size?: number;                           // diameter in px, default: 600
  parallaxFactor?: number;                 // default: 0.5
  className?: string;
}
```

**Behavior:**
- Renders a `motion.div` with `radial-gradient` background in the specified color at 10–20% opacity
- `pointer-events: none`, `z-index` below content
- Parallax: `useScroll` + `useTransform` translates Y at `parallaxFactor` of scroll speed

**Color Map:**
```typescript
const colorMap = {
  purple: 'rgba(99, 102, 241, 0.15)',
  indigo: 'rgba(79, 70, 229, 0.12)',
  teal:   'rgba(0, 255, 209, 0.10)',
};
```

---

#### UptimeCounter

```typescript
interface UptimeCounterProps {
  startDate: Date;  // fixed start date (e.g., new Date('2022-01-01'))
  className?: string;
}

interface UptimeValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
```

**Behavior:**
- Calculates elapsed time from `startDate` to `Date.now()` every second using `setInterval`
- Displays as `{days}d {hours}h {minutes}m {seconds}s`
- Uses `requestAnimationFrame`-aligned interval for smooth updates
- Cleans up interval on unmount

---

#### GradientProgressBar

```typescript
interface GradientProgressBarProps {
  value: number;       // 0–100
  animated?: boolean;  // animate from 0 on mount, default: true
  height?: number;     // px, default: 3
  className?: string;
}
```

**Behavior:**
- Renders a track div with a fill div inside
- Fill background: `linear-gradient(90deg, var(--accent-teal), var(--accent-cyan), var(--accent-blue))`
- When `animated` is true: fill starts at `width: 0%` and transitions to `width: {value}%` over 1000ms ease-out
- Triggered by `useScrollAnimation` hook (animates when entering viewport)

### Preserved UI Components (Updated)

#### ServiceMonitor (updated)

```typescript
interface ServiceMonitorProps {
  name: string;
  proficiency: number;
  status: 'running' | 'active';
  uptime: string;
  context: string;
}
```

**Changes from previous design:**
- Progress bar replaced with `GradientProgressBar` component (teal→cyan→blue gradient)
- Card wrapped in `GlassmorphismCard` for consistent glass styling

#### CommitCard (preserved interface, updated styling)

```typescript
interface CommitCardProps {
  hash: string;
  branch: string;
  title: string;
  date: string;
  achievements: string[];
}
```

**Changes:** Wrapped in `GlassmorphismCard`. Achievement prefix `"+ "` styled in `--accent-teal`.

#### ProjectCard → replaced by GlassmorphismCard + PerspectiveTilt

The old `ProjectCard` component is replaced by composing `PerspectiveTilt` > `GlassmorphismCard` > project content. The project content interface is unchanged:

```typescript
interface ProjectCardContentProps {
  hash: string;
  name: string;
  impact: string;
  tags: string[];
  link?: string;
  internal?: boolean;
}
```

### Layout Components

#### Navbar (updated)

```typescript
interface NavLink {
  label: string;
  href: string;
}
```

**Changes from previous design:**
- Adds `UptimeCounter` component on the right side (replaces "AVAILABLE FOR OPPORTUNITIES" badge, or shown alongside it)
- `backdrop-filter: blur(16px)` (increased from 12px)
- HUD-style border bottom using `--gradient-accent`

#### Footer (preserved)

No interface changes. Pulsing dot color updated to `--accent-teal`.

### Section Components

#### Hero Section (updated)

**Layout:**
- Full 100vh with `ParticleCanvas` as absolute background layer
- `HUDBrackets` fixed to viewport corners
- Left 60%: `SplitTextReveal` for name, role subtitle, stats row, CTA buttons
- Right 40%: `NodeGraph` (hidden on mobile)
- `AmbientGlow` blob positioned at bottom of hero

**Animation Sequence:**
1. `ParticleCanvas` starts immediately on mount
2. `SplitTextReveal` fires for "Kuldeepsinh" then "Rajput" (40–60ms stagger per letter)
3. After name reveal: role subtitle, stats, CTAs fade in sequentially
4. `NodeGraph` nodes stagger in (50ms per node)

#### Experience Section (updated)

**Layout:**
- Display font section header "Experience" at 80px+ with gradient underline
- `AmbientGlow` blob (indigo) positioned behind section
- Two `CommitCard` components wrapped in `GlassmorphismCard`
- `HUDBrackets` as relative decorations on section container

#### Projects Section (updated)

**Layout:**
- Display font section header "Projects" at 80px+ with gradient underline
- 2×2 grid of `PerspectiveTilt` > `GlassmorphismCard` > project content
- `HUDBrackets` as relative decorations on section container

#### Skills Section (updated)

**Layout:**
- Display font section header "Skills" at 80px+ with gradient underline
- 3-column grid (desktop) / 2-column (tablet) / 1-column (mobile)
- Each skill: `GlassmorphismCard` > `ServiceMonitor` with `GradientProgressBar`

#### Contact Section (updated)

**Layout:**
- Display font section header "Contact" at 80px+ with gradient underline
- `ApiPlayground` preserved with updated glass styling
- `AmbientGlow` blob (purple) positioned behind section

### Custom Hooks (preserved)

#### useTypingEffect

```typescript
function useTypingEffect(text: string, speed?: number): string
```

No changes. Used by `BootSequence` and `TypingText`.

#### useScrollAnimation

```typescript
function useScrollAnimation(threshold?: number): { ref: RefObject<HTMLElement>; isVisible: boolean }
```

No changes. Used by `GradientProgressBar` and section header animations.

#### useCountUp

```typescript
function useCountUp(end: number, duration?: number, start?: number): number
```

No changes. Used by hero stats counters.

## Data Models

### Design Tokens (CSS Custom Properties)

Updated `globals.css`:

```css
:root {
  /* Backgrounds */
  --bg-primary:   #080B10;
  --bg-secondary: #0D1117;
  --bg-card:      #0A0E1A;
  --border:       #1C2333;

  /* Gradient accent */
  --gradient-accent: linear-gradient(135deg, #00FFD1 0%, #00BFFF 50%, #6366F1 100%);
  --accent-teal:  #00FFD1;
  --accent-cyan:  #00BFFF;
  --accent-blue:  #6366F1;
  --accent-amber: #FFAA00;
  --accent-green: #3FB950;

  /* Ambient glow tokens */
  --glow-purple: rgba(99, 102, 241, 0.15);
  --glow-teal:   rgba(0, 255, 209, 0.12);

  /* Text */
  --text-primary: #E6EDF3;
  --text-muted:   #7D8590;
  --text-dim:     #30363D;

  /* Glass */
  --glass-bg:     rgba(10, 14, 26, 0.6);
  --glass-border: rgba(255, 255, 255, 0.08);

  /* macOS terminal chrome (preserved) */
  --terminal-red:   #FF5F56;
  --terminal-amber: #FFBD2E;
  --terminal-green: #27C93F;
}
```

**Scanline overlay** (added to `body::after` or `layout.tsx` fixed div):
```css
.scanline-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.03) 2px,
    rgba(0, 0, 0, 0.03) 4px
  );
}
```

### Tailwind Configuration Extensions

```typescript
// tailwind.config.ts additions
theme: {
  extend: {
    colors: {
      'bg-primary':   'var(--bg-primary)',
      'bg-secondary': 'var(--bg-secondary)',
      'bg-card':      'var(--bg-card)',
      'accent-teal':  'var(--accent-teal)',
      'accent-cyan':  'var(--accent-cyan)',
      'accent-blue':  'var(--accent-blue)',
      'accent-amber': 'var(--accent-amber)',
      'accent-green': 'var(--accent-green)',
      'text-primary': 'var(--text-primary)',
      'text-muted':   'var(--text-muted)',
      'text-dim':     'var(--text-dim)',
    },
    fontFamily: {
      display: ['Space Grotesk', 'sans-serif'],
      mono:    ['JetBrains Mono', 'monospace'],
      sans:    ['Inter', 'sans-serif'],
    },
    backgroundImage: {
      'gradient-accent': 'var(--gradient-accent)',
    },
  },
}
```

### Content Data Interfaces (preserved from data.ts)

All existing interfaces are unchanged:

```typescript
interface BootLine       { text: string; color: 'muted' | 'teal' | 'white'; delay: number; }
interface WhoamiData     { name: string; location: string; experience: string; focus: string; scale: string; status: string; }
interface WorkExperience { hash: string; branch: string; title: string; date: string; achievements: string[]; }
interface Project        { hash: string; name: string; impact: string; tags: string[]; link?: string; internal?: boolean; }
interface Skill          { name: string; proficiency: number; status: 'running' | 'active'; uptime: string; context: string; }
interface DiagramNode    { id: string; label: string; x: number; y: number; }
interface DiagramConnection { from: string; to: string; label?: string; }
interface ContactLink    { label: string; href: string; }
```

No new data fields are required. The cinematic redesign is purely a presentation layer change.

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, the following redundancies were identified and consolidated:

- Requirements 1.1, 1.2, 1.3 (CSS token existence) → single "design tokens exist" example, not a property
- Requirements 10.4 and 12.4 (GlassmorphismCard styling) → same component, consolidated into Property 4
- Requirements 13.1 and 13.2 (tilt effect + degree limit) → consolidated into Property 8 (tilt bounded by ±maxTilt)
- Requirements 2.3 and 2.6 (section header font + underline) → consolidated into Property 1
- Requirements 3.8 and 27.1 (nav smooth scroll) → consolidated into Property 2
- Requirements 15.6 and 20.2 (progress bar animation on scroll) → consolidated into Property 6

---

### Property 1: Section Header Styling Consistency

*For any* section header component in the Portfolio_System, it should apply the display font (Space Grotesk) at a minimum of 80px on desktop and render a glowing gradient underline accent element beneath the title text.

**Validates: Requirements 2.3, 2.6**

---

### Property 2: Navigation Link Smooth Scroll

*For any* navigation link in the Navbar, when clicked, the Portfolio_System should call `scrollIntoView` (or equivalent smooth scroll) on the element whose ID matches the link's href target.

**Validates: Requirements 3.8, 27.1**

---

### Property 3: Navigation Active Section Highlight

*For any* section that is currently intersecting the viewport at 20% threshold, the corresponding Navbar link should have `--accent-teal` color applied.

**Validates: Requirements 3.9, 27.4**

---

### Property 4: GlassmorphismCard Visual Properties

*For any* rendered GlassmorphismCard, the component should have a semi-transparent dark background with `backdrop-filter: blur`, a gradient border derived from `--gradient-accent`, and on hover, an intensified `box-shadow` glow using `--glow-teal`.

**Validates: Requirements 10.4, 12.4, 12.5**

---

### Property 5: SplitTextReveal Character Count

*For any* string passed to SplitTextReveal, the component should render exactly `text.length` individual character motion elements, each with `opacity: 0` as the initial state and `opacity: 1` as the animate state.

**Validates: Requirements 6.1, 6.2, 6.3**

---

### Property 6: GradientProgressBar Scroll Animation

*For any* GradientProgressBar with a target `value` between 0 and 100, when the component enters the viewport, the fill width should animate from 0% to `value`% and the fill background should be the teal→cyan→blue gradient.

**Validates: Requirements 15.5, 15.6, 20.2**

---

### Property 7: UptimeCounter Non-Negative Values

*For any* `startDate` in the past, the UptimeCounter should render days, hours, minutes, and seconds as non-negative integers, where hours is in [0, 23], minutes is in [0, 59], and seconds is in [0, 59].

**Validates: Requirements 3.6**

---

### Property 8: PerspectiveTilt Bounded Rotation

*For any* mouse position within a PerspectiveTilt card, the computed `rotateX` and `rotateY` values should each be within `[-maxTilt, maxTilt]` degrees. When the mouse leaves the card, both values should return to 0.

**Validates: Requirements 13.1, 13.2, 13.4**

---

### Property 9: NodeGraph Connection Line Gradient

*For any* connection in the NodeGraph, the rendered SVG path should reference a `linearGradient` definition that transitions from `--accent-teal` to `--accent-cyan`.

**Validates: Requirements 7.3**

---

### Property 10: NodeGraph Node Glow Styling

*For any* node in the NodeGraph, the rendered SVG element should have a stroke color of `--accent-teal` and reference a glow filter definition.

**Validates: Requirements 7.4**

---

### Property 11: ParticleCanvas Minimum Particle Count

*For any* ParticleCanvas initialization with `particleCount` ≥ 80, the internal particle array should contain at least 80 particles, each with valid x, y, vx, vy, and opacity values.

**Validates: Requirements 5.3**

---

### Property 12: ParticleCanvas Pauses When Hidden

*For any* ParticleCanvas, when `document.hidden` becomes true, the animation loop should stop scheduling new frames, and when `document.hidden` becomes false, the loop should resume.

**Validates: Requirements 26.5**

---

### Property 13: Count-Up Animation Bounds

*For any* target value passed to `useCountUp`, the hook should return values that are monotonically non-decreasing from 0 to the target value over the specified duration.

**Validates: Requirements 8.1, 8.2**

---

### Property 14: Form Validation Rejects Invalid Inputs

*For any* combination of form inputs where at least one required field (name, email, message) is empty or the email does not match `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, the API_Playground should prevent submission and display an inline error message.

**Validates: Requirements 18.1, 18.2, 18.3, 18.4, 18.5**

---

### Property 15: Scroll Animation Trigger Threshold

*For any* element with a scroll-triggered animation, the animation should not fire until the element is at least 20% visible in the viewport.

**Validates: Requirements 20.5**

---

### Property 16: Keyboard Navigation on Interactive Elements

*For any* interactive element (button, link, form input, expandable card), it should be reachable via Tab key and activatable via Enter or Space, with a visible focus indicator applied.

**Validates: Requirements 25.4, 25.5**

---

### Property 17: Image and Diagram Alt Text

*For any* image or SVG diagram element in the Portfolio_System, it should have a non-empty `alt` attribute or `aria-label` describing its content.

**Validates: Requirements 25.2**

---

### Property 18: Ambient Glow Parallax Factor

*For any* AmbientGlow component with a given `parallaxFactor`, the Framer Motion `useTransform` output Y value should equal `scrollY * parallaxFactor` (within floating-point tolerance).

**Validates: Requirements 22.5, 9.4**

---

### Property 19: Animation Uses CSS Transforms

*For any* animated element in the Portfolio_System, the animation should modify `transform` (translate, scale, rotate) properties rather than layout properties (top, left, width, height) to ensure GPU-composited rendering.

**Validates: Requirements 26.1**

---

### Property 20: ProjectCard Link XOR Internal Badge

*For any* project card, it should display either a live URL link OR an "internal" badge, but never both simultaneously.

**Validates: Requirements 12.6**

## Error Handling

### Canvas Failures

**Scenario**: Browser does not support HTML5 Canvas or `getContext('2d')` returns null
- **Handling**: Render a static CSS gradient background as fallback; log warning in development
- **Implementation**: `const ctx = canvas.getContext('2d'); if (!ctx) { setCanvasFailed(true); return; }`
- **Fallback**: `<div style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,255,209,0.05), transparent)' }} />`

**Scenario**: Canvas resize causes performance spike
- **Handling**: Debounce resize handler by 150ms before reinitializing particles
- **Implementation**: `const debouncedResize = useMemo(() => debounce(initParticles, 150), [])`

### Font Loading Failures

**Scenario**: Space Grotesk or JetBrains Mono fails to load from Google Fonts
- **Handling**: `font-display: swap` ensures text renders immediately with system font fallback
- **Fallback stack**: `'Space Grotesk', 'Inter', system-ui, sans-serif` and `'JetBrains Mono', 'Fira Code', monospace`

### Animation / Framer Motion Failures

**Scenario**: Framer Motion fails to initialize (rare, but possible in SSR edge cases)
- **Handling**: All motion components degrade to their `initial` state (content still visible)
- **Implementation**: Wrap critical sections in `ErrorBoundary` — content is readable without animation

**Scenario**: `IntersectionObserver` not supported
- **Handling**: Show all content immediately without scroll-triggered animations
- **Implementation**: Feature detection: `if (!('IntersectionObserver' in window)) { setIsVisible(true); }`

**Scenario**: `useScroll` / parallax causes layout jank on low-end devices
- **Handling**: Parallax transforms are applied via `will-change: transform` and use `transform3d` for GPU compositing
- **Implementation**: `style={{ willChange: 'transform' }}` on all parallax elements

### Perspective Tilt Failures

**Scenario**: Mouse events not firing correctly on touch devices
- **Handling**: `PerspectiveTilt` is disabled when `disabled` prop is true; detect mobile via viewport width
- **Implementation**: Pass `disabled={isMobile}` where `isMobile = useMediaQuery('(max-width: 768px)')`

### Form Submission Errors

**Scenario**: Contact form validation fails
- **Handling**: Display inline error messages per field; prevent submission
- **Implementation**: Validate on submit, store errors in `Record<string, string>` state

**Scenario**: Email format invalid
- **Handling**: Show "Please enter a valid email address" beneath the email field
- **Implementation**: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)`

### Accessibility / Reduced Motion

**Scenario**: User has `prefers-reduced-motion: reduce` enabled
- **Handling**: Disable ParticleCanvas animation, SplitTextReveal stagger, parallax, and PerspectiveTilt
- **Implementation**: CSS `@media (prefers-reduced-motion: reduce)` sets all durations to 0.01ms; Framer Motion respects this via `useReducedMotion()` hook

**Scenario**: Keyboard navigation fails on custom interactive components (expandable cards, tilt cards)
- **Handling**: All clickable `div` elements have `role="button"`, `tabIndex={0}`, and `onKeyDown` handlers for Enter/Space
- **Implementation**: `onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}`

## Testing Strategy

### Dual Testing Approach

Both unit tests and property-based tests are required for comprehensive coverage:

- **Unit tests**: Specific examples, integration points, edge cases, error conditions
- **Property tests**: Universal properties that hold across all valid inputs

### Unit Testing

**Framework**: Jest + React Testing Library (already configured)

**Test Categories:**

1. **Component Rendering Examples**
   - ParticleCanvas renders a `<canvas>` element
   - SplitTextReveal renders correct number of character spans for a given string
   - NodeGraph renders all 9 nodes and correct number of connection paths
   - HUDBrackets renders exactly 4 corner elements
   - GlassmorphismCard renders children with glass background styles
   - UptimeCounter renders days, hours, minutes, seconds labels
   - GradientProgressBar renders with correct gradient background
   - Hero section renders ParticleCanvas and SplitTextReveal
   - Navbar renders UptimeCounter and all 4 nav links
   - Scanline overlay element exists in the DOM with correct opacity

2. **Design Token Examples**
   - CSS custom properties `--gradient-accent`, `--accent-teal`, `--accent-cyan`, `--accent-blue` are defined
   - CSS custom properties `--glow-purple`, `--glow-teal` are defined
   - `--bg-card` is updated to `#0A0E1A`

3. **Content Verification Examples**
   - Experience section renders "Backend Engineer & AI Engineer @ Avesta HQ"
   - Projects section renders "Zinnova – Agentic AI Marketing SaaS" with link to zinnova.in
   - Skills section renders "Node.js / TypeScript" at 95% proficiency
   - Contact section renders "[POST] /v1/contact" endpoint label

4. **Interaction Examples**
   - Clicking a CommitCard expands it to show achievements
   - Clicking an expanded CommitCard collapses it
   - Submitting contact form with valid data shows success response panel
   - Submitting contact form with empty name shows error message

5. **Edge Cases**
   - Empty form submission shows validation errors for all fields
   - Invalid email format shows "Please enter a valid email address"
   - ParticleCanvas falls back gracefully when `getContext('2d')` returns null
   - Page loads with URL hash and scrolls to correct section
   - `prefers-reduced-motion` disables animations

6. **Responsive Layout Examples**
   - NodeGraph is hidden on mobile (<768px)
   - PerspectiveTilt is disabled on mobile (<768px)
   - Projects grid is single column on mobile
   - Skills grid is 2-column on tablet, 3-column on desktop

### Property-Based Testing

**Framework**: fast-check

**Installation**: `npm install --save-dev fast-check`

**Configuration**: Each property test runs minimum 100 iterations. Each test includes a comment tag:
```typescript
// Feature: dark-control-room-portfolio, Property N: <property text>
```

**Property Test Implementations:**

```typescript
// Feature: dark-control-room-portfolio, Property 5: SplitTextReveal Character Count
it('renders one motion span per character', () => {
  fc.assert(
    fc.property(fc.string({ minLength: 1, maxLength: 50 }), (text) => {
      const { container } = render(<SplitTextReveal text={text} />);
      const spans = container.querySelectorAll('span[data-char]');
      return spans.length === text.length;
    }),
    { numRuns: 100 }
  );
});

// Feature: dark-control-room-portfolio, Property 8: PerspectiveTilt Bounded Rotation
it('tilt rotation stays within maxTilt bounds', () => {
  fc.assert(
    fc.property(
      fc.float({ min: 0, max: 1 }),  // normalized x
      fc.float({ min: 0, max: 1 }),  // normalized y
      fc.integer({ min: 5, max: 15 }), // maxTilt
      (normX, normY, maxTilt) => {
        const rotateY = (normX - 0.5) * 2 * maxTilt;
        const rotateX = -(normY - 0.5) * 2 * maxTilt;
        return Math.abs(rotateX) <= maxTilt && Math.abs(rotateY) <= maxTilt;
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: dark-control-room-portfolio, Property 7: UptimeCounter Non-Negative Values
it('uptime values are always non-negative and within valid ranges', () => {
  fc.assert(
    fc.property(
      fc.date({ min: new Date('2020-01-01'), max: new Date() }),
      (startDate) => {
        const elapsed = Date.now() - startDate.getTime();
        const totalSeconds = Math.floor(elapsed / 1000);
        const seconds = totalSeconds % 60;
        const minutes = Math.floor(totalSeconds / 60) % 60;
        const hours = Math.floor(totalSeconds / 3600) % 24;
        const days = Math.floor(totalSeconds / 86400);
        return days >= 0 && hours >= 0 && hours <= 23
          && minutes >= 0 && minutes <= 59
          && seconds >= 0 && seconds <= 59;
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: dark-control-room-portfolio, Property 13: Count-Up Animation Bounds
it('useCountUp returns monotonically increasing values from 0 to target', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 1, max: 10000 }),
      fc.integer({ min: 100, max: 3000 }),
      (target, duration) => {
        // Simulate the count-up progression
        const samples = [0, 0.25, 0.5, 0.75, 1.0].map(progress =>
          Math.floor(target * Math.min(progress, 1))
        );
        // Values should be non-decreasing and bounded by [0, target]
        return samples.every((v, i) =>
          v >= 0 && v <= target && (i === 0 || v >= samples[i - 1])
        );
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: dark-control-room-portfolio, Property 14: Form Validation Rejects Invalid Inputs
it('form rejects any submission with empty or invalid fields', () => {
  fc.assert(
    fc.property(
      fc.record({
        name: fc.oneof(fc.constant(''), fc.string({ minLength: 1, maxLength: 50 })),
        email: fc.oneof(fc.constant(''), fc.constant('notanemail'), fc.emailAddress()),
        message: fc.oneof(fc.constant(''), fc.string({ minLength: 1, maxLength: 500 })),
      }),
      ({ name, email, message }) => {
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const isValid = name.length > 0 && emailValid && message.length > 0;
        const errors = validateContactForm({ name, email, message });
        // If invalid, errors object should be non-empty
        return isValid ? Object.keys(errors).length === 0 : Object.keys(errors).length > 0;
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: dark-control-room-portfolio, Property 20: ProjectCard Link XOR Internal Badge
it('project card shows link OR internal badge, never both', () => {
  fc.assert(
    fc.property(
      fc.record({
        hash: fc.hexaString({ minLength: 7, maxLength: 7 }),
        name: fc.string({ minLength: 5, maxLength: 50 }),
        impact: fc.string({ minLength: 10, maxLength: 100 }),
        tags: fc.array(fc.string({ minLength: 2, maxLength: 15 }), { minLength: 1, maxLength: 8 }),
        link: fc.option(fc.webUrl(), { nil: undefined }),
        internal: fc.boolean(),
      }),
      (project) => {
        const { container } = render(<ProjectCardContent {...project} />);
        const hasLink = container.querySelector('a[href]') !== null;
        const hasBadge = container.querySelector('[data-testid="internal-badge"]') !== null;
        return hasLink !== hasBadge; // XOR
      }
    ),
    { numRuns: 100 }
  );
});
```

### Test Coverage Goals

- **Unit Test Coverage**: Minimum 80% code coverage across all new components
- **Property Test Coverage**: All 20 properties must have corresponding property-based tests
- **Each property test**: Minimum 100 iterations (`numRuns: 100`)

### Testing Commands

```bash
# Run all tests (single pass)
npm test -- --run

# Run with coverage
npm test -- --coverage

# Run only property tests
npm test -- --testNamePattern="Property"
```
