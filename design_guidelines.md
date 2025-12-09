# Neuro-Canvas Design Guidelines

## Design Approach

**Selected Approach:** Design System + Reference Hybrid

Drawing from **Linear** (modern productivity aesthetics), **Figma** (canvas interface patterns), and **VS Code** (code editor conventions) to create a professional, efficiency-focused development environment.

**Core Principles:**
- Clarity over decoration: Every visual element must serve function
- Spatial efficiency: Maximize workspace, minimize chrome
- Immediate feedback: Visual states communicate system status instantly
- Consistent patterns: Predictable interactions reduce cognitive load

---

## Layout System

### Application Shell

**Three-Panel Layout:**
- Left Sidebar (280px): Block library palette, collapsible to icon-only (56px)
- Center Canvas: Infinite workspace, occupies remaining width
- Right Panel (320px): Properties/Code preview, collapsible, can hide entirely

**Spacing Primitives:** Use Tailwind units of **2, 3, 4, 6, 8** consistently
- Tight spacing: `p-2, gap-2` (component internals)
- Standard spacing: `p-4, gap-4` (cards, sections)
- Generous spacing: `p-6, gap-6` (panel sections)
- Major divisions: `p-8` (top-level containers)

### Canvas Workspace

**Full-viewport implementation:**
- Canvas fills 100% of available space between sidebars
- Subtle grid pattern (dots or lines) at 40px intervals for alignment reference
- Mini-map in bottom-right corner (160x120px) for navigation overview
- Zoom controls (bottom-left): buttons for +/-, reset to 100%, current zoom percentage display

---

## Typography

**Font Stack:**
- Primary Interface: Inter (via Google Fonts) - 400, 500, 600 weights
- Code/Monospace: JetBrains Mono (via Google Fonts) - 400, 500 weights

**Type Scale:**
- Panel Headers: `text-sm font-semibold uppercase tracking-wide` (11px effective)
- Block Labels: `text-sm font-medium` (14px)
- Properties Labels: `text-xs font-medium` (12px)
- Code Editor: `text-sm font-mono` (14px)
- Tooltips: `text-xs` (12px)
- Button Text: `text-sm font-medium` (14px)

**Hierarchy Pattern:**
- Section headers use uppercase + letter-spacing for clear delineation
- All-caps limited to 2-3 levels maximum to avoid visual noise
- Code always in monospace with consistent 14px size

---

## Component Library

### Canvas Nodes (Blocks)

**Node Structure:**
- Rounded rectangles: `rounded-lg` (8px radius)
- Compact height: 48px for single-line blocks, auto-expand for complex
- Width: Auto-fit content with min-width 120px, max-width 240px
- Internal padding: `px-3 py-2`

**Port System:**
- Input ports: Left edge, small circles (8px diameter)
- Output ports: Right edge, small circles (8px diameter)
- Port spacing: `gap-3` (12px) when multiple on same side
- Hover state increases port size to 12px diameter for easier targeting

**Block Categories Visual Distinction:**
- Layers: Standard rectangle nodes
- Activations: Pill-shaped (fully rounded ends)
- Operations: Diamond/hexagon shape
- Attention: Rectangle with distinctive header accent

### Connection Lines (Edges)

**Visual Specifications:**
- Default width: 2px
- Bezier curves (cubic) for organic flow
- Valid connection: Solid line
- Invalid connection: Dashed line with 4px dash, 4px gap
- Selected connection: 3px width
- Hover state: 3px width, slight glow effect

**Connection Animation:**
- Subtle "flow" animation: small dots traveling along valid connections (optional, can disable)
- Speed: 2-second full traversal for visual feedback of data flow direction

### Left Sidebar (Block Palette)

**Organization:**
- Collapsible category sections (Layers, Activations, Operations, Attention)
- Search bar at top: `h-9` with icon prefix
- Block items: 
  - Full mode: Icon (16px) + Label, height `h-10`
  - Compact mode: Icon only (20px), height `h-12`
