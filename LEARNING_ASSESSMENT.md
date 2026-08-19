# React + TypeScript Self-Assessment (using this codebase)

Goal: relearn React/TypeScript *through* the code you already have, not generic tutorials.
Work top to bottom. Each part has (1) conceptual questions — answer them yourself in a scratch
file or out loud before checking the Answer Key at the bottom, and (2) a hands-on task you do
in the actual repo. Don't use AI to write the hands-on tasks — use it only to explain something
you get stuck on.

Stack recap: React + TypeScript, TanStack Router/Start (file-based routing in `src/routes/`),
TanStack Query (server-state cache), Supabase (auth + Postgres), Tailwind, Radix UI primitives
in `src/components/ui/`.

---

## Part 1 — TypeScript basics, read from real code

Open `src/hooks/useUserProgress.ts`.

**Q1.** Line 15: `export type ChangProgress = { noiDungIndex: number; isCompleted: boolean };`
What's the difference between declaring this with `type` vs `interface`? Would either work here?

**Q2.** Line 32: `const map = new Map<string, ChangProgress>();`
What do the `<string, ChangProgress>` do? What would TypeScript complain about if you later
wrote `map.set(123, {...})`?

**Q3.** Line 21: `export function useUserProgress(userId: string | null)`
What does `string | null` mean, and why might a hook accept `null` here instead of just always
requiring a string?

**Q4.** Line 48: `async (changId: string): Promise<boolean> => {`
What does the `: Promise<boolean>` return-type annotation guarantee, and where in the function
body would TypeScript flag an error if you accidentally `return`ed a string instead?

**Q5.** Line 52: `queryClient.getQueryData<Map<string, ChangProgress>>(key);`
This is a *generic function call*. Why does `getQueryData` need you to tell it the type,
when a normal function like `map.set(...)` infers types automatically?

### Hands-on task 1
In `src/hooks/useUserProgress.ts`, `ChangProgress` only has `noiDungIndex` and `isCompleted`.
Without touching runtime behavior, add a third **optional** field `lastSeenAt?: string` to the
type. Confirm with `npx tsc --noEmit` (or your editor) that nothing else in the codebase breaks
— this demonstrates that optional fields are backward compatible. Then revert the change (this
is practice, not a real feature).

---

## Part 2 — React hooks, read from real code

Open `src/hooks/useAuth.ts` (short, ~25 lines) and `src/hooks/useLearningProgress.ts`.

**Q6.** In `useAuth.ts`, why is there both a `useState` *and* a `useEffect`? Could the
`supabase.auth.getSession()` call happen directly in the function body instead of inside
`useEffect`?

**Q7.** `useEffect(() => { ... return () => subscription.unsubscribe(); }, [])`
What is the empty `[]` dependency array telling React? What would change if you removed it?
What would change if you passed `[user]` instead?

**Q8.** `useLearningProgress.ts` line 57: `const prevUserIdRef = useRef<string | null>(null);`
Why use `useRef` here instead of `useState`? (Hint: think about what happens on re-render vs.
what triggers a re-render.)

**Q9.** Line 44: `const activeProgressMap = user ? progressMap : localProgressMap;`
This hook merges two different data sources (DB-backed vs. localStorage-backed) behind one
return value. What's the benefit of doing that merge *inside the hook* rather than making every
component that calls `useLearningProgress` do the `user ? a : b` check itself?

**Q10.** In `useUserProgress.ts`'s `markComplete` (lines 47-78), the query cache is updated
*before* the network request resolves (`queryClient.setQueryData` before `await supabase...`).
What is this pattern called, and why does the code snapshot the previous value first (line 52)?

### Hands-on task 2
Pick `src/hooks/useSingletonAudio.ts` (used by `AudioButton` in `LessonPage.tsx`) — a hook you
haven't looked at yet. Read it cold, then write (in your own words, in a scratch file) one
sentence per: what state it holds, what effect(s) it runs, and what it returns. Then check
yourself by re-reading the file.

---

