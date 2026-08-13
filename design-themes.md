# Personal Calendar — Especificación de temas (Aurora, Midnight, Dusk)

Documento de implementación para otra IA / otro proyecto. Stack objetivo: **React + Tailwind CSS v4** (config CSS-first, sin `tailwind.config.js`). Todos los colores en **oklch**. Nunca uses colores hardcodeados (`text-white`, `bg-[#hex]`): sólo tokens semánticos.

---

## 1. Arquitectura de tokens

Cada tema es **una clase envolvente** con un set completo de variables. La misma pantalla de login se renderiza con las mismas utilidades semánticas (`bg-background`, `text-foreground`, `bg-primary`, `panel`, `field`, `btn-primary`) y cambia sólo el tema del wrapper:

```tsx
<div className="theme-aurora min-h-screen bg-background">
  <LoginScreen />
</div>
```

### Registro en Tailwind v4 (`src/styles.css`)

```css
@import "tailwindcss" source(none);
@source "../src";

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-lg: var(--radius);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: calc(var(--radius) + 12px);

  --font-display: var(--font-family-display);
  --font-body: var(--font-family-body);

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-surface: var(--surface);
  --color-surface-2: var(--surface-2);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-brand-soft: var(--brand-soft);
}

:root {
  --radius: 1rem;
  --font-family-display: "Inter", system-ui, sans-serif;
  --font-family-body: "Inter", system-ui, sans-serif;
  --success: oklch(0.72 0.17 152);
  --warning: oklch(0.78 0.16 78);
}
```

Las fuentes se cargan con `<link>` en el `<head>` (nunca `@import` remoto en el CSS):

- Inter, Space Grotesk, Manrope (Google Fonts).

---

## 2. Tema 1 — Aurora (claro)

SaaS azul, split screen, aire y precisión. Radios 16 px, sombras suaves.

```css
.theme-aurora {
  color-scheme: light;
  --radius: 1rem;
  --font-family-display: "Inter", system-ui, sans-serif;
  --font-family-body: "Inter", system-ui, sans-serif;
  --background: oklch(0.985 0.006 250);
  --foreground: oklch(0.21 0.03 265);
  --surface: oklch(1 0 0);
  --surface-2: oklch(0.965 0.008 252);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.21 0.03 265);
  --primary: oklch(0.55 0.2 262);
  --primary-foreground: oklch(0.99 0.003 250);
  --secondary: oklch(0.955 0.01 252);
  --secondary-foreground: oklch(0.3 0.03 262);
  --muted: oklch(0.965 0.008 252);
  --muted-foreground: oklch(0.55 0.03 258);
  --accent: oklch(0.95 0.035 258);
  --accent-foreground: oklch(0.4 0.12 262);
  --border: oklch(0.92 0.012 255);
  --input: oklch(0.9 0.014 255);
  --ring: oklch(0.62 0.19 258);
  --brand-soft: oklch(0.955 0.03 258);
  --gradient-hero: linear-gradient(140deg, oklch(0.45 0.19 264), oklch(0.62 0.17 238) 55%, oklch(0.78 0.11 208));
  --shadow-panel: 0 28px 70px -30px oklch(0.35 0.12 262 / 0.35);
  --shadow-soft: 0 2px 12px -6px oklch(0.35 0.1 262 / 0.28);
}
```

### Layout del login (Aurora)

- Grid a pantalla completa `lg:grid-cols-[1.05fr_1fr]`, máx. 1400 px.
- **Aside izquierdo** (oculto en móvil, `lg:flex`): fondo `var(--gradient-hero)`, texto `text-primary-foreground`, distribución `justify-between`:
  1. Logo: cuadro 36 px `rounded-xl bg-primary-foreground/15` con iniciales + nombre del producto.
  2. Titular `font-display text-4xl font-bold leading-[1.15] tracking-[-0.02em]` + lista de 3 beneficios con icono `Check` (lucide).
  3. Mini calendario mensual 7×5 en tarjeta `w-64 rounded-2xl bg-primary-foreground/10 p-4 backdrop-blur`; día activo con `bg-primary-foreground text-primary`.
