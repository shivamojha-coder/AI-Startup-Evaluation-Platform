# AI Coding Rules — Write Less, Think More

## What This File Does

This file gives instructions to the AI assistant about HOW to write code for this project.
The main idea is simple: **write as little code as possible, but make it work perfectly.**
More code = more bugs = harder to maintain. So always choose the simplest solution.

---

## Step-by-Step Thinking (Before Writing Any Code)

Before I write any code, I must ask these questions one by one.
I stop at the first question where the answer is YES:

1. **Do we actually need this feature?**
   → If nobody asked for it and it is just a guess, skip it. Don't build things nobody needs.

2. **Does this already exist in the project?**
   → Before writing new code, search the project. If a similar function or component already exists, use it. Don't write the same thing twice.

3. **Can Python or JavaScript handle this on its own?**
   → Python and JavaScript have many built-in tools. Use them first before writing custom code.

4. **Can the browser or HTML do this automatically?**
   → For example: instead of building a custom date-picker component, just use `<input type="date">` which the browser already supports.

5. **Is there already an installed package/library that does this?**
   → Check what is already installed in the project. Use that. Do NOT install a new package if an existing one can do the job.

6. **Can this be written in just one line?**
   → If yes, write it in one line. Short code is better than long code.

7. **Only if all above answers are NO:**
   → Write the minimum amount of new code that solves the problem. Nothing extra.

**Important:** First fully understand the problem, then go through these steps. Don't skip understanding.

---

## How to Fix Bugs

When fixing a bug, always fix the **real cause**, not just the visible symptom.

- First, find where the broken code is actually used in the whole project.
- Fix it in one place so it is fixed everywhere automatically.
- Do NOT fix the same bug in 5 different places separately — that creates more problems.

**Example:** If a login check is broken, fix the main login function once — not every single page that uses login.

---

## General Rules (Always Follow)

- Do NOT create extra layers or complex structures unless the user specifically asks for them.
- Do NOT install new packages/libraries if it can be avoided.
- Do NOT write extra code that nobody asked for.
- If you can delete code instead of adding new code — delete it.
- Simple and boring code is better than smart and complex code.
- The smallest fix that solves the real problem is always the best fix.

---

## Things That Are NEVER Skipped (Safety Rules)

Even when writing minimal code, these things are ALWAYS included:

- **Input checking** — always check what data the user sends before using it.
- **Error handling** — always handle what happens when something goes wrong.
- **Login/permission checks** — always verify the user is allowed to do the action.
- **Accessibility** — make sure the website works for all users including those with disabilities.
- **Security** — protect against common attacks like SQL injection, XSS, etc.

---

## Rules Specific to This Project (VentureAI)

This project uses: **FastAPI (Python backend) + React (TypeScript frontend) + Supabase (database)**

- **Python:** Use Python's built-in tools first before writing custom helper functions.
- **FastAPI (backend):** The project already has `require_role` (for login checks) and `supabase_service_client` (for database). Use them directly — do not create new wrappers around them.
- **React (frontend):** The project already has reusable components, a state manager (Zustand stores), and API functions. Use them before creating new ones.
- **No new packages:** Do not run `npm install` or `pip install` for a new package unless absolutely no existing tool can do the job.
- **Database queries:** Write database queries directly where needed — do not add extra service layers on top unless they already exist in the project.
