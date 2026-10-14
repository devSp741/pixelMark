# ⚡ PixelMark — Screenshot & Image Annotation Studio

<div align="center">

![PixelMark Banner](https://raw.githubusercontent.com/devSp741/pixelMark/main/screenshot-preview.png)

**A modern, blazing fast, 100% private in-browser screenshot and image annotation editor.**  
*Crop, blur, highlight, draw arrows, add numbered steps, callout bubbles, and export in full studio resolution — zero backend required.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React 18](https://img.shields.io/badge/React-18-61dafb.svg?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Privacy: 100% Client-Side](https://img.shields.io/badge/Privacy-100%25%20Client--Side-10b981.svg)](https://github.com/devSp741/pixelMark)
[![Author](https://img.shields.io/badge/Author-Satyam%20Prajapati-indigo.svg)](https://github.com/devSp741)

[**Live Demo**](https://github.com/devSp741/pixelMark) • [**Report Bug**](https://github.com/devSp741/pixelMark/issues) • [**Request Feature**](https://github.com/devSp741/pixelMark/issues)

</div>

---

## 🌟 Key Highlights

- 🔒 **100% Private & Zero Backend**: Everything runs locally in browser memory using the HTML5 Canvas API. Your screenshots and images **never** leave your computer.
- 🎨 **14 Professional Markup Tools**: Precision geometric shapes, dynamic curved arrows, sensitive data blurring, numbered tutorial steps, and custom typography.
- 📱 **Fully Responsive Across All Devices**: Seamless experience on Mobile phones, Tablets, and Desktop screens with smart overflow drawers and floating inspector triggers.
- 🌓 **Auto System Theme Sync**: 3-state segmented theme switcher (`Light`, `System Auto`, `Dark`) with automatic OS theme listener and local storage persistence.
- 📋 **Seamless Clipboard Workflow**: Press `Ctrl+V` anywhere to paste an image directly from your clipboard, and click `Copy Image` to copy the final rendered canvas back to your clipboard.
- 🚀 **Studio Export Options**: High-DPI 2x/3x supersampling, CleanShot-style studio background gradients, shadow offsets, and export formats in PNG, JPEG, and WebP.

---

## 🛠️ Complete Tools Suite

| Tool | Shortcut | Description |
| :--- | :---: | :--- |
| **Select & Move** | `V` | Select, drag, resize, rotate, and duplicate annotations |
| **Crop Image** | `C` | Interactive multi-handle crop tool with preset aspect ratios |
| **Arrow Tool** | `A` | Straight, curved, single-headed or double-headed arrows |
| **Line Tool** | `L` | Solid, dashed, or dotted precise measurement lines |
| **Rectangle** | `R` | Rounded corners, fill colors, and border stroke controls |
| **Ellipse / Circle** | `O` | Smooth geometric oval and circle highlight zones |
| **Freehand Pen** | `P` | Responsive pressure brush strokes with smoothing |
| **Text Annotation** | `T` | Rich typography with fonts (Inter, Mono, Serif), pill backdrops |
| **Highlight Box** | `H` | Vibrant semi-transparent highlighter for text and UI elements |
| **Blur / Pixelate** | `B` | Mask sensitive API keys, passwords, and user details |
| **Numbered Step** | `N` | Auto-incrementing step counter badges (1, 2, 3...) for docs |
| **Marker Pen** | `M` | Semi-opaque felt marker for organic sketching |
| **Callout Bubble** | `K` | Speech bubble with adjustable tail pointer for notes |
| **Eraser** | `E` | Single-click delete tool for quick canvas cleaning |

---

## ⌨️ Essential Keyboard Shortcuts

- `Ctrl + Z`: Undo last action
- `Ctrl + Y` / `Ctrl + Shift + Z`: Redo
- `Ctrl + V`: Paste image from clipboard
- `Ctrl + D`: Duplicate selected annotation
- `Backspace` / `Delete`: Delete selected element
- `Spacebar + Drag`: Pan across canvas
- `+` / `-`: Zoom in / Zoom out
- `0`: Fit canvas to screen
- `?` or `Ctrl + K`: Open Shortcuts reference guide

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/devSp741/pixelMark.git
   cd pixelMark
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to **[http://localhost:5173/](http://localhost:5173/)** in your web browser.

---

## 🏗️ Technology Stack

- **Framework**: [React 18](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Bundler & Dev Server**: [Vite 5](https://vitejs.dev/)
- **Canvas Rendering**: Pure HTML5 Canvas 2D Context (Hardware-accelerated)

---

## 📂 Project Structure

```text
pixelmark/
├── index.html                                        # SEO-optimized HTML entry with schema.org JSON-LD
├── package.json                                      # Dependencies and author metadata
├── tsconfig.json                                     # TypeScript compiler configuration
├── vite.config.ts                                    # Vite bundler configuration
├── tailwind.config.js                                # Tailwind CSS theme tokens
├── LICENSE                                           # MIT License
├── README.md                                         # Project documentation
├── pixelmark_screenshot_image_annotation_editor.tsx  # Core editor component and canvas engine
└── src/
    ├── App.tsx                                       # Root application component
    ├── main.tsx                                      # React DOM mount entry point
    └── index.css                                     # Global styling & custom typography
```

---

## 👨‍💻 Author

Crafted with ❤️ by **Satyam Prajapati**

- **GitHub**: [@devSp741](https://github.com/devSp741)
- **Repository**: [https://github.com/devSp741/pixelMark](https://github.com/devSp741/pixelMark)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
Feel free to use, modify, and distribute.
