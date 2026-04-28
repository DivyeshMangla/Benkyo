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

All data is persisted to the local filesystem using **Tauri**.

- Data is independent of your browser cache.
- **Windows:** `C:\Users\<user>\AppData\Roaming\io.github.divyeshmangla\`
- **macOS:** `~/Library/Application Support/io.github.divyeshmangla/`
- **Linux:** `~/.local/share/io.github.divyeshmangla/`

*(Note: The app still falls back to `localStorage` if run as a standard website, allowing flexible deployment options.)*

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

**Prerequisites:** Node.js 18 or later, Rust toolchain.

```bash
# Install dependencies
npm install

# Start the development server (browser-only)
npm run dev

# Start the Tauri desktop app in dev mode
npm run tauri:dev
```

The browser dev app will be available at `http://localhost:5173`.

```bash
# Build desktop app
npm run tauri:build
```

---

## Roadmap

- Export and import data as JSON
- Basic statistics view