- **Columna derecha**: centrada, `max-w-md`.
  - Badge `rounded-full bg-brand-soft text-accent-foreground` con icono `Sparkles`.
  - H1 `text-3xl font-bold tracking-[-0.02em]` + subtítulo `text-muted-foreground`.
  - Tarjeta `panel p-6` con tabs (Iniciar sesión / Crear cuenta, activa con `border-b-2 border-primary text-primary`).
  - Campos Correo y Contraseña (`.field`), ojo `Eye` posicionado a la derecha del password.
  - Fila: checkbox "Recordarme" + link "¿Olvidaste tu contraseña?" (`text-primary`).
  - `btn-primary w-full` "Entrar".
  - Separador "o continúa con" (líneas `bg-border`) y 2 botones sociales en `grid-cols-2` (`border border-border bg-surface-2 hover:bg-accent`).

---

## 3. Tema 2 — Midnight (oscuro)

Slate profundo, glass, halos azules radiales. Radios 20 px, titulares Space Grotesk.

```css
.theme-midnight {
  color-scheme: dark;
  --radius: 1.25rem;
  --font-family-display: "Space Grotesk", system-ui, sans-serif;
  --font-family-body: "Inter", system-ui, sans-serif;
  --background: oklch(0.19 0.03 265);
  --foreground: oklch(0.97 0.005 250);
  --surface: oklch(0.24 0.032 265);
  --surface-2: oklch(0.28 0.035 265);
  --card: oklch(0.24 0.032 265);
  --card-foreground: oklch(0.97 0.005 250);
  --primary: oklch(0.64 0.18 258);
  --primary-foreground: oklch(0.99 0.003 250);
  --secondary: oklch(0.3 0.035 265);
  --secondary-foreground: oklch(0.93 0.008 250);
  --muted: oklch(0.28 0.032 265);
  --muted-foreground: oklch(0.72 0.025 258);
  --accent: oklch(0.35 0.07 268);
  --accent-foreground: oklch(0.9 0.05 258);
  --border: oklch(0.34 0.03 265);
  --input: oklch(0.36 0.03 265);
  --ring: oklch(0.68 0.17 258);
  --brand-soft: oklch(0.33 0.06 262);
  --gradient-hero:
    radial-gradient(120% 100% at 15% 0%, oklch(0.45 0.19 268 / 0.55), transparent 60%),
    radial-gradient(90% 90% at 100% 100%, oklch(0.6 0.14 210 / 0.35), transparent 60%);
  --shadow-panel: 0 40px 90px -40px oklch(0.1 0.05 265 / 0.9);
  --shadow-soft: 0 2px 14px -6px oklch(0.1 0.05 265 / 0.8);
}
```

### Layout del login (Midnight)

- Contenedor `relative min-h-screen overflow-hidden`; capa `absolute inset-0` con `background: var(--gradient-hero)` y contenido en `relative`.
- Grid `lg:grid-cols-[1fr_420px]`, `max-w-6xl`, `px-6 py-20`, `items-center`, `gap-12`.
- **Izquierda (marca)**:
  - Logo: cuadro 36 px `rounded-2xl bg-primary text-primary-foreground` + nombre.
  - H1 `font-display text-5xl font-bold leading-[1.05] tracking-[-0.02em]` (ej. "Tu agenda, en modo enfoque total.").
  - Párrafo `max-w-md text-sm text-muted-foreground`.
  - Tarjeta "agenda del día" `rounded-3xl border border-border bg-surface/70 p-5 backdrop-blur`: cabecera con icono `Clock` + fecha y `Bell` a la derecha; lista de 3 eventos, cada uno `rounded-2xl bg-surface-2 p-3` con barra vertical de color (`bg-primary`, `bg-success`, `bg-warning`), título y hora.
- **Derecha (formulario)**: `panel bg-surface/80 p-8 backdrop-blur-xl`.
  - H2 `font-display text-2xl font-bold` "Iniciar sesión" + subtítulo.
  - Labels con `<span>` + `.field` (Correo, Contraseña), `btn-primary w-full`.
  - Botón secundario "Continuar con Google" (`rounded-2xl border border-border bg-surface-2 hover:bg-accent`).
  - Pie: `ShieldCheck` en `text-primary` con nota de seguridad + enlace "Crear una" en `text-primary`.

---

## 4. Tema 3 — Dusk (oscuro)

Penumbra violeta, formas muy suaves. Radios 28 px, Manrope, degradado violeta→cian.