## Part 3 — Component structure & props

Open `src/components/learning/LessonPage.tsx` lines 1-120.

**Q11.** `function BackToMapButton({ color, topicIndex, className, arrowClassName, iconClassName }: { color: StageColor; topicIndex: number; className: string; arrowClassName: string; iconClassName: string })`
This inlines the props type instead of a named `interface Props`. When would you prefer a named
type instead?

**Q12.** `AudioButton` (line 90) destructures `{ playing, play, pause, audioRef, onEnded, onPause, onError }` from `useSingletonAudio(src)`. What does this tell you about what that hook returns, without even opening its file?

**Q13.** Line 64-70, the `onClick` handler checks `e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey` before calling `e.preventDefault()`. Why does it bother checking all of these instead of just always intercepting the click?

**Q14.** The comment above `BackToMapButton` (lines 36-37) explains *why* it's a shared function
instead of being inlined twice. Find one other multi-line comment in this file and explain, in
your own words, what problem it's preventing (not just what the code does).

### Hands-on task 3
In `LessonPage.tsx`, `VideoEmbed` (line 118+) calls `toYouTubeEmbed(url)` and renders `null`
when it returns `null` (read a few more lines past 120 to confirm). Add a fallback: if the URL
isn't a recognized YouTube link, render a plain `<a href={url}>` link to it instead of nothing.
Keep the diff small — this is the kind of task you'd actually get asked to do in an interview
pairing exercise.

---

## Part 4 — Routing & data flow (TanStack Start specific)

Open `src/routes/hoc-tap.quyen-1.tsx` (tiny) and then `src/routes/hoc-tap.quyen-1.index.tsx`
and `src/routes/hoc-tap.quyen-1.chu-de-{$chuDeIndex}.tsx`.

**Q15.** The filename `hoc-tap.quyen-1.chu-de-{$chuDeIndex}.tsx` encodes a route path and a
dynamic param. What URL would map to this file, and how would the component read the param
value?

**Q16.** `hoc-tap.quyen-1.tsx`'s component is just `Outlet`. What is `Outlet` and why does a
"layout route" like this exist at all instead of every child route repeating its own `<head>`?

**Q17.** Trace one full data path: a component renders → calls a hook (e.g.
`useLearningContent` or `useLearningProgress`) → that hook calls `useQuery` → which calls
Supabase. Write out the chain in your own words for one specific piece of UI (e.g. "the
checkmark that shows a lesson is done").

### Hands-on task 4
Using only `grep`/your editor (no AI), find every file that imports `useLearningProgress`.
For each one, answer: does this component *read* progress, *write* progress, or both? This
builds the skill of tracing data flow across a codebase, which is 80% of onboarding onto any
real job's frontend.

---

## Part 5 — Explain-it-back (interview simulation)

Answer these out loud, as if a technical interviewer asked them. Time yourself — 2 minutes each.

**Q18.** "Walk me through what happens, end to end, when a logged-out user completes a lesson,
then logs in five minutes later." (Use `useLearningProgress.ts` — this is exactly what
`mergeLocalProgress` handles.)

**Q19.** "Why does this app use TanStack Query instead of just `useState` + `useEffect` +
`fetch` everywhere?"

**Q20.** "This project has zero test files that I can see — how would you convince your team
to add tests, and what would you test first?" (Honest opinion question, no wrong answer, but
you should have *a* position.)

---

## Answer Key (Part 1–4 conceptual questions only)

<details>
<summary>Click to expand after you've written your own answers</summary>

**A1.** `type` and `interface` are nearly interchangeable for plain object shapes. `interface`
supports declaration merging (re-opening the same interface later) and is conventionally used
for object/class shapes that might be extended; `type` is required for unions, intersections,
mapped/conditional types, and tuples. Either works for `ChangProgress`; the codebase's own
convention (grep `type` vs `interface` under `src/`) is the tiebreaker, not a language rule.

**A2.** They're generic type parameters: keys must be `string`, values must match the
`ChangProgress` shape. `map.set(123, {...})` errors because `123` is a `number`, not `string`.

