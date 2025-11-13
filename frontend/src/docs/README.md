# Synapse Chatbot - Design System & Developer Handoff Package

**Version:** 1.0.0  
**Last Updated:** November 3, 2025  
**Status:** ✅ Complete & Ready for Development

---

## 📦 What's Included

This package contains everything needed to implement the Synapse chatbot application:

### 🎨 Design Assets
- ✅ Complete design token system (JSON + CSS)
- ✅ SVG icon library (optimized, ready to use)
- ✅ Typography specifications
- ✅ Color system (Dark + Light themes)
- ✅ Spacing and layout tokens

### 📚 Documentation
- ✅ API contract with endpoint specifications
- ✅ Component usage guide with code examples
- ✅ Developer handoff guide
- ✅ Accessibility guidelines
- ✅ Animation specifications

### 💻 Code Implementation
- ✅ React components (TypeScript)
- ✅ ShadCN UI integration
- ✅ Responsive layouts
- ✅ Theme system (Dark/Light)
- ✅ Modal components (Auth, Settings, Profile)

---

## 🚀 Quick Start

### For Developers

1. **Review the design system:**
   ```bash
   # Check design tokens
   cat design-tokens/tokens.json
   
   # Review CSS variables
   cat styles/globals.css
   ```

2. **Read the documentation:**
   - Start with: `docs/DEVELOPER_HANDOFF.md`
   - API reference: `docs/API_CONTRACT.md`
   - Components: `docs/COMPONENT_GUIDE.md`

3. **Explore the icons:**
   ```bash
   ls icons/
   # All icons are optimized SVGs ready to import
   ```

4. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

5. **Run the application:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

---

## 📁 File Structure

```
/synapse-chatbot
│
├── /design-tokens/          # Design system tokens
│   └── tokens.json          # Complete token specification (JSON)
│
├── /icons/                  # SVG icon library
│   ├── icon-send.svg
│   ├── icon-star-outline.svg
│   ├── icon-star-filled.svg
│   ├── icon-search.svg
│   ├── icon-stop.svg
│   ├── icon-new-chat.svg
│   ├── icon-settings.svg
│   ├── icon-user.svg
│   ├── icon-logout.svg
│   ├── icon-trash.svg
│   ├── icon-archive.svg
│   ├── icon-sun.svg
│   ├── icon-moon.svg
│   ├── icon-copy.svg
│   └── icon-synapse-logo.svg
│
├── /docs/                   # Documentation
│   ├── README.md            # This file
│   ├── API_CONTRACT.md      # API specifications
│   ├── COMPONENT_GUIDE.md   # Component usage guide
│   └── DEVELOPER_HANDOFF.md # Developer handoff notes
│
├── /components/             # React components
│   ├── /modals/
│   │   ├── AuthModal.tsx
│   │   ├── ProfileModal.tsx
│   │   └── SettingsModal.tsx
│   ├── /pages/
│   │   ├── ChatPage.tsx
│   │   └── LandingPage.tsx
│   └── /ui/                 # ShadCN components
│
├── /styles/
│   └── globals.css          # Global styles + CSS variables
│
└── App.tsx                  # Main application
```

---

## 🎨 Design System Overview

### Color Tokens

**Primary Brand Colors:**
- `--primary: #4f46e5` (Indigo 600)
- `--primary-400: #818cf8` (Lighter)
- `--primary-600: #4338ca` (Darker)

**Theme Colors:**

| Token | Light Theme | Dark Theme |
|-------|-------------|------------|
| `--bg` | #ffffff | #0b1220 |
| `--surface-1` | #f8fafc | #0f1a2b |
| `--text` | #0f172a | #e6eefc |
| `--border` | #e2e8f0 | #334155 |

### Typography

