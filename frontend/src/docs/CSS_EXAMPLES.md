# CSS Examples - Using Synapse Design Tokens

This document provides practical CSS examples using the Synapse design token system.

---

## Table of Contents

1. [Button Styles](#button-styles)
2. [Input Styles](#input-styles)
3. [Card Styles](#card-styles)
4. [Modal Styles](#modal-styles)
5. [Send Button with Glow](#send-button-with-glow)
6. [Message Bubbles](#message-bubbles)
7. [Sidebar Styles](#sidebar-styles)
8. [Utility Classes](#utility-classes)

---

## Button Styles

### Primary Button

```css
.btn-primary {
  /* Layout */
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  
  /* Appearance */
  background: linear-gradient(to right, var(--primary-600), var(--primary));
  color: white;
  border: none;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  
  /* Typography */
  font-size: var(--text-base);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
  
  /* Interaction */
  cursor: pointer;
  transition: all var(--motion-default) var(--motion-ease);
}

.btn-primary:hover {
  background: linear-gradient(to right, var(--primary-700), var(--primary-600));
  box-shadow: var(--shadow-lg);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: var(--shadow-md);
  transition-duration: var(--motion-fast);
}

.btn-primary:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
```

### Secondary Button

```css
.btn-secondary {
  padding: var(--space-3) var(--space-6);
  background: var(--surface-2);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--motion-default) var(--motion-ease);
}

.btn-secondary:hover {
  background: var(--surface-3);
  border-color: var(--border-light);
}
```

### Icon Button

```css
.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  color: var(--text);
  cursor: pointer;
  transition: all var(--motion-fast) var(--motion-ease);
}

.btn-icon:hover {
  background: var(--surface-2);
}

.btn-icon:active {
  background: var(--surface-3);
}
```

---

## Input Styles

### Text Input

```css
.input-text {
  /* Layout */
  width: 100%;
  padding: var(--space-3) var(--space-4);
  
  /* Appearance */
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text);
  
  /* Typography */
  font-size: var(--text-base);
  font-family: var(--font-sans);
  line-height: var(--line-height-normal);
  
  /* Interaction */
  transition: all var(--motion-default) var(--motion-ease);
}

.input-text::placeholder {
  color: var(--text-muted);
}

.input-text:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--focus-ring-opacity);
}

.input-text:disabled {
  background: var(--surface-2);
  cursor: not-allowed;
  opacity: 0.6;
}

.input-text.error {
  border-color: var(--danger);
}

.input-text.error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}
```

### Input with Icon

```css
.input-wrapper {
  position: relative;
}

.input-with-icon {
  padding-left: var(--space-10); /* Make room for icon */
}

.input-icon {
  position: absolute;
  left: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}
```

### Textarea

```css
.textarea {
  width: 100%;
  min-height: 100px;
  padding: var(--space-3) var(--space-4);
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text);
  font-size: var(--text-base);
  font-family: var(--font-sans);
  line-height: var(--line-height-relaxed);
  resize: vertical;
  transition: all var(--motion-default) var(--motion-ease);
}

.textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--focus-ring-opacity);
}
```

---

## Card Styles

### Basic Card

```css
.card {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  transition: all var(--motion-default) var(--motion-ease);
}

.card:hover {
  border-color: var(--border-light);
  box-shadow: var(--shadow-md);
}
```

### Feature Card

```css
.card-feature {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  transition: all var(--motion-default) var(--motion-ease);
}

.card-feature:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px) scale(1.02);
}

.card-feature-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), var(--primary-600));
  border-radius: var(--radius-md);
  margin-bottom: var(--space-4);
}

.card-feature-title {
  font-size: var(--text-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text);
  margin-bottom: var(--space-2);
}

.card-feature-description {
  font-size: var(--text-sm);
  color: var(--subtext);
  line-height: var(--line-height-relaxed);
}
```

### Glass Card

```css
.card-glass {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  backdrop-filter: blur(12px);
  box-shadow: var(--shadow-md);
}
```

---

## Modal Styles

### Modal Overlay

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: var(--overlay);
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn var(--motion-default) var(--motion-ease);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

### Modal Content

```css
.modal-content {
  position: relative;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  max-height: 85vh;
  overflow-y: auto;
  animation: scaleIn var(--motion-default) var(--motion-ease);
}

.modal-content.modal-sm {
  width: 100%;
  max-width: var(--modal-sm);
}

.modal-content.modal-md {
  width: 100%;
  max-width: var(--modal-md);
}

.modal-content.modal-lg {
  width: 100%;
  max-width: var(--modal-lg);
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### Modal Header

```css
.modal-header {
  padding: var(--space-6);
  border-bottom: 1px solid var(--border);
}

.modal-title {
  font-size: var(--text-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text);
  margin: 0;
}
```

### Modal Footer

```css
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: var(--space-6);
  border-top: 1px solid var(--border);
}
```

---

## Send Button with Glow

```css
.btn-send {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, var(--primary-600), var(--primary));
  border: none;
  border-radius: var(--radius-md);
  color: white;
  cursor: pointer;
  box-shadow: var(--shadow-glow-md);
  transition: all var(--motion-default) var(--motion-ease);
  animation: glowPulse 2s ease-in-out infinite;
}

.btn-send:hover {
  box-shadow: var(--shadow-glow-lg);
  transform: scale(1.05);
  animation: none; /* Stop pulse on hover */
}

.btn-send:active {
  transform: scale(0.98);
}

/* Pulse animation */
@keyframes glowPulse {
  0%, 100% {
    box-shadow: var(--shadow-glow-md);
  }
  50% {
    box-shadow: 0 0 25px var(--glow), var(--shadow-md);
  }
}

/* Stop state (generating) */
.btn-send.generating {
  background: var(--danger);
  animation: none;
}

.btn-send.generating:hover {
  background: #dc2626; /* Darker red */
}
```

---

## Message Bubbles

### Assistant Message

```css
.message-assistant {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-4);
  animation: slideInFromLeft 180ms var(--motion-ease);
}

.message-assistant-avatar {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--primary), var(--primary-600));
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-assistant-content {
  flex: 1;
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  color: var(--text);
  line-height: var(--line-height-relaxed);
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### User Message

```css
.message-user {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: var(--space-4);
  animation: slideInFromRight 180ms var(--motion-ease);
}

.message-user-content {
  max-width: 70%;
  background: linear-gradient(135deg, var(--primary), var(--primary-600));
  border-radius: var(--radius-md);
  padding: var(--space-4);
  color: white;
  line-height: var(--line-height-relaxed);
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### Code Block in Message

```css
.message-code-block {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  margin: var(--space-3) 0;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--line-height-relaxed);
}

.message-code-block code {
  color: var(--text);
}
```

---

## Sidebar Styles

### Sidebar Container

```css
.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--surface-1);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  transition: transform var(--motion-default) var(--motion-ease);
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    z-index: var(--z-sticky);
    transform: translateX(-100%);
  }
  
  .sidebar.open {
    transform: translateX(0);
    box-shadow: var(--shadow-xl);
  }
}
```

### Thread Row

```css
.thread-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  color: var(--text);
  cursor: pointer;
  transition: all var(--motion-fast) var(--motion-ease);
  position: relative;
}

