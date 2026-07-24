# Veriflow Design System

Inspired by Halo, Aether, Forge, and Pulse Lattice (uiverse.io).

## Philosophy

Veriflow treats the interface as a deep-space substrate where information becomes the source of light. Surfaces stack in three faint tiers of charcoal, hairline borders draw the geometry, and a single electric indigo carries every action while green, amber, and magenta act as discrete signal flares for status, data, and emphasis.

## Surface Tiers

| Tier  | Usage               | Token                    |
|-------|---------------------|--------------------------|
| Base  | Page background     | `#04030a` (`--surface`) |
| Raised| Cards, panels       | `bg-glass` (rgba white 3%) |
| Overlay| Modals, dropdowns  | `bg-glass-strong` (rgba white 5%) |

All surfaces use `backdrop-filter: blur()` for depth.

## Palette

```
Near-black canvas:    #04030a
Charcoal raised:      rgba(255,255,255,0.03)
Charcoal overlay:     rgba(255,255,255,0.05)

Primary (indigo):     #7458db
Primary light:        #b4a4ef
Primary glow:         rgba(116,88,219,0.35)

Signal green:         #27c93f   (valid, success)
Signal amber:         #ffbd2e   (warning, fixed)
Signal red:           #ff5f56   (risky, error)
Signal cyan:          #22d3ee   (info)
Signal magenta:       #d946ef   (emphasis)

Text heading:         #eceaf4
Text body:            #b9b8bf
Text muted:           #a5a4ab
Text subdued:         #696870

Border:               rgba(241,241,243,0.15)
Border hover:         rgba(116,88,219,0.3)
```

## Typography

- Font: Inter (sans-serif)
- Headings: font-medium, tracking-tight, low leading
- Labels: uppercase, 0.08em letter-spacing
- Monospace: verification results, API responses

## Motion

```
fade-in:    0.5s ease-out
slide-up:   0.6s cubic-bezier(0.16, 1, 0.3, 1)
float:      8s ease-in-out infinite  (background orbs)
scroll-in:  0.7s ease-out (Intersection Observer)
```

## Glass & Glow

- `bg-glass`: `rgba(255,255,255,0.03)` + `backdrop-filter: blur(24px)`
- `text-glow`: `drop-shadow(0 0 48px rgba(255,255,255,0.6))`
- Prismatic ribbon: thin gradient border `linear-gradient(90deg, cyan, magenta, amber)`
- Edge lighting: 1px pseudo-element glow on active elements

## Components

### Buttons
- Primary: `#eceaf4` bg, `#04030a` text, hover brightness 110%
- Secondary: border + transparent bg, hover white/5
- Ghost: transparent, hover white/4

### Cards
- Raised surface (`bg-glass`)
- 1px hairline border (`border-white/10` or `border-white/[0.06]`)
- Hover: `border-accent/20` + `shadow-accent-glow`

### Verification Status
- `deliverable` → green badge (`#27c93f`)
- `risky` → red badge (`#ff5f56`)
- `fixed` → amber badge (`#ffbd2e`)

## Dot Lattice

Background pattern of `60x60` grid dots at `rgba(116,88,219,0.04)` used on feature sections.

## Grain Overlay

Fixed SVG noise texture at `opacity: 0.035`, applied globally via `grain-overlay`.
