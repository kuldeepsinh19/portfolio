# Implementation Plan: Dark Control Room Portfolio — Cinematic Control Redesign

## Overview

Redesign the existing portfolio's visual layer with a cinematic dark editorial + sci-fi aesthetic. All personal content is preserved; only the presentation layer changes. New components are created from scratch, existing components are updated in-place.

## Tasks

- [ ] 1. Update design tokens and global styles
  - [ ] 1.1 Update globals.css with new design tokens
    - Add --gradient-accent, --accent-cyan, --accent-blue, --glow-purple, --glow-teal CSS custom properties
    - Update --bg-card to #0A0E1A
    - Add --glass-bg (rgba(10,14,26,0.6)) and --glass-border (rgba(255,255,255,0.08)) tokens
    - Add .scanline-overlay utility class with repeating-linear-gradient at 0.03 opacity
    - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.2_

  - [ ] 1.2 Update tailwind.config.ts with new tokens and display font
    - Add accent-cyan, accent-blue, glow-purple, glow-teal color tokens
    - Add `display` font family entry for Space Grotesk
    - Add gradient-accent backgroundImage entry
    - _Requirements: 2.1, 2.3_

  - [ ] 1.3 Update layout.tsx with Space Grotesk font and scanline overlay
    - Import Space Grotesk from next/font/google alongside existing JetBrains Mono
    - Apply Space Grotesk CSS variable to html element
    - Add fixed scanline overlay div with pointer-events: none and z-index above bg but below content
    - _Requirements: 2.1, 4.1, 4.3, 4.4_

- [ ] 2. Create new primitive UI components
  - [ ] 2.1 Create GradientProgressBar component
    - File: src/components/ui/GradientProgressBar.tsx
    - Accept value (0–100), animated (default true), height (default 3px), className props
    - Fill background: linear-gradient(90deg, --accent-teal, --accent-cyan, --accent-blue)
    - When animated: use useScrollAnimation hook to trigger width transition from 0% to value% over 1000ms ease-out
    - _Requirements: 15.5, 15.6, 20.2_

  - [ ]* 2.2 Write unit tests for GradientProgressBar
    - Test renders with correct gradient background style
    - Test fill width equals value% when not animated
    - _Requirements: 15.5_

  - [ ] 2.3 Create UptimeCounter component
    - File: src/components/ui/UptimeCounter.tsx
    - Accept startDate: Date and className props
    - Calculate elapsed days/hours/minutes/seconds from startDate to Date.now() via setInterval (1s)
    - Display as "{days}d {hours}h {minutes}m {seconds}s" in JetBrains Mono
    - Clean up interval on unmount
    - _Requirements: 3.6_

  - [ ]* 2.4 Write property test for UptimeCounter
    - **Property 7: UptimeCounter Non-Negative Values**
    - **Validates: Requirements 3.6**
    - For any startDate in the past, hours ∈ [0,23], minutes ∈ [0,59], seconds ∈ [0,59], days ≥ 0
    - _Requirements: 3.6_

  - [ ] 2.5 Create HUDBrackets component
    - File: src/components/ui/HUDBrackets.tsx
    - Accept position ('fixed' | 'absolute', default 'fixed'), color, size (default 20px), opacity (default 0.5), className props
    - Render four L-shaped corner divs using CSS border-top/border-left etc.
    - Apply pointer-events: none to all brackets
    - _Requirements: 21.1, 21.2, 21.3, 21.5_

  - [ ] 2.6 Create GlassmorphismCard component
    - File: src/components/ui/GlassmorphismCard.tsx
    - Accept children, className, glowOnHover (default true) props
    - Background: rgba(10,14,26,0.6) with backdrop-filter: blur(16px)
    - Gradient border via outer wrapper with --gradient-accent background and 1px gap technique
    - On hover: box-shadow with --glow-teal intensifies; transition 0.3s ease
    - _Requirements: 10.4, 12.4, 12.5_

  - [ ]* 2.7 Write property test for GlassmorphismCard
    - **Property 4: GlassmorphismCard Visual Properties**
    - **Validates: Requirements 10.4, 12.4, 12.5**
    - For any children, rendered card has backdrop-filter style and gradient border wrapper
    - _Requirements: 10.4, 12.4_

  - [ ] 2.8 Create PerspectiveTilt component
    - File: src/components/ui/PerspectiveTilt.tsx
    - Accept children, maxTilt (default 10), perspective (default 1000), disabled (default false), className props
    - On mousemove: compute rotateX/rotateY from normalized cursor position within card bounds, clamped to ±maxTilt
    - On mouseleave: animate back to rotateX(0) rotateY(0) with 300ms ease
    - Use useMotionValue + useSpring for smooth interpolation
    - When disabled: render children without transform
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

  - [ ]* 2.9 Write property test for PerspectiveTilt
    - **Property 8: PerspectiveTilt Bounded Rotation**
    - **Validates: Requirements 13.1, 13.2, 13.4**
    - For any normalized mouse position (0–1) and maxTilt (5–15), rotateX and rotateY ∈ [-maxTilt, maxTilt]
    - _Requirements: 13.1, 13.2_

  - [ ] 2.10 Create AmbientGlow component
    - File: src/components/ui/AmbientGlow.tsx
    - Accept color ('purple' | 'indigo' | 'teal', default 'purple'), size (default 600px), parallaxFactor (default 0.5), className props
    - Render motion.div with radial-gradient background at 10–20% opacity
    - Apply pointer-events: none, z-index below content
    - Use useScroll + useTransform to translate Y at parallaxFactor of scroll speed
    - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5_

  - [ ]* 2.11 Write property test for AmbientGlow parallax
    - **Property 18: Ambient Glow Parallax Factor**
    - **Validates: Requirements 22.5, 9.4**
    - For any parallaxFactor, useTransform output Y = scrollY * parallaxFactor within floating-point tolerance
    - _Requirements: 22.5_

