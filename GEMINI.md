# GEMINI.md

This file provides guidance to Gemini when working with code in this repository.

## 🏗️ Project Overview

Encodly is a monorepo for a collection of developer tools, built with React, TypeScript, and Vite. The project consists of multiple web applications sharing common UI components and utilities.

### Architecture
- **Monorepo Structure**: Using npm workspaces
- **Apps**: Individual tool applications in `/apps` directory
- **Packages**: Shared components and utilities in `/packages` directory
- **Deployment**: Each app is deployed as a separate subdomain (e.g., json.encodly.com)

## 📦 Key Commands

### Development
```bash
# Run all apps simultaneously
npm run dev

# Run specific app
npm run dev:json          # JSON Formatter
npm run dev:calc          # Percentage Calculator
npm run dev:base64        # Base64 Converter
npm run dev:url           # URL Converter
npm run dev:jwt-decoder   # JWT Decoder
npm run dev:jwt-encoder   # JWT Encoder
npm run dev:hash-generator # Hash Generator
npm run dev:uuid-generator # UUID Generator
npm run dev:password-generator # Password Generator
npm run dev:md-viewer     # Markdown Viewer
npm run dev:qr-generator  # QR Code Generator
npm run dev:regex-tester  # Regex Tester
```

To run all apps at once on Windows, you can also use the `start-all-apps-wt.bat` script.

### Building
```bash
# Build all (shared packages first, then apps)
npm run build

# Build specific app
npm run build:json
npm run build:calc
# etc...
```

### Linting
```bash
npm run lint
```

### Deployment
```bash
# Deploy all apps
npm run deploy

# Deploy specific app
npm run deploy:json
# etc...
```

## 🏛️ Code Architecture

### Shared Packages

1. **@encodly/shared-ui** (`packages/shared-ui/`)
   - Common UI components (Header, Footer, ToolLayout, Button, etc.)
   - Shadcn/UI components in `src/components/ui/`
   - Theme provider and hooks
   - Global styles and Tailwind configuration

2. **@encodly/shared-utils** (`packages/shared-utils/`)
   - Common utilities (clipboard, formatting, storage, validation)
   - Analytics utilities
   - Shared TypeScript types

3. **@encodly/shared-analytics** (`packages/shared-analytics/`)
   - Google Analytics provider
   - AdSense provider
   - Analytics tracking utilities

4. **@encodly/shared-config** (`packages/shared-config/`)
   - ESLint configurations
   - Prettier configurations
   - TypeScript base configurations

### App Structure Pattern

Each app follows this structure:
```
apps/[app-name]/
├── src/
│   ├── App.tsx           # Main app component with providers
│   ├── main.tsx          # Entry point
│   ├── index.css         # Tailwind imports
│   ├── components/       # App-specific components
│   ├── pages/           # Page components (usually one)
│   └── utils/           # App-specific utilities
├── public/              # Static assets
├── package.json         # App dependencies
├── vite.config.ts       # Vite configuration with unique port
└── vercel.json          # Deployment configuration
```

### Adding New Apps

When creating a new app, follow the structure in `NEW-APP-CHECKLIST.md`.

### Port Assignments
- Main Site: 5000
- JSON Formatter: 5001
- Percentage Calculator: 5002
- Base64 Converter: 5003
- URL Converter: 5004
- JWT Decoder: 5005
- JWT Encoder: 5006
- Hash Generator: 5007
- UUID Generator: 5008
- Password Generator: 5009
- Markdown Viewer: 5010
- QR Code Generator: 5011
- Regex Tester: 5012

## 🔧 Development Guidelines

### Component Patterns
- Use functional components with TypeScript
- Implement comprehensive SEO metadata in page components
- Include InfoModal for help/documentation
- Use shared UI components from `@encodly/shared-ui`
- Follow existing component patterns for consistency

### State Management
- Local state with React hooks
- URL state for shareable configurations
- Local storage for user preferences via `@encodly/shared-utils`

### Styling
- Tailwind CSS for styling
- Use theme colors via CSS variables
- Responsive design with mobile-first approach
- Dark/light theme support built-in

### Error Handling
- User-friendly error messages
- Toast notifications for user feedback
- Proper validation with helpful messages
- Loading states for async operations

### Security & Privacy
- All processing happens client-side
- No data sent to servers
- No persistent storage of user data (except preferences)
- Input sanitization where needed

## 🚨 Important Notes

1. **Monorepo Dependencies**: Always use `workspace:*` for internal package dependencies
2. **Build Order**: Shared packages must be built before apps
3. **TypeScript**: Strict mode enabled, ensure proper typing
4. **Testing**: Currently no tests (package.json shows placeholder)
5. **Environment Variables**:
   - `VITE_GA_MEASUREMENT_ID` for Google Analytics
   - `VITE_ADSENSE_CLIENT_ID` for AdSense
