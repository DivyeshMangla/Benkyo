# Benkyo

Minimal exam preparation tracker. Organise subjects into topics and subtopics, track completion progress, plan your daily workload, and keep a live countdown to each exam date.

> [!WARNING]
> This project is in active development and was built for personal use. The API surface, data format, and feature set may change without notice.

---

## Features

- Per-subject topic and subtopic tree with completion tracking
- Live countdown timers to each exam date
- Daily plan — add topics or individual subtopics as work items for the day, reset automatically at midnight
- Subject-level and topic-level progress bars

---

## Data Persistence

All data is stored in the browser's `localStorage`. This means:

- Data is tied to the specific browser and device you use.
- Clearing your browser's site data or cache **will permanently delete everything**.
- There is currently no export, import, sync, or backup mechanism.

The plan is to wrap the application using [Tauri](https://tauri.app) to move storage to the local filesystem, which will make data independent of the browser entirely.

---

## Project Structure

```
benkyo/
├── src/
│   ├── components/
│   │   ├── Countdown.jsx       # Live countdown timer
│   │   ├── Dashboard.jsx       # Daily plan and subject overview
│   │   ├── LoadingScreen.jsx   # Animated intro screen
│   │   ├── ProgressBar.jsx     # Reusable progress bar
│   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   └── SubjectPage.jsx     # Subject, topic, and subtopic management
│   ├── utils/
│   │   ├── calculations.js     # Date, countdown, and progress utilities
│   │   └── id.js               # ID generation
│   ├── App.jsx                 # Root component, state, and persistence
│   ├── index.css               # Global styles and loading animation
│   └── main.jsx                # Entry point
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## Getting Started

**Prerequisites:** Node.js 18 or later.

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` by default.

```bash
# Lint
npm run lint

# Production build
npm run build
```

---

## Roadmap

- Wrap with Tauri for filesystem-based persistence
- Export and import data as JSON
- Basic statistics view
