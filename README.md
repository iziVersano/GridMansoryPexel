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

Create a `.env` file inside the `client` folder:
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

## ⚡ Performance Techniques

- **Manual Virtualization**: Renders only visible items to reduce DOM load.  
- **Infinite Scroll**: Loads more data only when needed.  
- **Memoization & Throttling**: Used in scroll handling and layout calculations.  
- **Lazy Loading**: Components and images load on demand.  

---

## 🧪 Testing

We use **Jest** with **ts-jest** and **@testing-library/react** for unit and integration tests.

1. **Install test dependencies**
   ```bash
   yarn add -D jest ts-jest @types/jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
   ```

2. **Run all tests**
   ```bash
   yarn test
   ```

3. **Watch mode**
   ```bash
   yarn test:watch
   ```

4. **Generate coverage report**
   ```bash
   yarn test:coverage
   ```

> **Note:** Jest configuration lives in `jest.config.js` (uses `ts-jest` preset), and setup helpers are in `client/src/setupTests.ts`.

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
