# Design System — Personal Calendar

> Guía visual compacta para que cualquier IA reproduzca la estética del proyecto sin leer el código fuente. App de productividad (gestión de tiempo y calendario). Estilo: SaaS moderno, elegante, minimalista y premium.

---

## 1. Paleta de Colores

### Primario (Azul)

| Token | HEX | Uso |
|-------|-----|-----|
| `--primary-50` | `#eff6ff` | Fondos de estados hover suaves, chips |
| `--primary-100` | `#dbeafe` | Fondos seleccionados, tintes de badge |
| `--primary-200` | `#bfdbfe` | Bordes suaves, líneas activas |
| `--primary-300` | `#93c5fd` | Bordes de foco, elementos decorativos |
| `--primary-400` | `#60a5fa` | Acentos, enlaces hover |
| `--primary-500` | `#3b82f6` | Iconos y acentos azules |
| `--primary-600` | `#2563eb` | **Botón primario, enlaces, elementos interactivos** |
| `--primary-700` | `#1d4ed8` | Hover de elementos primarios |
| `--primary-800` | `#1e40af` | Estados presionados, texto sobre fondos claros |
| `--primary-900` | `#1e3a8a` | Texto de marca, fondo de gradiente |

### Neutrales (Escala de grises)

| Token | HEX | Uso |
|-------|-----|-----|
| `--gray-50` | `#f9fafb` | **Fondo de página** |
| `--gray-100` | `#f3f4f6` | Fondos de secciones, hover de inputs |
| `--gray-200` | `#e5e7eb` | Bordes de inputs y tablas |
| `--gray-300` | `#d1d5db` | Bordes deshabilitados, divisores |
| `--gray-400` | `#9ca3af` | Iconos secundarios, placeholders |
| `--gray-500` | `#6b7280` | Texto de apoyo |
| `--gray-600` | `#4b5563` | Texto secundario de cuerpo |
| `--gray-700` | `#374151` | Títulos, texto principal |
| `--gray-800` | `#1f2937` | Encabezados principales |
| `--gray-900` | `#111827` | **Texto más prominente / títulos display** |

### Integraciones, gradientes y acentos

| Token | Value | Uso |
|-------|-------|-----|
| `--accent-gradient` | `linear-gradient(135deg, #111827 0%, #1e3a8a 100%)` | Fondos de marca, header/hero |
| `--google` | `#4285F4` | Badge integración Google |
| `--outlook` | `#0078D4` | Badge integración Outlook |
| `--whatsapp` | `#25D366` | Badge integración WhatsApp |

### Semánticos

| Token | HEX | Uso |
|-------|-----|-----|
| `--success` | `#22c55e` | Éxito, completado, estados positivos |
| `--warning` | `#f59e0b` | Advertencias, pendientes |
| `--danger` | `#ef4444` | Errores, eliminación, cancelación |
| `--info` | `#0ea5e9` | Información, avisos |

### Dark Mode

| Concepto | Token | HEX |
|----------|-------|-----|
| Surface | `--surface` | `#0f172a` |
| Card | `--card` | `#111827` |
| Border | `--border` | `#1f2937` |
| Texto | `--text` | `#f9fafb` |

**Regla:** sobre fondos oscuros usar tonos claros de primario (`--primary-100/200`); el texto siempre `#f9fafb`. Se recomienda `color-scheme` con tokens duales CSS.

### Temas soportados

La aplicación ofrece únicamente dos temas:

- **Claro:** fondo de página `--gray-50`, superficies blancas y texto `--gray-900`.
- **Oscuro:** superficie `#0f172a`, tarjetas `#111827`, bordes `#1f2937` y texto `#f9fafb`.

El selector de tema alterna entre Claro y Oscuro. No existe un tema visual independiente basado en categorías; las categorías solo identifican eventos mediante color, etiqueta o indicador.

---

## 2. Tipografía

**Familia:** `Inter` (`font-family: "Inter", sans-serif`).