- [ ] 3. Create ParticleCanvas component
  - [ ] 3.1 Implement ParticleCanvas
    - File: src/components/ui/ParticleCanvas.tsx
    - Accept particleCount (default 100), connectionDistance (default 120), parallaxFactor (default 0.3), className props
    - Initialize particles with random x, y, vx, vy, radius, opacity using useRef + useEffect
    - Animation loop: move particles, wrap at edges, draw connection lines within connectionDistance
    - Use --accent-teal / --accent-cyan at 0.3–0.6 opacity for particles and lines
    - Wrap canvas in motion.div with useScroll + useTransform for Y parallax
    - Pause loop on document.hidden via Page Visibility API; resume on visibility change
    - Debounce resize handler 150ms; recreate particles on resize
    - Fallback: if getContext('2d') returns null, render static radial-gradient div
    - _Requirements: 5.2, 5.3, 5.4, 9.1, 9.5, 26.3, 26.5_

  - [ ]* 3.2 Write property test for ParticleCanvas
    - **Property 11: ParticleCanvas Minimum Particle Count**
    - **Validates: Requirements 5.3**
    - For any particleCount ≥ 80, internal particle array contains ≥ 80 particles with valid x, y, vx, vy, opacity
    - _Requirements: 5.3_

  - [ ]* 3.3 Write property test for ParticleCanvas pause behavior
    - **Property 12: ParticleCanvas Pauses When Hidden**
    - **Validates: Requirements 26.5**
    - When document.hidden becomes true, animation loop stops; when false, loop resumes
    - _Requirements: 26.5_