**Font Stack:**
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', ...
--font-mono: 'JetBrains Mono', 'Fira Code', Consolas, ...
```

**Font Sizes:**
- xs: 12px
- sm: 14px
- base: 16px
- lg: 18px
- xl: 20px
- 2xl: 24px
- 3xl: 30px
- 4xl: 36px

### Spacing Scale

Based on 4px increments:
- 1 = 4px
- 2 = 8px
- 3 = 12px
- 4 = 16px
- 6 = 24px
- 8 = 32px
- 12 = 48px
- 16 = 64px

### Motion Tokens

**Durations:**
- Fast: 120ms
- Default: 220ms
- Slow: 350ms

**Easing:**
- Default: `cubic-bezier(0.2, 0.8, 0.2, 1)`
- Ease in: `cubic-bezier(0.4, 0, 1, 1)`
- Ease out: `cubic-bezier(0, 0, 0.2, 1)`
- Bounce: `cubic-bezier(0.68, -0.55, 0.265, 1.55)`

---

## 🧩 Key Components

### 1. Authentication Modal
**File:** `/components/modals/AuthModal.tsx`

Features:
- Tabbed interface (Login / Sign Up)
- Email/password fields
- Password show/hide toggle
- Social OAuth buttons (Google, GitHub)
- Inline validation
- Responsive design

### 2. Settings Modal
**File:** `/components/modals/SettingsModal.tsx`

Sections:
- **Model:** Dropdown selection
- **Behaviour:** Sliders (response length, temperature)
- **Account & Privacy:** Toggles and retention settings

Features:
- Unsaved changes indicator
- Reset to defaults
- Save/Cancel actions

### 3. Profile Modal
**File:** `/components/modals/ProfileModal.tsx`

Features:
- Avatar upload
- Editable name/email
- Usage statistics
- Plan information

### 4. Chat Interface
**File:** `/components/pages/ChatPage.tsx`

Components:
- Sidebar (320px) with chat history
- Header (64px) with title
- Message feed
- Input area with send/stop button

Features:
- Search chats
- Star/archive threads
- New chat button
- Theme toggle
- User dropdown menu

### 5. Landing Page
**File:** `/components/pages/LandingPage.tsx`

Features:
- Hero section with logo
- Feature cards (3-up grid)
- Example prompt chips
- Call-to-action buttons

---

## 🔌 API Integration

### Base URL
```
Production: https://api.synapse.ai/v1
Development: http://localhost:3000/api/v1
```

### Authentication
All authenticated requests require a Bearer token:
```http
Authorization: Bearer {access_token}
```

### Key Endpoints

**Auth:**
- `POST /auth/login` - Login with email/password
- `POST /auth/signup` - Create new account
- `POST /auth/logout` - End session

**User:**
- `GET /user/settings` - Get user settings
- `PUT /user/settings` - Update settings (partial)
- `GET /user/profile` - Get profile
- `PUT /user/profile` - Update profile

**Threads:**
- `GET /threads` - List all threads
- `POST /threads` - Create new thread
- `POST /threads/:id/star` - Star thread
- `DELETE /threads/:id/star` - Unstar thread

**Messages:**
- `POST /threads/:id/messages` - Send message (supports streaming)

See `docs/API_CONTRACT.md` for complete specifications.

---

## ♿ Accessibility

The application meets **WCAG 2.1 Level AA** standards:

### Keyboard Navigation
- ✅ All interactive elements keyboard accessible
- ✅ Logical tab order
- ✅ Visible focus indicators
- ✅ Escape closes modals

### Screen Reader Support
- ✅ ARIA labels on all icon buttons
- ✅ Live regions for dynamic content
- ✅ Semantic HTML structure
- ✅ Form labels properly associated

### Color Contrast
- ✅ Text: 4.5:1 minimum
- ✅ Large text: 3:1 minimum
- ✅ UI elements: 3:1 minimum

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📱 Responsive Design

### Breakpoints

| Size | Width | Layout |
|------|-------|--------|
| Mobile | < 768px | Stacked, collapsible sidebar |
| Tablet | 768px - 1023px | 2-column grid |
| Desktop | 1024px - 1439px | Full layout |
| Wide | ≥ 1440px | Full layout, max content width |

### Mobile Adaptations
- Sidebar becomes slide-in drawer
- Settings modal becomes full-screen
- 3-column grid becomes single column
- Touch-optimized button sizes (min 44x44px)

---

## 🎬 Animation Specifications

### Button Interactions
```css
.button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
  transition: all 150ms var(--motion-ease);
}

