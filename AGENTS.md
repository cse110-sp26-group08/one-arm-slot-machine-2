# Project Overview

This project is a fully fledged Slot Machine website. Users will login or play as guest. They will be able to compete through leaderboards and send friend requests. There will be multiple slot machines on the website, all of which should work the same but have different themes. There will also be a streaks feature where a user will be required to spin the slot machine once everyday to maintain their streak and on reaching a certain threshold unlock new slot machines/themes. There should also be a few slot machine available to buy from the in game store using the ingame cosmetic currency (which is the same as playing tokens but they do not get spent when the game is played). The main currency of the game will be tokens. Each spin would require a certain amount of tokens and that would be subracted from their token balance. On winning tokens the same amount of tokens will also be added to cosmetic currency.

# Architecture and Structure

/backend\
/backend/controllers\
/backend/models\
/backend/routes\
/backend/validators\
/backendapp.ts\
/frontend\
/frontend/components\
/frontend/pages

# Workflow

## Tech Stack

You will be using the MERN stack for developing this project.

## Workflow Guidelines

1. You will be given a github issue in the prompt and your job is to implement this issue which will be a feature requested by a user.
2. Once you are done with the feature you will first design tests to test the feature you implemented
3. Then you will raise a PR request signaling what fetaure you completed, and which issue resolved.
4. Have the tests be stored in tests folder.

# Skills

You have a few skills at your disposal.

1. Playwright skill which will allow you to visit the project in the broswer while you are building it.
2. GitHub skill that will allow you to raise PRs.

# Coding conventions

Source code must be appropriately document. JavaScript/TypeScript should use JSDocs with type annotations.

# Unit tests

Unit tests are required at a bare minimum. End-to-end tests with Playwright are suggested. Link to playwright https://playwright.dev/

# Following the principles of [clean code](https://blog.codacy.com/what-is-clean-code). you should use:

- Meaningful names for variables,functions, and classes
- Small functions and classes
- AVOID: duplicate code
- Handle errors
- use appropriate abstraction and modularity
- Do not make the code super bloated
- Have an organization scheme for files and organize files by if they are used together
- Keep the code style consistent

# constraints and reminders

- Make tests for your code
- follow the clean code guidelines
