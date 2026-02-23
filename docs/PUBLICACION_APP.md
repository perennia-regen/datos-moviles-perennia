# Publicación - Recorrida Holística

Análisis y decisiones de publicación de la app para iOS y Android.

## Estrategia

Dos fases de distribución, ambas con actualizaciones OTA semanales sin pasar por revisión de stores:

| Fase | Canal | iOS | Android | Revisión store |
|------|-------|-----|---------|:-:|
| **Testing** | `preview` | TestFlight (internal testers) | Play Store (internal testing track) | No |
| **Producción** | `production` | App Store (público/unlisted) | Play Store (público) | Sí (1-3 días) |

### Cómo funcionan las actualizaciones

```
┌─────────────────────────────────────┐
│          Capa nativa                │  Build con EAS → .ipa / .aab
│  expo-camera, expo-sqlite,          │  Se actualiza via TestFlight / Play Store
│  expo-location, react-native-maps   │  Solo cambia si se agrega/actualiza módulo nativo
├─────────────────────────────────────┤
│          Capa JS/TS                 │  Update con EAS Update → OTA instantáneo
│  Pantallas, lógica, estilos,        │  Se actualiza al abrir la app
│  imágenes, fuentes                  │  Sin revisión, sin reinstalar
└─────────────────────────────────────┘
```

- **OTA update (semanal):** un comando, llega a todos los usuarios en minutos. Sin revisión.
- **Rebuild nativo (~mensual):** solo cuando cambia algo nativo. Llega automáticamente via TestFlight/Play Store.

## Costos

| Servicio | Costo |
|----------|-------|
| EAS Build + Update (free tier: 15 builds/mes, 1000 MAU) | $0 |
| Apple Developer Program | USD 99/año |
| Google Play Developer | USD 25 (one-time) |
| **Total primer año** | **USD 124** |
| **Total años siguientes** | **USD 99/año** |

### Límites del free tier de EAS

| Recurso | Límite free | Suficiente para 15 usuarios? |
|---------|-------------|:-:|
| Builds iOS | 15/mes | Sí (~1-2/mes) |
| Builds Android | 15/mes | Sí (~1-2/mes) |
| OTA Updates MAU | 1,000 | Sí |
| OTA Bandwidth | 100 GiB/mes | Sí |

---

## Cuentas y credenciales

| Cuenta | Estado | Email / Usuario |
|--------|--------|-----------------|
| Expo (EAS) | LISTO | `perennia-regen` |
| Apple Developer | ESPERANDO PAGO (USD 99) | (Apple ID personal) |
| Google Play Console | ESPERANDO VERIFICACIÓN | `perennia.mh@gmail.com` |

**D-U-N-S Perennia**: `973343560`

**Proyecto EAS**: `0dea489b-c201-4e7b-bb8a-25975b540c05`

### Pendientes

- [ ] Apple: esperar acreditación de pago → habilita build iOS
- [ ] Apple: migrar cuenta individual a organización → publisher "Perennia" en el store
  - [developer.apple.com/contact](https://developer.apple.com/contact/) → Account → "Convert individual to organization"
  - D-U-N-S: `973343560`
  - ~1-2 semanas, no bloqueante para testing
- [ ] Google Play: completar verificación de identidad (DNI) + teléfono
- [ ] Configurar TestFlight: crear grupo "Equipo Perennia", agregar testers por Apple ID
- [ ] Configurar Play Store: crear internal testing track, agregar testers por email

---

## Onboarding de usuarios

### iOS (TestFlight)
1. Agregar email (Apple ID) al grupo en [App Store Connect](https://appstoreconnect.apple.com) → TestFlight → Internal Testing
2. El usuario recibe mail → instala TestFlight (gratis) → acepta invitación → instala la app
3. Actualizaciones futuras llegan automáticamente

### Android (Play Store Internal Testing)
1. Agregar email a la lista de testers en [Play Console](https://play.google.com/console) → Testing → Internal testing
2. El usuario recibe link → acepta → instala desde Play Store
3. Actualizaciones futuras se instalan automáticamente

### TestFlight expira a los 90 días
Hacer un rebuild nativo al menos cada 2 meses para renovar.

---

## Transición a producción

Cuando la app esté estable, publicar en stores:

### Requisitos para los listings

**App Store (iOS):**
- Nombre, descripción, capturas de pantalla
- Categoría: Productivity o Business
- Política de privacidad (URL)
- Opción **unlisted**: solo accesible con link directo

**Google Play (Android):**
- Store listing: nombre, descripción, screenshots, ícono
- Content rating (cuestionario)
- Política de privacidad (URL)
- Declaración de permisos sensibles (ubicación, cámara)

### Tiempos de revisión

| Store | Primera vez | Updates posteriores |
|-------|:-:|:-:|
| App Store (iOS) | 1-3 días | 1-2 días |
| Play Store (Android) | Horas a 1 día | Horas |

> La revisión solo aplica a rebuilds nativos. Los OTA updates semanales nunca pasan por revisión.