- [ ] 4. Create SplitTextReveal and NodeGraph components
  - [ ] 4.1 Create SplitTextReveal component
    - File: src/components/ui/SplitTextReveal.tsx
    - Accept text, className, staggerDelay (default 50ms), initialDelay (default 0), onComplete props
    - Split text into individual motion.span elements with data-char attribute
    - Each char: initial { opacity: 0, y: 20 }, animate { opacity: 1, y: 0 }, transition duration 0.3s easeOut
    - Use staggerChildren in container variants; spaces rendered as &nbsp;
    - Fire onComplete via onAnimationComplete on container
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ]* 4.2 Write property test for SplitTextReveal
    - **Property 5: SplitTextReveal Character Count**
    - **Validates: Requirements 6.1, 6.2, 6.3**
    - For any string of length 1–50, component renders exactly text.length character spans each with opacity 0 as initial state
    - _Requirements: 6.1, 6.2_

  - [ ] 4.3 Create NodeGraph component (upgrade from ArchitectureDiagram)
    - File: src/components/ui/NodeGraph.tsx
    - Accept nodes: DiagramNode[], connections: DiagramConnection[] (same interfaces as ArchitectureDiagram)
    - Define SVG <defs> with <linearGradient id="lineGrad"> (--accent-teal → --accent-cyan) and <filter id="nodeGlow"> using feGaussianBlur
    - Connection paths: stroke="url(#lineGrad)", strokeDasharray="6 3", CSS animation on strokeDashoffset for data-flow effect
    - Node rects: stroke="var(--accent-teal)", filter="url(#nodeGlow)"
    - Nodes stagger in with scale + opacity animation (50ms per node)
    - Hide on mobile (<768px)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

  - [ ]* 4.4 Write property test for NodeGraph connection gradient
    - **Property 9: NodeGraph Connection Line Gradient**
    - **Validates: Requirements 7.3**
    - For any set of connections, each rendered SVG path references the linearGradient definition
    - _Requirements: 7.3_

  - [ ]* 4.5 Write property test for NodeGraph node glow
    - **Property 10: NodeGraph Node Glow Styling**
    - **Validates: Requirements 7.4**
    - For any node, rendered SVG element has stroke --accent-teal and references glow filter
    - _Requirements: 7.4_

- [ ] 5. Checkpoint — Ensure all new primitive components render without errors
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Update animations.ts with cinematic variants
  - Add cinematicFadeUp variant: initial { opacity: 0, y: 30 }, animate { opacity: 1, y: 0 }, transition 400ms easeOut
  - Add sectionHeaderReveal variant for display-font headers
  - Add nodeStagger container variant with staggerChildren: 0.05
  - Add glowPulse variant for ambient elements
  - Preserve all existing variants (fadeIn, slideInLeft, slideUp, pulse, cursorBlink)
  - _Requirements: 20.1, 20.4_

- [ ] 7. Update Navbar with UptimeCounter and HUD styling
  - Import and render UptimeCounter (startDate: new Date('2022-01-01')) on the right side of the nav bar
  - Increase backdrop-filter blur to 16px
  - Add HUD-style gradient border-bottom using --gradient-accent
  - Keep existing scroll spy, smooth scroll, mobile menu, and available badge
  - _Requirements: 3.1, 3.2, 3.6, 3.7_

- [ ] 8. Redesign Hero section
  - [ ] 8.1 Replace Hero background and add ParticleCanvas
    - Remove CSS grid-line background
    - Add ParticleCanvas as absolute full-viewport background layer (z-index 0)
    - Add HUDBrackets (position="fixed") for viewport corner brackets
    - Add AmbientGlow (color="teal") at bottom of hero section
    - _Requirements: 5.1, 5.2, 5.5, 21.1, 21.3_

  - [ ] 8.2 Replace name display with SplitTextReveal
    - Replace static "Kuldeepsinh" / "Rajput" divs with two SplitTextReveal components
    - First: "Kuldeepsinh" with staggerDelay=50, initialDelay=0
    - Second: "Rajput" with staggerDelay=50, initialDelay=600
    - Apply display font (Space Grotesk) at 52px+ font-weight 700
    - After second reveal completes, trigger sequential fade-in of role subtitle, stats, CTAs
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ] 8.3 Replace ArchitectureDiagram with NodeGraph
    - Swap ArchitectureDiagram import for NodeGraph in the right 40% panel
    - Pass same architectureNodes and architectureConnections from data.ts
    - _Requirements: 7.1, 7.2, 7.5_

  - [ ] 8.4 Update CTA buttons with gradient border glow
    - Replace flat teal/amber borders with gradient border glow using --gradient-accent
    - On hover: apply box-shadow glow effect
    - _Requirements: 8.3, 8.4_

