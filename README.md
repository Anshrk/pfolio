# 🖥️ macOS Terminal Coded Portfolio

A dynamic, stylish, and authentic **macOS Terminal Coded Portfolio** built with **Svelte**, **FastAPI**, and **PostgreSQL**.

Featuring a startup **Fastfetch / Neofetch** system diagnostics banner, an interactive UNIX virtual shell (`ls`, `cd`, `cat`, `projects`, `skills`, `contact`, `theme`, `open`, `nano`, `cmatrix`), dual CLI & macOS GUI modes, authentic mechanical keyboard sound effects (Web Audio API), CRT retro scanlines, and an authenticated **Dynamic Portfolio Studio** so only you can edit projects, skills, and bio in real-time.

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js**: v18+ (v20+ recommended)
- **Python**: 3.10+
- **PostgreSQL** (or Docker for 1-click database startup; falls back gracefully to SQLite if PostgreSQL is not active)

---

### 2. Backend Setup (FastAPI + PostgreSQL)

```bash
cd backend

# Create virtual environment and install dependencies
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# (Optional) Launch local PostgreSQL container
docker compose up -d

# Start the FastAPI server
PYTHONPATH=. uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

- API Base URL: `http://localhost:8000`
- Interactive OpenAPI Docs: `http://localhost:8000/api/docs`

---

### 3. Frontend Setup (Svelte + Tailwind CSS + Web Audio)

```bash
cd frontend

# Install packages
npm install

# Start Vite dev server
npm run dev
```

- Portfolio Website: `http://localhost:5173`

---

## 🔑 Admin Dynamic Editing & Security

To dynamically update your projects, skills, profile info, and files:

1. Configure your secret credentials in `backend/.env` (which is kept private by `.gitignore`):
   ```bash
   ADMIN_USERNAME="your_custom_username"
   ADMIN_PASSWORD="your_secure_password"
   SECRET_KEY="your_jwt_secret"
   ```

2. Authenticate:
   - **In Terminal**: Run `sudo login` or `admin`.
   - **In macOS Menu Bar / Dock**: Click the **Lock 🔒 / Admin** icon.

3. Once authenticated, you can edit files using `nano <filename>` right inside the terminal or use the floating **macOS Dynamic Portfolio Studio** GUI.

---

## 🛠️ Interactive Terminal Commands

| Command | Description |
| :--- | :--- |
| `fastfetch` / `neofetch` | Display macOS system info, specs, and colored palette bars |
| `projects` | Interactive visual project showcase with live demo and GitHub links |
| `skills` | Visual skill proficiency meters grouped by category |
| `experience` | Career timeline, milestones, and achievements |
| `ls [-la] [path]` | List virtual directory contents with permissions and file sizes |
| `cd <dir>` | Navigate directories (`~`, `projects/`, `secrets/`, `..`) |
| `cat <file>` | Read virtual file contents (e.g. `cat about.md`, `cat resume.txt`) |
| `open <target>` | Launch visual macOS Safari preview modal for a project or document |
| `contact` | Send an inquiry message directly to the PostgreSQL database |
| `theme <name>` | Switch palette (`tokyo-night`, `dracula`, `matrix`, `cyberpunk`, `apple-retro`, `monokai`, `catppuccin`, `nord`, `synthwave`) |
| `audio` | Toggle realistic mechanical keyboard clicks & command beeps |
| `crt` | Toggle retro vintage CRT monitor scanlines & phosphor glow |
| `sudo login` / `admin` | Authenticate as portfolio administrator |
| `nano <file>` | In-terminal text editor for authenticated live editing |
| `cmatrix` | Matrix falling green digital rain animation |
| `gui` / `finder` | Open macOS Finder visual file explorer |
| `help` / `?` | Print command cheat sheet |

---

## 🏗️ Project Architecture

```
pfolio/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app, lifespan & CORS
│   │   ├── config.py            # Settings, DB connection, JWT secrets
│   │   ├── database.py          # SQLAlchemy engine (PostgreSQL + SQLite fallback)
│   │   ├── models.py            # Models: Profile, Project, Skill, Experience, VFS, Messages
│   │   ├── schemas.py           # Pydantic validation schemas
│   │   ├── auth.py              # Bcrypt hashing & JWT verification
│   │   ├── seed.py              # Initial portfolio data seeder
│   │   └── routers/
│   │       ├── portfolio.py     # Public data endpoints
│   │       ├── auth.py          # Admin login & session check
│   │       ├── admin.py         # Authenticated CRUD mutations
│   │       └── contact.py       # Message submission endpoint
│   ├── docker-compose.yml       # 1-click PostgreSQL container
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/
│   │   │   │   ├── MacMenuBar.svelte    # Top macOS Menu Bar with live clock & menus
│   │   │   │   ├── MacWindow.svelte     # Glass terminal window with traffic lights
│   │   │   │   ├── MacDock.svelte       # Floating macOS dock with bounce animations
│   │   │   │   ├── Terminal.svelte      # Virtual UNIX interactive shell
│   │   │   │   ├── Fastfetch.svelte     # Neofetch/Fastfetch system diagnostics banner
│   │   │   │   ├── NanoEditor.svelte    # In-terminal GNU nano text editor
│   │   │   │   ├── AdminModal.svelte    # macOS floating Studio for dynamic live editing
│   │   │   │   ├── ProjectModal.svelte  # macOS Safari project preview modal
│   │   │   │   ├── FinderModal.svelte   # macOS Finder visual file browser
│   │   │   │   ├── MatrixRain.svelte    # Digital matrix canvas visualizer
│   │   │   │   └── ContactModal.svelte  # macOS Mail contact inquiry modal
│   │   │   ├── stores/                  # Svelte stores (terminal, theme, sound, auth, portfolio)
│   │   │   └── utils/                   # Shell command parser, audio synthesizer, API client
│   │   ├── App.svelte                   # Root application layout
│   │   └── app.css                      # Glassmorphism tokens & typography
│   └── vite.config.ts
└── README.md
```
