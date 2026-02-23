# Formato Estandar de Capas GIS

## Resumen

Para cargar un establecimiento en la plataforma, el tecnico debe subir **2 archivos** desde el BackOffice:

| Archivo | Formato | Contenido | Obligatorio |
|---------|---------|-----------|-------------|
| Lotes | Shapefile (.zip) o GeoJSON (.geojson) | Poligonos vectoriales con nombre de cada lote/potrero | Si |
| Ambientacion | GeoTIFF (.tif) | Raster de clasificacion de ambientes (Earth Engine o QGIS) | Opcional |

---

## Archivo 1: Lotes (vector)

### Que es

Un archivo vectorial donde cada feature es un poligono que representa un lote o potrero del establecimiento. Puede incluir tambien fragmentos del perimetro (sin nombre) que el tecnico clasifica en la UI.

### Formatos aceptados

- **Shapefile**: subir como `.zip` conteniendo al menos `.shp`, `.dbf`, `.prj`, `.shx`
- **GeoJSON**: archivo `.geojson` o `.json`

### Campos

El unico campo requerido es el **nombre del lote**. El sistema detecta automaticamente cual columna es el nombre buscando entre: `Lote`, `nombre`, `nombre_lote`, `Nombre Pot`, `name`, `Name`, `NOMBRE`.

Campos opcionales que se detectan si existen:
- `Sup`, `superficie`, `has`, `area` → superficie en hectareas (si no existe, se calcula geometricamente)
- `Celula`, `celula`, `Células` → agrupacion por celula de pastoreo

### Sistema de coordenadas

Cualquier CRS es aceptado. El sistema lee el `.prj` (shapefile) o la metadata del GeoJSON y reproyecta automaticamente a WGS84 (EPSG:4326).

CRS comunes en Argentina:
- POSGAR 2007 Zone 5 (EPSG:5347) - Santiago del Estero, Chaco
- POSGAR 2007 Zone 4 (EPSG:5346) - Buenos Aires, Santa Fe
- WGS84 (EPSG:4326) - GPS directo

### Poligonos sin nombre

Es comun que el shapefile incluya poligonos sin nombre de lote (fragmentos de perimetro, caminos, cascos, etc.). En la pantalla de upload, el tecnico clasifica cada uno como:

- **Descartar**: no se importa
- **Perimetro**: se guarda como referencia visual
- **Asignar nombre**: el tecnico ingresa un nombre y se importa como lote

### Ejemplo de datos

Del establecimiento Los Olivos (`Perimetro con lotes.shp`):

```
Campos: id, Sup, Lote
Registros con nombre: 62 lotes (ej: "1", "2 Chanchos", "7 Toni", "11 Noria", "Frutales")
Registros sin nombre: 76 fragmentos (perimetro, caminos, etc.)
CRS: POSGAR 2007 Zone 5
```

---

## Archivo 2: Ambientacion (raster)

### Que es

Un raster de clasificacion de ambientes generado desde Earth Engine o procesado en QGIS. Cada pixel tiene un valor numerico que representa una clase de ambiente (monte cerrado, bajo dulce, etc.).

### Formato

- **GeoTIFF** (`.tif`): archivo raster con una o mas bandas

### Origen

Segun la guia de clasificacion de ambientes, el flujo tipico es:

1. Entrar a la app de Earth Engine: `ee-fontagrobiomasa.projects.earthengine.app/view/clasificacion`
2. Dibujar el perimetro del campo (un poco mas grande)
3. Configurar: fecha, numero de periodos, longitud, numero de clases
4. Clasificar y descargar "Clasificacion QGIS" (GeoTIFF)
5. Opcionalmente procesar en QGIS (recortar, reasignar valores, validar)

### Sistema de coordenadas

Cualquier CRS. El sistema reproyecta automaticamente.

### Nombrado de clases

El raster solo tiene valores numericos (1, 2, 3...). En la pantalla de upload, el tecnico asigna nombres a cada clase:

- Clase 1 → "Monte cerrado"
- Clase 2 → "Bajo dulce"
- Clase 3 → "Monte abierto bajo"
- etc.

Nombres de ambiente comunes (extraidos de datos reales de `pa_lote`):
- Monte cerrado
- Monte abierto bajo
- Media loma con monte
- Bajo dulce
- Abra / Campo natural
- Sorgo diferido
- Pastura consociada

---

## Procesamiento en el Backend

### Paso 1: Parseo de lotes

1. Detectar formato (shapefile vs geojson)
2. Leer CRS del archivo
3. Reproyectar geometrias a WGS84 (EPSG:4326)
4. Detectar campo de nombre automaticamente
5. Calcular superficie en hectareas (reproyectar a CRS plano para calculo de area)
6. Agrupar poligonos con mismo nombre (multi-part polygons)
7. Mostrar preview en mapa para validacion

### Paso 2: Parseo de ambientacion (si existe)

1. Leer raster GeoTIFF con metadatos (CRS, extent, resolucion)
2. Reproyectar a mismo CRS que los lotes si es necesario
3. Identificar valores unicos (clases de ambiente)
4. Mostrar preview con simbologia por clase
5. Tecnico asigna nombres a cada clase

### Paso 3: Cross Classification (lotes x ambientes)