- [ ] 9. Update Experience section with editorial header and glassmorphism cards
  - Add display-font section header "Experience" at 80px+ with gradient underline accent
  - Add AmbientGlow (color="indigo") behind section
  - Wrap each CommitCard in GlassmorphismCard
  - Add HUDBrackets (position="absolute") as section decorations
  - Apply cinematicFadeUp scroll animation to section header
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 20.1_

- [ ] 10. Update Projects section with editorial header, tilt, and glassmorphism
  - Add display-font section header "Projects" at 80px+ with gradient underline accent
  - Wrap each project card in PerspectiveTilt > GlassmorphismCard composition
  - Pass disabled={isMobile} to PerspectiveTilt (detect via window.innerWidth < 768)
  - Add HUDBrackets (position="absolute") as section decorations
  - Apply cinematicFadeUp scroll animation to section header
  - _Requirements: 12.1, 12.2, 12.3, 13.1, 13.5, 20.1, 21.4_

- [ ] 11. Update Skills section with editorial header and gradient progress bars
  - Add display-font section header "Skills" at 80px+ with gradient underline accent
  - Update ServiceMonitor to use GradientProgressBar instead of flat progress bar
  - Wrap each ServiceMonitor in GlassmorphismCard
  - Apply cinematicFadeUp scroll animation to section header
  - _Requirements: 15.1, 15.2, 15.4, 15.5, 15.6, 20.1_

- [ ] 12. Update Contact section with editorial header and glass styling
  - Add display-font section header "Contact" at 80px+ with gradient underline accent
  - Add AmbientGlow (color="purple") behind section
  - Update ApiPlayground container to use GlassmorphismCard styling
  - Apply cinematicFadeUp scroll animation to section header
  - _Requirements: 17.1, 17.2, 20.1_

- [ ] 13. Update Footer dot color
  - Change pulsing dot color from --accent-green to --accent-teal
  - _Requirements: 19.3_

- [ ] 14. Checkpoint — Ensure full visual redesign renders correctly end-to-end
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 15. Write unit tests for new components
  - [ ] 15.1 Write unit tests for ParticleCanvas
    - Test renders a canvas element
    - Test fallback renders static gradient div when getContext returns null
    - _Requirements: 5.2, 5.3_

  - [ ] 15.2 Write unit tests for SplitTextReveal
    - Test renders correct number of character spans for a given string
    - Test spaces are rendered as non-breaking space
    - _Requirements: 6.1, 6.2_

  - [ ] 15.3 Write unit tests for NodeGraph
    - Test renders all 9 nodes from architectureNodes data
    - Test renders correct number of connection paths
    - Test linearGradient and glow filter defs are present in SVG
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ] 15.4 Write unit tests for HUDBrackets
    - Test renders exactly 4 corner elements
    - Test pointer-events: none is applied
    - _Requirements: 21.1, 21.2_

  - [ ] 15.5 Write unit tests for GlassmorphismCard
    - Test renders children
    - Test has backdrop-filter style applied
    - _Requirements: 10.4, 12.4_

  - [ ] 15.6 Write unit tests for UptimeCounter
    - Test renders days, hours, minutes, seconds labels
    - Test values are non-negative on mount
    - _Requirements: 3.6_

  - [ ] 15.7 Write unit tests for GradientProgressBar
    - Test renders with gradient background
    - Test fill width matches value prop when not animated
    - _Requirements: 15.5_

  - [ ] 15.8 Write unit tests for updated section headers
    - Test Experience, Projects, Skills, Contact sections each render a display-font header
    - Test scanline overlay element exists in DOM with correct opacity
    - _Requirements: 2.3, 2.6, 4.1, 4.2_

