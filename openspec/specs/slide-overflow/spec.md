# slide-overflow Specification

## Purpose
TBD - created by archiving change enhance-slide-experience. Update Purpose after archive.
## Requirements
### Requirement: Long slide content SHALL be fully reachable via vertical scroll

When the rendered content of an individual slide exceeds the height of the slide viewport (windowed or fullscreen), the slide body SHALL provide vertical scrolling so that every part of the content — including the first and last lines — is reachable. No content SHALL be clipped at the top or bottom edge.

#### Scenario: Slide content taller than viewport in windowed mode
- **WHEN** the user navigates to a slide whose content's natural height exceeds the windowed viewport height
- **THEN** the first line of the slide content is visible at the top of the slide area
- **AND** the user can scroll down to read the last line of the slide content

#### Scenario: Slide content taller than viewport in fullscreen
- **WHEN** the user is in fullscreen mode (toggled via `f`) and on a slide whose content exceeds the fullscreen viewport
- **THEN** the slide body scrolls vertically within the fullscreen area
- **AND** the navigation bar remains pinned and reachable

#### Scenario: Mouse wheel and trackpad scroll the slide
- **WHEN** the user scrolls with mouse wheel or trackpad while a long slide is active
- **THEN** the slide content scrolls vertically
- **AND** scrolling does not advance to the next slide

### Requirement: Short slide content SHALL remain visually centered

When the rendered content of a slide fits within the viewport without overflow, the slide body SHALL appear vertically centered within the available area (not flush to the top with empty space below).

#### Scenario: Slide content shorter than viewport
- **WHEN** the user navigates to a slide whose content's natural height is less than the viewport height
- **THEN** the slide content is vertically centered in the slide area

#### Scenario: Cover-layout slide
- **WHEN** the user navigates to a slide using `<Slide layout="cover">`
- **THEN** the slide content is horizontally and vertically centered, regardless of content length up to the viewport height

### Requirement: Slide horizontal width SHALL remain bounded

The slide body SHALL constrain its content to a maximum readable width (matching the existing `max-w-4xl` prose constraint) and center horizontally, so behavior changes only on the vertical axis.

#### Scenario: Wide viewport
- **WHEN** the slide viewer is rendered in a viewport wider than the maximum content width
- **THEN** the slide content is horizontally centered with bounded width
- **AND** slide content does not stretch full-width

### Requirement: Slide-change SHALL reset scroll position to the top

When the user navigates from one slide to another, the newly active slide SHALL be positioned so its content starts at the top of the viewport (or centered if it fits without overflow). Stale scroll offsets from the previous viewing of any slide SHALL NOT carry over.

#### Scenario: Returning to a previously-scrolled slide
- **WHEN** the user has scrolled to the bottom of a long slide, navigated away, and navigated back to that same slide
- **THEN** the slide is shown from the top (or centered if short), not at the previous scroll position

