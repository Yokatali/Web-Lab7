# Assignment 7 - Online Shop

## File Organization

```text
assignment7/
├─ src/
│  ├─ api/
│  │  ├─ productsApi.js     fetchProducts and fetchProduct (fetch + AbortSignal)
│  │  └─ authApi.js         simulated login with a 500 ms delay
│  ├─ hooks/
│  │  ├─ useFetch.js        loading / error / data with useReducer and cleanup
│  │  └─ useLocalStorage.js useState-like hook backed by localStorage
│  ├─ context/
│  │  └─ AuthContext.jsx    AuthProvider, reducer and useAuth
│  ├─ store/
│  │  └─ cartStore.js       Zustand cart store with localStorage persistence
│  ├─ components/
│  │  ├─ Layout.jsx         shared layout (NavBar, Outlet, footer, theme class)
│  │  ├─ NavBar.jsx         links, cart count, login/logout, theme toggle
│  │  ├─ ProductCard.jsx    one product in the list
│  │  └─ ProtectedRoute.jsx redirects to /login when nobody is signed in
│  ├─ pages/
│  │  ├─ Home.jsx
│  │  ├─ ProductList.jsx    list with filters stored in the URL
│  │  ├─ ProductDetail.jsx  one product, read from the route parameter
│  │  ├─ Cart.jsx
│  │  ├─ Login.jsx
│  │  └─ NotFound.jsx
│  ├─ App.jsx               routes
│  └─ main.jsx              BrowserRouter and AuthProvider
├─ index.html
└─ package.json
```

## Reasoning Questions

### 1. State choices

- **Signed-in user:** it lives in Context with `useReducer` (`AuthContext.jsx`), because many distant components need it (NavBar, Login, ProtectedRoute) and it changes rarely.
- **Cart:** it lives in a Zustand store (`cartStore.js`), because it changes often and is read by many components. The item count and the total are not stored, they are calculated from `items`.
- **Filter values:** they live in the URL query string, read with `useSearchParams`. This way the filtered view can be shared by link and survives a refresh.
- **Product list:** it lives inside `useFetch` (a reducer) in `ProductList`, because it is server data that only that page needs. The filtered list is derived during render.
- **Theme:** it lives in `useLocalStorage` inside `Layout`, so it survives reloads. `Layout` passes it to `NavBar` as props.

### 2. Context versus store

When a Context value changes, every component that uses that Context re-renders. The user changes only on login and logout, so this cost is small and Context with a reducer is enough. The cart changes often and many components read it, so in Context all of them would re-render on every change, while with Zustand a component selects only what it needs (for example `NavBar` selects only the item count). If I swapped them, the cart would cause many unnecessary re-renders, and the user in a store would work but add nothing.

### 3. Custom hooks

`useFetch` shares the loading pattern: the reducer with three states, the `AbortController`, and the cleanup that cancels the request when the inputs change or the component unmounts. It does not share data. Every component that calls it gets its own separate state, so `ProductList` and `ProductDetail` do not see each other's data, and nothing is cached between them.

### 4. Route parameters

The `id` from `useParams` is always a **string**, even for a URL like `/products/3`. In `ProductDetail` it is used in the request URL and in the `[id]` dependency list of `useFetch`, so a string is fine there. It mattered for the cart: the product from the API has a **number** `id`, and the cart compares ids with `===`. I add the product object from the API to the cart (not the id from the URL), so the types match and the same product is not added twice.

### 5. Protected routes

`ProtectedRoute` only runs in the browser. Anyone can open the developer tools, change the JavaScript or the state, or call the API directly, so it is a user-experience feature and not security. To make it secure, the server must check a real credential (for example a session or a token) on every request and refuse to send protected data if it is missing or invalid.

### 6. Deep links

On a plain static file server, reloading `/products/3` would look for a file at that path. Only `index.html` exists, so the server would answer 404. It works on the Vite development server because it falls back to `index.html` for unknown paths, and then React Router reads the URL in the browser and shows the right page. On a static server the same fallback must be configured (all unknown paths served as `index.html`).

## Self-Study Notes

### Updating one query parameter without losing the others

In the react-router documentation I found that `setSearchParams` replaces the whole query string. To change only one parameter, I copy the current parameters with `new URLSearchParams(searchParams)`, then use `set` (or `delete` when the value is empty) on the one key, and pass the copy to `setSearchParams`. This way changing the category keeps the search text and the other way around. I also used `{ replace: true }` so that every key press does not add a new entry to the browser history.

### Initialising the store from localStorage safely

`localStorage` can be empty, can contain broken JSON, or can contain something that is not a cart. In `cartStore.js`, the `loadItems` function reads the value inside `try/catch`, checks that the parsed value is an array, and keeps only items with the correct field types and a quantity of at least 1. In every other case it returns an empty array, so the app starts with an empty cart instead of crashing. Saving is done outside React with `useCartStore.subscribe`, and it only writes when the `items` reference changed.

### Light and dark theme

I read how CSS custom properties work. The `Layout` wrapper gets a `light` or `dark` class, and each class defines the variables `--bg`, `--text` and `--link`. The `.app` element uses these variables for background and text colour, so changing the class changes the whole page. The chosen theme is stored with my `useLocalStorage` hook.

## Challenges

- **Installing packages in the wrong folder.** I first ran `npm install react-router zustand` in the parent folder instead of inside `assignment7`, so a stray `package.json` and `node_modules` appeared there. I deleted them, ran the install again inside `assignment7`, and checked `package.json`. Since then I check the terminal path before running commands.
- **Products not showing.** In `ProductList` I wrote the `map` callback with curly braces and no `return`, so the page showed only the title. The linter did not warn about it because it is valid JavaScript. Using parentheses (or an explicit `return`) fixed it.
- **A hook that returned nothing.** My first `useLocalStorage` had the `return [value, setValue]` line inside the `catch` block, so the hook returned `undefined` in normal use. The lint was clean, which showed me that a clean lint does not mean correct logic. I moved the return to the end of the hook.
- **Lint warnings in `useFetch`.** The `deps` list is passed in from outside, so ESLint cannot check it statically. I kept the design because the caller decides what the request depends on, and I added a single `eslint-disable-next-line` for this line.
- **A typo in a commit message.** I once added a comma at the end of a commit message. Because I had not pushed yet, I fixed it with `git commit --amend`. After that I read each message before running the command.
