# Synapse Chatbot - Accessibility Checklist

**Standard:** WCAG 2.1 Level AA  
**Last Updated:** November 3, 2025  
**Version:** 1.0.0

---

## 📋 Overview

This checklist ensures the Synapse chatbot meets accessibility standards for users with disabilities. All items should be tested and verified before deployment.

---

## ✅ Keyboard Navigation

### General Navigation

- [ ] **Tab order is logical** - Follows visual layout from left to right, top to bottom
- [ ] **All interactive elements are keyboard accessible** - Buttons, links, inputs, dropdowns
- [ ] **No keyboard traps** - Users can navigate away from all interactive elements
- [ ] **Skip links provided** - Allow users to skip to main content
- [ ] **Focus visible** - All focusable elements have clear visible focus indicator

### Specific Components

#### Buttons
- [ ] **Space or Enter activates buttons**
- [ ] **Focus ring visible** (2px outline with offset)
- [ ] **Disabled buttons cannot receive focus**

#### Modals
- [ ] **Escape key closes modals**
- [ ] **Focus trapped within modal** when open
- [ ] **Focus returns to trigger element** after modal closes
- [ ] **First focusable element receives focus** when modal opens

#### Dropdowns/Selects
- [ ] **Arrow keys navigate options**
- [ ] **Enter selects option**
- [ ] **Escape closes dropdown**
- [ ] **Type-ahead search works** (if applicable)

#### Sliders
- [ ] **Arrow keys increase/decrease value**
- [ ] **Home/End keys jump to min/max**
- [ ] **Page Up/Down for larger increments** (optional)

#### Tabs
- [ ] **Left/Right arrows navigate tabs**
- [ ] **Tab key moves to tab panel**
- [ ] **Home/End jump to first/last tab**

#### Search Input
- [ ] **Clear button keyboard accessible**
- [ ] **Search can be submitted with Enter**

#### Chat Input
- [ ] **Send with Enter** (if setting enabled)
- [ ] **Shift+Enter for new line**
- [ ] **Focus automatically in input** on page load

---

## 🎯 Focus Management

### Focus Indicators

```css
/* Required: Visible focus state */
:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}
```

- [ ] **Focus indicators meet 3:1 contrast ratio** against background
- [ ] **Focus indicators visible in both themes** (dark and light)
- [ ] **No invisible focus states**
- [ ] **Custom focus styles** maintain visibility

### Focus Order

- [ ] **Header navigation** → **Sidebar** → **Main content** → **Footer input**
- [ ] **Sidebar items** in chronological order (newest to oldest chats)
- [ ] **Modal elements** trapped in logical order
- [ ] **Dynamically added content** receives focus appropriately

---

## 🔊 Screen Reader Support

### ARIA Labels

#### Icon Buttons
```tsx
<Button aria-label="Send message">
  <Send className="w-4 h-4" />
</Button>

<Button aria-label="Toggle theme">
  <Sun className="w-4 h-4" />
</Button>

<Button aria-label="Open settings">
  <Settings className="w-4 h-4" />
</Button>
```

- [ ] **All icon-only buttons have aria-label**
- [ ] **Labels are descriptive and action-oriented**
- [ ] **No generic labels like "button" or "icon"**

#### Form Inputs
```tsx
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" aria-required="true" />

<Label htmlFor="password">Password</Label>
<Input 
  id="password" 
  type="password"
  aria-describedby="password-error"
/>
<span id="password-error" className="error">
  Password must be at least 8 characters
</span>
```

- [ ] **All inputs have associated <label>** elements
- [ ] **Required fields marked** with aria-required
- [ ] **Error messages linked** with aria-describedby
- [ ] **Instructions provided** before input (not just placeholder)

#### Live Regions
```tsx
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {statusMessage}
</div>
```

- [ ] **Success messages announced** (settings saved, message sent)
- [ ] **Error messages announced** (failed to save, network error)
- [ ] **Loading states announced** ("Generating response...")
- [ ] **Use aria-live="polite"** for non-urgent announcements
- [ ] **Use aria-live="assertive"** for errors only

#### Modals
```tsx
<Dialog
  role="dialog"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
  aria-modal="true"
>
  <DialogTitle id="modal-title">Settings</DialogTitle>
  <DialogDescription id="modal-description">
    Manage your application preferences
  </DialogDescription>
</Dialog>
```

- [ ] **Modal has role="dialog"**
- [ ] **Modal has aria-modal="true"**
- [ ] **Title linked** with aria-labelledby
- [ ] **Description linked** with aria-describedby (if present)

#### Loading States
```tsx
<Button disabled aria-busy={isLoading}>
  {isLoading ? 'Sending...' : 'Send Message'}
</Button>
```

