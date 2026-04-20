# Summary for Frontend Research

## General Frontend Practices

- Readable Code: Code should be consistently formatted and styled across all files
- Semantic HTML: Use correct HTML tags for its purpose and not make div soup
- Responsive Design: Website should be responsive and look like its tailored for every form factor
- Accessibility: Website should be accessible for people with disabilities.
- Separation of Concerns
- Performance: Lazy load assets nor immediately needed. Bundle assets. Avoid unneccessary re-renders.
- Cross Browser Compatibility
- Error Handling: Display errors to users in a meaningful way.
- Frontend JS: One function = one job. Toggle CSS classes to change visual state rather than setting .style directly in JS.

## Website Visuals

- Branding
  - Audience analysis
  - Competitor Analysis
- Color Palette
  - 60/30/10 rule
  - Complementary colors to separate sections
- Visual Hierarchy: guides visitors to important parts of the page
  - Symmetrical design
- Scale: brings attention to important details
  - 3 sizes max: Small, medium, and large sizes. Generally, the sizes range
    from 14 px to 16 px for body copy, 18 px to 22 px for subheadings,
    and up to 32 px for headings.
  - Enlarge important elements
- Navigation
  - Horizontal menu (Desktops)
  - Hamburger menu (Mobile)

## Slot Machine Frontend

- NO SCROLL
- Reels: Vertical columns that spin 3-5 reels tracked per spin (to account for paylines), instead of just 1 row of
  symbols
- Paylines: Patterns across reels that count as a win. Can be Straight or Zig-zag.
- Symbols: We would have different types
  - Standard symbols = basic payouts
  - Wildcard symbols = substitutes for others
  - Scatter symbols = triggers bonuses,
    - can be anywhere in the reels.
    - More than 3 scatter symbols to trigger
  - Bonus symbols = free spins
- Theme: Have atleast 5 themed slot machines
- Colors: Bright and dark background for contrast

### Animations

**GOAL:** Losses should feel smooth and quick, wins should feel big and rewarding

- When game is idle:
  - No big animations
  - “Calm” to save the excitement for when game is going
  - Reels: stopped
  - Spin button: glowing
  - Balance: visible
- Reel spin animation
  - Smooth spinning
  - A slight “shake” when it stops spinning
  - Reels STOP 1 by 1 to create tension.
  - “Spin” button “light” dims
- Win animations
  - Splash screen
  - Flashing symbols
  - Coins flying
  - Screen shake
  - When bonus is achieved: Separate set of animations (more grand)
- But when players “lose”
  - We need to move on quick
  - Spin button lights back up

### Layout

- Reels on majority of screen
- Spin button
  - Large, bottom center below reels
- Balance display
- Bet controls
- Paytable
- rules/how to play
- Mute sound
- Control settings - for bright lights

## Technologies

- React/CSS for frontend