### Escala y Jerarquía

| Tipo | Tamaño | Peso | Uso |
|------|--------|------|-----|
| Display | 64px | 700 | Hero, landing (raro en app) |
| H1 | 48px | 700 | Títulos de sección amplios |
| H2 | 36px | 600 | Título principal de página |
| H3 | 30px | 600 | Secciones |
| H4 | 24px | 600 | Subtítulos, títulos de tarjeta |
| Body Large | 18px | 400 | Introducciones, texto destacado |
| Body | 16px | 400 | **Texto por defecto** |
| Small | 14px | 400 | Metabwamp, metadatos, enlaces |
| Caption | 12px | 400 | Etiquetas, timestamps, badges |

### Reglas

- Altura de línea cómoda: `1.5` para body, `1.2` para títulos.
- `letter-spacing: -0.02em` en Display y H1 para un look premium.
- Peso semibold (600) para UI interactiva (botones, menús).
- Nunca usar peso <400 para texto de tamaño body.

---

## 3. Espaciado y Bordes

### Cuadrícula de Espaciado (base 8px)

| Token | px |
|-------|-----|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 24px |
| `--space-6` | 32px |
| `--space-7` | 40px |
| `--space-8` | 48px |
| `--space-9` | 64px |
| `--space-10` | 80px |

**Reglas de padding:** tarjetas `24px`; inputs y botones `16px` horizontal; gaps de sección `--space-6` (32px).

### Border Radius

| Token | px |
|-------|-----|
| `--radius-sm` | 8px |
| `--radius-md` | 12px |
| `--radius-lg` | 16px |
| `--radius-xl` | 24px |
| `--radius-2xl` | 32px |

Cards = `--radius-lg` (16px); botones e inputs = `--radius-md` (12px); badges/chips = `--radius-sm`.

### Sombras

| Token | Valor |
|-------|-------|
| Small | `0 1px 3px rgba(0,0,0,.08)` |
| Medium | `0 4px 12px rgba(0,0,0,.10)` |
| Large | `0 8px 24px rgba(0,0,0,.12)` |

Cards = Medium (elevación por defecto); modales = Large; hover de card puede subir a Large para feedback de profundidad.

### Layout

- Desktop: Navbar superior + Sidebar (280px) + Área principal.
- Mobile: navbar compacta + menú hamburguesa + una columna.
- Área principal: padding vertical de `32px` en desktop y `24px` en mobile.
- Separación estándar entre bloques: `--space-6` (`32px`).
- El sidebar permanece fijo en desktop y se oculta en mobile.

### Componentes principales

| Componente | Aplicación visual |
|------------|-------------------|
| Panel / Card | Superficie de tarjeta, `padding: 24px`, `border-radius: 16px`, sombra Medium |
| Botón primario | `min-height: 40px` (`min-h-10`), padding horizontal `16px` (`px-4`), `--primary-600`, radio `12px` |
| Botón secundario | Superficie de tarjeta, borde `--gray-200`, hover con tinte `--primary-50` |
| Input / Select | Sin min-height fijo (`py-2`), padding horizontal `12px` (`px-3`), radio `16px` (`rounded-lg`), focus con ring azul |
| Badge / Chip | Altura compacta, radio `rounded-full` (circulares), texto de `12px` |
| Estadística | Card independiente con etiqueta muted, valor destacado y contexto breve |
| Calendario mensual | 7 columnas, máximo 3 eventos visibles por día e indicador `+N more` |

Las tarjetas y paneles deben usar elevación contenida; no añadir sombras o bordes redundantes a cada fila, celda o wrapper estructural.

---

## 4. Estados Visuales

### Hover

- **Botón primario:** fondo de `--primary-600` → `--primary-700`.
- **Elementos secundarios/bordes:** `border-color: --gray-300` → `--gray-400`; opcional tilde suave (tinte `--primary-50`).
- **Cards:** elevar de Small a Medium, ligera transición.
- Respetar transición `150ms` (estándar) o `250ms` (complejas).

