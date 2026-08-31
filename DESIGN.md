# DESIGN.md — COSMORA

**Product descriptor:** AI-Powered Space Exploration & Astronomy Experiences

**Design direction:** scientific-editorial 70% + cinematic-futuristic 30%  
**Experience model:** immersive landing page + interactive exploration application  
**Primary aesthetic:** premium, spatial, modern, experimental, disciplined

---

## 1. Design Thesis

This product must **not** look like a SaaS dashboard with a space skin.

It should feel like:

> **an editorial/scientific space experience that happens to be interactive.**

Reference direction:

- immersive space exploration sites
- premium editorial storytelling
- NASA / National Geographic-style scientific credibility
- experimental typography and composition
- cinematic 3D object presentation

Do not copy any reference. Extract principles only.

---

## 2. Core UX Structure

```text
HOME
 ├─ Explore Space
 └─ Ask AI
        ↓
     OBJECT / EVENT
        ↓
    UNDERSTAND
        ↓
      AI INSIGHT
        ↓
 OBSERVE / PHOTO / RESEARCH / VISIT
        ↓
     DOCUMENT
```

The visual map and AI are two entry points into the same experience.

---

## 3. Homepage

### Objective

Create immediate curiosity and make the product understandable within seconds.

### Hierarchy

1. product identity
2. oversized headline
3. immersive 3D/space visual
4. one primary CTA: Explore Space
5. one secondary CTA: Ask AI
6. subtle current/curated highlights
7. scroll indicator / chapter navigation

### Avoid

- hero with ten cards
- dashboard metrics
- large feature grid
- generic SaaS navbar
- excessive glassmorphism
- obvious template sections
- “AI” badge everywhere

---

## 4. Navigation

Navigation should be minimal and contextual.

Suggested top-level navigation:

- Explore
- Destinations
- Experiences
- About

Primary action:

- Ask AI

Do not use a permanent admin-style sidebar.

On exploration surfaces, allow a compact contextual control bar instead.

---

## 5. Visual Language

### Foundation

Near-black / deep-space canvas.

Primary text:
- soft white
- off-white

Secondary text:
- cool grey

Accent:
- restrained electric cyan / blue
- optional warm astronomical accent used sparingly

### Rule

No rainbow gradients.

The product should feel **precise, not gamer-neon**.

---

## 6. Typography

Use a modern grotesk/sans for major display text.

Use a monospace/technical face selectively for:

- coordinates
- scientific values
- dates
- system metadata
- measurement labels

### Type hierarchy

- Display: oversized, tight, cinematic
- Section: strong editorial
- Body: readable and calm
- Metadata: compact, technical
- Microcopy: short, functional

Avoid decorative futuristic fonts for body copy.

---

## 7. Layout System

Use an asymmetric editorial grid.

Characteristics:

- controlled whitespace
- full-bleed imagery
- overlapping object/typography where intentional
- variable column widths
- thin technical rules
- anchored labels
- large negative space
- strong vertical rhythm

The layout can feel experimental because the **grid is strict underneath**.

Do not make every section symmetrical.

Do not use bento cards as the default layout pattern.

---

## 8. 3D Interaction

### Primary 3D layer

Three.js + React Three Fiber.

Use for:

- universe scene
- solar system
- planet presentation
- orbital relationships
- cinematic camera movement
- particle/star field
- object transitions

### Secondary spatial layer

Cesium can be used when the problem is real Earth/geospatial visualization:

- astronomy destinations
- real-world locations
- terrain/geospatial context

### 3D rule

3D must explain spatial relationships or create meaningful immersion.

Do not add 3D merely because it looks cool.

---

## 9. Object Detail Experience

Example: Mars.

### Structure

**Hero**
- huge Mars visual
- Mars
- “The Red Planet”
- a few essential measurements

**Context**
- overview
- atmosphere
- surface
- moons
- missions

**AI**
- “Ask about Mars”

**Actions**
- Observe
- Photograph
- Research
- Visit

### Visual rule

Scientific facts should feel embedded in the composition, not presented as a dashboard KPI wall.

---

## 10. AI Interaction

AI must be contextual to the active object/event.

Preferred UI:

- expandable side panel
- floating sheet
- inline answer layer
- anchored prompt

Avoid a standalone ChatGPT-clone page as the primary experience.

Example:

User is viewing Mars → asks “Why is Mars red?” → answer appears without destroying the Mars context.

---

## 11. Astronomy Destination Experience

Destination pages should feel like editorial travel experiences, not booking dashboards.

Display:

- location
- sky/observation context
- why it is interesting
- best activities
- accessibility/basic notes
- recommended observation conditions
- related objects/events

Visual direction:

**large destination image / map / night-sky composition + concise data.**

---

## 12. Motion Design

Motion should communicate spatial continuity.

### Recommended

- 3D camera transitions
- object zoom / focus transitions
- panel reveal
- image parallax used sparingly
- text stagger
- subtle loading states
- shared-layout transitions

### Avoid

- constant floating
- excessive blur animation
- bounce everywhere
- auto-playing motion that prevents reading

### Targets

- micro-interaction: 160–240ms
- panel transitions: 240–420ms
- spatial/hero transitions: 500–900ms depending on distance
- honor `prefers-reduced-motion`

Use easing that feels cinematic but restrained.

---

## 13. Responsive Design

### Desktop

Primary experience.

- large 3D canvas
- editorial composition
- layered metadata
- floating contextual UI

### Tablet

- preserve spatial hierarchy
- simplify overlays
- reduce simultaneous information

### Mobile

Do not simply shrink desktop.

Transform:

- dense overlays → bottom sheets
- multi-column editorial → single narrative flow
- 3D controls → simplified touch gestures
- metadata clusters → collapsible sections

---

## 14. Component Inventory

### Core

- Global navigation
- contextual control bar
- display heading
- metadata label
- object selector
- AI prompt
- AI response panel
- action rail
- destination card
- timeline
- source/reference block
- media/documentation block

### States for every interactive component

- default
- hover
- focus
- pressed
- disabled
- loading
- empty
- error
- offline/partial data

No component ships without defined loading/error behavior.

---

## 15. Accessibility

- WCAG-conscious contrast
- keyboard-accessible navigation
- visible focus ring
- semantic HTML
- accessible labels
- reduced-motion mode
- do not rely on color alone
- 3D interactions always have an alternative information path

---

## 16. Performance UX

3D is expensive. The UX must communicate loading deliberately.

Use:

- poster/placeholder scenes
- progressive asset loading
- route-level code splitting
- texture compression
- dynamic imports for heavy 3D modules
- low-detail fallback
- static fallback for unsupported devices

Never block the whole page waiting for the 3D experience.

---

## 17. Brand Personality

The product should feel:

**Curious**  
Invites exploration.

**Intelligent**  
Makes complex information understandable.

**Scientific**  
Precise and source-aware.

**Cinematic**  
Creates wonder.

**Human**  
Does not punish beginners for not knowing technical terms.

---

## 18. Anti-Patterns

Reject implementations that look like:

- generic dashboard
- generic AI chat
- template cards everywhere
- overdone glassmorphism
- neon cyberpunk overload
- giant “AI” marketing labels
- cluttered data walls
- impossible-to-read futuristic fonts
- 3D gimmicks with no semantic value
- desktop-first layout squeezed into mobile

---

## 19. Design Success Criteria

A first-time user should be able to answer within ~10 seconds:

1. What is this?
2. Why should I explore it?
3. How do I start?

A user in an object view should be able to answer:

1. What am I looking at?
2. Why is it interesting?
3. What can I do next?

If the interface cannot make those answers obvious, simplify the composition.
