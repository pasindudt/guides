## 1. Slide overflow fix

- [x] 1.1 In [src/components/SlideViewer.tsx](src/components/SlideViewer.tsx), replace the `flex items-center justify-center p-8 overflow-auto` slide container with a `flex justify-center overflow-y-auto` parent and a `my-auto px-8 py-8 w-full max-w-4xl prose dark:prose-invert prose-lg` child so short slides center and long slides scroll.
- [x] 1.2 Reset scroll position to top on slide change (e.g. via a `ref` on the active slide's scroll container and `scrollTop = 0` in an effect keyed on `current`).
- [ ] 1.3 Verify cover layout still centers: open a material that uses `<Slide layout="cover">` in dev (`npm run dev`) and visually confirm.
- [ ] 1.4 Manually verify in windowed mode: short slide centers, long slide top-aligns and scrolls, first and last lines reachable.
- [ ] 1.5 Manually verify in fullscreen (`f`): same behavior, navigation bar pinned and reachable.
- [ ] 1.6 Manually verify in Safari and Chrome on macOS that `my-auto` inside an overflow scroll container behaves as expected.

## 2. Slide context for interactive coordination

- [x] 2.1 Create `src/components/slide-modes/SlideContext.tsx` exporting a `SlideContext` with `{ isActive: boolean, registerReveal, unregisterReveal, advanceReveal, hasPendingReveal }`.
- [x] 2.2 In [src/components/SlideViewer.tsx](src/components/SlideViewer.tsx), wrap each rendered slide in a `SlideContext.Provider` whose `isActive` reflects whether `i === current`.
- [x] 2.3 Maintain a per-slide registry of Reveal components keyed by slide index in `SlideViewer` state; expose `advance` and `hasPending` for the active slide.
- [x] 2.4 Update the keyboard handler so `Space` advances a pending Reveal on the active slide first; only if none pending does it call `goTo(current + 1)`.

## 3. Expandable component

- [x] 3.1 Create `src/components/slide-modes/Expandable.tsx` exporting `Expandable` (group wrapper, adds spacing/border styling) and `ExpandableItem` (renders native `<details><summary>{title}</summary>{children}</details>` with Tailwind styling and a chevron indicator that rotates on `[open]`).
- [x] 3.2 Style the summary with focus-visible ring and hover state for keyboard accessibility.
- [x] 3.3 In an effect listening to `SlideContext.isActive`, reset `<details>` `open` attribute to `false` when the slide deactivates.

## 4. Reveal component

- [x] 4.1 Create `src/components/slide-modes/Reveal.tsx` exporting `Reveal` and `RevealItem`.
- [x] 4.2 `Reveal` registers itself with `SlideContext` on mount with a step counter equal to the number of `RevealItem` children minus 1; unregisters on unmount.
- [x] 4.3 `RevealItem` reads its index from a local context provided by `Reveal` and renders only when its index ≤ current step count.
- [x] 4.4 Use a CSS opacity/translate transition on item appearance for a non-jarring reveal.
- [x] 4.5 Reset step count to 0 when `SlideContext.isActive` becomes `false`.

## 5. Flashcard component

- [x] 5.1 Create `src/components/slide-modes/Flashcard.tsx` accepting `front: ReactNode | string` and `back: ReactNode | string` props.
- [x] 5.2 Render two stacked faces with `transform-style: preserve-3d`, `backface-visibility: hidden`, and a `rotateY(180deg)` flip on the back face when flipped state is true.
- [x] 5.3 Make the card a real `<button>` so Enter/Space toggle flip; add `aria-pressed` for screen-reader state.
- [ ] 5.4 If a `<Reveal>` on the same slide has pending steps, the keyboard handler in `SlideViewer` already wins for `Space`; verify the card's onClick still fires for mouse clicks.
- [x] 5.5 Reset flipped state when `SlideContext.isActive` becomes `false`.

## 6. Tabs component

- [x] 6.1 Create `src/components/slide-modes/Tabs.tsx` exporting `Tabs` and `Tab`.
- [x] 6.2 `Tabs` reads its `Tab` children, builds a `role="tablist"` of `<button>`s with `role="tab"` and `aria-selected`, and renders the active tab's children below in `role="tabpanel"`.
- [x] 6.3 `Tab` accepts `label: string` and `children: ReactNode`; it is data-only — the actual rendering is driven by `Tabs`.
- [x] 6.4 Reset active tab to index 0 when `SlideContext.isActive` becomes `false`.

## 7. MDX registration

- [x] 7.1 Locate where MDX components are passed to the renderer (per-route under [src/app/\[category\]/](src/app/[category]/), and/or in [src/components/ArticleViewer.tsx](src/components/ArticleViewer.tsx) and [src/components/SlideViewer.tsx](src/components/SlideViewer.tsx)).
- [x] 7.2 Add `Expandable`, `ExpandableItem`, `Reveal`, `RevealItem`, `Flashcard`, `Tabs`, `Tab` to the MDX components map alongside `Slide`.
- [ ] 7.3 Verify a sample `.mdx` slide can use each component without an `import` line.

## 8. Demo / verification content

- [x] 8.1 Add a single demo material under [content/](content/) (e.g. `content/demo/slide-modes.mdx`) that exercises each new component in its own slide and includes one deliberately long slide to verify scrolling.
- [ ] 8.2 Run `npm run dev` and step through every slide in the demo: scroll, expand, reveal (Space), flip, and tab-switch.
- [ ] 8.3 Verify in fullscreen.
- [x] 8.4 Run `npm run build` and confirm the static export succeeds.

## 9. Cleanup

- [x] 9.1 Run `npm run lint` and address any warnings introduced.
- [ ] 9.2 Walk through 2–3 existing materials to confirm no visual regression from the layout change.
