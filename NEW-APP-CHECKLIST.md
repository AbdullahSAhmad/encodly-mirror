# New App Development Checklist

This checklist ensures all new apps follow the established guidelines and standards for the Encodly platform.

## 📋 Project Setup

### Directory Structure
- [ ] Create app directory in `/apps/[app-name]`
- [ ] Set up proper folder structure:
  - [ ] `src/components/`
  - [ ] `src/pages/`
  - [ ] `src/utils/`
  - [ ] `public/`

### Configuration Files
- [ ] `package.json` with correct name `@encodly/[app-name]`
- [ ] `tsconfig.json` with proper TypeScript configuration
- [ ] `tsconfig.node.json` for Vite configuration
- [ ] `tailwind.config.js` with shared-ui integration
- [ ] `postcss.config.js` for Tailwind processing
- [ ] `vite.config.ts` with unique port number
- [ ] `vercel.json` with monorepo build commands

### Dependencies
- [ ] Add required dependencies:
  - [ ] `@encodly/shared-ui` (workspace:*)
  - [ ] `@encodly/shared-utils` (workspace:*)
  - [ ] `@encodly/shared-analytics` (workspace:*)
  - [ ] `react` and `react-dom`
  - [ ] Any app-specific dependencies
- [ ] Add dev dependencies (TypeScript, Vite, etc.)

## 🎨 UI Components & Pages

### Core Files
- [ ] `src/main.tsx` - Entry point with React.StrictMode
- [ ] `src/App.tsx` - Main component with ThemeProvider
- [ ] `src/index.css` - Import shared-ui styles and Tailwind
- [ ] `src/vite-env.d.ts` - Vite type definitions

### Main Page Component
- [ ] Create `src/pages/[AppName]Page.tsx`
- [ ] Implement comprehensive SEO data with:
  - [ ] Enhanced title and description
  - [ ] Keywords (English + Arabic)
  - [ ] JSON-LD structured data
  - [ ] Middle East focus
- [ ] Use `ToolLayout` component
- [ ] Add `InfoModal` with help trigger
- [ ] Include `ToastContainer` for notifications

### Core Functionality Component
- [ ] Create main component in `src/components/[AppName].tsx`
- [ ] Implement core functionality
- [ ] Add proper TypeScript types
- [ ] Include error handling and validation
- [ ] Add loading states
- [ ] Implement copy/download functionality where applicable

### Info Modal
- [ ] Create `src/components/InfoModal.tsx`
- [ ] Include comprehensive help content:
  - [ ] What the tool does
  - [ ] Features overview
  - [ ] Use cases
  - [ ] Tips for best results
  - [ ] Privacy & security information

### Utility Functions
- [ ] Create utility file in `src/utils/` if needed
- [ ] Add proper error handling
- [ ] Include input validation
- [ ] Add TypeScript types

## 🌐 HTML & Meta

### HTML Setup
- [ ] `index.html` with proper structure
- [ ] Correct title format: `Encodly | [App Name]`
- [ ] Comprehensive meta tags:
  - [ ] Description
  - [ ] Keywords
  - [ ] Open Graph tags
  - [ ] Canonical URL
- [ ] Favicon reference to `/favicon.svg`

### Public Assets
- [ ] `public/favicon.svg` - Code icon with consistent styling
- [ ] `public/robots.txt` - SEO crawler instructions
- [ ] `public/sitemap.xml` - Site structure for SEO

## 🔗 Platform Integration

### URL Configuration
- [ ] Add app URL to `packages/shared-ui/src/utils/urls.ts`:
  - [ ] Development URL (localhost:[port])
  - [ ] Production URL ([subdomain].encodly.com)
- [ ] Add app URL to `apps/main-site/src/utils/urls.ts`:
  - [ ] Same dev and production URLs

### Main Site Homepage
- [ ] Add app card to `apps/main-site/src/pages/HomePage.tsx`:
  - [ ] Import appropriate icon from lucide-react
  - [ ] Add to tools array with:
    - [ ] Name, description, href
    - [ ] Icon component
    - [ ] Feature list (4 items)
    - [ ] Gradient colors (unique)
    - [ ] Categories array
    - [ ] Search keywords
  - [ ] Update category counts

