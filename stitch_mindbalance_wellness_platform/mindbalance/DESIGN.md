---
name: MindBalance
colors:
  surface: '#faf9ff'
  surface-dim: '#d3daef'
  surface-bright: '#faf9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8fd'
  surface-container-highest: '#dce2f8'
  on-surface: '#151b2b'
  on-surface-variant: '#414846'
  inverse-surface: '#293041'
  inverse-on-surface: '#edf0ff'
  outline: '#717976'
  outline-variant: '#c1c8c5'
  surface-tint: '#45645e'
  primary: '#45645e'
  on-primary: '#ffffff'
  primary-container: '#84a59d'
  on-primary-container: '#1b3b35'
  inverse-primary: '#accec5'
  secondary: '#545997'
  on-secondary: '#ffffff'
  secondary-container: '#b5b9ff'
  on-secondary-container: '#434785'
  tertiary: '#30628a'
  on-tertiary: '#ffffff'
  tertiary-container: '#73a3ce'
  on-tertiary-container: '#00395a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c7eae1'
  primary-fixed-dim: '#accec5'
  on-primary-fixed: '#00201b'
  on-primary-fixed-variant: '#2d4c46'
  secondary-fixed: '#e0e0ff'
  secondary-fixed-dim: '#bfc2ff'
  on-secondary-fixed: '#0f1251'
  on-secondary-fixed-variant: '#3c417e'
  tertiary-fixed: '#cde5ff'
  tertiary-fixed-dim: '#9bcbf8'
  on-tertiary-fixed: '#001d32'
  on-tertiary-fixed-variant: '#104a70'
  background: '#faf9ff'
  on-background: '#151b2b'
  surface-variant: '#dce2f8'
typography:
  headline-xl:
    fontFamily: Lexend
    fontSize: 48px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Lexend
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Lexend
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  headline-sm:
    fontFamily: Lexend
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  headline-xl-mobile:
    fontFamily: Lexend
    fontSize: 36px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  glass-blur: 16px
---

## Brand & Style
This design system is built to reduce cognitive load and foster a sense of digital sanctuary. The brand personality is grounded in empathy, offering a tranquil space for users to decompress. 

The visual style leverages **Glassmorphism** to create a sense of lightness and transparency, suggesting an open, breathable environment. High-quality background blurs and soft, organic gradients prevent the UI from feeling sterile. Every interaction should feel intentional and fluid, avoiding jarring transitions in favor of "breathing" animations that mirror a relaxed heart rate.

## Colors
The palette is centered on "Nature's Neutrals"—soothing tones that exist in the physical world. 

- **Sage Green** serves as the primary brand color, representing growth and grounding.
- **Soft Lavender** and **Sky Blue** provide cooling accents for interactive elements and state changes.
- **Midnight Navy** is used sparingly for high-contrast typography and deep backgrounds, ensuring legibility without the harshness of pure black.

Use subtle linear gradients (e.g., Sage to Sky Blue) at low opacity for background "blobs" to create the necessary depth for the glassmorphic effects to shine.

## Typography
**Lexend** is chosen for headings for its specific design intent of reducing visual stress and improving reading proficiency. Its slightly expanded apertures feel welcoming and modern.

**Inter** provides a highly functional, neutral counterpart for body text, ensuring that even dense health or relaxation information remains accessible. Use a generous line-height (1.6) for body text to maximize whitespace between lines, further reducing the user's cognitive effort.

## Layout & Spacing
The layout follows a **fluid grid** model with significant emphasis on "breathing room." 

- **Desktop:** 12-column grid with wide 64px outer margins to center focus.
- **Mobile:** 4-column grid with 20px margins.
- **Spacing Rhythm:** Use a 8px base unit. Component internal padding should default to 24px (3 units) to maintain the airy feel.

Avoid overcrowding the screen. Group related glass cards with at least 32px of margin to allow the background gradients to remain visible between surfaces.

## Elevation & Depth
Depth is not communicated through heavy shadows, but through **translucency and blur**.

1.  **Base Layer:** Soft, large-scale color gradients (Sage/Lavender) on a light off-white or deep navy background.
2.  **Surface Layer:** Glass panels with a `backdrop-filter: blur(16px)` and a background color of `rgba(255, 255, 255, 0.4)`. 
3.  **Floating Elements:** Elements that require high focus (like active Modals) use a higher blur (32px) and a subtle 1px white inner-border to simulate the edge of the glass catching light.
4.  **Shadows:** Use only one type of shadow—an ultra-diffused "Ambient Bloom" (`0px 20px 40px rgba(0,0,0,0.04)`).

## Shapes
In line with the empathetic and tranquil brand, sharp corners are strictly avoided. This design system uses a "Hyper-Rounded" language.

- **Main Cards/Containers:** Use a `2xl` radius (24px/1.5rem) to create a soft, pebble-like appearance.
- **Buttons/Inputs:** Follow the `rounded-lg` or `pill` standard to feel comfortable for touch and sight.
- **Icons:** Use a "Medium" or "Soft" corner treatment—avoiding harsh geometric points.

## Components
- **Glass Cards:** The primary container. Must have a 1px solid border at 30% opacity (White) to define the silhouette against dynamic backgrounds.
- **Primary Buttons:** Solid Sage Green with white text. Use a subtle "pulse" hover effect rather than a color change to maintain tranquility.
- **Secondary Buttons:** Ghost style with a glass background and a 1px Sage Green border.
- **Input Fields:** Semi-transparent white backgrounds with `blur(8px)`. On focus, the border transitions to Soft Lavender.
- **Progress Bubbles:** Used for meditation or breathing exercises. These should be perfectly circular with a soft glow effect rather than a standard linear progress bar.
- **Chips/Filters:** Pill-shaped with a light Lavender tint and no border, providing a soft "cloud" look for categorization.
- **Modals:** Centered glass sheets with a backdrop-dim (Midnight Navy at 20% opacity) to pull focus without completely hiding the background context.