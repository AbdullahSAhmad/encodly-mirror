# New App Integration Checklist

This checklist ensures that new apps are properly integrated into the Encodly ecosystem and are discoverable across all platforms.

## ✅ Required Steps for Each New App

### 1. **URL Configuration**
- [ ] Add app URL to `packages/shared-ui/src/utils/urls.ts`
  - [ ] Add dev URL (localhost:PORT)
  - [ ] Add production URL (subdomain.encodly.com)
  - [ ] Export URL in getToolUrls() function

### 2. **Header Tools Menu**
- [ ] Add app to tools array in `packages/shared-ui/src/components/Header.tsx`
  - [ ] Include name, href (using toolUrls), and description
  - [ ] Ensure description is concise and descriptive

### 3. **Command Palette**
- [ ] Add app to defaultCommands in `packages/shared-ui/src/components/CommandPalette.tsx`
  - [ ] Include id, title, description, icon
  - [ ] Add relevant keywords for search functionality
  - [ ] Set category as 'tools'
  - [ ] Use appropriate Lucide icon

### 4. **Main Site Homepage**
- [ ] Add app to tools array in `apps/main-site/src/pages/HomePage.tsx`
  - [ ] Include name, description, href, icon, and features
  - [ ] Ensure features list highlights key capabilities
  - [ ] Use consistent icon with other components

### 5. **Info Modal Integration**
- [ ] Create InfoModal component in `src/components/InfoModal.tsx`
  - [ ] Include structured content with features, use cases, examples
  - [ ] Use consistent styling with other info modals
  - [ ] Add pro tips and best practices
- [ ] Integrate info modal in main page component
  - [ ] Import InfoModal and Info icon
  - [ ] Add headerActions prop to ToolLayout
  - [ ] Use consistent button styling (borderless, hover effects)

### 6. **Package Configuration**
- [ ] Add app to root `package.json` scripts
  - [ ] dev:app-name
  - [ ] build:app-name
  - [ ] deploy:app-name (if applicable)
- [ ] Add to build:apps and deploy scripts
- [ ] Add to main dev script for parallel running

### 7. **Startup Scripts**
- [ ] Add app to `start-all-apps-wt.bat` with correct port
- [ ] Update any other startup scripts in the project

### 8. **Build and Deploy Configuration**  
- [ ] Install all dependencies: `npm install` (required for vite-plugin-pwa and other packages)
- [ ] Verify app builds successfully with `npm run build:app-name`
- [ ] Test dev server with `npm run dev:app-name`
- [ ] Ensure app works with shared packages

### 9. **SEO and Analytics**
- [ ] Verify SEO component is properly configured
- [ ] Ensure Google Analytics is integrated via shared-analytics
- [ ] Add robots.txt and sitemap.xml files
- [ ] Include app in main sitemap if applicable

### 10. **Testing and Quality Assurance**
- [ ] Test app functionality independently
- [ ] Test navigation from header dropdown
- [ ] Test command palette search and navigation
- [ ] Test info modal content and styling
- [ ] Verify app appears correctly on main homepage
- [ ] Test responsive design on mobile/tablet
- [ ] Verify all links and buttons work correctly

### 11. **Documentation**
- [ ] Add app to any relevant documentation
- [ ] Update README if app adds new dependencies
- [ ] Document any special setup requirements

## 🚀 After Integration

### Install Dependencies
```bash
npm install
```
*This installs all dependencies including the new app's packages*

### Rebuild Shared Packages
```bash
npm run build:shared
```

### Test All Integration Points
- [ ] Header dropdown shows new app
- [ ] Command palette finds app in search
- [ ] Main homepage displays app card
- [ ] Info modal opens and displays correctly
- [ ] All navigation works across apps

### Deployment Verification
- [ ] Verify subdomain is configured
- [ ] Test production URLs work
- [ ] Confirm app loads in production environment

## 📝 Example Integration

For reference, see how JWT Encoder was integrated:
- URLs: Added `jwtEncoder: 'http://localhost:5006'` and production URL
- Header: Added `{ name: 'JWT Token Encoder', href: toolUrls.jwtEncoder, description: 'Create & sign JWT tokens' }`
- Command Palette: Added with keywords `['jwt', 'token', 'encode', 'create', 'sign', 'json', 'web', 'generate']`
- Homepage: Added with features `['Token creation', 'Custom payloads', 'HMAC signing', 'Payload templates']`
- Info Modal: Comprehensive content about JWT encoding, algorithms, and security

## ⚠️ Common Pitfalls to Avoid

1. **Forgetting to install dependencies** - vite-plugin-pwa and other packages won't be available
2. **Forgetting to rebuild shared packages** - Changes won't take effect
3. **Inconsistent naming** - Use the same app name across all integration points
4. **Missing keywords** - Command palette won't find the app
5. **Wrong URLs** - App won't be accessible from navigation
6. **Outdated build scripts** - App won't build in CI/CD
7. **Missing analytics** - Can't track app usage
8. **Broken info modal** - Poor user experience
9. **PWA config issues** - Missing vite-plugin-pwa causes dev server failures
10. **Using unavailable UI components** - Select, Dropdown not exported from shared-ui

## 🔧 Troubleshooting Common Issues

### "Cannot find package 'vite-plugin-pwa'" Error
```bash
npm install  # Install all workspace dependencies
npm run build:shared  # Rebuild shared packages
npm run dev:app-name  # Try again
```

### App Not Showing in Navigation
1. Check `packages/shared-ui/src/utils/urls.ts` has both dev and prod URLs
2. Verify `packages/shared-ui/src/components/Header.tsx` has the app in tools array
3. Run `npm run build:shared` to apply changes
4. Clear browser cache and reload

### Command Palette Not Finding App
1. Verify app is added to `packages/shared-ui/src/components/CommandPalette.tsx`
2. Check that keywords array includes relevant search terms
3. Rebuild shared packages: `npm run build:shared`

### "No matching export" Error for UI Components
```bash
# Check available components in packages/shared-ui/src/index.ts
# Use only exported components like Button, Input, Card, etc.
# For dropdowns, use HTML <select> with Tailwind classes instead of Select component
```

## 🔧 Automation Ideas for Future

Consider creating scripts to automate:
- Adding new apps to all configuration files
- Generating boilerplate integration code
- Validating all integration points are complete