.thread-row:hover {
  background: var(--surface-2);
}

.thread-row.active {
  background: var(--surface-3);
  border-left: 3px solid var(--primary);
}

.thread-row-title {
  flex: 1;
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.thread-row-actions {
  display: flex;
  gap: var(--space-1);
  opacity: 0;
  transition: opacity var(--motion-fast) var(--motion-ease);
}

.thread-row:hover .thread-row-actions {
  opacity: 1;
}
```

---

## Utility Classes

### Spacing Utilities

```css
/* Padding */
.p-0 { padding: 0; }
.p-1 { padding: var(--space-1); }
.p-2 { padding: var(--space-2); }
.p-3 { padding: var(--space-3); }
.p-4 { padding: var(--space-4); }
.p-6 { padding: var(--space-6); }
.p-8 { padding: var(--space-8); }

/* Margin */
.m-0 { margin: 0; }
.m-1 { margin: var(--space-1); }
.m-2 { margin: var(--space-2); }
.m-3 { margin: var(--space-3); }
.m-4 { margin: var(--space-4); }
.m-6 { margin: var(--space-6); }
.m-8 { margin: var(--space-8); }

/* Gap */
.gap-1 { gap: var(--space-1); }
.gap-2 { gap: var(--space-2); }
.gap-3 { gap: var(--space-3); }
.gap-4 { gap: var(--space-4); }
.gap-6 { gap: var(--space-6); }
```

### Typography Utilities

```css
.text-xs { font-size: var(--text-xs); }
.text-sm { font-size: var(--text-sm); }
.text-base { font-size: var(--text-base); }
.text-lg { font-size: var(--text-lg); }
.text-xl { font-size: var(--text-xl); }
.text-2xl { font-size: var(--text-2xl); }

.font-normal { font-weight: var(--font-weight-normal); }
.font-medium { font-weight: var(--font-weight-medium); }
.font-semibold { font-weight: var(--font-weight-semibold); }
.font-bold { font-weight: var(--font-weight-bold); }
```

### Color Utilities

```css
.text-primary { color: var(--primary); }
.text-muted { color: var(--text-muted); }
.text-danger { color: var(--danger); }
.text-success { color: var(--success); }

.bg-primary { background: var(--primary); }
.bg-surface-1 { background: var(--surface-1); }
.bg-surface-2 { background: var(--surface-2); }
```

### Border Utilities

```css
.border { border: 1px solid var(--border); }
.border-t { border-top: 1px solid var(--border); }
.border-b { border-bottom: 1px solid var(--border); }
.border-l { border-left: 1px solid var(--border); }
.border-r { border-right: 1px solid var(--border); }

.rounded-sm { border-radius: var(--radius-sm); }
.rounded-md { border-radius: var(--radius-md); }
.rounded-lg { border-radius: var(--radius-lg); }
.rounded-xl { border-radius: var(--radius-xl); }
.rounded-full { border-radius: var(--radius-full); }
```

### Shadow Utilities

```css
.shadow-sm { box-shadow: var(--shadow-sm); }
.shadow-md { box-shadow: var(--shadow-md); }
.shadow-lg { box-shadow: var(--shadow-lg); }
.shadow-xl { box-shadow: var(--shadow-xl); }
.shadow-glow { box-shadow: var(--shadow-glow-md); }
```

### Special Effects

```css
/* Glass Morphism */
.glass {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(12px);
}

/* Glow Effect */
.glow {
  box-shadow: var(--shadow-glow-md);
}

/* Gradient Text */
.gradient-text {
  background: linear-gradient(135deg, var(--primary), var(--primary-600));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Truncate Text */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

---

## Responsive Utilities

```css
/* Hide on mobile */
@media (max-width: 767px) {
  .hide-mobile {
    display: none !important;
  }
}

/* Hide on desktop */
@media (min-width: 768px) {
  .hide-desktop {
    display: none !important;
  }
}

/* Responsive grid */
.grid-responsive {
  display: grid;
  gap: var(--space-4);
}

@media (max-width: 767px) {
  .grid-responsive {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-responsive {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## Animation Classes

```css
/* Fade in */
.fade-in {
  animation: fadeIn var(--motion-default) var(--motion-ease);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide up */
.slide-up {
  animation: slideUp var(--motion-default) var(--motion-ease);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Spin (for loading) */
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Bounce (for dots) */
.bounce {
  animation: bounce 1.4s ease-in-out infinite;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
}
```

---

## Complete Example: Chat Input Area

```css
.chat-input-area {
  padding: var(--space-6);
  border-top: 1px solid var(--border);
  background: var(--bg);
}

.chat-input-container {
  display: flex;
  gap: var(--space-3);
  align-items: flex-end;
  max-width: 900px;
  margin: 0 auto;
}

.chat-input-wrapper {
  flex: 1;
  position: relative;
}

.chat-input {
  width: 100%;
  min-height: 44px;
  max-height: 200px;
  padding: var(--space-3) var(--space-4);
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  color: var(--text);
  font-size: var(--text-base);
  font-family: var(--font-sans);
  line-height: var(--line-height-normal);
  resize: none;
  transition: all var(--motion-default) var(--motion-ease);
}

.chat-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--focus-ring-opacity);
}

.chat-send-button {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-600), var(--primary));
  border: none;
  border-radius: var(--radius-md);
  color: white;
  cursor: pointer;
  box-shadow: var(--shadow-glow-md);
  transition: all var(--motion-default) var(--motion-ease);
  animation: glowPulse 2s ease-in-out infinite;
}

.chat-send-button:hover {
  box-shadow: var(--shadow-glow-lg);
  transform: scale(1.05);
  animation: none;
}

.chat-send-button.generating {
  background: var(--danger);
  animation: none;
}
```

---

All examples use the design token system defined in `/design-tokens/tokens.json` and `/styles/globals.css`.
