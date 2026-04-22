# Initial strategy we are employing

- We equippied Codex with the Playwright and frontend skills to allow for it to check what its doing with a browser.
- We also equipped Codex with a variety of other skills to allow for it create PRs and resolve issues we make on github. This is covered by the github skill but codex store also showed us another skill that we acquired that supposedly did this as well.
- We will be using GPT-5.4 with medium reasoning.
- We will be focusing on giving it very well specified issues on github so that it can execute and open a PR on them
-  We will also stray away from this strategy as bugs start arising but until then we will brute-force codex to resolve the specifications of github issues we make.
-  We did not try any adversarial agents to critique our code since we only were on the 20$ plan for codex.

# strategy update starting from log-4

- even with the AGENTS.md file, codex was not modularizing its code. It might be benefical for us to spend a few turns just making sure codex understands that it should not be utilizing one file to store its code in. 
- It seems like the AGENTS.md file was not really being taken into account so drilling this into the AI's head to write modular code is a need
- We are still going to stick with the give issues to the agent and it creates a pr for them approach.
  

# strategy update starting from log-11

- The model is making more bugs than anticipated
- SO we need to adjust our strategy for this and just solely focus on resolving bugs before making new github issues
- After we can resume with our original strategy

#   strategy update starting from log-15

- The agent can not get its own dependencies for animations and images.
- This should not have been suprising to us but we cant find a skill that allows models to do this natively, so we have to spend some time gathering these assets.
- After this we can resume with making issues for the agent.