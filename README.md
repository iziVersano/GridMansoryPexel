# 📸 Virtualized Masonry Grid - Pexels Photo Viewer

A performant Single Page Application (SPA) that displays photos in a virtualized masonry grid using the [Pexels API](https://www.pexels.com/api/). Built with **React**, **TypeScript**, and **Vite**.

---

## 🚀 Live Demo

👉 [grid-mansory-pexel.vercel.app](https://grid-mansory-pexel.vercel.app)

---

## 📦 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/iziVersano/GridMansoryPexel.git
cd GridMansoryPexel
```

### 2. Install dependencies
```bash
yarn install
```

### 3. Add Pexels API key

Create `.env` inside the `client` folder:

```
VITE_PEXELS_API_KEY=your_pexels_api_key
```

### 4. Run locally
```bash
yarn dev
```

### 5. Build for production
```bash
yarn build
```

---

## 🧱 Project Structure & Architecture

The app follows a **feature-based folder structure** (e.g. `photoGrid`, `photoDetail`, `search`). This keeps related logic (components, hooks, styles) grouped together, making the codebase easier to scale and maintain, especially as new features are added.

---

## ⚙️ Key Features

- 🔍 Search photos by title or photographer
- 🧱 Masonry layout without external layout libraries
- 📦 Virtualized rendering for performance
- 🔄 Infinite scroll
- 📸 Detailed view with metadata
- 📱 Responsive design

---

## ⚡ Performance Techniques

- **Manual Virtualization**: Renders only visible items to reduce DOM load.
- **Infinite Scroll**: Loads more data only when needed.
- **Memoization & Throttling**: Used in scroll handling and layout calculations.
- **Lazy Loading**: Components and images load on demand.

---

## 🛠️ Tech Stack

- React + TypeScript
- Vite
- Styled-components
- Vercel (deployment)
- Pexels API

---

## 👨‍💻 Author

Izi Versano  
📧 iziversano@gmail.com
