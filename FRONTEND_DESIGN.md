# Guía de Diseño Front-End — Personal Calendar

> Documento de referencia visual para que una IA mejore o replique el diseño de la interfaz sin necesidad de revisar lógica de negocio ni backend. Enfocado exclusivamente en el front-end (tokens, componentes, vistas y pantallas), incluyendo el flujo de login/registro. Estilo: SaaS moderno, elegante, minimalista y premium.

---

## 1. Tokens de Diseño

### 1.1 Paleta de Colores

#### Primario (Azul)

| Token | HEX | Uso |
|-------|-----|-----|
| `primary-50` | `#eff6ff` | Hover suaves, chips |
| `primary-100` | `#dbeafe` | Fondos seleccionados, tintes de badge |
| `primary-200` | `#bfdbfe` | Bordes suaves, líneas activas |
| `primary-300` | `#93c5fd` | Bordes de foco, decorativos |
| `primary-400` | `#60a5fa` | Acentos, enlaces hover |
| `primary-500` | `#3b82f6` | **Iconos, ring de focus, acentos** |
| `primary-600` | `#2563eb` | **Botón primario, enlaces, interactivos** |
| `primary-700` | `#1d4ed8` | Hover de primario |
| `primary-800` | `#1e40af` | Estados presionados |
| `primary-900` | `#1e3a8a` | Texto de marca, gradientes |

#### Neutrales (Escala de grises)

| Token | HEX | Uso |
|-------|-----|-----|
| `gray-50` | `#f9fafb` | **Fondo de página** |
| `gray-100` | `#f3f4f6` | Fondos de secciones, hover inputs |
| `gray-200` | `#e5e7eb` | Bordes de inputs/tablas |
| `gray-300` | `#d1d5db` | Bordes deshabilitados, divisores |
| `gray-400` | `#9ca3af` | Iconos secundarios, placeholders |
| `gray-500` | `#6b7280` | Texto de apoyo |
| `gray-600` | `#4b5563` | Texto secundario |
| `gray-700` | `#374151` | Títulos, texto principal |
| `gray-800` | `#1f2937` | Encabezados |
| `gray-900` | `#111827` | Texto más prominente |

#### Semánticos

| Token | HEX | Uso |
|-------|-----|-----|
| `success` | `#22c55e` | Completado, positivo |
| `warning` | `#f59e0b` | Pendiente, advertencia |
| `danger` | `#ef4444` | Error, cancelado, eliminar |
| `info` | `#0ea5e9` | Información |

#### Categorías de eventos

| Categoría | Color |
|-----------|-------|
| `default` (None) | `#6b7280` |
| `work` | `#3b82f6` |
| `personal` | `#8b5cf6` |
| `health` | `#22c55e` |
| `finance` | `#f59e0b` |
| `social` | `#ec4899` |
| `travel` | `#06b6d4` |
| `education` | `#ef4444` |

#### Integraciones (badges)

| Integración | Color |
|-------------|-------|
| Google | `#4285F4` |
| Outlook | `#0078D4` |
| WhatsApp | `#25D366` |

### 1.2 Dark Mode

| Concepto | Claro | Oscuro |
|----------|-------|--------|
| Fondo página | `gray-50` | `slate-900` (`#0f172a`) |
| Superficie / Card | `white` | `gray-900` (`#111827`) |
| Borde | `gray-200` | `gray-800` (`#1f2937`) |
| Texto principal | `gray-900` | `gray-50` / `white` |
| Texto secundario | `gray-500` | `gray-400` |

Se implementa con `darkMode: 'class'` en Tailwind y la clase `dark` en `<html>`. En dark mode, el botón primario pasa de `primary-600` a `primary-500`.

### 1.3 Tipografía

- **Familia:** `Inter` (400, 500, 600, 700), fallback `system-ui, sans-serif`.
- **Line-height:** `1.5` body, `1.2` títulos.
- **Letter-spacing:** `-0.02em` en títulos grandes (look premium).

| Tipo | Clase Tailwind | Tamaño | Peso | Uso |
|------|----------------|--------|------|-----|
| Display / Hero | — | 64px | 700 | Landing (raro en app) |
| H1 | `text-3xl` | 30px | 700 | Título de página |
| H2 | `text-2xl` | 24px | 600 | Títulos de sección |
| H3 / Título modal | `text-lg` | 18px | 600 | Título de modal, tarjeta |
| Body | `text-sm`–`text-base` | 14–16px | 400 | Texto por defecto |
| Small | `text-xs` | 12px | 400 | Metadatos, enlaces |
| Caption / Badge | `text-[10px]`–`text-[11px]` | 10–11px | 500–600 | Etiquetas, badges |

