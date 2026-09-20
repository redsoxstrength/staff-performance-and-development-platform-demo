# Coach Performance & Development Platform — Preview Build

This is a **name-scrubbed preview** of the platform, gated behind a simple shared
password, meant for sending a link to people outside the immediate project team.
All real staff names/emails have been replaced with role-based placeholders
(Salem Lead, Greenville Assistant, Boston Coach 1, etc. — see below), and the
underlying demo data (scores, cycles, personas) is otherwise unchanged.

Every page in this preview has a small "&larr; All Tools" link fixed in the bottom-left
corner that jumps straight back to `index.html`, so anyone exploring can bounce between
tools without clicking all the way back out first. **This is a demo-only convenience** —
it isn't in the real tool files (see the note in "Recent changes" below), because a real
360/checkpoint form or reflection tool goes out as a single-purpose link to one coach or
reviewer, and that person shouldn't be able to click through into leadership dashboards
or other people's submissions.

## Installing a page as an app (home screen / dock / desktop)

Every page can be added as its own app-like icon, using the S&C logo, instead of
just being a bookmark:

- **iPhone/iPad (Safari):** open the page &rarr; Share &rarr; **Add to Home Screen**.
- **Android (Chrome):** open the page &rarr; menu (&#8942;) &rarr; **Add to Home screen** /
  **Install app**.
- **Mac (Safari 17+, Sonoma or later):** open the page &rarr; File menu &rarr;
  **Add to Dock**.
- **Mac or Windows (Chrome or Edge):** open the page &rarr; click the install icon
  in the address bar (or menu &rarr; **Install page as app** / **Apps** &rarr;
  **Install this site as an app**).

Each tool has its own icon setup (`manifest-*.json`), so whichever page someone
installs — say, a coach installing just their checkpoint form — the icon that
lands on their home screen/dock reopens that exact tool directly, not the main
menu. Simon installing `index.html` gets an icon that opens the full menu.
It's the same S&C logo everywhere; only the name under the icon differs per tool.
This needs the real GitHub Pages URL (HTTPS) to work — it won't do anything useful
opened as a local file straight off disk.

## Hosting this on GitHub Pages

1. Push everything in this folder to a repo's default branch, unchanged —
   `index.html` and `gate.html` need to stay at the repo root.
2. In the repo, go to **Settings → Pages**. Set **Source** to "Deploy from a
   branch", pick your branch (usually `main`) and folder **`/ (root)`**. Save.
3. GitHub gives you a URL like `https://<your-username>.github.io/<repo-name>/`.
   That's the password gate — visitors land there first no matter which page
   they're linked to.
4. First deploy can take a minute or two; every push after that redeploys
   automatically.

## The password gate

Every page (`index.html` and the seven tool pages) checks a session flag on load
and bounces to `gate.html` if it isn't set. `gate.html` hashes whatever the
visitor types (SHA-256, done in the browser) and compares it to a stored hash —
if it matches, it unlocks the rest of the site for that browser tab's session.

**This is a casual deterrent, not real security.** It's static hosting with no
server, so there's no way to truly hide anything — anyone who opens the page
source and is motivated enough can find the hash and brute-force a short/common
password offline, or just read the tool files directly by URL. It's meant to
keep a shared link from being casually stumbled into, not to protect sensitive
data. Don't rely on it for anything you wouldn't be okay with a determined
person eventually seeing.

**Current password:** `RedSoxCoach2026`

**To change it:** open a browser console (or run it anywhere JS runs) and compute
the SHA-256 hash of your new password:

```js
crypto.subtle.digest('SHA-256', new TextEncoder().encode('yourNewPassword'))
  .then(b => console.log([...new Uint8Array(b)].map(x => x.toString(16).padStart(2,'0')).join('')))
```

Paste the printed hash into `gate.html`, replacing the `PASSWORD_HASH` constant
near the top of its `<script>` block, then push.

## What's in this package

```
gate.html                            <-- password gate, landing point for every visitor
index.html                           <-- the real landing page, links to every tool below

coach_platform_prototype.html        <-- the working platform demo
coach_portal.html                    <-- a coach's own dashboard + history

coach_360_feedback_form.html         <-- colleague feedback form
coach_360_dashboard.html             <-- leadership dashboard for 360 data

coach_reflection_tool.html           <-- bilingual (EN/ES) self-reflection wizard

coach_checkpoint_form.html           <-- early-season self-checkpoint form
coach_checkpoint_dashboard.html      <-- leadership dashboard for checkpoints

icon-512.png, icon-192.png,
icon-180.png, favicon-32.png,
favicon-16.png                       <-- shared app icon (S&C logo), all sizes
manifest-*.json                      <-- one per page, for "install as app" (see above)
```

This is a trimmed set — just what's needed for the interactive demo to run
behind the gate. The backend (Google Apps Script), setup guide, and reference
PDFs aren't included here; ask Simon if you need those too.

## Recent changes in this build

- **Fixed: forced dark mode and a tap "freeze" on iPhone.** A tester found
  that on iPhone (not on laptop) the platform prototype re-themed itself
  dark to match the phone's system appearance, and that tapping buttons
  after the first one would freeze. Both are fixed:
  - Every page now sets `color-scheme: light` (in the CSS and as a
    `<meta>` tag), and the platform prototype's old
    `prefers-color-scheme: dark` override has been removed, so every page
    stays in its light theme regardless of the phone/OS dark-mode setting.
  - The service worker (`sw.js`) has been removed. It only existed for a
    marginal desktop "install as app" nicety, and iOS Safari's background
    handling of an active service worker is the likely cause of the tap
    freeze (Chrome/Edge desktop installs work fine without one). Every
    page now actively unregisters any leftover service-worker registration
    a phone/browser may have picked up from the earlier build, rather than
    registering a new one — if a phone had already added a page to its
    home screen from the previous package, opening it once (in the
    browser or from the home-screen icon) should clean that up. If it
    doesn't seem to take right away, removing the home-screen icon and
    re-adding it forces a completely fresh copy.
- **Every page can now be installed as an app**, using the S&C logo as its icon
  — see "Installing a page as an app" above.
- **Added a demo-only "All Tools" nav link.** Every page now has a small fixed
  link back to `index.html` in the bottom-left corner. Added only in this
  preview package, not in the real tool files in `tools/` — the real forms go
  out as single-purpose links to individual coaches/reviewers, and they
  shouldn't be able to click through into leadership dashboards or other
  people's data from there.
- **Checkpoint is now print/PDF based too, matching 360.** The checkpoint form
  (`coach_checkpoint_form.html`) now ends the same way the 360 form does: check
  your answers, confirm, then print the result as a PDF and send it to the
  Coordinator, instead of downloading a JSON file. `coach_checkpoint_dashboard.html`
  reads that PDF back in the browser (via pdf.js) to reconstruct the
  submission — dropping a `.json` backup file or pasting the sheet's CSV still
  work as fallbacks. For now everything runs this way — print, send, drop in —
  with no Google Sheets backend wired up; the dormant backend-send code is
  still there in both forms (disabled, `BACKEND_URL` left blank) for whenever
  a real backend gets built into the platform.
- **360 feedback is print/PDF based, not JSON.** The reviewer form
  (`coach_360_feedback_form.html`) now ends with a formatted, printable result
  page instead of a raw JSON download — the reviewer prints or saves it as a
  PDF and emails that. The machine-readable data travels invisibly embedded on
  the last printed page. `coach_360_dashboard.html` reads that PDF back in the
  browser (via pdf.js) to reconstruct the submission — dropping a `.json` file
  still works as a fallback. Nothing about the underlying scoring or
  aggregation changed, just how a submission gets from reviewer to dashboard.
- **Checkpoint dashboard bugfix:** a coach's personal-domain detail view could
  previously show a missing/unscored area as "surviving" (the worst status)
  instead of "no data yet." It now shows an explicit unknown/no-data state
  instead of guessing.
- **New: Coach Reflection Tool.** A self-guided, bilingual (English/Spanish)
  reflection wizard covering the same coaching and leadership competency
  frameworks used elsewhere in the platform, including a spider/radar summary
  and an optional comparison against a coach's own prior submission. Like the
  360 form, it produces a printable PDF with the data embedded for later
  re-import. It has no staff roster of its own, so there was nothing to
  anonymize in it — it's included in this package as-is.

## The placeholder roster

Every real name was replaced 1:1, keeping the same underlying score/persona
data. Each profile now carries **position** and **team** as two separate
fields (not one merged label), so the seat stays legible even as whoever
fills it changes — shown together wherever there's room (login tiles, the
360 roster and detail views, the top-nav user badge) and left off the couple
of spots too small for it (the 2-letter avatar circles).