- [ ] **Loading buttons have aria-busy**
- [ ] **Loading text describes action** ("Saving...", "Loading...")

#### Toggles/Switches
```tsx
<Switch
  role="switch"
  aria-checked={isEnabled}
  aria-label="Enable streaming responses"
/>
```

- [ ] **Switches have role="switch"**
- [ ] **State indicated** with aria-checked
- [ ] **Label describes** what is being toggled

#### Star/Favorite Button
```tsx
<Button
  aria-label={isStarred ? "Unstar conversation" : "Star conversation"}
  aria-pressed={isStarred}
>
  <Star className={isStarred ? "fill-current" : ""} />
</Button>
```

- [ ] **Toggle buttons use aria-pressed**
- [ ] **Label describes both states** ("Star" vs "Unstar")

### Screen Reader Only Text

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

- [ ] **Important status updates** have sr-only announcements
- [ ] **Dynamic content changes** announced
- [ ] **Loading states** communicated to screen readers

---

## 🎨 Color & Contrast

### Text Contrast

**WCAG AA Requirements:**
- Normal text (< 18px): **4.5:1 minimum**
- Large text (≥ 18px or ≥ 14px bold): **3:1 minimum**
- UI components and graphics: **3:1 minimum**

#### Light Theme Checks

- [ ] **Body text on background**: `#0f172a` on `#ffffff` = **16.1:1** ✅
- [ ] **Subtext on background**: `#475569` on `#ffffff` = **8.6:1** ✅
- [ ] **Primary button text**: `#ffffff` on `#4f46e5` = **8.3:1** ✅
- [ ] **Link text**: `#4f46e5` on `#ffffff` = **8.3:1** ✅
- [ ] **Border on background**: `#e2e8f0` on `#ffffff` = **1.2:1** (decorative only)

#### Dark Theme Checks

- [ ] **Body text on background**: `#e6eefc` on `#0b1220` = **14.2:1** ✅
- [ ] **Subtext on background**: `#94a3b8` on `#0b1220` = **7.1:1** ✅
- [ ] **Primary button text**: `#ffffff` on `#4f46e5` = **8.3:1** ✅
- [ ] **Border on surface**: `#334155` on `#0f1a2b` = **2.1:1** (decorative only)

### Color Independence

- [ ] **Color is not the only indicator** of status or information
- [ ] **Error states** have icon + color + text
- [ ] **Success states** have icon + color + text
- [ ] **Required fields** marked with asterisk, not just color
- [ ] **Links distinguishable** without color (underline or weight)
- [ ] **Star/favorite state** indicated by filled icon, not just color

### Focus Indicators

- [ ] **Focus ring contrast**: 3:1 minimum against background
- [ ] **Focus ring visible** in both light and dark themes

---

## 📱 Responsive & Zoom

### Text Scaling

- [ ] **Text can be resized** up to 200% without loss of content or functionality
- [ ] **No horizontal scrolling** required at 200% zoom (except data tables)
- [ ] **Content reflows** appropriately when zoomed
- [ ] **Minimum font size**: 12px (0.75rem) for body text

### Touch Targets (Mobile)

- [ ] **Minimum touch target size**: 44x44px
- [ ] **Adequate spacing** between touch targets (8px minimum)
- [ ] **Buttons are large enough** for finger interaction
- [ ] **Swipe gestures** have alternative actions

### Viewport

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

- [ ] **Viewport meta tag** present
- [ ] **No maximum-scale restriction**
- [ ] **Responsive design** works across breakpoints

---

## 🎬 Motion & Animation

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Respects prefers-reduced-motion** media query
- [ ] **Animations can be disabled** by user preference
- [ ] **No seizure-inducing flashing** content (max 3 flashes per second)
- [ ] **Auto-playing animations** can be paused

### Animation Considerations

- [ ] **Modal transitions** respect reduced motion
- [ ] **Message animations** respect reduced motion
- [ ] **Button hover effects** simplified in reduced motion
- [ ] **Loading spinners** use reduced motion alternative

---

## 📝 Forms & Validation

### Labels & Instructions

- [ ] **All inputs have <label>** elements
- [ ] **Labels are visible** (not just placeholders)
- [ ] **Instructions provided** before input
- [ ] **Required fields** clearly marked

### Error Handling

```tsx
<div role="alert" className="error-message">
  Email is required
</div>
```

- [ ] **Errors have role="alert"**
- [ ] **Errors are descriptive** (not just "Invalid input")
- [ ] **Errors are associated** with inputs (aria-describedby)
- [ ] **Errors are announced** to screen readers
- [ ] **Form can be submitted** with keyboard

### Auto-complete

```tsx
<Input
  type="email"
  autoComplete="email"
  aria-autocomplete="list"
/>
```

- [ ] **Appropriate autocomplete** attributes used
- [ ] **Helps password managers**