### Header Navigation
- [ ] Add to `packages/shared-ui/src/components/Header.tsx`:
  - [ ] Add to appropriate category in `toolCategories`
  - [ ] Include name, href, and description

### Command Palette
- [ ] Add to `packages/shared-ui/src/components/CommandPalette.tsx`:
  - [ ] Import icon from lucide-react
  - [ ] Add command object with:
    - [ ] Unique id, title, description
    - [ ] Icon component
    - [ ] Action function
    - [ ] Correct category
    - [ ] Search keywords

### Start Script
- [ ] Add app to `start-all-apps.sh`:
  - [ ] Add echo line with localhost URL

### Main Package.json
- [ ] Add to root `package.json` scripts:
  - [ ] `dev:[app-name]` script
  - [ ] Add to main `dev` script
  - [ ] `build:[app-name]` script
  - [ ] Add to `build:apps` script
  - [ ] `deploy:[app-name]` script
  - [ ] Add to main `deploy` script

## 🎯 Functionality Requirements

### Core Features
- [ ] Implement main functionality
- [ ] Add real-time processing where applicable
- [ ] Include input validation
- [ ] Add error handling with user-friendly messages
- [ ] Implement loading states

### User Experience
- [ ] Responsive design (mobile-first)
- [ ] Dark/light theme support
- [ ] Keyboard accessibility
- [ ] Copy to clipboard functionality
- [ ] Download functionality (where applicable)
- [ ] Clear/reset functionality
- [ ] Toast notifications for user feedback

### Performance
- [ ] Debounced inputs where applicable
- [ ] Optimized re-renders with useMemo/useCallback
- [ ] Lazy loading for heavy components
- [ ] Efficient algorithms

## 🔐 Standards & Best Practices

### Security & Privacy
- [ ] Client-side processing only
- [ ] No data transmission to servers
- [ ] No data persistence (except user preferences)
- [ ] Input sanitization

### Code Quality
- [ ] TypeScript types for all props and functions
- [ ] Consistent naming conventions
- [ ] Proper error boundaries
- [ ] Clean, readable code structure
- [ ] No console.log statements in production
- [ ] Proper component composition

### Accessibility
- [ ] ARIA labels where needed
- [ ] Keyboard navigation support
- [ ] Focus management
- [ ] Screen reader compatibility
- [ ] Sufficient color contrast

## 🚀 Deployment & Testing

### Build Configuration
- [ ] Vercel.json with correct monorepo commands
- [ ] Build succeeds without errors
- [ ] All imports resolve correctly
- [ ] TypeScript compilation passes

### Pre-deployment Testing
- [ ] App runs in development (`npm run dev:[app-name]`)
- [ ] All features work as expected
- [ ] Responsive design works on different screen sizes
- [ ] Theme switching works correctly
- [ ] Error states display properly
- [ ] Copy/download functions work

### SEO & Analytics
- [ ] Meta tags render correctly
- [ ] JSON-LD structured data is valid
- [ ] Analytics tracking implemented
- [ ] Canonical URLs are correct

## 📱 Port Assignment

### Port Numbers
Current port assignments:
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

- [ ] Assign next available port number
- [ ] Update vite.config.ts with assigned port
- [ ] Update URLs configuration files
- [ ] Update start-all-apps.sh

## ✅ Final Verification

### Integration Check
- [ ] App appears in main site homepage
- [ ] App appears in header dropdown
- [ ] App appears in command palette
- [ ] App starts with `npm run dev:[app-name]`
- [ ] App builds with `npm run build:[app-name]`
- [ ] Start-all-apps script includes new app

### Quality Assurance
- [ ] Code follows established patterns
- [ ] UI/UX matches other apps
- [ ] Error handling is comprehensive
- [ ] Performance is optimized
- [ ] All links and navigation work
- [ ] Theme persistence works across apps

### Documentation
- [ ] README updated if needed
- [ ] Code is self-documenting
- [ ] Complex logic has comments
- [ ] Public API is clearly defined

---

## 🏆 Completion

Once all items are checked:
1. Test the complete application thoroughly
2. Deploy to Vercel for production testing
3. Verify production deployment works
4. Add to this checklist any missing steps discovered during development

**App Name:** ________________  
**Developer:** ________________  
**Date Completed:** ________________  
**Production URL:** ________________