### 1.4 Espaciado (base 8px)

| Token | px |
|-------|-----|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 24px |
| `space-6` | 32px |
| `space-7` | 40px |
| `space-8` | 48px |
| `space-9` | 64px |
| `space-10` | 80px |

### 1.5 Border Radius

| Token | px | Uso |
|-------|-----|-----|
| `sm` | 8px | Badges/chips, chips de atajo |
| `md` / `rounded-xl` | 12px | **Botones, inputs, cards de evento** |
| `lg` / `rounded-lg` | 16px | Cards/paneles, modal de login, contenedores |
| `2xl` / `rounded-2xl` | 24px | Modal overlay, tour onboarding |

> **Nota:** en el código hay inconsistencia: los `Input` usan `rounded-lg` (16px), los `Button` usan `rounded-xl` (12px), los `select` del formulario usan `rounded-xl`, el modal usa `rounded-2xl`.

### 1.6 Sombras

| Token | Valor | Uso |
|-------|-------|-----|
| `shadow-sm` | `0 1px 3px rgba(0,0,0,.08)` | Cards de evento, chips |
| `shadow-md` | `0 4px 12px rgba(0,0,0,.10)` | Paneles, cards, login |
| `shadow-lg` | `0 8px 24px rgba(0,0,0,.12)` | Hover de panel |
| `shadow-2xl` | `0 25px 50px rgba(0,0,0,.25)` | Modal, onboarding |

---

## 2. Componentes Base (UI Primitivas)

### 2.1 Button (`components/ui/Button.jsx`)

| Variante | Estilo |
|----------|--------|
| `primary` | `bg-primary-600 text-white hover:bg-primary-700` (dark: `bg-primary-500 hover:bg-primary-600`) |
| `secondary` | `bg-gray-200 text-gray-800 hover:bg-gray-300` (dark: `bg-gray-700 text-gray-200 hover:bg-gray-600`) |
| `danger` | `bg-red-600 text-white hover:bg-red-700` |
| `ghost` | `text-gray-600 hover:bg-gray-100` (dark: `text-gray-300 hover:bg-gray-800`) |

**Base común:** `inline-flex items-center justify-center min-h-10 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed`.

### 2.2 Input (`components/ui/Input.jsx`)