---

## 🖼️ Images & Media

### Alternative Text

```tsx
// Decorative image
<img src="decoration.svg" alt="" role="presentation" />

// Informative image
<img src="chart.png" alt="Revenue chart showing 30% growth" />

// Icon with adjacent text
<Send aria-hidden="true" />
<span>Send Message</span>

// Icon button
<Button aria-label="Send message">
  <Send aria-hidden="true" />
</Button>
```

- [ ] **Decorative images have empty alt=""**
- [ ] **Informative images have descriptive alt**
- [ ] **Icons with adjacent text** marked aria-hidden
- [ ] **Icon-only buttons** have aria-label on button
- [ ] **SVG icons** have role="img" and <title> if standalone

### SVG Accessibility

```tsx
<svg role="img" aria-labelledby="icon-title">
  <title id="icon-title">Settings Icon</title>
  {/* SVG content */}
</svg>
```

- [ ] **Meaningful SVGs** have role="img"
- [ ] **Title element** for important SVGs
- [ ] **Decorative SVGs** have aria-hidden="true"

---

## 🔐 Security & Privacy

### Password Fields

```tsx
<Input
  type="password"
  autoComplete="current-password"
  aria-describedby="password-requirements"
/>
<div id="password-requirements">
  Must be at least 8 characters with one number
</div>
```

- [ ] **Password requirements** announced to screen readers
- [ ] **Show/hide toggle** keyboard accessible
- [ ] **autocomplete** attributes used correctly

---

## 📊 Testing Checklist

### Automated Testing

- [ ] **axe-core** - No violations found
- [ ] **Lighthouse** - Accessibility score ≥ 90
- [ ] **WAVE** - No errors
- [ ] **pa11y** - No errors

### Manual Testing

#### Keyboard Only
- [ ] **Unplug mouse** and navigate entire app
- [ ] **All features** accessible via keyboard
- [ ] **Focus visible** at all times
- [ ] **No keyboard traps**

#### Screen Reader Testing
- [ ] **NVDA (Windows)** - All content accessible
- [ ] **JAWS (Windows)** - All content accessible
- [ ] **VoiceOver (macOS)** - All content accessible
- [ ] **TalkBack (Android)** - Mobile interface accessible

#### Zoom & Scaling
- [ ] **200% browser zoom** - No content loss
- [ ] **400% zoom** - Content still usable
- [ ] **Mobile zoom** - Pinch to zoom works

#### Color & Contrast
- [ ] **Contrast analyzer** used on all text
- [ ] **Both themes** meet contrast requirements
- [ ] **Color blind simulation** - Information still conveyed

---

## 🎯 Component-Specific Checks

### Authentication Modal

- [ ] **Tab order**: Email → Password → Show/Hide → Forgot Password → Login Button
- [ ] **Labels** associated with inputs
- [ ] **Errors announced** when validation fails
- [ ] **Success** announced after login
- [ ] **Focus returns** to trigger button after close

### Settings Modal

- [ ] **Sliders** keyboard accessible (arrow keys)
- [ ] **Value changes** announced to screen readers
- [ ] **Toggles** have proper aria-checked state
- [ ] **Unsaved changes** banner announced
- [ ] **Save confirmation** announced

### Chat Interface

- [ ] **New messages** announced to screen readers (aria-live)
- [ ] **Typing indicator** communicated
- [ ] **Code blocks** properly formatted for screen readers
- [ ] **Copy button** has aria-label
- [ ] **Star button** announces state change

### Sidebar

- [ ] **Thread list** has accessible name
- [ ] **Active thread** indicated with aria-current
- [ ] **Delete action** requires confirmation
- [ ] **Search** has clear label

---

## 📄 Documentation

- [ ] **Accessibility statement** published
- [ ] **Keyboard shortcuts** documented
- [ ] **Contact for accessibility issues** provided
- [ ] **Known issues** listed (if any)

---

## ✨ Best Practices

### Semantic HTML

- [ ] **Use semantic elements** (header, nav, main, footer, article, aside)
- [ ] **Heading hierarchy** is logical (h1 → h2 → h3)
- [ ] **Lists** use ul/ol/li
- [ ] **Buttons** use <button>, not <div>
- [ ] **Links** use <a> with href

### Progressive Enhancement

- [ ] **Core functionality** works without JavaScript
- [ ] **Fallbacks** for modern features
- [ ] **Graceful degradation**

### Testing Frequency

- [ ] **Before each release** - Full accessibility audit
- [ ] **During development** - Automated tests in CI/CD
- [ ] **User testing** - Include users with disabilities

---

## 📞 Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

---

**Last Updated:** November 3, 2025  
**Compliance Target:** WCAG 2.1 Level AA  
**Next Review:** Every release

