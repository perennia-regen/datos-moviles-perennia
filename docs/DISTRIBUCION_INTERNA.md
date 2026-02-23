# Distribución - Recorrida Holística

Guía para distribuir la app a ~15 usuarios internos (iOS + Android) con actualizaciones semanales, y luego publicar en stores.

## Fases

| Fase | Canal | iOS | Android | Revisión store |
|------|-------|-----|---------|:-:|
| **Testing** | `preview` | TestFlight (internal testers) | Play Store (internal testing track) | No |
| **Producción** | `production` | App Store (público/unlisted) | Play Store (público) | Sí (1-3 días) |

Ambas fases usan **EAS Update (OTA)** para updates semanales de JS sin pasar por revisión.

### Costo total

| Servicio | Costo |
|----------|-------|
| EAS Build + Update (free tier: 15 builds/mes, 1000 MAU) | $0 |
| Apple Developer Program (obligatorio para iOS) | USD 99/año |
| Google Play Developer (one-time) | USD 25 |
| **Total primer año** | **USD 124** |
| **Total años siguientes** | **USD 99/año** |

---

## Cuentas necesarias (una sola vez)

### 1. Expo Account (gratis) — LISTO
1. ~~Crear cuenta en [expo.dev](https://expo.dev)~~
2. Habilita EAS Build y EAS Update

### 2. Apple Developer Account (USD 99/año) — ESPERANDO PAGO
1. ~~Cuenta creada como individuo~~
2. **Bloqueante**: pago de USD 99 pendiente de acreditación (puede tomar horas hasta 48hs)
   - Hasta que no se acredite, no se puede buildear para iOS (`no team associated`)
   - Una vez acreditado, correr: `eas build --profile preview --platform ios`
3. **Pendiente (no urgente)**: migrar a cuenta de organización (Perennia)
   - Contactar a Apple: [developer.apple.com/contact](https://developer.apple.com/contact/) → Account → "Convert individual to organization"
   - D-U-N-S de Perennia: `973343560`
   - Tarda ~1-2 semanas, no es bloqueante para testing

### 3. Google Play Developer Account (USD 25, one-time) — ESPERANDO VERIFICACIÓN
1. ~~Ir a [play.google.com/console](https://play.google.com/console/signup)~~
2. Cuenta: `perennia.mh@gmail.com`, tipo organización
3. D-U-N-S de Perennia: `973343560`
4. ~~Verificación sitio web (Search Console)~~
5. Verificación de identidad (DNI): en proceso (~48hs)
6. Verificación de teléfono: pendiente (después del DNI)
7. Una vez verificado, subir build Android: `eas submit --profile preview --platform android`

---

## Setup inicial del proyecto — LISTO

Todo completado el 2026-02-23:

- ~~Instalar EAS CLI~~ (`eas-cli/18.0.3`)
- ~~Login Expo~~ (usuario: `perennia-regen`)
- ~~`eas init`~~ (project ID: `0dea489b-c201-4e7b-bb8a-25975b540c05`)
- ~~`eas update:configure`~~ (instaló `expo-updates`)
- ~~Crear `eas.json`~~ (profiles: preview + production)
- ~~Configurar `app.json`~~ (fingerprint, OTA updates, bundleIdentifier, package)
- ~~Primer build Android~~ (exitoso, AAB generado)
- Build iOS: esperando acreditación de pago Apple Developer

### Archivos de configuración

- `perennia-app/eas.json` — profiles de build y submit
- `perennia-app/app.json` — config de Expo, updates, identificadores

---

# Fase 1: Testing (equipo interno)

## Primer build + distribución

```bash
# Buildear para ambas plataformas
eas build --profile preview --platform all

# Subir a TestFlight y Play Store
eas submit --profile preview --platform ios
eas submit --profile preview --platform android
```

### Configurar TestFlight (iOS)

En [appstoreconnect.apple.com](https://appstoreconnect.apple.com):

1. Ir a tu app → TestFlight → Internal Testing
2. Crear un grupo "Equipo Perennia"
3. Agregar a los usuarios por email (Apple ID)
4. Los usuarios reciben mail → instalan TestFlight → instalan la app

> TestFlight Internal (hasta 100 personas) **no tiene revisión de Apple**. Disponible en minutos.

### Configurar Play Store Internal Testing (Android)

En [play.google.com/console](https://play.google.com/console):

1. Ir a tu app → Testing → Internal testing
2. Crear lista de testers, agregar emails
3. Los usuarios reciben link → instalan desde Play Store

> Internal testing track **no tiene revisión de Google**. Disponible en minutos.

### Onboarding de usuarios (una vez por persona)

**iOS:**
1. Recibe mail de invitación a TestFlight
2. Instala la app "TestFlight" desde App Store (gratis)
3. Acepta invitación → instala Recorrida Holística
4. Futuras actualizaciones llegan como notificación en TestFlight

**Android:**
1. Recibe link de internal testing
2. Acepta ser tester
3. Instala desde Play Store
4. Futuras actualizaciones se instalan automáticamente

### Workflow semanal (testing)

```bash
# Updates de JS/TS — cada semana
eas update --channel preview --message "semana X - descripción"
# → Los 15 usuarios actualizan automáticamente al abrir la app

# Rebuilds nativos — solo cuando hay cambios nativos (cada 1-2 meses)
eas build --profile preview --platform all
eas submit --profile preview --platform ios
eas submit --profile preview --platform android
# → TestFlight y Play Store actualizan automáticamente
```

### Nota: TestFlight expira a los 90 días

Los builds de TestFlight expiran después de 90 días. Hacer un rebuild nativo al menos cada 2 meses.

---

# Fase 2: Producción (publicar en stores)

Cuando la app esté estable y lista para salir de testing.

## Preparar listing de stores

### App Store Connect (iOS)
1. En [appstoreconnect.apple.com](https://appstoreconnect.apple.com), crear un listing:
   - Nombre, descripción, capturas de pantalla (iPhone + iPad si aplica)
   - Categoría: Productivity o Business
   - Clasificación de contenido
   - Política de privacidad (URL requerida)
2. Opción **unlisted**: la app no aparece en búsquedas, solo accesible con link directo. Ideal si querés que solo la usen personas con el link.

### Google Play Console (Android)
1. En [play.google.com/console](https://play.google.com/console), completar:
   - Store listing: nombre, descripción, screenshots, ícono
   - Content rating (cuestionario)
   - Política de privacidad (URL requerida)
   - Declaración de permisos sensibles (ubicación, cámara)

## Build y submit de producción

```bash
# Build de producción
eas build --profile production --platform all

# Submit a los stores para revisión
eas submit --profile production --platform ios
eas submit --profile production --platform android
```

### Tiempos de revisión

| Store | Primera vez | Updates posteriores |
|-------|:-:|:-:|
| App Store (iOS) | 1-3 días | 1-2 días |
| Play Store (Android) | Horas a 1 día | Horas |

> La revisión solo aplica a **rebuilds nativos**. Los OTA updates semanales siguen sin revisión.

## Workflow semanal (producción)

```bash
# Updates de JS/TS — cada semana, sin revisión
eas update --channel production --message "semana X - descripción"

# Rebuilds nativos — cada 1-2 meses, con revisión (1-3 días)
eas build --profile production --platform all
eas submit --profile production --platform all
```

## Mantener ambos canales

Podés mantener `preview` (testing interno) y `production` (store público) en paralelo:

```bash
# Probar features nuevas con el equipo interno primero
eas update --channel preview --message "feature experimental"

# Cuando esté validada, pushear a producción
eas update --channel production --message "release estable"
```

---

# Referencia rápida

## Cuándo se necesita rebuild nativo

| Cambio | Rebuild? |
|--------|:-:|
| Bug fix en TS/JS | No — OTA |
| Nueva pantalla o componente | No — OTA |
| Cambiar imágenes, fuentes, JSON | No — OTA |
| Agregar paquete npm (JS puro) | No — OTA |
| **Agregar módulo nativo** (ej: expo-barcode-scanner) | **Sí** |
| **Upgrade Expo SDK** (54 → 55) | **Sí** |
| **Upgrade módulos nativos** (expo-camera, expo-sqlite, etc.) | **Sí** |
| **Cambiar permisos de la app** | **Sí** |
| **Agregar nuevo usuario (testing)** | **No** (agregar email) |

## Límites del free tier de EAS

| Recurso | Límite free | Suficiente? |
|---------|-------------|:-:|
| Builds iOS | 15/mes | Sí (~1-2/mes) |
| Builds Android | 15/mes | Sí (~1-2/mes) |
| OTA Updates MAU | 1,000 | Sí (15 usuarios) |
| OTA Bandwidth | 100 GiB/mes | Sí (sobra) |

## Comandos frecuentes

```bash
# OTA update semanal (sin rebuild)
eas update --channel preview --message "descripción"

# Rebuild nativo + deploy testing
eas build --profile preview --platform all
eas submit --profile preview --platform ios
eas submit --profile preview --platform android

# Rebuild nativo + deploy producción
eas build --profile production --platform all
eas submit --profile production --platform all

# Registrar nuevo dispositivo iOS (solo para ad hoc, no necesario con TestFlight)
eas device:create
```