- Drag preview: Semi-transparent version of full block follows cursor

### Right Panel (Properties/Code)

**Tab System:**
- Top tabs switching between "Properties" and "Code" views
- Tab height: `h-10`
- Active tab indicator: 2px bottom border

**Properties Panel:**
- Form groups with clear labels above inputs
- Input heights: `h-9` for text fields
- Spacing between groups: `gap-6`
- Section dividers: 1px horizontal rule with `my-6`
- Help text below inputs: `text-xs` with muted styling

**Code Preview Panel:**
- Syntax-highlighted code display (use Prism.js or similar)
- Line numbers in gutter
- Copy button (top-right): `h-8 w-8` icon button
- Export dropdown button next to copy
- Download options: .py, .ipynb, .yaml

### Top Toolbar

**Layout:**
- Height: `h-12` (48px)
- Left section: Logo/title
- Center section: Canvas controls (Undo, Redo, Group, Delete)
- Right section: Export, Save, Template Library buttons

**Button Specifications:**
- Icon buttons: `h-9 w-9` square
- Text buttons: `h-9 px-4`
- Primary action (Export/Generate Code): `h-9 px-6` with emphasis

### Modals & Overlays

**Template Library Modal:**
- Large modal: 800px width, 600px max-height
- Grid of template cards: 3 columns on desktop, `gap-4`
- Card structure: Preview image (16:9 ratio) + Title + Description + "Load" button
- Card size: Each card approximately 240px wide

**Properties Tooltips:**
- Max width: 280px
- Padding: `p-3`
- Appears on hover with 200ms delay
- Dark overlay with subtle drop shadow

**Dry Run Results Modal:**
- Table format showing layer-by-layer tensor shapes
- Error highlighting: Row with red accent for dimension mismatches
- Success: Green checkmark icon, Failure: Red X icon

### Super-Block/Group Indicator

**Visual Treatment:**
- Grouped blocks: Dashed border container around group
- Container padding: `p-4` around grouped items
- Collapse/expand icon in top-right of group container
- Collapsed state shows single representative block with badge count

---

## Interaction Patterns

### Drag & Drop Behavior
- Drag from palette creates ghost/preview immediately
- Drop zone highlights on canvas when valid drop location
- Invalid drop zones show red outline
- Smooth snap-to-grid option (toggle in preferences)

### Selection States
- Single selection: Block shows solid border (2px)
- Multi-selection: Each block shows lighter border, bounding box around all
- Hover state: Subtle elevation shadow

### Context Menus
- Right-click on block: Delete, Duplicate, Group (if multiple selected), Properties
- Right-click on canvas: Paste, Select All, Import Template
- Menu width: 200px, item height: `h-9`

---

## Responsive Considerations

**Desktop-First Design:**
This is primarily a desktop application. Minimum supported width: 1280px

**Panel Collapse Strategy:**
- Below 1440px: Right panel auto-collapses to icon/tab strip
- Below 1280px: Show warning overlay suggesting larger viewport

---

## Images

**No hero images required** - this is a functional workspace application.

**Icon Usage:**
- Use Heroicons (outline style) throughout via CDN
- Block palette icons: Custom 16x16px SVG icons representing each layer type
- Toolbar actions: 20px icons
- Status indicators: 16px icons

**Template Thumbnails:**
- Auto-generated canvas screenshots for saved templates
- Fallback: Abstract network graph visualization
- Dimensions: 320x180px (16:9 ratio)

---

## Animation Guidelines

**Minimal Animation Philosophy:**
- Transitions: 150ms for most UI elements
- Canvas zoom/pan: Smooth 250ms easing
- Modal open/close: 200ms fade + slight scale
- Connection drawing: Animated path reveal over 300ms

**No decorative animations** - only functional feedback

---

This design creates a professional, powerful tool that prioritizes clarity, efficiency, and spatial awareness for complex neural network visualization work.