### Focus

- **Outline accesible AA:** `ring: 2px solid --primary-500` + `ring-offset: 2px`.
- Alternativa sutil: `box-shadow: 0 0 0 3px rgba(59,130,246,.25)`.
- Visible siempre al navegar por teclado; nunca suprimirlo sin sustituto.

### Deshabilitado

| Token | Valor |
|-------|-------|
| Texto | `--gray-400` |
| Fondo | `--gray-100` |
| Borde | `--gray-200` |
| Opacidad | `0.6` |

El borde deshabilitado: `border-color: --gray-300`; **sin** curso pointer y **sin** elevación de sombra. No se deben aplicar estados `hover` a elementos deshabilitados.

### Estado Pulsar/Activo

- **Pulsado (click):** invertFeedback de color primario un paso más oscuro + `transform: scale(0.98)`.
- **Seleccionado/actual (p.ej. día de hoy):** fondo primario claro `--primary-100` con borde `--primary-400`, texto `--primary-800`.

### Motion

- Duración estándar: `150ms`.
- Transiciones complejas: `250ms`.
- Modales: `scale(0.98) -> scale(1)`.

---

> **Recordatorio para IA:** mantener consistencia visual, priorizar rapidez (evento creado en <10s), no sobredimensionar, dar feedback inmediato y cumplir accesibilidad AA.

---

## 5. Stack Tecnológico

| Capa | Tecnología | Versión | Propósito |
|------|------------|---------|-----------|
| Frontend | React | 18.2.0 | UI rendering |
| Build Tool | Vite | 5.1.0 | Dev server + bundler |
| Routing | React Router DOM | 6.22.0 | SPA routing |
| State | Zustand | 4.5.0 | Global state (auth, theme) |
| Styling | Tailwind CSS | 3.4.1 | Utility-first CSS |
| Backend | Supabase | 2.39.0 | PostgreSQL, Auth, RLS, Edge Functions |
| Deploy | Vercel | — | Static hosting |
| PWA | Service Worker + Web Manifest | — | Offline + push notifications |
| Fonts | Inter | Google Fonts | Tipografía principal |
| Dates | date-fns | 3.3.1 | Manipulación de fechas |

**No es Next.js.** Es un SPA Vite + React sin SSR.

---

## 6. Arquitectura y Rutas

### Rutas

| Ruta | Componente | Auth | Descripción |
|------|------------|------|-------------|
| `/login` | LoginPage | No | Login / Registro |
| `/` | DashboardPage | Sí | Dashboard principal con calendario |
| `/events/:id` | EventDetailPage | Sí | Editar evento individual |
| `/settings` | SettingsPage | Sí | Perfil, notificaciones, integraciones |
| `/auth/google/callback` | AuthCallback | Sí | Callback OAuth Google |
| `/auth/microsoft/callback` | AuthCallback | Sí | Callback OAuth Microsoft |
| `*` | Redirect to `/` | — | Catch-all |

### Protected Routes

Las rutas `/`, `/events/:id` y `/settings` usan `ProtectedRoute` que redirige a `/login` si no hay sesión autenticada.

---

## 7. Estructura del Proyecto

