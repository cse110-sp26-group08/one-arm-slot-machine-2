# Research Summary

## Structural Overview of Summaries

### Frontend Summary

[Detailed frontend summary (click)](./raw-research/frontend/summary.md)

**Domain (Problem Space):**

- Code Quality Standards: Consistent formatting/styling, semantic HTML (no div soup), readable code with meaningful JS patterns (one function = one job), toggle CSS classes instead of inline .style
- Responsive & Accessible Design: Adapt to all form factors, accessibility for people with disabilities, cross-browser compatibility
- Performance Optimization: Lazy load non-critical assets, bundle assets, avoid unnecessary re-renders
- Error Handling: Display meaningful error messages to users
- Visual Design Principles: Branding (audience/competitor analysis), color theory (60/30/10 rule, complementary colors for section separation), visual hierarchy with symmetrical design, typography scale (14-16px body, 18-22px subheadings, up to 32px headings)
- Navigation Patterns: Horizontal menus for desktop, hamburger menus for mobile
- Animation Philosophy: Loss states smooth & quick, win states big & rewarding; save excitement for active gameplay
- Technologies: React/CSS

**User-Related Artifacts:**

- Game UI Structure: No scroll design, 3-5 vertical reels tracked per spin (for payline calculation), paylines in straight or zig-zag patterns, symbol types (standard=base payouts, wildcard=substitutes, scatter=bonus trigger at 3+, bonus=free spins)
- Machine Theming: 5+ distinct themed slot machine variations with bright/dark background contrast
- Layout & Controls: Reels occupy majority of screen, large spin button centered below, balance display, bet adjustment controls, accessible paytable, rules/how-to-play section, sound mute toggle, brightness settings
- Idle State: No large animations, calm presentation, reels stopped, spin button glowing, balance clearly visible
- Reel Spin Sequence: Smooth spinning animation, slight shake when stopping, reels stop 1-by-1 to build tension, spin button light dims during spin
- Win Animations: Splash screen, flashing symbols, flying coins, screen shake, bonus triggers receive more grand/elaborate animations
- Loss Handling: Quick smooth transition, spin button re-lights promptly

### Backend Summary

[Detailed backend summary (click)](./raw-research/backend/summary.md)

**Domain (Problem Space):**

- Code Quality: Meaningful variable/function names, consistent formatting, small focused functions, separation of concerns, eliminate duplication
- Reliability & Security: Error handling with logging, meaningful error messages, handle exceptions without crashes, validate all user input, type checking, sanitize inputs to prevent attacks
- Documentation: Clean functional documentation (no unnecessary comments), proper function and complex code block documentation
- Extensibility: Design code to accommodate future feature additions without modifying existing code
- Quality Assurance: Write unit tests, maintain linter compliance
- Technologies: Node.JS

**User-Related Artifacts:**

- Machine Library: 5+ different slot machine variants/themes available to players
- Symbol System: Multiple symbol types (wilds that substitute, scatters that trigger bonuses) with distinct behaviors and payout rules
- Reward Mechanics: Free spins on trigger, hourly bonus tokens, progressive jackpots
- Gambling Features: Double or Nothing risk/reward mechanics
- Player Engagement: Login system with persistent accounts, leaderboard rankings for competition

### Users/UX Summary

[Detailed users/ux summary (click)](./raw-research/users/summary.md)

**Domain (Problem Space):**

- Volatility Strategy: Low volatility (frequent modest wins) maintains engagement; high volatility (longer dry spells with occasional big payouts) creates anticipation and excitement
- RTP Economics: RTP = (probability of each outcome) × (payout of that outcome); 98-99% RTP = 1-2% house edge = sustainable profitability; achieved by weighting symbol combinations and designing payout structures
- Near Miss Psychology: Research-proven that near misses increase motivation to continue playing, speed up next spin, and increase later betting; can be systematically programmed into reward sequences
- Virtual Reel Implementation: Use RNG to select from large set of virtual reel positions (mapped to symbols as hashmap); weighted virtual reel positions directly control symbol combination frequencies displayed to player
- Sound Science: Players misremember win frequency when sound is on vs mute; sound makes wins feel more significant than losses, draws attention, raises player self-esteem, increases cognitive load (creates feeling of excitement), gives perception that winning is more common
- Sound Design Principle: Audio effects must align with game theme and be audible over ambient noise

**User-Related Artifacts:**

- Retention Mechanics: New themes released regularly, seasonal limited-time events, missions/objectives, collections to unlock, achievement/progression tracks
- Reward Tiers: VIP tier system, daily login streak bonuses, non-cash cosmetic rewards, occasional low-complexity bonus events
- Community Features: Leaderboards for competition, shared "bank" that accumulates showing eventual big payouts are possible (builds hope)
- Experience Optimization: Sound paired with win animations to emphasize success, atmosphere designed to make players overlook/forget losses, near-misses strategically placed to maintain engagement

### Codex/Development Strategy Summary

[Detailed codex summary (click)](./raw-research/codex/summary.md)

**Domain (Problem Space):**

