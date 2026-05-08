## Context

Guides is a Next.js (static-export) MDX viewer. `SlideViewer` ([src/components/SlideViewer.tsx](src/components/SlideViewer.tsx)) renders one MDX slide at a time inside a fixed-height viewport (`h-[calc(100vh-3.5rem)]` normal, `inset-0` fullscreen). Each slide currently uses:

```
flex items-center justify-center p-8 overflow-auto
  └─ max-w-4xl prose prose-lg
```

The combination of `items-center justify-center` plus `overflow-auto` is the root cause of the cut-off bug: when content's natural height exceeds the flex container, the centered child is positioned with negative offsets that scroll containers cannot reach. Standard fix: drop centering for tall content and let the scroll container start at the top.

For interactive modes, MDX components are registered once (current registration is for the `<Slide>` wrapper used by `SlideViewer` and `ArticleViewer`). All new modes are pure-React + Tailwind; the static export constraint (`output: 'export'`) means we cannot use server actions but client components are fine.

Stakeholders: a single author (the user) producing learning material; learners viewing it in a browser.

## Goals / Non-Goals

**Goals:**
- Slides of any reasonable length are fully reachable — no clipped top or bottom — with intuitive scroll behavior.
- Short slides still look visually balanced (not flush to the top with a sea of whitespace below).
- Authors can opt into four new presentation patterns (`Expandable`, `Reveal`, `Flashcard`, `Tabs`) by using components in `.mdx` without imports or boilerplate.
- Keyboard navigation stays predictable: existing arrow keys keep working, new `Space` behavior degrades gracefully when no `Reveal` is present.
- All four new components work in static export and in fullscreen mode.

**Non-Goals:**
- No animation library (Framer Motion etc.) — CSS transitions are sufficient.
- No persistence of expand/reveal/flip/tab state across page reloads (only URL-hash for slide index, as today).
- No auto-fit/text-shrink or auto-pagination — explicitly rejected in scoping.
- No author-side authoring tools (live preview, validation) — components fail gracefully if mis-used in MDX.

## Decisions

### 1. Replace centered flex with top-aligned scroll, with conditional centering for short content

**Decision:** Change the slide outer container to:

```
flex justify-center overflow-y-auto
  └─ w-full max-w-4xl my-auto px-8 py-8 (slide body)
```

Using `my-auto` on the child inside an `overflow-y-auto` parent gives "center if it fits, top-align and scroll if it doesn't" — a known idiom that works without JS measurement.

**Alternative considered:** JS-based ResizeObserver to toggle a `centered` class. Rejected — adds complexity and a render flash for a layout problem CSS already solves.

**Alternative considered:** Always top-align. Rejected — short title slides look unbalanced.

### 2. Cover layout keeps explicit centering

`<Slide layout="cover">` wraps its content in `flex flex-col items-center justify-center min-h-full`. Cover slides are intentionally always centered (title cards, section dividers). Keep this exactly as it is — `min-h-full` already plays well with the new scrolling parent.

### 3. New components live under `src/components/slide-modes/` and are registered globally

**Decision:** Add `src/components/slide-modes/{Expandable,Reveal,Flashcard,Tabs}.tsx`, each a `'use client'` component. Register them in the MDX components map alongside `Slide` so they're available in any `.mdx` file without imports.

**Alternative considered:** One file with all four. Rejected — Reveal needs `useContext` to find its slide, Tabs/Expandable use `useState` differently; separate files keep diffs reviewable.

### 4. Reveal coordinates with SlideViewer via context, not prop drilling

`<Reveal>` needs to know (a) is this slide currently active? and (b) when the user presses Space, has any Reveal on this slide consumed it?

**Decision:** `SlideViewer` provides a `SlideContext` with `{ isActive, registerReveal, advanceReveal }`. Each `<Reveal>` registers a step counter on mount; the viewer's keyboard handler checks if any reveal on the active slide still has steps left. If yes, `Space` advances the next pending step; if no, `Space` falls through to "next slide" (matching today's `ArrowRight` behavior).

**Alternative considered:** Global window event with custom event names. Rejected — leaks across slides and is hard to reason about.

**Alternative considered:** Reveal manages its own state entirely; viewer doesn't know. Rejected — then `Space` would always go to next slide, defeating the point.

### 5. State resets when slide changes

When the user navigates between slides, the off-screen slide unmounts visually but stays in the DOM (current behavior — opacity toggling). That means Expandable/Tabs/Flashcard state would persist if we did nothing. **Decision:** key each slide wrapper by `current` index in `SlideViewer`'s render of inactive slides — actually simpler: reset interactive state on slide-deactivate via an effect inside each component listening to `SlideContext.isActive`. Each interactive component resets to its initial state when its enclosing slide goes inactive.

**Alternative considered:** Persist state. Rejected — re-entering a flashcard slide and seeing the back already flipped is confusing for a learner.

### 6. Flashcard: CSS 3D flip, no library

Use `transform: rotateY(180deg)` with `transform-style: preserve-3d` and `backface-visibility: hidden`. Tailwind doesn't ship 3D utilities by default — add a small inline style or extend tailwind config. **Decision:** inline style is fine for one component; avoid config churn.

### 7. Tabs: keyboard support deferred to native focus

Tab buttons are real `<button>`s in a `role="tablist"`. Use Tab/Shift-Tab + Enter/Space rather than implementing arrow-key tab nav from scratch. Acceptable for a learning viewer.

### 8. Expandable: `<details>` element, styled

Use the native `<details>`/`<summary>` element with Tailwind styling. Free accessibility, free state, no JS. The `<ExpandableItem>` component just renders `<details><summary>{title}</summary>{children}</details>`. `<Expandable>` is a thin wrapper that adds spacing/styling and isn't strictly required — keep it for grouping consistency.

## Risks / Trade-offs

- **[Risk]** Cover slides or short slides may look slightly different after the layout change. → Mitigation: keep `<Slide layout="cover">` centering explicit; manually verify a handful of existing slides after the change.
- **[Risk]** `my-auto`-in-scroll-container has subtle browser quirks (older Safari). → Mitigation: target evergreen browsers only (no polyfill burden documented for this app); manually verify in Safari on macOS.
- **[Risk]** `Space` advancing a Reveal could surprise authors who expect Space = next slide. → Mitigation: only intercept Space when an active `<Reveal>` has pending steps; otherwise fall through. Document in component JSDoc.
- **[Risk]** Off-screen slides keep their interactive state in the DOM (opacity-hidden, not unmounted). → Mitigation: each interactive component resets via `SlideContext.isActive` effect (Decision 5).
- **[Trade-off]** No animation polish (just CSS transitions). Acceptable for a learning tool; can revisit if it feels janky.
- **[Trade-off]** No author-time validation that `<Reveal>` items are direct children. Mis-nesting just means some items don't reveal correctly; fail visible, not silent.

## Migration Plan

This is a single-PR change with no data migration:

1. Land the layout fix and the four components together.
2. Manually walk through existing materials in [content/](content/) (dev server, both fullscreen and windowed) to verify nothing regressed.
3. No rollback strategy needed beyond `git revert` — purely client-side, no persisted state.

## Open Questions

- Should `<Reveal>` support a "show all on last step" mode for printing/PDF export? Defer until a learner asks for it.
- Should `<Flashcard>` support multi-card decks (next/previous within one slide)? Defer; single card per `<Flashcard>` keeps the v1 small. Authors can use multiple `<Flashcard>` blocks for now.