```
personal-calendar/
├── src/
│   ├── main.jsx                    # Entry point (createRoot)
│   ├── App.jsx                     # BrowserRouter, Routes, Auth listener
│   ├── index.css                   # Tailwind directives + CSS custom properties
│   │
│   ├── store/                      # Estado global (Zustand)
│   │   ├── authStore.js            # user, profile, signIn/signUp/signOut
│   │   └── themeStore.js           # dark/light mode, localStorage persistence
│   │
│   ├── hooks/                      # Lógica de negocio
│   │   ├── useEvents.js            # CRUD, conflictos, recurrencia, sync, iCal
│   │   ├── useIntegrations.js      # Estado integraciones (Google, Outlook, WhatsApp)
│   │   └── useKeyboardShortcuts.js # Atajos: N, T, D, W, M, L, /
│   │
│   ├── lib/                        # Servicios y utilidades
│   │   ├── supabase.js             # Cliente Supabase
│   │   ├── googleCalendar.js       # Google Calendar API
│   │   ├── outlookCalendar.js      # Microsoft Graph API
│   │   ├── pkce.js                 # OAuth PKCE helpers
│   │   ├── naturalLanguage.js      # Parser "mañana a las 3pm"
│   │   ├── icalUtils.js            # iCal RFC 5545 import/export
│   │   └── pushNotifications.js    # VAPID + Notification API
│   │
│   ├── pages/                      # Componentes de ruta
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── EventDetailPage.jsx
│   │   ├── SettingsPage.jsx
│   │   └── AuthCallback.jsx
│   │
│   └── components/
│       ├── ui/                     # Primitivas base
│       │   ├── Button.jsx          # primary/secondary/danger/ghost
│       │   ├── Input.jsx           # Input con label + error
│       │   ├── Modal.jsx           # Overlay modal con backdrop
│       │   ├── Checkbox.jsx        # Checkbox custom
│       │   └── Icons.jsx           # SVG icons (Google, Outlook, WhatsApp)
│       │
│       ├── layout/                 # Shell de layout
│       │   ├── Navbar.jsx          # Top nav (logo, theme, settings, sign out)
│       │   ├── Sidebar.jsx         # Mini calendar, integrations, quick stats
│       │   └── ProtectedRoute.jsx  # Auth guard
│       │
│       ├── auth/                   # Formularios de auth
│       │   ├── LoginForm.jsx
│       │   └── RegisterForm.jsx    # + password strength meter
│       │
│       ├── calendar/               # Vistas del calendario
│       │   ├── MonthView.jsx       # Grid mensual 7 cols
│       │   ├── WeekView.jsx        # 7 cols x 24 rows
│       │   ├── DayView.jsx         # 24 hour rows
│       │   └── EventCard.jsx       # Display de evento
│       │
│       ├── events/                 # Gestión de eventos
│       │   ├── EventForm.jsx       # Create/edit con lenguaje natural
│       │   └── EventList.jsx       # Vista lista vertical
│       │
│       ├── integrations/           # Integraciones third-party
│       │   ├── GoogleCalendarConnect.jsx
│       │   ├── OutlookConnect.jsx
│       │   ├── WhatsAppConnect.jsx
│       │   └── ConsentModal.jsx    # Modal de consentimiento reutilizable
│       │
│       └── onboarding/             # Primera vez
│           └── OnboardingTour.jsx  # Tour 5 pasos, dismissable
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_schema.sql          # Schema base (profiles, events, integrations, notifications + RLS)
│   │   └── 002_enhanced_events.sql # Recurrence, categories, all-day, multi-day
│   └── functions/
│       ├── exchange-google-token/   # OAuth token exchange (Google)
│       ├── exchange-outlook-token/  # OAuth token exchange (Microsoft)
│       ├── sync-calendar-event/     # Sync CRUD con APIs externas
│       └── send-reminders/          # WhatsApp (Twilio) + Email (Resend)
│
└── public/
    ├── manifest.json               # PWA manifest
    └── sw.js                       # Service worker (caching + push)
```

---

## 8. Lógica de Negocio (Hooks)

### `useEvents`

El hook central de lógica de negocio. Maneja:

- **CRUD**: Crear, actualizar, eliminar eventos via Supabase
- **Detección de conflictos**: Verifica solapamiento de horarios antes de guardar
- **Recurrencia**: Genera instancias via RPC `generate_recurring_instances`
- **Sync externo**: Orquesta `syncGoogleEvent` / `syncOutlookEvent`
- **Recordatorios**: Inserta en tabla `notifications`
- **Búsqueda y filtrado**
- **Importación masiva iCal**

### `useIntegrations`

