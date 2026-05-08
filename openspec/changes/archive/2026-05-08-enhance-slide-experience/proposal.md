## Why

Long slides currently cut off content at the top and bottom because `SlideViewer` centers the slide vertically with flex while also using `overflow-auto` — centered flex children don't scroll past their container's edges, so learners can't reach material that overflows. At the same time, every slide is a static block of MDX, which limits how learning content can be presented; the project needs richer, learner-driven slide modes (progressive reveal, expand-on-click, flip cards, tabbed views) to support different pedagogical patterns beyond linear reading.

## What Changes

- Replace centered flex layout in `SlideViewer` with a top-aligned scrollable container so overflowing content is fully reachable, while keeping short slides looking centered.
- Add four new MDX slide-mode components usable inside `.mdx` content:
  - `<Expandable>` / `<ExpandableItem>` — click a header to reveal hidden detail (accordion).
  - `<Reveal>` — bullets/blocks appear one-at-a-time on click or `Space`/`Enter`, gated within the active slide.
  - `<Flashcard front=… back=…>` — card flips on click to show the back face.
  - `<Tabs>` / `<Tab label=…>` — switch between tabbed sub-sections inside one slide.
- Wire the new components into the MDX renderer so they work in any `.mdx` material without per-file imports.
- Add minimal keyboard affordances: `Space` advances reveals when a `<Reveal>` is on the current slide before falling through to next-slide navigation.
- **BREAKING for slide CSS only:** authors who relied on vertical-centering of slide bodies will see content top-align instead. Cover-layout slides (`<Slide layout="cover">`) keep their centered behavior.

## Capabilities

### New Capabilities
- `slide-overflow`: How `SlideViewer` lays out and scrolls slide content so long material is fully reachable while short slides still look balanced.
- `slide-interactions`: The set of interactive MDX slide-mode components (`Expandable`, `Reveal`, `Flashcard`, `Tabs`) and how they integrate with the slide viewer's keyboard and navigation model.

### Modified Capabilities
<!-- None — no existing specs in openspec/specs/ -->

## Impact

- **Code:** [src/components/SlideViewer.tsx](src/components/SlideViewer.tsx) (layout + keyboard handler), [src/components/Slide.tsx](src/components/Slide.tsx) (cover layout preserved), MDX components registry in [src/components/ArticleViewer.tsx](src/components/ArticleViewer.tsx) and the per-material slide page under [src/app/\[category\]/](src/app/[category]/) (register new components). New files under `src/components/slide-modes/` for the four interactive components.
- **Content:** Existing `.mdx` materials in [content/](content/) keep working unchanged; authors opt into new modes by using the new components.
- **Dependencies:** No new runtime deps required — built on React + Tailwind already in [package.json](package.json).
- **Build:** Static export (`output: 'export'` in [next.config.mjs](next.config.mjs)) still works; all interactivity is client-side.
- **Risk:** Top-aligning slide content is a visible UX shift; cover slides and short slides need a quick visual check after rollout.