```css
.theme-dusk {
  color-scheme: dark;
  --radius: 1.75rem;
  --font-family-display: "Manrope", system-ui, sans-serif;
  --font-family-body: "Manrope", system-ui, sans-serif;
  --background: oklch(0.27 0.045 285);
  --foreground: oklch(0.97 0.01 300);
  --surface: oklch(0.33 0.05 288);
  --surface-2: oklch(0.38 0.055 290);
  --card: oklch(0.33 0.05 288);
  --card-foreground: oklch(0.97 0.01 300);
  --primary: oklch(0.8 0.13 200);
  --primary-foreground: oklch(0.25 0.05 250);
  --secondary: oklch(0.38 0.05 290);
  --secondary-foreground: oklch(0.95 0.01 300);
  --muted: oklch(0.36 0.045 288);
  --muted-foreground: oklch(0.78 0.03 295);
  --accent: oklch(0.45 0.09 320);
  --accent-foreground: oklch(0.94 0.04 320);
  --border: oklch(0.42 0.05 290);
  --input: oklch(0.45 0.05 290);
  --ring: oklch(0.8 0.13 200);
  --brand-soft: oklch(0.4 0.07 300);
  --gradient-hero: linear-gradient(155deg, oklch(0.42 0.11 300), oklch(0.32 0.07 268) 50%, oklch(0.55 0.11 210));
  --shadow-panel: 0 34px 80px -36px oklch(0.15 0.06 290 / 0.85);
  --shadow-soft: 0 2px 16px -8px oklch(0.15 0.06 290 / 0.7);
}
```

### Layout del login (Dusk)

- Página centrada: `min-h-screen px-6 py-14` con `backgroundImage: var(--gradient-hero)`; contenido `max-w-5xl`, columna centrada.
- Píldora superior: `rounded-full border border-border bg-surface/60 px-4 py-2 backdrop-blur` con punto `bg-primary` + nombre del producto.
- H1 centrado `max-w-2xl font-display text-5xl font-extrabold leading-[1.05] tracking-[-0.02em]`.
- Grid `lg:grid-cols-[380px_1fr] gap-6`:
  - **Tarjeta de acceso** `panel p-8`: H2 "Acceder", campos Correo/Contraseña (`.field`), `btn-primary w-full`, separador "o", dos botones pill `rounded-full border border-border bg-surface-2 hover:bg-accent` (Google, Outlook), pie "¿Nuevo aquí? Crear cuenta".
  - **Tarjeta de vista semanal** `panel p-8`: cabecera con rango de semana + chip `rounded-full bg-brand-soft text-accent-foreground` ("17 eventos"); grid de 5 días `rounded-3xl bg-surface-2 p-3` con barras de evento (`bg-primary/70`, `bg-accent`, `bg-warning/70`); abajo 3 métricas (Completados / Pendientes / Recordatorios) en tarjetas `rounded-3xl bg-surface-2` con número `font-display text-2xl font-bold`.

---

## 5. Utilidades compartidas (`@utility`, Tailwind v4)

```css
@utility panel {
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-panel);
}

@utility field {
  width: 100%;
  background-color: var(--surface-2);
  border: 1px solid var(--input);
  border-radius: calc(var(--radius) * 0.6);
  padding: 0.7rem 0.9rem;
  font-size: 0.9rem;
  color: var(--foreground);
  outline: none;
  transition: box-shadow 150ms ease, border-color 150ms ease;
  &::placeholder { color: var(--muted-foreground); }
  &:focus-visible {
    border-color: var(--ring);
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 30%, transparent);
  }
}

@utility btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding: 0 1.25rem;
  border-radius: calc(var(--radius) * 0.6);
  background-color: var(--primary);
  color: var(--primary-foreground);
  font-size: 0.9rem;
  font-weight: 600;
  transition: transform 150ms ease, filter 150ms ease;
  &:hover { filter: brightness(1.08); }
  &:active { transform: scale(0.98); }
}
```

Si el proyecto usa Tailwind v3, reemplaza `@utility x { ... }` por `@layer components { .x { ... } }` y define los tokens en `tailwind.config.js` apuntando a las mismas variables CSS.

---

## 6. Reglas de implementación

1. Un solo `<h1>` por pantalla; jerarquía `font-display` para titulares, `font-body` para el resto.
2. Contraste mínimo AA: `--muted-foreground` sólo para texto secundario ≥ 12 px.
3. Focus visible obligatorio en inputs y botones (ver `.field` / `--ring`).
4. Todas las tarjetas usan `panel`; no dupliques sombras a mano.
5. Iconografía: `lucide-react` (`Check`, `Eye`, `Sparkles`, `Clock`, `Bell`, `ShieldCheck`, `CalendarDays`), tamaño 14–16 px.
6. Móvil: los paneles decorativos (aside de Aurora, agenda de Midnight, semana de Dusk) se ocultan o pasan a una sola columna; el formulario siempre es la primera columna visible.
7. Idioma de la UI: español.
