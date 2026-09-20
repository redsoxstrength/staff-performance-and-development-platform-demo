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

Every page (`index.html` and the six tool pages) checks a session flag on load
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

coach_checkpoint_form.html           <-- early-season self-checkpoint form
coach_checkpoint_dashboard.html      <-- leadership dashboard for checkpoints
```

This is a trimmed set — just what's needed for the interactive demo to run
behind the gate. The backend (Google Apps Script), setup guide, and reference
PDFs aren't included here; ask Simon if you need those too.

## The placeholder roster

Every real name was replaced 1:1, keeping the same underlying score/persona
data, using this scheme:

| Code | Role | Placeholder name |
|---|---|---|
| DD | Department Director | Marcus Webb |
| DC | Department Coordinator | Erin Coleman |
| AC | Assistant Coordinator | Derek Simmons |
| SL / SA | Salem Lead / Assistant | Tyler Brooks / Megan Foster |
| GL / GA | Greenville Lead / Assistant | Austin Reed / Kayla Sanders |
| PL / PA | Portland Lead / Assistant | Jordan Blake / Hannah Adams |
| WL / WA | Worcester Lead / Assistant | Brandon Hayes / Emily Turner |
| FL / FA | Florida Lead / Assistant | Devin Marsh / Sarah Lang |
| RL / RA | Rehab Lead / Assistant | Michael Torres / Olivia Grant |
| B1 / B2 | Boston Coach 1 / 2 | Kevin Ortiz / Wyatt Price |
| BR | Boston Rehab | Nathan Ford |

Note: the original 18-person roster didn't include a separate "Academy" group,
so A1/A2/A3 aren't represented here — say the word if you want three more
synthetic entries added for that.

One more thing worth knowing before this link goes anywhere outside the
project team: `coach_platform_prototype.html` still has one persona (now
"Erin Coleman") built from a real personal Apple Health export rather than
synthetic numbers — the name is scrubbed but the underlying health data itself
is real. Say so if you'd rather that one persona was swapped for synthetic
values too.
