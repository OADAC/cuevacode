# Cueva Code · iPad / Mobile

> **Descompositor unificado de patronaje** — del Sistema Operativo de la Construcción **Cueva**.
> Funciona en **iPad**, **iPhone**, **Android** y **escritorio**, con o sin internet.

[![Live demo](https://img.shields.io/badge/demo-live-8a6d3b)]()
[![PWA](https://img.shields.io/badge/PWA-installable-2d6fa8)]()
[![Touch](https://img.shields.io/badge/touch-✓-2e7d4f)]()
[![Apple Pencil](https://img.shields.io/badge/pencil-✓-c87a3a)]()
[![Offline](https://img.shields.io/badge/offline-first-b83232)]()

---

## ¿Qué es esto?

La versión **iPad/Mobile** del descompositor de patronaje **Cueva**. Toma como base
el prototipo móvil (`decompositor_mobile`) y el desktop (`dec_v11`) y los unifica
en una **PWA single-file** optimizada para tableta y móvil con **lápiz, dedo o ratón**.

Toma de **Cueva Code** (`edro-v9`) los conceptos clave: tipos de capa
(forjado / fachada / tabique / cubierta / estructura), exportación CSV
compatible con el Manager Cueva, y multi‑silueta.

---

## Características

### Dibujo y geometría
- **Polígono**, **Rectángulo**, **Elipse**, **Pincel** (a mano alzada con simplificación RDP) y **Hueco**
- **Editor de vértices** con manijas grandes para tocar con el dedo
- **Snap a cuadrícula** (toggle)
- **Multi‑silueta** con varias capas por proyecto y tipos de capa

### Sistema J de unificación
- J1, J2, J4, J6, J8, J10 con **columnas configurables** (×1 – ×5)
- **Vista previa** antes de confirmar (preview punteado)
- **Bloques persistentes** sobreviven cambios de offset / tamaño de celda
- **7 secuencias de montaje**: fila, columna, serpentín, espiral, base→arriba, centro→afuera

### Análisis
- **Auto★** detecta bordes y celdas especiales (recortadas)
- **Elastómetro** de densidad (ligero / óptimo / denso)
- **HUD flotante** con std / esp / bloques / total en tiempo real
- **Animación** del orden de montaje pieza a pieza

### Touch + Pencil + Mouse (unificado vía Pointer Events)
- **1 dedo**: dibujar / añadir vértice
- **1 dedo arrastrando**: pan en modo edit
- **2 dedos**: pinch zoom + pan simultáneo
- **Doble toque**: cerrar polígono · ver detalle de pieza
- **Long‑press (500 ms)**: menú contextual (marcar Std / Esp / Exc)
- **Apple Pencil**: detección automática + indicador + palm rejection
- **Presión** del pencil para variar grosor del trazo
- **Wheel + atajos** en escritorio (P / R / E / D / H / V / +/- / 0 / F / Esc / Enter / ⌘Z / ⌘⇧Z / ⌘S)

### Persistencia
- **Guardar/Cargar JSON** local
- **Auto‑save** cada 30 s en el dispositivo
- **Snapshot undo/redo** de 50 niveles

### Exportación
- **SVG** vectorial
- **DXF** (CAD) con capas separadas: BLOQUE_J*, ESPECIALES, ESTANDAR, SILUETA
- **CSV** con encabezado compatible con el **Manager Cueva**
  (UID, ID, CATEGORIA, USO, LARGO, ANCHO, M2, POSX, POSY, LAYER, LAYER_TYPE)
- **PNG** instantáneo del lienzo

### Importación
- **SVG** (path / polygon / polyline / rect / circle / ellipse)
- **DXF** (entidades LWPOLYLINE)

### UI / UX
- **Layout adaptativo**: 3 columnas en landscape iPad → slide‑over en portrait/móvil
- **Tema claro / oscuro** (auto‑detecta el sistema)
- **Glass‑morphism** en HUD y controles flotantes
- **Hairline borders** estilo iOS · animaciones spring nativas
- **Safe area insets** para notch / barra inferior iPad / iPhone
- **Sin dependencias** — sólo HTML + CSS + JS vanilla

### PWA (offline)
- **Instalable** desde Safari iPad (Compartir → Añadir a inicio) y Chrome/Edge
- **Service worker** cache‑first del app shell
- **Funciona 100 % sin internet** una vez instalada
- **Auto‑update** en cada nueva visita

---

## Instalación rápida

### En iPad / iPhone (Safari)

1. Abre la URL pública del repositorio (GitHub Pages).
2. Pulsa **Compartir** (icono ⬆️ centro inferior).
3. **Añadir a pantalla de inicio**.
4. La app aparece como icono nativo y funciona offline.

### En Android (Chrome) / Escritorio (Chrome / Edge)

1. Abre la URL.
2. En la barra de direcciones aparecerá el icono **Instalar**.
3. Confirma → la app se instala como aplicación nativa.

### En local

Cualquier servidor estático sirve. Por ejemplo:

```bash
# Con Python
cd cueva-code-ipad
python3 -m http.server 8080

# Con Node
npx serve cueva-code-ipad

# Con PHP
php -S localhost:8080 -t cueva-code-ipad
```

Abre **http://localhost:8080**.

> ⚠️ **Importante**: El service worker requiere HTTPS o `localhost`. Abrir
> `index.html` con `file://` funciona pero sin offline‑PWA.

---

## Despliegue en GitHub Pages

1. Sube esta carpeta a un repositorio de GitHub.
2. Settings → Pages → Source: `main` branch · folder `/ (root)`.
3. La PWA quedará disponible en `https://<usuario>.github.io/<repo>/`.

Si tu carpeta `cueva-code-ipad/` está dentro del repositorio (no en la raíz),
ajusta la ruta del service worker o sirve desde subcarpeta:

```yaml
# .github/workflows/pages.yml — opcional
name: Pages
on: { push: { branches: [main] } }
permissions: { pages: write, id-token: write }
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with: { path: 'cueva-code-ipad' }
      - uses: actions/deploy-pages@v4
```

---

## Generar iconos PNG (una sola vez)

Algunos navegadores (especialmente **iOS Safari** para *apple‑touch‑icon*)
prefieren PNG sobre SVG para el icono de pantalla de inicio. El SVG ya está
incluido y funciona como fallback, pero para un mejor pulido:

1. Abre `icons/build.html` en cualquier navegador.
2. Pulsa **📥 Generar y descargar todos los PNG**.
3. Mueve los archivos descargados a la carpeta `icons/`.
4. Haz commit y push.

(El generador usa solo Canvas API del propio navegador, no requiere instalar nada.)

---

## Estructura del repositorio

```
cueva-code-ipad/
├── index.html            ← App single-file (HTML + CSS + JS)
├── manifest.webmanifest  ← PWA manifest
├── sw.js                 ← Service worker (cache-first)
├── icons/
│   ├── icon.svg          ← Icono vectorial maestro
│   ├── build.html        ← Generador de PNG (browser-side)
│   └── icon-*.png        ← (generados con build.html)
├── README.md
├── LICENSE
└── .gitignore
```

---

## Atajos de teclado (escritorio)

| Tecla        | Acción                          |
|--------------|---------------------------------|
| `P`          | Polígono                        |
| `R`          | Rectángulo                      |
| `E`          | Elipse                          |
| `D`          | Pincel (Draw)                   |
| `H`          | Hueco                           |
| `V`          | Editar vértices                 |
| `Enter`      | Cerrar curva                    |
| `Esc`        | Cancelar / cerrar paneles       |
| `+` / `-`    | Zoom in / out                   |
| `0`          | Centrar vista                   |
| `F`          | Ajustar a contenido             |
| `Backspace`  | Deshacer último vértice         |
| `⌘Z` / `Ctrl+Z` | Deshacer                     |
| `⌘⇧Z` / `Ctrl+Y` | Rehacer                    |
| `⌘S` / `Ctrl+S` | Guardar JSON                |

---

## Gestos táctiles

| Gesto                  | Acción                                          |
|------------------------|-------------------------------------------------|
| 1 dedo · tap           | Añadir vértice / seleccionar                   |
| 1 dedo · double-tap    | Cerrar polígono · ver detalle de pieza         |
| 1 dedo · long-press    | Menú contextual                                 |
| 1 dedo · drag (modos no-dibujo) | Pan                                  |
| 2 dedos · pinch        | Zoom                                            |
| 2 dedos · drag         | Pan + zoom simultáneos                         |
| Apple Pencil           | Dibujo de precisión con palm rejection         |

---

## Compatibilidad

| Plataforma                  | Estado     |
|-----------------------------|------------|
| iPad Safari (iOS 14+)       | ✅ Pencil  |
| iPhone Safari (iOS 14+)     | ✅         |
| Android Chrome              | ✅         |
| macOS Safari                | ✅         |
| Chrome / Edge / Firefox     | ✅         |

---

## Roadmap

- [ ] Modo Diseño (muros + zonas) tipo edro-v9
- [ ] Viewer 3D Three.js para revisión de bloques
- [ ] Sincronización con Manager Cueva vía REST
- [ ] Múltiples plantas (floors)
- [ ] Algoritmos de descomposición adicionales (compact / strips / balanced)

---

## Créditos

- **Cueva** — Sistema Operativo de la Construcción
- **Nanca** — creadora del sistema EDRO
- **Prototipos base**: `decompositor_mobile` (móvil) + `dec_v11` (desktop) + `edro-v9` (full)

---

## Licencia

MIT — ver `LICENSE`.
