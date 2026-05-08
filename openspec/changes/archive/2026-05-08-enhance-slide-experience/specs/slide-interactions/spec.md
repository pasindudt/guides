## ADDED Requirements

### Requirement: MDX authors SHALL have access to interactive slide-mode components without imports

The system SHALL register the following components in the global MDX components map so authors can use them in any `.mdx` material without an import statement: `Expandable`, `ExpandableItem`, `Reveal`, `RevealItem`, `Flashcard`, `Tabs`, `Tab`.

#### Scenario: Author uses an interactive component in MDX
- **WHEN** an author writes `<Flashcard front="What is X?" back="X is Y" />` inside an `.mdx` file in `content/`
- **THEN** the component renders in the slide viewer without the file needing an `import` line
- **AND** the same component name resolves identically across all categories and materials

### Requirement: Expandable items SHALL toggle visibility on click

`<ExpandableItem title="…">` SHALL render a clickable header showing the title. Clicking the header SHALL toggle the visibility of the item's body content. Multiple `<ExpandableItem>` components SHALL be independently toggleable.

#### Scenario: Click expands a collapsed item
- **WHEN** the user clicks the header of a collapsed `<ExpandableItem>`
- **THEN** the item's body content becomes visible
- **AND** the header indicates the expanded state

#### Scenario: Click collapses an expanded item
- **WHEN** the user clicks the header of an expanded `<ExpandableItem>`
- **THEN** the item's body content is hidden
- **AND** the header indicates the collapsed state

#### Scenario: Multiple items expand independently
- **WHEN** the user expands one item and another remains collapsed
- **THEN** the state of each item is independent

#### Scenario: Keyboard accessibility
- **WHEN** the user focuses an `<ExpandableItem>` header and presses `Enter` or `Space`
- **THEN** the item toggles its expanded state

### Requirement: Reveal SHALL show child items progressively

`<Reveal>` SHALL render its `<RevealItem>` children one at a time. The first item SHALL be visible on slide entry; subsequent items SHALL appear in source order each time the user advances the reveal. Items already revealed SHALL remain visible.

#### Scenario: Initial state shows only the first item
- **WHEN** the user navigates to a slide containing `<Reveal>` with three `<RevealItem>` children
- **THEN** only the first item is visible
- **AND** the remaining items are hidden

#### Scenario: Space advances the next item
- **WHEN** the user presses `Space` and at least one `<RevealItem>` is still hidden on the active slide
- **THEN** the next hidden item becomes visible
- **AND** the slide does not advance to the next slide

#### Scenario: Space falls through after all items revealed
- **WHEN** all `<RevealItem>` children on the active slide are visible and the user presses `Space`
- **THEN** the slide viewer advances to the next slide

#### Scenario: Reveal state resets when leaving the slide
- **WHEN** the user advances some items, navigates to a different slide, and returns
- **THEN** the reveal state is reset and only the first item is visible

### Requirement: Flashcard SHALL flip between front and back faces on click

`<Flashcard front=… back=…>` SHALL render a card showing the `front` content. Clicking the card SHALL flip it to show the `back` content; clicking again SHALL flip back to the front.

#### Scenario: Initial state shows the front
- **WHEN** the user navigates to a slide containing a `<Flashcard>`
- **THEN** the front face is visible
- **AND** the back face is hidden

#### Scenario: Click flips to the back
- **WHEN** the user clicks the card
- **THEN** the back face becomes visible
- **AND** the front face is hidden

#### Scenario: Click again flips back
- **WHEN** the user clicks the card while the back face is showing
- **THEN** the front face becomes visible again

#### Scenario: Flip state resets when leaving the slide
- **WHEN** the user flips a card, navigates away, and returns
- **THEN** the card is shown front-side up

#### Scenario: Keyboard accessibility
- **WHEN** the user focuses the card and presses `Enter` or `Space`
- **THEN** the card flips
- **AND** if `<Reveal>` is also present and has pending steps, `Space` advances the reveal instead (Reveal takes precedence)

### Requirement: Tabs SHALL switch sub-content within a slide

`<Tabs>` SHALL render a tablist of its `<Tab label=…>` children's labels. The first `<Tab>` SHALL be active by default. Clicking a tab label SHALL show that tab's content and hide others.

#### Scenario: Initial render shows the first tab
- **WHEN** the user navigates to a slide containing `<Tabs>` with three `<Tab>` children
- **THEN** the first tab's content is visible
- **AND** the first tab's label is marked as active

#### Scenario: Click switches the active tab
- **WHEN** the user clicks the label of a non-active tab
- **THEN** that tab's content becomes visible
- **AND** the previously active tab's content is hidden
- **AND** the active label indicator moves to the clicked tab

#### Scenario: Tab state resets when leaving the slide
- **WHEN** the user activates a non-first tab, navigates away, and returns
- **THEN** the first tab is active again

#### Scenario: Keyboard accessibility
- **WHEN** the user focuses a tab label and presses `Enter` or `Space`
- **THEN** that tab becomes active

### Requirement: Interactive components SHALL coexist with existing slide navigation

The introduction of interactive components SHALL NOT break existing keyboard navigation: `ArrowRight`, `ArrowDown`, `ArrowLeft`, `ArrowUp`, `f` (fullscreen), and `Escape` SHALL behave exactly as before.

#### Scenario: Arrow keys still navigate slides regardless of interactive content
- **WHEN** the user is on a slide containing any combination of `<Expandable>`, `<Reveal>`, `<Flashcard>`, or `<Tabs>` and presses `ArrowRight`
- **THEN** the slide viewer advances to the next slide regardless of interactive component state

#### Scenario: Fullscreen toggle still works
- **WHEN** the user is on a slide with interactive components and presses `f`
- **THEN** fullscreen mode toggles
- **AND** interactive components remain functional in fullscreen
