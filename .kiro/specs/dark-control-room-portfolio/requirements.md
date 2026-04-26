# Requirements Document

## Introduction

This document specifies requirements for redesigning Kuldeepsinh Rajput's portfolio website with a "Cinematic Control" aesthetic — a dark editorial + sci-fi visual direction that delivers a cinematic scroll experience. The portfolio retains all existing personal content (Kuldeepsinh Rajput, Avesta HQ experience, 4 projects, 9 skills, contact form) while replacing the generic terminal theme with a high-impact, visually immersive presentation. The implementation uses Next.js 14 App Router, TypeScript, Tailwind CSS, and Framer Motion.

## Glossary

- **Portfolio_System**: The Next.js 14 single-page application serving Kuldeepsinh Rajput's portfolio
- **Cinematic_Theme**: Visual design pattern combining dark editorial typography, sci-fi HUD elements, and cinematic scroll depth
- **Particle_Canvas**: Full-viewport animated HTML5 canvas rendering a star-field or particle mesh background
- **Split_Text_Reveal**: Letter-by-letter name animation where each character animates in individually
- **Node_Graph**: Animated SVG visualization of the tech stack as glowing interconnected nodes
- **HUD_Brackets**: Corner bracket decorations (⌐ ¬ style) framing key sections in a sci-fi HUD style
- **Glassmorphism_Card**: Card component with deep glass background, gradient border, and glow on hover
- **Perspective_Tilt**: CSS 3D perspective transform applied to project cards tracking mouse position
- **Gradient_Accent**: Teal → cyan → blue gradient used for accents, borders, and glows
- **Ambient_Glow**: Soft purple/indigo radial gradient blobs placed between sections as background atmosphere
- **Scanline_Overlay**: Subtle repeating horizontal line texture at low opacity over the entire page
- **Uptime_Counter**: Live counter in the navbar displaying elapsed time since a fixed start date
- **Display_Font**: Large condensed/editorial font (Space Grotesk or Syne) used for section headers at 120px+
- **Parallax_Scene**: Section transition effect where background layers move at different scroll speeds
- **Navbar**: Fixed top navigation bar with terminal branding, uptime counter, and HUD styling
- **Hero_Section**: Full-viewport opening section with particle canvas, split-text reveal, and node graph
- **Experience_Section**: Work history displayed as cinematic scene with editorial typography
- **Projects_Section**: Portfolio projects displayed as glassmorphism cards with 3D tilt
- **Skills_Section**: Technical skills displayed as system service monitors with gradient progress bars
- **Contact_Section**: Contact form styled as API endpoint testing interface
- **Footer**: Bottom section with copyright and operational status
- **Scroll_Animation**: Animation triggered when element enters viewport
- **Count_Up_Animation**: Numeric value animation from 0 to target value

## Requirements

### Requirement 1: Color Palette and Design Tokens

**User Story:** As a developer viewing the portfolio, I want a cohesive cinematic dark aesthetic, so that the visual theme is consistent and impactful throughout the interface.

#### Acceptance Criteria

