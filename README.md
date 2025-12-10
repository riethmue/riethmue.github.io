# 👩🏻‍💻 Sarah Riethmüller - Personal Website

> A retro-styled cyberpunk portfolio with an interactive 3D scene and terminal interface

[![Angular](https://img.shields.io/badge/Angular-20.2-DD0031?logo=angular)](https://angular.io/)
[![Three.js](https://img.shields.io/badge/Three.js-0.179-000000?logo=three.js)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)

## ✨ Features

- 🎮 **Retro Terminal Interface** - Interactive xterm.js terminal with custom commands
- 🖥️ **3D Computer Model** - Three.js rendered 3D scene with pixel art shader
- 💚 **Cyberpunk Aesthetics** - Neon green terminal vibes with scanline effects
- 📱 **Mobile Optimized** - Responsive design with mobile-specific layouts
- ⚡ **Performance Stats** - Real-time rendering metrics with ASCII bargraphs
- 🎨 **Pixel Art Graphics** - Custom shaders and retro visual effects

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
npm install
```

## 📜 Available Scripts

| Command          | Description                                         |
| ---------------- | --------------------------------------------------- |
| `npm start`      | Start development server on `http://localhost:4200` |
| `npm run build`  | Build for production (output in `dist/`)            |
| `npm run watch`  | Build in watch mode for development                 |
| `npm test`       | Run unit tests via Karma                            |
| `npm run mobile` | Start dev server with QR code for mobile testing    |

### Mobile Development

The `mobile` script starts a dev server accessible on your local network and displays a QR code for easy mobile testing:

```bash
npm run mobile
```

## 🛠️ Tech Stack

### Core

- **Angular 20.2** - Modern web framework
- **TypeScript 5.9** - Type-safe JavaScript
- **RxJS 7.8** - Reactive programming

### 3D & Graphics

- **Three.js 0.179** - 3D rendering engine
- **Custom GLSL Shaders** - Pixel art post-processing

### Terminal

- **xterm.js 5.5** - Terminal emulator
- **xterm-addon-fit** - Terminal sizing

### UI & Styling

- **Tailwind CSS 4.1** - Utility-first CSS
- **Angular CDK 20.2** - Component development kit
- **FontAwesome 7.0** - Icon library

## 🎨 Project Structure

```
src/
├── app/
│   ├── about-me-card/        # Main content card with terminal
│   ├── computer-model/       # 3D scene with Three.js
│   │   ├── shader/           # Custom GLSL shaders
│   │   └── *.ts              # Scene setup & controls
│   ├── modal/                # Retro-styled modal component
│   ├── terminal/             # xterm.js terminal integration
│   ├── rendering-performance/ # FPS & stats overlay
│   └── services/             # Shared services
├── assets/                   # Static assets
└── styles.css               # Global styles & themes
```

## 🎯 Terminal Commands

Type `help` in the terminal to see available commands:

- `help` - Show all commands
- `about` - Info about me
- `skills` - Display my tech skills
- `projects` - List my projects
- `hobbies` - Show my hobbies
- `contact` - Get contact info
- `cv` - Open my CV
- `fortune` - Random tech quote
- `info` - System information
- `clear` - Clear terminal

## 🔧 Development

### Code Scaffolding

```bash
ng generate component component-name
ng generate directive|pipe|service|class|guard|interface|enum|module
```

### Build

```bash
npm run build
```

Build artifacts will be stored in the `dist/` directory.

## 📝 TODO

- [ ] Accessibility features (ARIA labels, keyboard navigation)
- [ ] Consider removing Tailwind CSS dependency
- [ ] Add comprehensive unit tests
- [ ] Add E2E tests
- [ ] PWA support
- [ ] Dark/Light theme toggle

## 📄 License

© 2025 Sarah Riethmüller. All rights reserved.

## 🔗 Links

- [Live Demo](https://riethmue.github.io/)
- [GitHub](https://github.com/riethmue)
- [Twitter](https://twitter.com/riethmue93)

---

Built with 💚 and lots of ☕
