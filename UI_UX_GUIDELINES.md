# Scenic UI/UX Design System

Scenic employs a premium, cinematic "Soft Dark" aesthetic. The goal is to make the application feel like a high-end operating system for entertainment—immersive, fast, and visually striking but not overwhelming.

## 1. Color Palette
- **Background Base:** `#0a0a0a` (Near black, used for the main app background).
- **Elevated Cards/Surfaces:** `#131316` to `#18181b` (zinc-900). Never use pure `#000000` or `#ffffff` for cards.
- **Text (Primary):** `text-white` or `text-zinc-100` for main headings.
- **Text (Secondary):** `text-zinc-400` for descriptions, metadata, and inactive icons.
- **Accents:** Indigo (`bg-indigo-600`, `text-indigo-500`) is the primary brand color for active states, loading spinners, and primary buttons.

## 2. Typography
- The app uses standard sans-serif (Tailwind default/Inter).
- **Headings:** Should be tight and bold. Use `tracking-tight` and `font-bold` or `font-black`. Example: `text-5xl md:text-7xl font-bold tracking-tight text-white`.
- **Readability:** Synopses and paragraph text should use `leading-relaxed` for breathing room.

## 3. UI Components & Patterns
- **Glassmorphism:** Used heavily for navigation bars and overlay buttons over cinematic backdrops.
  - *Tailwind classes:* `bg-black/80 backdrop-blur-sm` or `bg-zinc-500/40 backdrop-blur-md`.
- **Gradients:** Essential for blending Hero images into the background.
  - *Tailwind classes:* `bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent`.
- **Borders:** Extremely subtle borders are used to separate dark elements.
  - *Tailwind classes:* `border border-zinc-800` or `border-zinc-800/50`.
- **Rounded Corners:** Use `rounded-xl` or `rounded-2xl` for media cards and large buttons. `rounded-full` for profile avatars and icon buttons.

## 4. Interactions
- **Hover States:** Buttons and cards should have slight transitions.
  - *Tailwind classes:* `transition-colors duration-300`, `group-hover:text-white`.
- **Scaling:** Media cards should gently scale up on hover: `hover:scale-105 transition-transform duration-300`.
- **Loading:** Use skeleton loaders or minimalist indigo spinners (`w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin`) rather than generic "Loading..." text.