1. THE Portfolio_System SHALL define CSS custom properties for --bg-primary (#080B10), --bg-secondary (#0D1117), --bg-card (#0A0E1A), --border (#1C2333)
2. THE Portfolio_System SHALL define gradient accent tokens: --gradient-accent (linear-gradient from #00FFD1 via #00BFFF to #6366F1), --accent-teal (#00FFD1), --accent-cyan (#00BFFF), --accent-blue (#6366F1)
3. THE Portfolio_System SHALL define ambient glow tokens: --glow-purple (rgba(99, 102, 241, 0.15)), --glow-teal (rgba(0, 255, 209, 0.12))
4. THE Portfolio_System SHALL define CSS custom properties for --text-primary (#E6EDF3), --text-muted (#7D8590), --text-dim (#30363D)
5. THE Portfolio_System SHALL apply --bg-primary as the root background color
6. THE Portfolio_System SHALL apply --text-primary as the default text color

### Requirement 2: Typography System

**User Story:** As a developer viewing the portfolio, I want a cinematic typographic hierarchy, so that section headers feel editorial and impactful while code elements retain a terminal feel.

#### Acceptance Criteria

1. THE Portfolio_System SHALL import a display font (Space Grotesk or Syne) from Google Fonts for section headers
2. THE Portfolio_System SHALL import JetBrains Mono from Google Fonts for terminal and code elements
3. THE Portfolio_System SHALL apply the display font to all section header titles at a minimum of 80px on desktop
4. THE Portfolio_System SHALL apply JetBrains Mono to navbar brand text, terminal labels, code snippets, and skill names
5. THE Portfolio_System SHALL use font-weight 700 or 800 for display headings and font-weight 400 for body text
6. THE Portfolio_System SHALL apply a glowing accent underline beneath each section header title

### Requirement 3: Fixed Navigation Bar with Uptime Counter

**User Story:** As a visitor, I want a persistent navigation bar with a live uptime counter, so that the sci-fi HUD feel is established immediately and I can navigate at any time.

#### Acceptance Criteria

1. THE Navbar SHALL be fixed to the top of the viewport with position: fixed
2. THE Navbar SHALL apply backdrop-filter: blur(16px) and a dark semi-transparent background
3. THE Navbar SHALL display "$ kuldeep.rajput" in --accent-teal on the left side using JetBrains Mono
4. THE Navbar SHALL render a blinking cursor animation after the brand text
5. THE Navbar SHALL display navigation links: --work, --projects, --skills, --contact
6. THE Navbar SHALL display a live Uptime_Counter showing elapsed time (days, hours, minutes, seconds) since a fixed start date, updating every second
7. THE Navbar SHALL display "● AVAILABLE FOR OPPORTUNITIES" badge in --accent-teal
8. WHEN a navigation link is clicked, THE Navbar SHALL smooth scroll to the corresponding section
9. THE Navbar SHALL highlight the active section link using --accent-teal color

### Requirement 4: Scanline Texture Overlay

**User Story:** As a visitor, I want a subtle scanline texture across the page, so that the sci-fi aesthetic is reinforced without distracting from content.

#### Acceptance Criteria

1. THE Portfolio_System SHALL render a fixed full-viewport scanline overlay using a CSS repeating-linear-gradient of horizontal lines
2. THE scanline overlay SHALL have opacity between 0.02 and 0.04 so it is subtle and does not obscure content
3. THE scanline overlay SHALL use pointer-events: none so it does not block interactions
4. THE scanline overlay SHALL be positioned above the background but below all content (z-index between background and content layers)

### Requirement 5: Hero Section with Particle Canvas

**User Story:** As a visitor, I want a dramatic full-viewport hero section, so that I am immediately immersed in the cinematic aesthetic.

#### Acceptance Criteria

1. THE Hero_Section SHALL occupy 100vh (full viewport height)
2. THE Hero_Section SHALL render a Particle_Canvas as the full-viewport background using HTML5 canvas
3. THE Particle_Canvas SHALL animate at least 80 particles as small dots moving slowly, connected by lines when within proximity, creating a star-field or particle mesh effect
4. THE Particle_Canvas SHALL use --accent-teal and --accent-cyan colors at low opacity (0.3–0.6) for particles and connection lines
5. THE Hero_Section SHALL display HUD_Brackets in all four corners of the viewport framing the content
6. THE Hero_Section SHALL divide layout into a left content area (name, role, stats, CTAs) and a right visualization area (Node_Graph)
7. WHEN viewport width is below 768px, THE Hero_Section SHALL stack left and right areas vertically and hide the Node_Graph

### Requirement 6: Split-Text Name Reveal Animation

**User Story:** As a visitor, I want to see the name animate in dramatically, so that the first impression is cinematic and memorable.

#### Acceptance Criteria

1. WHEN Hero_Section loads, THE Portfolio_System SHALL animate "Kuldeepsinh" and "Rajput" with a Split_Text_Reveal
2. THE Split_Text_Reveal SHALL animate each letter individually with a stagger of 40–60ms between letters
3. EACH letter SHALL animate from opacity 0 and translateY(20px) to opacity 1 and translateY(0)
4. THE name SHALL be displayed at a minimum of 52px on desktop using font-weight 700
5. AFTER the name reveal completes, THE Hero_Section SHALL fade in the role subtitle, stats row, and CTA buttons in sequence

### Requirement 7: Animated Node Graph in Hero

**User Story:** As a technical recruiter, I want to see Kuldeep's tech stack visualized as a glowing node graph, so that I can quickly understand his technical expertise.

#### Acceptance Criteria

1. THE Node_Graph SHALL render on the right side of Hero_Section
2. THE Node_Graph SHALL display nodes representing: Client Request, Node.js/Express.js, TypeScript, MySQL (RDS), OpenSearch, Redis Cache, AWS Lambda/ECS, SQS Event Queue, LangChain/LangGraph
3. THE Node_Graph SHALL connect nodes with directional lines styled with a gradient from --accent-teal to --accent-cyan
4. EACH node SHALL be styled as a rounded box with a glowing border using --accent-teal color and a subtle box-shadow glow
5. WHEN Node_Graph loads, THE Portfolio_System SHALL animate nodes to appear with a staggered fade-in and scale-up effect (50ms stagger per node)
6. THE Node_Graph connection lines SHALL have a subtle animated pulse or dash-offset animation to suggest data flow
7. WHEN viewport width is below 768px, THE Node_Graph SHALL be hidden

### Requirement 8: Hero Stats and CTA Buttons

**User Story:** As a visitor, I want to see key impact metrics and clear calls to action, so that I understand Kuldeep's scale of work and know how to engage.

#### Acceptance Criteria

1. THE Hero_Section SHALL display three stats with Count_Up_Animation: "2M+" users served, "30%" performance gains, "70%" less manual work
2. EACH stat number SHALL animate from 0 to its target value over 1500ms using requestAnimationFrame
3. THE Hero_Section SHALL display two CTA buttons: "View Projects" with a gradient border and "Contact Me" with a gradient border
4. WHEN a CTA button is hovered, THE Portfolio_System SHALL apply a gradient glow effect around the button
5. THE Hero_Section SHALL display a role subtitle: "Backend Engineer · AI Engineer" in --text-muted using JetBrains Mono

### Requirement 9: Parallax Scroll Depth Between Sections

**User Story:** As a visitor, I want depth and parallax as I scroll, so that the experience feels cinematic and three-dimensional.

#### Acceptance Criteria

1. THE Portfolio_System SHALL apply a parallax scroll effect to the Particle_Canvas background so it moves at 0.3× the scroll speed
2. EACH major section SHALL be treated as a "scene" with its own background layer that transitions as the user scrolls
3. THE Portfolio_System SHALL place Ambient_Glow blobs (soft radial gradients in purple/indigo) between sections as atmospheric background elements
4. THE Ambient_Glow blobs SHALL move at a slower scroll rate than the content (parallax factor 0.5×) to create depth
5. THE Portfolio_System SHALL use Framer Motion's useScroll and useTransform hooks to implement parallax transforms

### Requirement 10: Experience Section with Editorial Typography

**User Story:** As a hiring manager, I want to see Kuldeep's work experience with cinematic presentation, so that I can evaluate his professional background.

#### Acceptance Criteria

1. THE Experience_Section SHALL display a section header using the display font at 80px+ with the text "Experience"
2. THE section header SHALL have a glowing gradient underline accent beneath it
3. THE Experience_Section SHALL render two work experience cards for Avesta HQ entries
4. EACH experience card SHALL use deep Glassmorphism_Card styling with a gradient border
5. THE experience card SHALL display: role title, company, date range, and expandable achievement list
6. WHEN an experience card is clicked, THE Portfolio_System SHALL expand it to reveal achievement bullet points with a smooth height transition
7. THE experience card SHALL display achievements with a "+" prefix styled in --accent-teal
8. WHEN viewport width is below 768px, THE Experience_Section SHALL display cards at full width

### Requirement 11: Experience Content Data

**User Story:** As a visitor, I want to see specific work experience details, so that I understand Kuldeep's professional history.

#### Acceptance Criteria

1. THE Experience_Section SHALL display "Backend Engineer & AI Engineer @ Avesta HQ" for the first entry with date "Jan 2024 – Present · Ahmedabad, India"
2. THE Experience_Section SHALL display "Backend Engineer Intern @ Avesta HQ" for the second entry with date "Jul 2023 – Dec 2023 · Ahmedabad, India"
3. THE first entry SHALL list achievements: "Built Zinnova SaaS serving 5,000+ concurrent users with 99.9% uptime", "Architected multi-agent AI system reducing manual work by 70%", "Designed microservices handling 2M+ user queries", "Optimized API performance achieving 30% faster response times"
4. THE second entry SHALL list achievements: "Developed REST APIs for production applications", "Implemented event-driven architecture with SQS", "Contributed to AWS Lambda and ECS deployments"

### Requirement 12: Projects Section with Glassmorphism Cards

**User Story:** As a potential client, I want to see Kuldeep's projects in a visually striking layout, so that I can assess the quality and scope of his work.

#### Acceptance Criteria

1. THE Projects_Section SHALL display a section header using the display font at 80px+ with the text "Projects"
2. THE section header SHALL have a glowing gradient underline accent beneath it
3. THE Projects_Section SHALL render 4 Glassmorphism_Card components in a 2×2 grid layout on desktop
4. EACH Glassmorphism_Card SHALL have a deep glass background (rgba with backdrop-filter: blur), a gradient border using --gradient-accent, and a subtle inner glow
5. WHEN a Glassmorphism_Card is hovered, THE Portfolio_System SHALL intensify the gradient border glow
6. THE Glassmorphism_Card SHALL display: project name, one-line impact summary, technology tags, and a link or internal badge
7. WHEN viewport width is below 768px, THE Projects_Section SHALL display cards in single column layout

### Requirement 13: 3D Perspective Tilt on Project Cards

**User Story:** As a visitor, I want project cards to respond to my mouse movement with a 3D tilt, so that the interaction feels tactile and immersive.

#### Acceptance Criteria

1. WHEN the mouse moves over a Glassmorphism_Card, THE Portfolio_System SHALL apply a CSS 3D perspective transform (rotateX and rotateY) tracking the mouse position within the card
2. THE tilt effect SHALL be limited to a maximum of ±10 degrees on both axes to remain subtle
3. THE tilt SHALL use CSS perspective of 800px–1200px on the card container
4. WHEN the mouse leaves the card, THE Portfolio_System SHALL smoothly reset the transform to rotateX(0) rotateY(0) with a 300ms ease transition
5. WHEN viewport width is below 768px, THE Portfolio_System SHALL disable the perspective tilt effect

### Requirement 14: Projects Content Data

**User Story:** As a visitor, I want to see specific project details, so that I understand what Kuldeep has built.

#### Acceptance Criteria

1. THE Projects_Section SHALL display "Zinnova – Agentic AI Marketing SaaS" with impact "5,000+ concurrent users · 99.9% uptime · 70% less manual content work", tags "Node.js, Next.js, LangChain, LangGraph, AWS, Gemini, Vertex AI, Razorpay", and link to zinnova.in
2. THE Projects_Section SHALL display "Orchestrator-Based Agentic AI Dev System" with impact "70% faster feature delivery · RAG over large codebases · brownfield production", tags "Node.js, RAG, OpenSearch, LangGraph, LangChain", and an "internal" badge
3. THE Projects_Section SHALL display "Mitansh Interiors – Business Website" with impact "Responsive · Cloud deployed · Production ready", tags "React.js, Next.js", and link to mitanshinteriors.com
4. THE Projects_Section SHALL display "Aristo Cafe Restro – Restaurant Website" with impact "Full-stack · Node.js backend · Brand-accurate UI", tags "React.js, Next.js, Node.js", and link to aristocaferestro.com

### Requirement 15: Skills Section with Gradient Progress Bars

**User Story:** As a technical recruiter, I want to see Kuldeep's skills with proficiency levels, so that I can match him to relevant opportunities.

#### Acceptance Criteria

1. THE Skills_Section SHALL display a section header using the display font at 80px+ with the text "Skills"
2. THE section header SHALL have a glowing gradient underline accent beneath it
3. THE Skills_Section SHALL render 9 skill cards in a responsive grid
4. EACH skill card SHALL display: skill name, status badge ("● RUNNING" or "● ACTIVE"), a gradient progress bar, and uptime/context metadata
5. THE gradient progress bar SHALL use --gradient-accent (teal → cyan → blue) as its fill color
6. WHEN a skill card enters the viewport, THE Portfolio_System SHALL animate the progress bar from 0% to its target width
7. WHEN viewport width is below 768px, THE Skills_Section SHALL display skill cards in single column
8. WHEN viewport width is between 768px and 1024px, THE Skills_Section SHALL display skill cards in 2-column grid
9. WHEN viewport width is 1024px or above, THE Skills_Section SHALL display skill cards in 3-column grid

### Requirement 16: Skills Content Data

**User Story:** As a visitor, I want to see specific skill proficiency levels, so that I understand Kuldeep's technical strengths.

#### Acceptance Criteria

1. THE Skills_Section SHALL display "Node.js / TypeScript" at 95% proficiency with "● RUNNING" status, "3yr uptime · core stack" context
2. THE Skills_Section SHALL display "AWS (Lambda/ECS/SQS)" at 88% proficiency with "● RUNNING" status, "2yr · serverless architect" context
3. THE Skills_Section SHALL display "REST API Design" at 92% proficiency with "● RUNNING" status, "30% perf gains shipped" context
4. THE Skills_Section SHALL display "Microservices / EDA" at 85% proficiency with "● RUNNING" status, "8 services production" context
5. THE Skills_Section SHALL display "LangChain / LangGraph" at 85% proficiency with "● RUNNING" status, "multi-agent systems" context
6. THE Skills_Section SHALL display "OpenSearch / MySQL" at 80% proficiency with "● RUNNING" status, "2M+ user queries" context
7. THE Skills_Section SHALL display "Docker / CI/CD" at 78% proficiency with "● ACTIVE" status, "GitHub Actions · ECS" context
8. THE Skills_Section SHALL display "RAG / LLM Integration" at 82% proficiency with "● RUNNING" status, "Gemini · Vertex AI · MCP" context
9. THE Skills_Section SHALL display "React.js / Next.js" at 72% proficiency with "● ACTIVE" status, "full-stack capable" context

### Requirement 17: Contact Form as API Playground

**User Story:** As a potential collaborator, I want to contact Kuldeep, so that I can discuss opportunities or projects.

#### Acceptance Criteria

1. THE Contact_Section SHALL display a section header using the display font at 80px+ with the text "Contact"
2. THE section header SHALL have a glowing gradient underline accent beneath it
3. THE Contact_Section SHALL render an API_Playground with left panel (form) and right panel (response preview)
4. THE API_Playground left panel SHALL display method badge "[POST]" in --accent-teal and endpoint "/v1/contact"
5. THE API_Playground left panel SHALL display three input fields styled as JSON key-value pairs: "name", "email", "message"
6. THE API_Playground left panel SHALL display a send button "[▶ SEND REQUEST]" with a gradient background
7. WHEN the send button is clicked, THE API_Playground SHALL animate the response panel to show a success message
8. THE API_Playground response SHALL display: HTTP/1.1 200 OK, Content-Type: application/json, and a JSON body with status, message, to, and timestamp fields
9. THE Contact_Section SHALL display direct contact links below the form: mailto, LinkedIn, and phone
10. WHEN viewport width is below 768px, THE Contact_Section SHALL stack left and right panels vertically

### Requirement 18: Form Validation

**User Story:** As a visitor submitting the contact form, I want clear validation feedback, so that I know if my submission was successful or if I need to correct something.

#### Acceptance Criteria

1. WHEN the send button is clicked with an empty name field, THE API_Playground SHALL display an inline error message
2. WHEN the send button is clicked with an invalid email format, THE API_Playground SHALL display "Please enter a valid email address"
3. THE API_Playground SHALL validate email format using the pattern /^[^\s@]+@[^\s@]+\.[^\s@]+$/
4. WHEN the send button is clicked with an empty message field, THE API_Playground SHALL display an inline error message
5. THE API_Playground SHALL prevent form submission when any required field is empty or invalid

### Requirement 19: Footer with Operational Status

**User Story:** As a visitor, I want to see footer information, so that I know the site is maintained and operational.

#### Acceptance Criteria

1. THE Footer SHALL display centered text: "// built by kuldeepsinh rajput · © 2025 · all systems operational ●"
2. THE Footer SHALL apply --text-muted color to text
3. THE Footer SHALL display a green pulsing dot (●) using --accent-teal color
4. THE Footer SHALL animate the operational status dot with a pulse effect

### Requirement 20: Scroll-Triggered Animations

**User Story:** As a visitor, I want smooth animations as I scroll, so that the experience feels polished and cinematic.

#### Acceptance Criteria

1. WHEN a section header enters the viewport, THE Portfolio_System SHALL animate it to fade in and slide up from translateY(30px) to translateY(0)
2. WHEN a skill card enters the viewport, THE Portfolio_System SHALL animate its progress bar from 0% to the target percentage
3. WHEN Hero_Section loads, THE Portfolio_System SHALL animate numeric stats with Count_Up_Animation from 0 to target values
4. THE Portfolio_System SHALL use 300–500ms ease timing for section entrance animations
5. THE Portfolio_System SHALL trigger scroll animations when an element is 20% visible in the viewport

### Requirement 21: HUD Corner Bracket Decorations

**User Story:** As a visitor, I want sci-fi HUD corner brackets on key sections, so that the cinematic aesthetic is reinforced throughout the page.

#### Acceptance Criteria

1. THE Hero_Section SHALL display HUD_Brackets in all four corners of the viewport
2. EACH HUD_Bracket SHALL be rendered as an L-shaped corner element (two perpendicular lines, ~20px each arm) using --accent-teal color
3. THE HUD_Brackets SHALL be positioned with position: fixed relative to the viewport so they remain visible while scrolling
4. THE Portfolio_System SHALL apply HUD_Brackets to at least one additional key section (e.g., Projects or Skills) as relative-positioned decorations on the section container
5. THE HUD_Brackets SHALL have opacity between 0.4 and 0.7 to remain decorative without dominating the layout

### Requirement 22: Ambient Background Glow Blobs

**User Story:** As a visitor, I want subtle ambient glow between sections, so that the page feels atmospheric and cinematic rather than flat.

#### Acceptance Criteria

1. THE Portfolio_System SHALL render at least two Ambient_Glow blobs between major sections
2. EACH Ambient_Glow blob SHALL be a radial gradient in purple (#6366F1) or indigo (#4F46E5) at 10–20% opacity
3. EACH Ambient_Glow blob SHALL be at least 400px in diameter and positioned absolutely behind content
4. THE Ambient_Glow blobs SHALL use pointer-events: none and z-index below content layers
5. THE Ambient_Glow blobs SHALL move at a parallax factor of 0.5× scroll speed using Framer Motion transforms

### Requirement 23: Responsive Layout Breakpoints

**User Story:** As a mobile user, I want the portfolio to be fully responsive, so that I can view it on any device.

#### Acceptance Criteria

1. WHEN viewport width is below 768px, THE Portfolio_System SHALL stack Hero_Section areas vertically and hide the Node_Graph
2. WHEN viewport width is below 768px, THE Portfolio_System SHALL display Projects_Section in single column
3. WHEN viewport width is below 768px, THE Portfolio_System SHALL display Skills_Section in 1-column layout
4. WHEN viewport width is between 768px and 1024px, THE Portfolio_System SHALL display Skills_Section in 2-column grid
5. WHEN viewport width is 1024px or above, THE Portfolio_System SHALL display Skills_Section in 3-column grid
6. WHEN viewport width is below 768px, THE Portfolio_System SHALL stack API_Playground panels vertically
7. WHEN viewport width is below 768px, THE Portfolio_System SHALL disable the Perspective_Tilt effect on project cards

### Requirement 24: SEO and Metadata

**User Story:** As a search engine, I want proper metadata, so that I can index and display the portfolio correctly.

#### Acceptance Criteria

1. THE Portfolio_System SHALL set page title to "Kuldeepsinh Rajput — Backend & AI Engineer"
2. THE Portfolio_System SHALL set meta description to "Software Developer with 3+ years building scalable Node.js systems on AWS, serving 2M+ users. Specialized in microservices, GenAI, and agentic AI systems."
3. THE Portfolio_System SHALL include Open Graph title, description, and image metadata
4. THE Portfolio_System SHALL set viewport meta tag for responsive design
5. THE Portfolio_System SHALL include charset UTF-8 declaration

### Requirement 25: Performance and Accessibility

**User Story:** As a user with accessibility needs, I want the portfolio to be accessible, so that I can navigate and understand the content.

#### Acceptance Criteria

1. THE Portfolio_System SHALL use semantic HTML elements (nav, main, section, footer)
2. THE Portfolio_System SHALL provide alt text for all images and diagrams
3. THE Portfolio_System SHALL ensure color contrast ratios meet WCAG AA standards for text on backgrounds
4. THE Portfolio_System SHALL support keyboard navigation for all interactive elements
5. THE Portfolio_System SHALL provide visible focus indicators for keyboard navigation
6. THE Portfolio_System SHALL use aria-labels for icon-only buttons
7. THE Portfolio_System SHALL lazy-load non-critical sections to improve initial page load

### Requirement 26: Animation Performance

**User Story:** As a visitor on a lower-end device, I want smooth animations, so that the experience doesn't feel janky.

#### Acceptance Criteria

1. THE Portfolio_System SHALL use CSS transforms for animations instead of layout properties
2. THE Portfolio_System SHALL use will-change CSS property for animated elements
3. THE Portfolio_System SHALL use requestAnimationFrame for JavaScript-driven animations (count-up, uptime counter)
4. WHEN user prefers reduced motion, THE Portfolio_System SHALL disable or significantly reduce all animations
5. THE Particle_Canvas SHALL pause animation when the tab is not visible using the Page Visibility API

### Requirement 27: Single-Page Application Navigation

**User Story:** As a visitor, I want smooth navigation between sections, so that the experience feels seamless.

#### Acceptance Criteria

1. WHEN a navigation link is clicked, THE Portfolio_System SHALL smooth scroll to the target section
2. THE Portfolio_System SHALL update the URL hash when scrolling to sections
3. WHEN the page loads with a URL hash, THE Portfolio_System SHALL scroll to the corresponding section
4. THE Portfolio_System SHALL highlight the active section in the Navbar based on scroll position
5. THE Portfolio_System SHALL use scroll-behavior: smooth CSS property for native smooth scrolling
