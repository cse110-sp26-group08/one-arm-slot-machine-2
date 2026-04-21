# Summary of research done on codex

## General tips on how to use codex

### Create a good Agents.md file

This is task-specific but having an Agents.md is a given when working with Agents. One should have an template they use for what information to distribute to the agent, but this is very team dependant. Example being, what code structure are you looking for? What is the theme of the app your building? This should go in the Agents.md file. What kind of tests should the agent write? From now on we will use Codex web snce it allows for parrallelization to solve various issues in github simultaneously.

### Using Parallelization

By connecting GitHub repository to codex, we can create detailed issues on github and ask codex to implement them. Codex can simultaneously work on multiple issues using multiple tasks. Once codex finishes the task, we can ask it to create pull request which we can then review and merge the changes to main.

### Using skills

Allows our model to become an expert in one particular thing
Full documentation Agent Skills – Codex | OpenAI Developers
https://developers.openai.com/codex/skills?utm_source=chatgpt.com

Example, when we have different instances of gpt-5.4 we should give each instance a different skill. For example Frontend or backend
Skills should go in SKILLS.md file and will be only used when that specific skill needs to be invoked.

### using MCPs

The main thing we should keep in mind for our project is utilizing the ready MCP’s that can allow codex to view the browser, access figma for designing an interesting UI

**Important**: We should not overwhelm codex with MCP’s as too many mcps just become cumbersome in the long run.

Useful @playwright/mcp - npm playwright mcp, allows the model to look at browsers.

ChromeDevTools/chrome-devtools-mcp: Chrome DevTools for coding agents useful for if our browser is chrome.
