# CLAUDE.md — COSMORA

## Product Descriptor

**AI-Powered Space Exploration & Astronomy Experiences**

## Project Summary

COSMORA is an immersive astronomy/space exploration product that combines real astronomical data, 3D exploration, contextual AI, and real-world astronomy experiences.

The product is **not a dashboard** and is not a generic AI chatbot. The core user loop is:

> Explore → Understand → Act → Document → Explore Again

---

## Tech Stack

### Application

- Next.js **16.3.x** (Active LTS; pin the exact patch version in `package.json`)
- React **19.2.x** (stable; pin exact patch version in `package.json`)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Motion

Next.js 16.x is the current Active LTS major as of August 2026. React 19.2 is the current stable major/minor line. Do not introduce Canary/experimental releases into production without explicit approval.

### 3D / Spatial

- Three.js
- React Three Fiber
- CesiumJS when real-world geospatial/terrain requirements justify it
- MapLibre GL JS for map/geospatial UI when appropriate

### Data / Backend

- Supabase PostgreSQL
- PostGIS
- pgvector
- Supabase Auth
- Supabase Storage

### Application Utilities

- Zod
- Zustand
- React Hook Form
- Recharts only where charts are actually useful

### Deployment

- Vercel
- Git-based CI/CD

### External Data

Use authoritative sources and providers through server-side adapters.

Initial candidates:

- NASA PDS
- NASA Exoplanet Archive
- NASA/JPL SPICE / NAIF
- NASA scientific/technical sources
- weather/location providers

---

## Core Architecture

Use a **modular monolith** for MVP.

Do not introduce microservices unless a concrete scale or isolation problem requires them.

```text
app/
components/
features/
  explorer/
  ai/
  observation/
  research/
  destinations/
  documentation/
lib/
  astronomy/
  data/
  ai/
  providers/
  validation/
supabase/
```

Keep responsibilities separated:

- UI/presentation
- feature orchestration
- domain logic
- data access
- provider adapters
- AI tools
- validation

---

## Non-Negotiable Product Rules

1. **Do not build a dashboard UI.**
2. **Keep the product immersive and editorial.**
3. **Treat the object/event as the center of the experience.**
4. **Do not create separate product modes for photographer, student, or general user.**
5. **All users share the same exploration core; intent changes the action path.**
6. **Use 3D only where spatial interaction has product value.**
7. **Do not make AI the source of astronomical truth.**
8. **Deterministic tools must calculate astronomy-specific facts when possible.**
9. **AI must consume validated tool/data output before making factual claims.**
10. **Never expose secret API keys in client code.**
11. **Apply Row Level Security to user-owned Supabase data.**
12. **Validate external/API/tool inputs with Zod or equivalent schemas.**
13. **Do not silently merge conflicting scientific sources.**
14. **Preserve source/freshness metadata where appropriate.**
15. **Keep AI optional: core exploration must work without AI.**
16. **Every interactive component needs loading, empty, error, disabled, and focus states.**
17. **Support reduced motion.**
18. **Do not ship a 3D experience without a usable fallback path.**
19. **Do not add a dependency merely to solve a small UI problem.**
20. **Prefer server-side data fetching for sensitive or authoritative data flows.**

---

## AI Agent Rules

The agent is a **constrained tool-using agent**.

Required flow:

```text
User intent
→ intent/context extraction
→ tool selection
→ deterministic/data tool calls
→ validation
→ grounded response
→ optional action
```

Initial tools should be small and explicit:

- search_object
- get_object_data
- get_visibility
- get_location_context
- get_weather
- get_observation_window
- search_destination
- search_research

Do not give the agent unrestricted database access.

Do not let the LLM directly invent orbital/visibility calculations when a deterministic function exists.

Add source references when the answer materially depends on external scientific data.

---

## 3D Rules

Use React Three Fiber for the primary interactive space experience.

Keep the 3D layer isolated from ordinary UI.