- Label: `text-sm font-medium text-gray-700 dark:text-gray-300`.
- Campo: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800`.
- Borde: `border-gray-300 dark:border-gray-600`; en error `border-red-500`.
- Mensaje de error: `text-sm text-red-600 dark:text-red-400`.

### 2.3 Checkbox (`components/ui/Checkbox.jsx`)

- `h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500`.
- Label: `text-sm text-gray-700 dark:text-gray-300`, con gap `2`.

### 2.4 Modal (`components/ui/Modal.jsx`)

- Overlay: `fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm p-4`, cierra al hacer click fuera.
- Panel: `bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto`.
- Header: `p-4 border-b border-gray-200 dark:border-gray-800`, título `text-lg font-semibold`, botón cerrar `×` en `text-gray-400`.

---

## 3. Pantalla de Login / Registro

### 3.1 Estructura general (`pages/LoginPage.jsx`)

- Contenedor: `min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4`.
- Card centrada: `w-full max-w-md`.
- **Header** (sobre la card):
  - Título: `text-3xl font-bold text-primary-600 dark:text-primary-400` → "Personal Calendar".
  - Subtítulo: `text-gray-500 dark:text-gray-400 mt-2` → "Manage your appointments and reminders".
- **Card**: `bg-white dark:bg-gray-900 rounded-lg shadow-md p-6`.
- **Tabs** (Sign In / Create Account): barra con `border-b border-gray-200 dark:border-gray-800` y dos botones `flex-1`.
  - Tab activo: `text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400`.
  - Tab inactivo: `text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300`.
- **Estado de carga**: spinner `animate-spin h-8 w-8 border-b-2 border-primary-600` centrado.

### 3.2 LoginForm (`components/auth/LoginForm.jsx`)

- `space-y-4` con dos `Input` (Email, Password) y un `Button primary w-full`.
- Error de auth: `text-sm text-red-600 dark:text-red-400`.
- Botón: "Sign In" / "Signing in..." (deshabilitado durante carga).

### 3.3 RegisterForm (`components/auth/RegisterForm.jsx`)

Campos en `space-y-4`:
1. **Name** (Input).
2. **Email** (Input).
3. **Password** (campo con toggle mostrar/ocultar + barra de fortaleza).
4. **Confirm Password** (campo con toggle + validación de coincidencia).

**Campo de contraseña con toggle** (`PasswordInput`):
- Contenedor `relative`, input con `pr-10`.
- Botón ojo (`absolute inset-y-0 right-0 pr-3 text-gray-400`), alterna entre iconos de ojo abierto/cerrado.
- Error de coincidencia: borde rojo + mensaje `Las contraseñas no coinciden`.

**Barra de fortaleza** (`PasswordStrengthBar`):
- 3 barras `h-1.5 flex-1 rounded-full` con color según nivel.
- Reglas:
  - `< 8` caracteres → **Débil** (rojo, nivel 0).
  - `>= 12` caracteres y `>= 2` categorías → **Fuerte** (verde, nivel 2).
  - `>= 3` categorías → **Fuerte**.
  - `>= 2` categorías → **Media** (amarillo, nivel 1).
  - resto → **Débil**.
- Colores: rojo `bg-red-500`, amarillo `bg-yellow-500`, verde `bg-green-500`; texto en `-600`.

**Estado de éxito** (tras registro):
- Icono check `w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30` con check verde.
- Título `text-xl font-semibold` → "Revisa tu correo".
- Mensaje con el email en `<strong>`.

**Footer legal** (solo en registro): `text-xs text-gray-400 dark:text-gray-500` con enlace "Terms of Service" subrayado en `primary-600`.

---

## 4. Layout General (Aplicación)

### 4.1 Navbar (`components/layout/Navbar.jsx`)

- `sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm`.
- Altura `h-16`, ancho máx. `max-w-[1600px]`, padding `px-4 sm:px-6 lg:px-8`.
- **Logo**: cuadrado `w-8 h-8 rounded-xl bg-primary-600 text-white` con "PC" + texto "Personal Calendar" (oculto en mobile).
- **Derecha**: toggle de tema (icono sol/luna + label Claro/Oscuro), link "Settings" (activo en `primary-600`), nombre/email del usuario, avatar con iniciales (`w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700`), botón "Sign Out" ghost.

### 4.2 Sidebar (`components/layout/Sidebar.jsx`)

- `w-[280px] fixed top-16 bottom-0 border-r border-gray-200 dark:border-gray-800 p-6`, oculto en mobile (`hidden lg:flex`).
- Tres secciones con títulos `text-[11px] uppercase tracking-wider text-gray-400`:
  1. **Mini Calendar**: navegación de mes (`‹ ›`), grid 7 columnas, día actual con `bg-primary-600 text-white rounded-lg`.
  2. **Integrations**: filas con icono circular de color (`w-6 h-6 rounded-full`) + label + punto de estado (`bg-green-500` conectado / `bg-gray-300` no).
  3. **Quick Stats**: "Events today", "This week", "Completed" (verde), "Pending" (ámbar).

### 4.3 Área principal (Dashboard)

- Contenedor: `dashboard-main` con `padding: 32px` desktop, `24px` mobile; `ml-[280px]` en desktop para el sidebar.
- **Header**: eyebrow `text-sm text-primary-600` ("Your schedule"), H1 `text-2xl sm:text-3xl font-bold tracking-tight` ("Calendar overview"), fecha alineada a la derecha.
- **Toolbar**:
  - Selector de vistas (day/week/month/list): contenedor `bg-gray-100 dark:bg-gray-800 rounded-xl p-1`; vista activa `bg-white dark:bg-gray-700 text-primary-700 shadow-sm`, inactiva `text-gray-500`.
  - Search: input con icono lupa a la izquierda (`pl-9`), placeholder "Search events...".
  - Filtros: selects de Status y Category.
  - Botones Export / Import / Notifications (estilo `dashboard-control`).
  - **Botón "+ New Event"**: `min-h-11 px-5 bg-primary-600 text-white rounded-xl shadow-sm shadow-primary-600/20 hover:bg-primary-700`.
- **Hints de atajos**: chips `shortcut-chip` (`bg-gray-100 dark:bg-gray-800 text-gray-500`, `padding: 6px 9px`, `radius: 8px`).
- **Fila de estadísticas**: 4 cards `dashboard-stat` con etiqueta `text-xs text-gray-400` y valor `text-2xl font-bold` (verde para "Completion Rate").

---

## 5. Vistas del Calendario

### 5.1 MonthView

- Header con botones "‹ Prev" / "Next ›" (`bg-gray-100 rounded-xl hover:bg-primary-50`) y título "MMMM yyyy" + link "Today".
- Grid `grid-cols-7 gap-px bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm`.
- Encabezados de día: `bg-gray-50 text-xs font-semibold uppercase text-gray-500`.
- Celda: `min-h-[96px] bg-white dark:bg-gray-900 p-2 hover:bg-primary-50`, días fuera de mes con `opacity-40`.
- Número de día: círculo `w-6 h-6`, hoy = `bg-primary-600 text-white`.
- Máximo 3 eventos visibles por celda + indicador `+N more`.

### 5.2 EventCard (vista compacta)

- `text-xs rounded px-1 py-0.5 truncate flex items-center gap-1`.
- Dot de color: `w-2 h-2 rounded-full` con el color de categoría.
- Todo el día: `bg-blue-100 dark:bg-blue-900/50 text-blue-800`.
- Estado: pending (ámbar), completed (verde), cancelled (rojo).
- Icono de recurrencia `↻` en `w-3 h-3 text-gray-400`.

### 5.3 EventCard (vista completa)

- `p-4 bg-white dark:bg-gray-900 border border-gray-200 rounded-xl shadow-sm hover:shadow-md`.
- Header: título con dot de color + badge "All day" + badge de categoría + badge de estado.
- Fecha/hora en `text-sm text-gray-500`, descripción con `line-clamp-2`.
- Footer con etiquetas de integraciones (Google azul, Outlook morado, WhatsApp verde, Email naranja).

### 5.4 EventList

- Vista vertical de `EventCard` completas con `space-y-3`.
- Estado vacío: "No events found. Create one to get started!" centrado.

---

## 6. Formulario de Evento (`EventForm`)

- Formulario en `space-y-4` dentro del modal.
- **Título** con botón "Auto" (parseo de lenguaje natural) en `absolute top-0 right-3 text-primary-500 text-xs`.
- **Descripción**: `textarea rows=3` con estilo de input.
- **Checkbox "All day event"**.
- Grid `grid-cols-2 gap-4` para Start Date / Time (o End Date si es all-day).
- **Duration** (number, `min=5`).
- **Category** / **Repeat** / **Status**: `select` con `h-12 px-4 rounded-xl`.
- **Aviso de conflicto**: `p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-700`.
- **Reminders**: contenedor `bg-gray-50 dark:bg-gray-800 rounded-lg p-3` con checkboxes de WhatsApp/Email y select "Remind me".
- **Acciones**: `flex justify-end gap-2` con Cancel (secondary) + Create/Update (primary). Delete (danger, `w-full`) aparece solo al editar.

---

## 7. Estados Visuales

### Hover
- Botón primario: `primary-600` → `primary-700`.
- Cards de evento: `shadow-sm` → `shadow-md`.
- Paneles: elevación a `shadow-lg`.
- Inputs/controles: tinte `primary-50`.
- Transición estándar: `150ms`; complejas: `250ms`.

### Focus
- `ring: 2px solid primary-500` + `ring-offset: 2px`.
- Visible al navegar por teclado (`focus-visible`).

### Deshabilitado
- Texto `gray-400`, fondo `gray-100`, borde `gray-200`, `opacity: 0.5`.
- Sin `cursor-pointer`, sin hover.

### Pulsado
- `transform: scale(0.98)` (`active:scale-[.98]`).

### Motion
- Duración estándar `150ms`, complejas `250ms`.

---

## 8. Tour de Onboarding (`OnboardingTour`)

- Overlay: `fixed inset-0 bg-black/50 z-50`.
- Card: `fixed bottom-8 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-md border border-gray-200`.
- Barra de progreso: segmentos `h-1.5 rounded-full flex-1`, completados en `primary-600`, resto `gray-200`.
- Botones: "Skip" (texto `gray-400`) y "Next" / "Get Started" (`bg-primary-600 text-white rounded-xl hover:bg-primary-700`).
- 5 pasos, persistencia en `localStorage` (`onboarding-complete`).

---

> **Recordatorio para IA:** mantener consistencia visual, look premium (Inter, sombras sutiles, radios suaves), priorizar feedback inmediato y cumplir accesibilidad AA. Al mejorar, conservar la coherencia de tokens primarios azules y el soporte dual Claro/Oscuro.