- Parallelization Workflow: Connect GitHub repository to Codex, create detailed issues, assign multiple simultaneous tasks to agents, agents work in parallel on different issues, generate pull requests for review and merge
- Agent Architecture Principles: Skills-based specialization (each agent instance given specific skill like frontend/backend) prevents context overload and increases focus; selective MCP use avoids overwhelming model capabilities
- Team Coordination: Clear templates enable consistent agent behavior and task understanding across team implementations

**User-Related Artifacts (Development Configuration):**

- Agents.md Template: Standard format including code structure expectations, project/app theme context, testing requirements and standards, task distribution strategy
- Skills.md Definition: Specialized skill cards defining when to invoke specific agent expertise (frontend skills, backend skills, etc.) to maintain focus; each instance of agent has different skill
- GitHub Integration: Detailed issue creation for each task, parallel task execution capabilities, automated PR generation from completed tasks
- MCP Configuration: @playwright/mcp for browser viewing and automation, Chrome DevTools MCP for browser-based debugging and inspection

## Research Task Breakdown

| Member           | Contribution                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | raw-research file                                                                                                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Himir            | I Worked on researching how to use codex effectively to parallelize tasks and complete the project faster. I then researched on which codex harness would work the best for our project. I also worked on summarising frontend, backend and codex raw research into a single summary file which could be used to plan the project and prompts to codex.                                                                                                                                           | [himir-research](./raw-research/codex/himir-research.pdf)                                                                                                                             |
| Matthew Bozoukov | I primarily worked on figuring out the user experince side of the slot machine. This includes figuring out how to weigh the different symbols to make the user win just the right amount that they will stay. I also read through the play store for various slot machine apps and seeing what users liked/disliked about these apps. I worked on figuring out which MCPs would be useful for our project. Also, researched how to use agent skills and what we should put in our AGENTS.md file. | [codex matthew-bozoukov-research](./raw-research/codex/matthew-bozoukov-research.pdf) [users vinh-matthew-bozoukov-research](./raw-research/users/vinh-matthew-bozoukov-research.pdf) |
| Ki               | I researched general good front end coding practices to figure out good front end design to make the UI more appealing and accessible to users. I also researched into best security practices for front end design to prevent malware attacks and loss of user data. Lastly, I researched into what tools are best in varying contexts for front end design                                                                                                                                      | [ki-research](./raw-research/frontend/general/ki-research.pdf)                                                                                                                        |
| John             | I researched slot machine design to understand how reels, paylines, and symbols work together in gameplay. I also looked into animations and UI design, especially how things like spin timing, win effects, and layout can make the game feel more engaging and smooth.                                                                                                                                                                                                                          | [john-research](./raw-research/frontend/slot-machine/john-research.pdf)                                                                                                               |
| Vinh             | I researched on the science behind sound design for slot machines such as its importance and how it affects the user when playing. I also looked at reasons as to why people would come back to play the slot machine.                                                                                                                                                                                                                                                                            | [vinh-matthew-bozoukov-research](./raw-research/users/vinh-matthew-bozoukov-research.pdf)                                                                                             |
| Felix            | I researched common features of online slot machines to understand what techniques are used to retain and entertain users. This specifically encompassed reward/payout systems / game mechanics.                                                                                                                                                                                                                                                                                                  | [felix-research](./raw-research/backend/slot-machine/felix-research.pdf)                                                                                                              |
| William          | I researched general good backend coding practices. I went over basics like readability, security, testing and more.                                                                                                                                                                                                                                                                                                                                                                              | [william-research](./raw-research/backend/general/william-research.pdf)                                                                                                               |
| Yang             | I researched what most slot apps look like today and summarized the features that appear most often, such as daily rewards, jackpots, bonus rounds, tournaments, and social/VIP systems. I also connected these features to backend design ideas like wallet systems, event management, modular content support, and ranking or reward services.                                                                                                                                                  | [yang-research](./raw-research/backend/slot-machine/yang-research.md)                                                                                                                 |
| Yusuf            | I researched general backend coding practices such as writing secure code, modularizing components (breaking the code into smaller independent pieces) , and implementing proper error handling to understand how to build a scalable and maintainable system.                                                                                                                                                                                                                                    | [yusuf-research](./raw-research/backend/general/yusuf-research.pdf)                                                                                                                   |
| Nikita           | I researched general frontend coding practices such as making the frontend better for users to interact with the website. I also found general formats for the code that we should use. In relevance to the slot machine, there are certain features we can implement within the frontend to make our slot machine better for the users.                                                                                                                                                          | [nikita-research](./raw-research/frontend/general/nikita-research.pdf)                                                                                                                |
| Matthew Beaudin  | I researched common/proper frontend coding practices to better understand the frontend design and development aspects of the project. During this I learned about the various do's and dont's of frontend coding to help ensure that our team is more efficient during development. I also researched common frontend components and features that are standard amongst many applications such as security, input validation, and many more.                                                      | [matthew-beaudin-research](./raw-research/frontend/general/matthew-beaudin-research.pdf)                                                                                              |