| Code | Position | Team | Placeholder name |
|---|---|---|---|
| DD | Director | Department | Marcus Webb |
| DC | Coordinator | Department | Erin Coleman |
| AC | Assistant Coordinator | Department | Derek Simmons |
| SL / SA | Lead Coach / Assistant Coach | Salem | Tyler Brooks / Megan Foster |
| GL / GA | Lead Coach / Assistant Coach | Greenville | Austin Reed / Kayla Sanders |
| PL / PA | Lead Coach / Assistant Coach | Portland | Jordan Blake / Hannah Adams |
| WL / WA | Lead Coach / Assistant Coach | Worcester | Brandon Hayes / Emily Turner |
| FL / FA | Lead Coach / Assistant Coach | Florida (FCL) | Devin Marsh / Sarah Lang |
| RL / RA | Lead Coach / Assistant Coach | Rehab | Michael Torres / Olivia Grant |
| B1 / B2 | MLB Coach | Boston | Kevin Ortiz / Wyatt Price |
| BR | MLB Rehab Coach | Boston | Nathan Ford |

Department-tier profiles (Director, Coordinator, Assistant Coordinator) show
just the position — there's no separate team to display since the role is
org-wide, not site-specific.

Note: the original 18-person roster didn't include a separate "Academy" group,
so A1/A2/A3 aren't represented here — say the word if you want three more
synthetic entries added for that.

One more thing worth knowing before this link goes anywhere outside the
project team: `coach_platform_prototype.html` still has one persona (now
"Erin Coleman") built from a real personal Apple Health export rather than
synthetic numbers — the name is scrubbed but the underlying health data itself
is real. Say so if you'd rather that one persona was swapped for synthetic
values too.