- CRUD de estado de integraciones (Google, Outlook, WhatsApp)
- Lee de tabla `integrations`

### `useKeyboardShortcuts`

| Atajos | Acción |
|--------|--------|
| `N` | Nuevo evento |
| `T` | Ir a hoy |
| `D` | Vista día |
| `W` | Vista semana |
| `M` | vista mes |
| `L` | Vista lista |
| `/` | Buscar |

Se desactiva cuando el foco está en inputs/formularios.

---

## 9. Servicios (`lib/`)

| Archivo | Responsabilidad |
|---------|-----------------|
| `supabase.js` | Inicializa cliente Supabase desde `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` |
| `googleCalendar.js` | Token exchange y event sync via Edge Functions |
| `outlookCalendar.js` | Token exchange y event sync via Edge Functions |
| `pkce.js` | Genera PKCE code verifier, challenge (S256), state usando `crypto.subtle` |
| `naturalLanguage.js` | Parser de strings como "Cena viernes a las 8pm" en objetos fecha/título estructurados |
| `icalUtils.js` | Exportación e importación iCal completa (RFC 5545) |
| `pushNotifications.js` | Suscripción VAPID, Notification API, scheduler de push |

---

## 10. Backend (Supabase)

### Tablas de Base de Datos

| Tabla | Columnas Principales | Propósito |
|-------|---------------------|-----------|
| `profiles` | id (FK auth.users), name, email, phone, whatsapp_consent | Perfil de usuario (auto-creado en signup) |
| `events` | id, user_id, title, description, event_date, event_time, duration_minutes, status, category, color, is_all_day, end_date, recurrence_rule, recurrence_end_date, parent_event_id, sync_google, sync_outlook, google_event_id, outlook_event_id, whatsapp_reminder, email_reminder, reminder_before_minutes | Eventos con soporte completo |
| `integrations` | id, user_id, service (google/outlook/whatsapp), access_token, refresh_token, token_expires_at, connected | Tokens OAuth y estado |
| `notifications` | id, user_id, event_id, channel (whatsapp/email), status (pending/sent/failed), sent_at, error_message | Cola de recordatorios |

**Todas las tablas tienen RLS** con políticas por usuario.

### Edge Functions (Deno)

| Function | Descripción |
|----------|-------------|
| `exchange-google-token` | Intercambia código OAuth por tokens Google, almacena en `integrations` |
| `exchange-outlook-token` | Intercambia código OAuth por tokens Microsoft, almacena en `integrations` |
| `sync-calendar-event` | Create/update/delete en Google Calendar API o Microsoft Graph API. Maneja refresh automático |
| `send-reminders` | Cron que procesa cola `notifications`, envía WhatsApp (Twilio) y email (Resend) |

### SQL Functions

| Function | Descripción |
|----------|-------------|
| `generate_recurring_instances(p_start_date, p_rule, p_end_date, p_limit)` | Genera fechas de eventos recurrentes (daily/weekly/monthly/yearly) |
| `handle_new_user()` | Trigger que crea fila `profiles` automáticamente al registrarse |

---

## 11. Funcionalidades Clave

- **Calendario con 3 vistas**: Mes, semana y día
- **CRUD de eventos**: Soporte para todo el día, multi-día y recurrencia
- **Sincronización bidireccional**: Google Calendar y Outlook via OAuth 2.0 + PKCE
- **Recordatorios multi-canal**: WhatsApp (Twilio), Email (Resend) y Push del navegador
- **Import/Export iCal**: Compatible con otros calendarios (RFC 5545)
- **Input de lenguaje natural**: "Mañana a las 3pm reunión con Juan" parsea automáticamente
- **Detección de conflictos**: Alerta al solapar horarios
- **Tour de onboarding**: 5 pasos, dismissable, persiste en localStorage
- **Atajos de teclado**: N, T, D, W, M, L, /
- **Dark/Light mode**: Persiste en localStorage, previene flash en carga
- **PWA instalable**: Service worker con caching stale-while-revalidate
