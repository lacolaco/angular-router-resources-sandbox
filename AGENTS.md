# AGENTS.md

Guidance for coding agents working in this repository.

## Purpose

This is a demo app that provides the sample code for a blog post about Router Resources, implemented in Angular v22.2. Write code on the assumption that the post will quote it. Focus on showing how Router Resources behaves, and do not add abstractions or features that the explanation does not need.

The Router Resources API is new and may be missing from training data. Do not guess the shape or behavior of the API. Check the type definitions in `node_modules/@angular/router` or the official documentation (`search_documentation` in the angular-cli MCP server) before writing code.

## Language

Write everything that is published from this repository in English. This covers:

- Code, including identifiers, comments, and test names
- Documentation such as the README and this file
- Commit messages
- Pull request titles and descriptions
- Comments on pull requests and issues

## Commands

The package manager is npm (`package-lock.json`).

- Dev server: `npm start` (`ng serve`, http://localhost:4200/)
- Build: `npm run build` (production configuration by default)
- Test: `npm test` (Vitest + jsdom, `@angular/build:unit-test`)
  - Run once: `npx ng test --watch=false`
  - A single file: `npx ng test --watch=false --include src/app/app.spec.ts`
  - Filter by test name: `npx ng test --watch=false --filter '^App'`
  - The test build runs the type checker, so a type error in a spec file fails the run.
- Format: `npx prettier --write <path>` (`.prettierrc`: printWidth 100, single quotes, the angular parser for HTML)

No linter is configured.

## Structure

The app uses standalone components only, with no NgModules, and runs zoneless.

- `src/main.ts` bootstraps with `bootstrapApplication(App, appConfig)`.
- `src/app/app.config.ts` is where the router is configured. Pass router features (`with*` functions) to `provideRouter` here.
- `src/app/app.routes.ts` mounts each use case under `children`.
- Each use case in the blog post has its own directory under `src/app/` (`blocking`, `non-blocking`, `parallel`, `reload`, `search`, `http`, `type-safe`), with a `*.routes.ts`, its components, and a `*.spec.ts` that checks the behavior with `RouterTestingHarness`.
- `src/app/user.service.ts` and `src/app/post.service.ts` are in-memory mocks whose delays (200ms and 300ms) match the numbers in the blog post.
- `src/app/app.html` links to every use case. When you add a use case, add a link here and a section to the README tour.
