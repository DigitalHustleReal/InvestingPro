# FINAL THEME SPECIFICATION: The "Professional Trust" System
**Status:** FROZEN 🔒
**Archetype:** "Indian NerdWallet" (Wealth, Growth, Data)

## 1. Core Color Palette (The "Teal Standard")
This palette is derived strictly from the **Homepage** and **Quick Tools** sections which you identified as "The Best".

| Token | Class | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **Primary Base** | `primary-600` | `#0d9488` (Teal-600) | Main Acton Buttons, Links, Active States |
| **Primary Hover** | `primary-700` | `#0f766e` (Teal-700) | Button Hover |
| **Primary Light** | `primary-50` | `#f0fdfa` (Teal-50) | Backgrounds, Badges |
| **Brand Gradient** | - | `from-emerald-400 via-teal-400 to-blue-400` | Hero Text, Feature Cards |
| **Dark Surface** | `slate-950` | `#020617` | Main Background (Dark Mode) |
| **Card Surface** | `white` / `slate-900` | `#ffffff` / `#0f172a` | Cards (Light/Dark) |

## 2. Component Standards

### A. Buttons
*   **Primary:** Solid Teal (`bg-teal-600 text-white`).
*   **Secondary:** Outline Teal (`border-teal-600 text-teal-600`).
*   **Ghost:** Slate Text (`text-slate-600 hover:text-teal-600`).
*   **Radius:** `rounded-xl` (Matches Homepage Cards).

### B. Badges
*   **Standard:** `bg-teal-50 text-teal-700 border-teal-200` (Matches Quick Tools).
*   **Success:** `bg-emerald-50 text-emerald-700`.

### C. Forms (Inputs/Sliders)
*   **Focus Ring:** Teal (`ring-teal-500`).
*   **Slider Track:** Teal.
*   **Active Tab:** Teal underline/background.

## 3. Deployment Strategy (Stepwise)

1.  **Config Rewrite:** Update `tailwind.config.ts` to map `primary` → `teal` (System-wide fix).
2.  **Admin Cleanup:** Replace `bg-[#0f172a]` with `bg-slate-950`. Replace Blue accents with Teal.
3.  **Credit Card Page:** Replace "Purple Hero" with "Navy/Teal Hero".
4.  **Calculator Pages:** Dark Mode standardisation.

This specification is **Non-Negotiable** once approved to ensure consistency.
