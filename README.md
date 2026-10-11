# Angular Router Resources Sandbox

A sample app that shows Router Resources, introduced in Angular v22.2, through a set of use cases. Each use case has its own directory and its own path, and every path is linked from the top page.

## Getting started

```bash
npm install
npm start      # http://localhost:4200/
npm test       # Vitest. Run once with: npx ng test --watch=false
```

## Read these first

- `src/app/app.config.ts`: passes `withComponentInputBinding()` and `withRouterResources()` to `provideRouter`. The former binds resources to component inputs, and the latter enables `Route.resources`. `provideHttpClient()` is there for the `httpResource` example.
- `src/app/app.routes.ts`: groups the routes of each use case under `children`.
- `src/app/user.service.ts` and `src/app/post.service.ts`: in-memory mocks. Fetching a user waits 200ms and fetching posts waits 300ms before resolving the `Promise`.

## Tour

In each use case, `*.routes.ts` declares the resources, the component shows how they are received, and `*.spec.ts` checks the behavior.

### 1. Blocking data fetching on navigation

- Open: `/blocking/users/1`
- Read: `src/app/blocking/`
- A `resource()` returned from the `resources` function is blocking by default. The navigation does not complete until the data is ready, and the component receives the fetched `User` through `input.required<User>()`, just like with a resolver.
- The test checks that the navigation does not complete before 200ms have passed.

### 2. Non-blocking data fetching

- Open: `/non-blocking/users/1`
- Read: `src/app/non-blocking/`
- Wrapping a resource with `nonBlocking()` lets the navigation complete without waiting for it. The component receives the resource itself instead of its value, and switches the view with `isLoading()` and `error()`.
- `Loading...` appears right away, and the name appears 200ms later.

### 3. Parallel data fetching across parent and child routes

- Open: `/parallel/users/1`
- Read: `src/app/parallel/`
- The parent route fetches the user (200ms), and a child route with an empty path fetches the posts (300ms). Router Resources loads the resources of the matched parent and child routes in parallel, so the navigation completes in about 300ms instead of 500ms.
- The test checks that the navigation has not completed at 299ms and has completed at 301ms.

### 4. Reloading without re-navigation

- Open: `/reload/blocking/users` and `/reload/non-blocking/users`
- Read: `src/app/reload/`
- Edit a name in the user list and press Save. After saving completes, the component calls `reload()` on the list resource. No navigation happens.
- The blocking list (`blocking-user-list.ts`) only receives the fetched value through its input, so it gets the resource from `inject(ActivatedRoute).resources?.['users']`.
- The non-blocking list (`non-blocking-user-list.ts`) calls `reload()` on the resource it receives as an input. The type with `reload` is not public, so it defines its own `RouteResource<T>`.
- The test renames another user on the server side only before saving, and checks that the new name shows up in the list after saving. This proves that the list was fetched again.

### 5. Reactive data fetching driven by query parameters

- Open: `/search/users?q=ali`
- Read: `src/app/search/`
- The search term lives in the query parameter `q` and is read from `ctx.queryParams()`. The resource is non-blocking, so the URL changes immediately and the results update afterwards.
- `search.routes.ts` extracts `q` with `computed` before reading it in the `params` function. `resource()` fetches again whenever a signal read in the `params` function changes, even if the returned value stays the same. Adding `&view=grid` to the URL does not trigger a new search.
- The input is written with Signal Forms (`form` and `[formField]`). In a zoneless app, reading the DOM value directly does not update the `queryParams` of the Search button when you type.
- The tests check that changing `q` triggers a new search and that changing other parameters does not.

### 6. Data fetching with `httpResource`

- Open: `/http/users/1`
- Read: `src/app/http/`
- The `resources` function can also return an `httpResource()`. It builds `/api/users/:id` from the path parameter and fetches again when the ID changes.
- On the dev server, static JSON files in `public/api/users/` serve the responses. In the tests, `HttpTestingController` responds.

### 7. Things to consider: type-checking resource names against input names

- Open: `/type-safe/users/1`
- Read: `src/app/type-safe/`
- Resource names declared on a route and input names on the component are linked only by matching names. `user-profile.resources.ts` checks the resource declaration with `satisfies`, and the component `implements` the derived `UserProfileResourceInputs`.
- `type-check.spec.ts` lists code that should not compile, each marked with `@ts-expect-error`. The test build runs the type checker, so the build fails if any of these compiles. `satisfies` catches a misspelled resource name, and `implements` catches a missing input, a renamed input, and an input of the wrong type.
- Some mismatches go undetected. An input with an `alias` passes the type check, but receives `undefined` at runtime. Pointing the route at a different component causes neither a type error nor a runtime error. `type-safe.spec.ts` checks both runtime behaviors.