Do not load the full 3D engine for routes that do not need it.

Use:

- lazy loading
- dynamic imports
- compressed assets
- level-of-detail where needed
- progressive loading
- reduced-motion alternatives

Prefer semantic transitions over decorative animation.

---

## Data Rules

Maintain a canonical internal representation for:

- SpaceObject
- CelestialEvent
- Mission
- Observation
- Destination
- ResearchReference

Every imported external dataset must pass through a normalization layer.

Never couple UI components directly to raw provider payloads.

Example:

```text
provider payload
→ adapter
→ normalized domain model
→ application query
→ UI
```

---

## Security Rules

- Never put private credentials in client bundles.
- Use server-only modules for secrets and privileged queries.
- Enable Supabase RLS for user-owned tables.
- Validate uploaded file type/size before storage.
- Validate tool arguments.
- Rate-limit AI endpoints.
- Log failures without logging sensitive user content unnecessarily.
- Do not trust external API payloads blindly.

---

## Performance Rules

- Do not globally import heavy 3D code.
- Lazy-load Cesium/Three.js features when appropriate.
- Optimize textures and models before shipping.
- Keep first meaningful content independent from 3D asset completion.
- Avoid unnecessary client components.
- Prefer server components for static/content-heavy surfaces.
- Measure before optimizing.

---

## UI / UX Rules

The product should feel:

**Scientific + Editorial + Cinematic**

Do:

- oversized typography
- asymmetrical editorial grids
- strong whitespace
- thin technical rules
- contextual metadata
- layered 3D composition
- restrained accent color
- smooth but purposeful motion

Do not:

- make every section a card
- add glassmorphism everywhere
- build KPI grids
- use a permanent admin sidebar
- use decorative futuristic fonts for body content
- over-animate every component
- make the UI look like a generic AI app

---

## Error / Failure Behavior

Every external dependency can fail.

Required behavior:

### Astronomy data unavailable
Show cached/last-known data with freshness labeling when safe.

### Weather unavailable
Keep object/astronomy information available; clearly mark weather as unavailable.

### AI unavailable
Hide/disable AI actions gracefully; core exploration remains functional.

### 3D failure
Fallback to 2D/static representation.

### Missing data
Never show fake placeholder scientific values.

### Conflicting data
Apply provider priority and expose the conflict when material.

---

## Commands

These are the expected command categories. Keep the actual scripts in `package.json` synchronized with this section.

```bash
npm run dev
npm run build
npm run lint
npm run test
```

Add:

```bash
npm run typecheck
```

and keep it required in CI.

---

## Testing Expectations

At minimum:

- unit tests for astronomy calculations
- schema validation tests
- AI tool contract tests
- API/provider adapter tests
- component tests for critical interactions
- end-to-end tests for the primary loop

Primary E2E flow:

```text
Landing
→ Explore or Ask AI
→ Select object
→ View object
→ Ask AI
→ Select action
→ Complete action
```

---

## Dependency Policy

Before adding a dependency, confirm:

1. It solves a real product/engineering need.
2. It is compatible with the current Next.js/React versions.
3. It does not duplicate an existing capability.
4. Its bundle/runtime cost is acceptable.
5. It has a stable maintenance story.

Prefer native platform APIs or existing stack primitives for simple tasks.

---

## Definition of Done

A feature is not done when the happy path works.

It is done when:

- types pass
- lint passes
- relevant tests pass
- loading/error/empty states exist
- responsive behavior is verified
- accessibility basics are covered
- external dependencies have fallback behavior
- no secrets are exposed
- the feature matches the immersive product language
- documentation/architecture is updated when needed

---

## Important Reference Docs

Keep these files aligned:

- `PRD.md` — product scope and acceptance criteria
- `DESIGN.md` — UX and visual system
- `CLAUDE.md` — engineering rules and architecture

When a new prompt conflicts with these docs, flag the conflict before silently rewriting product fundamentals.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
