# VentureAI

Monorepo for the **VentureAI** platform.

```
venture-ai/
├── frontend/      → React + TypeScript + Tailwind CSS (Vite SPA)
├── backend/       → FastAPI (Python 3.11+)
│   └── app/
│       ├── main.py
│       ├── api/         → Route handlers
│       ├── core/        → Config, security, shared utilities
│       ├── services/    → Business logic
│       ├── models/      → ORM / database models
│       └── schemas/     → Pydantic request / response schemas
├── shared/        → Shared TypeScript types & JSON schema definitions
├── .gitignore
└── README.md
```

---

## Prerequisites

| Tool       | Version  |
| ---------- | -------- |
| Node.js    | ≥ 18     |
| npm        | ≥ 9      |
| Python     | ≥ 3.11   |
| pip        | latest   |

---

## Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server (http://localhost:5173)
npm run dev
```

### Available Scripts

| Script               | Description                        |
| -------------------- | ---------------------------------- |
| `npm run dev`        | Start Vite dev server              |
| `npm run build`      | Type-check & production build      |
| `npm run lint`       | Run ESLint                         |
| `npm run lint:fix`   | Run ESLint with auto-fix           |
| `npm run format`     | Format code with Prettier          |
| `npm run format:check` | Check formatting (CI-friendly)   |
| `npm run preview`    | Preview the production build       |

### Tech Stack

- **Vite** — lightning-fast HMR & build
- **React 19** + **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin)
- **React Router v7** — client-side routing
- **ESLint** + **Prettier** — linting & formatting

---

## Backend Setup

```bash
cd backend

# Create & activate a virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install -r requirements-dev.txt   # ruff, mypy

# Start the dev server (http://localhost:8000)
uvicorn app.main:app --reload --port 8000
```

### Health Check

```bash
curl http://localhost:8000/health
# → {"status": "ok"}
```

### API Docs

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Tech Stack

- **FastAPI** — high-performance async framework
- **Pydantic v2** — data validation & settings
- **Uvicorn** — ASGI server
- **python-dotenv** — `.env` file support
- **Ruff** — linter + formatter
- **Mypy** — static type checking

---

## Shared Types

The `shared/` directory contains TypeScript type definitions and JSON schema definitions consumed by both the frontend and backend.

```bash
cd shared
# Types are in shared/types/index.ts
```

---

## Code Quality

### Frontend (from `frontend/`)

```bash
npm run lint          # Check for lint errors (ESLint)
npm run lint:fix      # Auto-fix lint errors
npm run format        # Format code (Prettier)
npm run format:check  # Check formatting without writing (CI-friendly)
```

### Backend (from `backend/`, with venv activated)

```bash
ruff check .          # Lint all Python files
ruff check . --fix    # Lint + auto-fix
ruff format .         # Format all Python files
ruff format . --check # Check formatting without writing (CI-friendly)
mypy app/             # Type-check the app package
```

> **Note:** Pre-commit hooks (husky / pre-commit) are not configured yet.
> Run these commands manually before committing.

---

## Environment Variables

Copy the `.env.example` templates and fill in real values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Backend (`backend/.env`)

| Variable                   | Required | Default         | Description                     |
| -------------------------- | -------- | --------------- | ------------------------------- |
| `SUPABASE_URL`             | ✅       | —               | Supabase project URL            |
| `SUPABASE_SERVICE_ROLE_KEY`| ✅       | —               | Supabase service-role secret    |
| `SUPABASE_ANON_KEY`        | ✅       | —               | Supabase anonymous key          |
| `GEMINI_API_KEY`           | ✅       | —               | Google Gemini API key           |
| `JWT_SECRET_KEY`           | ✅       | —               | Secret for signing JWTs         |
| `JWT_ALGORITHM`            |          | `HS256`         | JWT signing algorithm           |
| `ENVIRONMENT`              |          | `development`   | `development` / `production`    |
| `ALLOWED_ORIGINS`          |          | `["http://localhost:5173"]` | CORS allowed origins |

### Frontend (`frontend/.env`)

| Variable                | Required | Default                  | Description               |
| ----------------------- | -------- | ------------------------ | ------------------------- |
| `VITE_SUPABASE_URL`     | ✅       | —                        | Supabase project URL      |
| `VITE_SUPABASE_ANON_KEY`| ✅       | —                        | Supabase anonymous key    |
| `VITE_API_BASE_URL`     |          | `http://localhost:8000`  | Backend API base URL      |

---

## Storage Setup

VentureAI requires a Supabase Storage bucket named `pitch-decks` to store uploaded PDF files.

**Manual Setup (via Supabase Dashboard):**
1. Go to your Supabase project dashboard.
2. Navigate to **Storage** -> **New Bucket**.
3. Name it `pitch-decks`.
4. Keep it private (do not check "Public bucket").

**Programmatic Setup (Python):**
You can run this python snippet to create the bucket programmatically:
```python
import os
from supabase import create_client

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(url, key)

# Create the pitch-decks bucket (public=False)
supabase.storage.create_bucket("pitch-decks", {"public": False})
```

---

## License

Private — all rights reserved.
