# SORAA UI/UX audit — 14 October 2026

Scope: initial source-code audit, not a completed visual or accessibility certification.
Preserve approved branding, copy, category layout, and product-page purchase behaviour.

## Principles

- Clear heading hierarchy and predictable navigation.
- Consistent spacing and readable type without clipping at narrow widths.
- Visible keyboard focus, operable dialogs, and comfortable touch targets.
- Respect reduced-motion preferences and provide animation controls.
- Keep purchase feedback and errors visible; never imply a successful order without confirmation.

Reference: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/

## Implemented in this pass

- Cart/search/menu drawers: focus moves to close button, cycles within the panel, returns to the opener, and locks background scrolling.
- Closed overlays hidden from interaction; labelled backdrop close control.
- Stable drawer close callback avoids resetting focus on routine provider renders.
- Social gallery heading changed from additional H1 to H2, preserving its visual size.
- Shared focus indicators and 44px minimum targets for small carousel/pause controls.
- Mobile category headings use container-relative sizes and allow wrapping instead of forcing oversized no-wrap labels.
- Form input text remains 16px; footer links gain vertical hit-area spacing.

## Remaining verification / decisions

- Local preview was unavailable on localhost:3000 during this pass. Verify 320, 390, 768 and 1440px layouts in a browser before publishing.
- Check drawer tab order, Escape, focus return, scrolling, and cart success/error feedback with real interactions.
- Shop categories “Nuts & Raisins” and “Dry Fruits” both point to /collections/dry-fruits. A distinct collection destination needs confirmation; not invented here.
- Desktop hero artwork is cropped for mobile. Verify embedded headline/CTA visibility; a dedicated portrait creative may be needed.
- Permanent chat tooltip can overlap mobile content; preserving the explicitly approved always-visible behaviour pending visual testing.
- Validate contrast across orange/white text combinations and imagery before claiming WCAG compliance.
- Forms need real end-to-end delivery testing; no external test submissions were sent.
- A full production-page visual audit and checkout testing remain outstanding.