- [ ] 16. Write property-based tests for cinematic redesign
  - [ ]* 16.1 Write property test for section header styling consistency
    - **Property 1: Section Header Styling Consistency**
    - **Validates: Requirements 2.3, 2.6**
    - For any section header, display font is applied at ≥80px and gradient underline element is present
    - _Requirements: 2.3, 2.6_

  - [ ]* 16.2 Write property test for navigation smooth scroll
    - **Property 2: Navigation Link Smooth Scroll**
    - **Validates: Requirements 3.8, 27.1**
    - For any nav link click, scrollIntoView is called on the matching section element
    - _Requirements: 3.8, 27.1_

  - [ ]* 16.3 Write property test for navigation active section highlight
    - **Property 3: Navigation Active Section Highlight**
    - **Validates: Requirements 3.9, 27.4**
    - For any section intersecting viewport at 20% threshold, corresponding nav link has --accent-teal color
    - _Requirements: 3.9, 27.4_

  - [ ]* 16.4 Write property test for gradient progress bar scroll animation
    - **Property 6: GradientProgressBar Scroll Animation**
    - **Validates: Requirements 15.5, 15.6, 20.2**
    - For any value 0–100, fill animates from 0% to value% on viewport entry with teal→cyan→blue gradient
    - _Requirements: 15.5, 15.6_

  - [ ]* 16.5 Write property test for count-up animation bounds
    - **Property 13: Count-Up Animation Bounds**
    - **Validates: Requirements 8.1, 8.2**
    - For any target value, useCountUp returns monotonically non-decreasing values from 0 to target
    - _Requirements: 8.1, 8.2_

  - [ ]* 16.6 Write property test for form validation
    - **Property 14: Form Validation Rejects Invalid Inputs**
    - **Validates: Requirements 18.1, 18.2, 18.3, 18.4, 18.5**
    - For any combination with empty/invalid fields, submission is blocked and errors are shown
    - _Requirements: 18.1, 18.2, 18.3_

  - [ ]* 16.7 Write property test for scroll animation trigger threshold
    - **Property 15: Scroll Animation Trigger Threshold**
    - **Validates: Requirements 20.5**
    - For any scroll-animated element, animation does not fire until element is ≥20% visible
    - _Requirements: 20.5_

  - [ ]* 16.8 Write property test for keyboard navigation
    - **Property 16: Keyboard Navigation on Interactive Elements**
    - **Validates: Requirements 25.4, 25.5**
    - For any interactive element, it is reachable via Tab and activatable via Enter/Space with visible focus indicator
    - _Requirements: 25.4, 25.5_

  - [ ]* 16.9 Write property test for image and diagram alt text
    - **Property 17: Image and Diagram Alt Text**
    - **Validates: Requirements 25.2**
    - For any image or SVG diagram, a non-empty alt attribute or aria-label is present
    - _Requirements: 25.2_

  - [ ]* 16.10 Write property test for animation uses CSS transforms
    - **Property 19: Animation Uses CSS Transforms**
    - **Validates: Requirements 26.1**
    - For any animated element, animation modifies transform properties not layout properties
    - _Requirements: 26.1_

  - [ ]* 16.11 Write property test for ProjectCard link XOR internal badge
    - **Property 20: ProjectCard Link XOR Internal Badge**
    - **Validates: Requirements 12.6**
    - For any project, it displays either a live URL link OR an internal badge, never both
    - _Requirements: 12.6_

- [ ] 17. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- All new components are TypeScript strict-mode; no `any` types
- Preserved components (BootSequence, TypingText, CommitCard, ApiPlayground, ErrorBoundary, all hooks, data.ts, page.tsx) require no changes unless noted
- PerspectiveTilt must be disabled on mobile (< 768px) via the disabled prop
- ParticleCanvas must respect prefers-reduced-motion by skipping the animation loop
- Property tests use fast-check with numRuns: 100 minimum
