# Next.js with Tailwind CSS

A modern Next.js 14 application built with JavaScript and Tailwind CSS.

## 🚀 Features

- **Next.js 14** - Latest version with improved performance and features
- **React 18** - Latest React version with enhanced capabilities
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **JavaScript** - Modern JavaScript implementation

## 📋 Prerequisites

- Node.js (v23.x or higher)
- npm or yarn

## 🛠️ Installation

1. Install dependencies:
  ```bash
  npm install
  # or
  yarn install
  ```

2. Start the development server:
  ```bash
  npm run dev
  # or
  yarn dev
  ```
3. Open [http://localhost:4028](http://localhost:4028) with your browser to see the result.

## 📁 Project Structure

```
nextjs-js-tailwind/
├── public/             # Static assets
├── src/
│   ├── app/            # App router components
│   │   ├── layout.jsx  # Root layout component
│   │   └── page.jsx    # Main page component
│   ├── components/     # Reusable UI components
│   ├── styles/         # Global styles and Tailwind configuration
├── next.config.mjs     # Next.js configuration
├── package.json        # Project dependencies and scripts
├── postcss.config.js   # PostCSS configuration
└── tailwind.config.js  # Tailwind CSS configuration

```

## 🧩 Page Editing

You can start editing the page by modifying `src/app/page.jsx`. The page auto-updates as you edit the file.

## 🎨 Styling

This project uses Tailwind CSS for styling with the following features:
- Utility-first approach for rapid development
- Custom theme configuration
- Responsive design utilities
- PostCSS and Autoprefixer integration

## 📦 Available Scripts

- `npm run dev` - Start development server on port 4028
- `npm run build` - Build the application for production
- `npm run start` - Start the development server
- `npm run serve` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier

## 📱 Deployment

Build the application for production:
  ```bash
  npm run build
  ```