**A3.** `string | null` is a union type — the value is either a string or exactly `null`, nothing
else. The hook accepts `null` because it's called even when there's no logged-in user yet
(`useUserProgress(user?.id ?? null)` in `useLearningProgress.ts`), and the hook internally
disables its query (`enabled: userId != null`) rather than crashing or requiring the caller to
conditionally call the hook (which would break the Rules of Hooks).

**A4.** It guarantees every code path in the function resolves to a `boolean` (wrapped in a
Promise, since it's `async`). TypeScript would flag `return "yes"` or forgetting to return on
some branch (implicit `undefined` isn't assignable to `boolean`).

**A5.** `getQueryData` is a general-purpose cache reader with no idea what's stored under a
given key — it's typed as `getQueryData<T>(key): T | undefined` internally. Because the *value*
isn't available for TypeScript to infer from (there's no argument shaped like the return value),
you must supply the type parameter explicitly. Compare to `map.set(k, v)`, where `v` is a real
argument TypeScript can inspect.

**A6.** `useState` holds the value across renders; `useEffect` is needed because
`supabase.auth.getSession()` is an async side effect (not something you can compute during
render — calling it directly in the function body would refetch on every render and violates
React's render-must-be-pure rule).

**A7.** `[]` means "run once after mount, clean up once before unmount" — it never re-runs.
Removing the array entirely would re-run the effect (and re-subscribe) after *every* render.
Passing `[user]` would re-subscribe every time `user` changes, which is unnecessary here since
the subscription itself is what *produces* user changes — it should only be set up once.

**A8.** `useRef` doesn't trigger a re-render when its `.current` is mutated, and its value
persists across renders (unlike a plain variable, which resets every render). This is exactly
what's needed here: the code needs to remember the previous user id across renders purely to
compare it, without causing an extra render each time it's updated.

**A9.** Centralizing the `user ? a : b` branch in the hook means every consuming component
(`LessonPage`, `RoadmapList`, etc.) gets one simple value and doesn't need to know or care that
there are two different data sources. If the merge logic changes later (e.g. a third data
source is added), only the hook changes, not every call site.

**A10.** Optimistic update. The snapshot lets the code roll back the cache to its exact prior
state if the network request fails (line 65), instead of leaving the UI showing a "completed"
state that was never actually saved.

**A11.** Prefer a named type/interface once the same prop shape is reused across more than one
component, when the shape is complex enough that a name improves readability at the call site,
or when you want to export it for other files to reference. A one-off, single-use, short prop
list (like here) is reasonable to inline.

**A12.** It returns: a boolean `playing` state, `play`/`pause` action functions, an `audioRef`
to attach to an `<audio>` element, and event handlers to wire to that element's `onEnded`,
`onPause`, `onError`. That's inferable purely from the destructuring, without opening the hook.

**A13.** It only wants to intercept a plain left-click for its custom back-navigation behavior.
Middle-click, ctrl/cmd-click, and shift-click are all browser conventions for "open in new
tab/window" — if the code always called `preventDefault()`, it would silently break those
standard browser behaviors for users who expect them.

**A14.** (Open-ended — check that your explanation names an actual risk/bug being avoided, not
just a paraphrase of the code.)

**A15.** URL: `/hoc-tap/quyen-1/chu-de-1`, `/hoc-tap/quyen-1/chu-de-2`, etc. (the `{$chuDeIndex}`
segment is the dynamic param). The component reads it via TanStack Router's `useParams()` or
the `Route.useParams()` helper generated for that file.

**A16.** `Outlet` is TanStack Router's placeholder that renders whichever child route matched.
A layout route exists so shared concerns (here, the `<head>` meta tags/SEO for the whole
`quyen-1` section) live in one place instead of being copy-pasted into every child route file.

**A17.** (Open-ended — verify your chain actually names real files/hooks and ends at a Supabase
table, not a vague "it fetches data somehow.")

</details>