Replica la funcionalidad de `SCP > Postprocesamiento > Cross Classification` de QGIS:

1. Para cada lote:
   a. Rasterizar el poligono del lote como mascara
   b. Aplicar mascara sobre el raster de ambientacion
   c. Contar pixeles por clase dentro del lote
   d. Calcular superficie de cada clase (pixeles x resolucion^2)
   e. Calcular porcentaje de cada clase

2. Aplicar umbral minimo (default 10%): si un ambiente ocupa menos del umbral en un lote, se fusiona con el ambiente mas cercano/similar

3. Generar registros en `dc_ambiente`:
   - Un registro por cada combinacion lote x ambiente significativo
   - Geometria = interseccion del poligono del lote con el area de la clase
   - Superficie = has calculadas

### Paso 4: Almacenamiento

Guardar en schema `datos_campo`:
- `dc_capa_gis`: registro de la capa original subida (geojson completo, metadata)
- `dc_lote`: un registro por lote con geometria, nombre, superficie
- `dc_ambiente`: un registro por ambiente-dentro-de-lote con geometria recortada y superficie

---

## Pantalla de Upload (BackOffice)

### Flujo de usuario

```
1. Seleccionar establecimiento
2. Subir archivo de lotes (.zip o .geojson)
   → Preview en mapa
   → Clasificar poligonos sin nombre (descartar/perimetro/nombrar)
   → Confirmar lotes
3. (Opcional) Subir raster de ambientacion (.tif)
   → Preview de clases sobre el mapa
   → Nombrar cada clase
   → Configurar umbral minimo (%)
   → Ejecutar cross classification
   → Preview de resultado: tabla lote x ambiente con superficies
   → Confirmar
4. Guardar todo en Supabase
```

### Wireframe

```
┌──────────────────────────────────────────────────────────────┐
│  Capas GIS - Los Olivos (P034)                               │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  PASO 1: Lotes                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Arrastra tu archivo .shp.zip o .geojson               │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  62 lotes detectados | 76 fragmentos sin nombre              │
│                                                              │
│  ┌─ Mapa ──────────────────────┐  ┌─ Lista ──────────────┐  │
│  │                             │  │ ✅ 1         16.7 ha  │  │
│  │   [Poligonos sobre          │  │ ✅ 2 Chanch  18.5 ha  │  │
│  │    satelite]                 │  │ ✅ 3 Farias  19.6 ha  │  │
│  │                             │  │ ...                   │  │
│  │                             │  │ ⚠️ (sin nombre) 1.5ha │  │
│  │                             │  │    [Descartar ▾]      │  │
│  └─────────────────────────────┘  └───────────────────────┘  │
│                                                              │
│  PASO 2: Ambientacion (opcional)                             │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Arrastra tu archivo .tif (clasificacion Earth Engine)  │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  5 clases detectadas                                         │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 🟤 Clase 1 (2340 px) → [Monte cerrado          ▾]     │  │
│  │ 🟢 Clase 2 (1890 px) → [Bajo dulce             ▾]     │  │
│  │ 🔵 Clase 3 (1205 px) → [Monte abierto bajo     ▾]     │  │
│  │ 🟡 Clase 4 (890 px)  → [Media loma con monte   ▾]     │  │
│  │ ⬜ Clase 5 (340 px)  → [Abra                   ▾]     │  │
│  │                                                        │  │
│  │ Umbral minimo: [10] % del lote                         │  │
│  │ [Ejecutar Cross Classification]                         │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  Resultado:                                                  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Lote 1 (16.7 ha):                                     │  │
│  │   Monte cerrado: 8.2 ha (49%) | Bajo dulce: 5.1 (31%)│  │
│  │   Monte abierto bajo: 3.4 ha (20%)                    │  │
│  │ Lote 2 Chanchos (18.5 ha):                            │  │
│  │   Bajo dulce: 12.3 ha (66%) | Monte cerrado: 6.2 (34%)│ │
│  │ ...                                                    │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  [Confirmar y Guardar]                                       │
└──────────────────────────────────────────────────────────────┘
```

---

## Tecnologias sugeridas para implementacion

### Parser vectorial (lotes)
- **pyshp** o **fiona**: lectura de shapefiles
- **pyproj**: reproyeccion de coordenadas
- **shapely**: operaciones geometricas (area, interseccion)

### Parser raster (ambientacion)
- **rasterio**: lectura de GeoTIFF
- **numpy**: operaciones sobre arrays de pixeles
- **rasterio.mask**: recorte de raster por poligono

### Cross classification
- Para cada lote: `rasterio.mask.mask(raster, [lote_polygon])` → array de pixeles
- `numpy.unique(masked_array, return_counts=True)` → conteo por clase
- Superficie = count * pixel_size_x * pixel_size_y (en metros^2, convertir a ha)

### Alternativa: Edge Function en Supabase
- Subir archivos a Supabase Storage
- Edge function procesa con libreria JS (geotiff.js, turf.js)
- O invocar un servicio Python serverless para el procesamiento pesado

### Alternativa: Procesamiento en el frontend
- Para archivos chicos, parsear en el browser con:
  - **shpjs**: lectura de shapefiles
  - **geotiff.js**: lectura de GeoTIFF
  - **turf.js**: operaciones geometricas
- Ventaja: preview instantaneo sin roundtrip al server