.button:active {
  transform: translateY(0);
  transition-duration: 50ms;
}
```

### Modal Open/Close
```css
@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
```

### Message Arrival
- Assistant messages: Slide in from left (180ms)
- User messages: Slide in from right (180ms)
- Fade + translate animation

### Send Button Glow
```css
.send-button {
  animation: glowPulse 2s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 20px var(--glow); }
  50% { box-shadow: 0 0 30px var(--glow); }
}
```

---

## 🧪 Testing

### Recommended Test Coverage

1. **Unit Tests:**
   - All components
   - Utility functions
   - State management

2. **Integration Tests:**
   - User flows (login, send message, etc.)
   - Modal interactions
   - Theme switching

3. **E2E Tests:**
   - Critical paths
   - Authentication flow
   - Chat functionality

4. **Accessibility Tests:**
   - Automated (axe-core)
   - Manual keyboard navigation
   - Screen reader testing

### Example Test
```typescript
test('user can toggle theme', () => {
  render(<App />);
  
  const themeButton = screen.getByLabelText('Toggle theme');
  fireEvent.click(themeButton);
  
  expect(document.documentElement).toHaveClass('dark');
});
```

---

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] Run full test suite
- [ ] Check bundle size
- [ ] Optimize images
- [ ] Validate accessibility (Lighthouse)
- [ ] Test on target browsers
- [ ] Verify API endpoints

### Environment Setup
```env
REACT_APP_API_URL=https://api.synapse.ai/v1
REACT_APP_ENVIRONMENT=production
```

### Build
```bash
npm run build
# or
yarn build
```

### Performance Targets
- Lighthouse Performance: > 90
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Bundle size: < 500KB (gzipped)

---

## 📖 Documentation Index

| Document | Purpose | Audience |
|----------|---------|----------|
| `README.md` | Overview & quick start | Everyone |
| `API_CONTRACT.md` | API specifications | Backend & Frontend devs |
| `COMPONENT_GUIDE.md` | Component usage & styling | Frontend devs |
| `DEVELOPER_HANDOFF.md` | Implementation guide | Frontend devs |
| `tokens.json` | Design token data | Designers & Devs |

---

## 🎯 Implementation Priority

### Phase 1: Foundation (Week 1)
- [ ] Set up design tokens
- [ ] Implement theme system
- [ ] Create base layout components
- [ ] Build authentication modal

### Phase 2: Core Features (Week 2)
- [ ] Chat interface
- [ ] Settings modal
- [ ] Profile modal
- [ ] API integration

### Phase 3: Refinement (Week 3)
- [ ] Animations and micro-interactions
- [ ] Responsive design
- [ ] Accessibility audit
- [ ] Performance optimization

### Phase 4: Polish (Week 4)
- [ ] Bug fixes
- [ ] Edge case handling
- [ ] Final testing
- [ ] Documentation updates

---

## 💡 Tips for Developers

### Using Design Tokens
```tsx
// ✅ Good - Use CSS variables
<div style={{ background: 'var(--surface-1)' }} />

// ❌ Bad - Hard-coded values
<div style={{ background: '#f8fafc' }} />
```

### Theme-Aware Components
```tsx
const MyComponent = ({ theme }: { theme: 'light' | 'dark' }) => {
  const isDark = theme === 'dark';
  
  return (
    <div className={isDark ? 'bg-surface-1' : 'bg-surface-1'}>
      {/* Content */}
    </div>
  );
};
```

### Importing Icons
```tsx
import { Send } from 'lucide-react';
// or use the SVG files directly
import SendIcon from '../icons/icon-send.svg';
```

---

## 🤝 Support

For questions or issues:

1. **Check documentation:** Review all docs first
2. **Inspect examples:** Look at existing component implementations
3. **Review tokens:** Ensure you're using the correct design tokens
4. **Test accessibility:** Use keyboard and screen readers

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Nov 3, 2025 | Initial release |

---

## 📄 License

Copyright © 2025 Synapse AI. All rights reserved.

---

**Ready to build something amazing! 🚀**
