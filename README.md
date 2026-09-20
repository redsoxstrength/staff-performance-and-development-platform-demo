# Coach Performance & Development Platform — Preview Build

This is a **name-scrubbed preview** of the platform, gated behind a simple shared
password, meant for sending a link to people outside the immediate project team.
All real staff names/emails have been replaced with role-based placeholders
(Salem Lead, Greenville Assistant, Boston Coach 1, etc. — see below), and the
underlying demo data (scores, cycles, personas) is otherwise unchanged.

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
```

This is a trimmed set — just what's needed for the interactive demo to run
behind the gate. The backend (Google Apps Script), setup guide, and reference
PDFs aren't included here; ask Simon if you need those too.

## Recent changes in this build

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
