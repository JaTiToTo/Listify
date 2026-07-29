# Listify Frontend

React + TypeScript + Tailwind starter for the frontend that sits in front of the existing Maven backend.

## Run it

```bash
npm install
npm run dev
```

## What to do next

0. Add the actual svg instead of getting them remotely from the local MCP Figma server
1. Go over code and understand it
2. Add the fonts correctly (currently somehow not working)
3. Change every functionality component (text input etc.) to actual functional components
4. Check repsonsivness
5. Give playlist creation etc. a better mock design (currently just plain objeczs)
6. Point API calls at your Maven backend using `BACKEND_API_BASE_URL`.

---

#### AI ToDo Explaination below:



Here is a step-by-step guide on how you can continue developing this frontend, using your Figma design as your source of truth:

### 1. Translating Figma to Code (Styling & Content)
When you want to change out content or build a new section from your Figma file:
* **Use Figma Dev Mode:** Click an element in Figma and look at the "Inspect" panel. It gives you raw CSS (padding, colors, sizes, fonts).
* **Translate to Tailwind:** Map those CSS properties to Tailwind classes. For example, if Figma says `gap: 16px; display: flex; flex-direction: column`, you write `<div className="flex flex-col gap-4">` (since Tailwind `gap-4` equals 16px).
* **Content:** To change text, just open the relevant page in pages (like `MainPage.tsx`) and edit the text inside the HTML tags.
* **Assets:** If you have new icons or images in Figma, export them as SVG or PNG, put them in a local folder (like `/public` or `src/assets`), and import them via `<img src="/your-image.svg" />`.

### 2. Creating Reusable Components
Right now, the pages have a lot of hardcoded code. The next best step is to modularize.
* If you look at `MainPage.tsx`, there are 4 playlist cards that look almost identical. 
* You should create a new file `src/components/PlaylistCard.tsx` that takes properties like `title`, `description`, `image`, and `color`.
* Then in `MainPage.tsx`, you just do: `<PlaylistCard title="Daily Drive" ... />`.
* Do the same for the **Sidebar** layout so you don't have to copy-paste it onto every single page.

### 3. Adding New Pages
When you design a new screen in Figma and want to add it:
1. Create a new file in the pages folder (e.g., `ProfilePage.tsx`).
2. Build the UI layout returning HTML/Tailwind standard to your Figma design. 
3. Open App.tsx (or your routing file) and add the route for it:
   ```jsx
   import { ProfilePage } from './pages/ProfilePage';
   // ... inside your Routes component:
   <Route path="/profile" element={<ProfilePage />} />
   ```

### 4. Adding Functionality (State & Interactivity)
Static designs need to become interactive. 
* **State:** Import `useState` from React. For example, on the `ListPage.tsx`, those widgets (Duration, Familiarity) are static right now. You would add a slider state:
  ```jsx
  const [duration, setDuration] = useState(45);
  // use setDuration when dragging the slider
  ```
* **Forms:** On AuthPage.tsx, attach React state to an `<input>` field instead of the hardcoded `email@domain.com` `<div>`.

### 5. Connecting to the Backend
Your README mentions this sits in front of a **Maven backend**.
* Open api.ts. This is where you will write your `fetch()` or `axios` calls to your Java backend.
* For example, clicking "Login with email" on AuthPage.tsx should trigger an API call to authenticate the user and save a JWT token.
token, rather than just forcing a navigation to `/main`.