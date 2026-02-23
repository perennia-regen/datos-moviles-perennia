# Guía de Deploy - Recorrida Holística

Referencia técnica para deployar nuevas versiones de la app.

## Setup

| Archivo | Qué contiene |
|---------|-------------|
| `perennia-app/app.json` | Config Expo: nombre, permisos, OTA updates, identificadores |
| `perennia-app/eas.json` | Profiles de build (`preview`/`production`) y submit |
| `perennia-app/.env` | Variables de entorno (Supabase) — NO va a git |

Las migraciones de Supabase viven en el repo de **BackOffice**, no acá.

---

## OTA Update (semanal)

Para cambios de JS/TS: pantallas, lógica, estilos, imágenes, fuentes, paquetes npm JS-only.

Los usuarios reciben el update automáticamente al abrir la app. Sin rebuild, sin revisión.

### Testing

```bash
cd perennia-app
npx tsc --noEmit
eas update --channel preview --message "semana X - descripción"
```

### Producción

```bash
cd perennia-app
npx tsc --noEmit
eas update --channel production --message "v1.X - descripción"
```

### Dual channel

Probar en testing primero, pushear a prod después:

```bash
eas update --channel preview --message "nueva feature X"
# validar con el equipo...
eas update --channel production --message "v1.X - feature X"
```

---

## Rebuild nativo (~mensual)

Solo cuando cambia algo de la capa nativa. El build corre en la nube de EAS (~15-30 min).

### Testing

```bash
cd perennia-app

# Build
eas build --profile preview --platform all

# Submit a TestFlight + Play Store Internal
eas submit --profile preview --platform ios
eas submit --profile preview --platform android
```

Los usuarios se actualizan automáticamente via TestFlight / Play Store.

### Producción

```bash
cd perennia-app

# Bump version en app.json
# "version": "1.1.0"

# Build
eas build --profile production --platform all

# Submit (pasa por revisión)
eas submit --profile production --platform ios      # 1-3 días
eas submit --profile production --platform android   # horas
```

---

## ¿OTA o rebuild?

| Cambio | Tipo de deploy |
|--------|---------------|
| Bug fix en TS/JS | OTA: `eas update` |
| Nueva pantalla o componente | OTA: `eas update` |
| Cambiar imágenes, fuentes, JSON | OTA: `eas update` |
| Agregar paquete npm (JS puro) | OTA: `eas update` |
| **Agregar módulo nativo** | Rebuild: `eas build` + `eas submit` |
| **Upgrade Expo SDK** | Rebuild: `eas build` + `eas submit` |
| **Upgrade módulos nativos** | Rebuild: `eas build` + `eas submit` |
| **Cambiar permisos de la app** | Rebuild: `eas build` + `eas submit` |

> `runtimeVersion: fingerprint` en `app.json` detecta automáticamente si un OTA update es incompatible con el build actual. Si lo es, lo rechaza y hay que hacer rebuild.

---

## Agregar usuario nuevo

**iOS:** agregar Apple ID en App Store Connect → TestFlight → Internal Testing → grupo "Equipo Perennia"

**Android:** agregar email en Play Console → Testing → Internal testing → lista de testers

No requiere rebuild ni cambio técnico.

---

## Versionado

- `app.json` → `"version"`: versión visible al usuario (1.0.0, 1.1.0, etc.)
- Bump manual antes de cada rebuild nativo
- Los OTA updates no cambian el version number

---

## Troubleshooting

### `no team associated with your Apple account`
El pago de Apple Developer (USD 99) no se acreditó todavía. Esperar horas/hasta 48hs.

### Build falla por credenciales de Apple
EAS necesita Apple ID + password para generar certificados. Correr `eas build` en terminal interactiva. Si usás passkey, resetear contraseña en [iforgot.apple.com](https://iforgot.apple.com).

### OTA update no llega a los usuarios
- Verificar que el build fue hecho con el mismo channel (`preview` o `production`)
- Verificar `runtimeVersion` — si cambió código nativo, el OTA es incompatible → rebuild
- El update se aplica en el **siguiente restart** de la app, no inmediatamente

### TestFlight expiró
Los builds expiran a los 90 días. Hacer un rebuild: `eas build --profile preview --platform ios` + `eas submit`.
