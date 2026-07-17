# Geometría Musical — Contexto para IA

## Descripción del proyecto

Visualizador interactivo de teoría musical como geometría en Z₁₂.
Acordes y escalas se representan como polígonos en un círculo cromático.
Stack: React 19 + TypeScript + Vite + Tone.js + Tailwind v4.

## Archivos clave para modificar lecciones

Solo necesitas tocar **un archivo** para cambiar, agregar o mejorar el contenido educativo:

```
src/data/lessonsContent.ts  ← TODO el contenido de las lecciones está aquí
```

El resto del código (componentes, lógica de audio, teoría) **no necesita modificarse** para cambiar textos.

## Estructura de una lección

```typescript
// Cada lección es un capítulo con bloques
{
  id: 'identificador-unico',
  title: '1. Título del Capítulo',
  subtitle: 'Subtítulo descriptivo',
  blocks: [
    // Los bloques se renderizan en orden. Tipos disponibles:
    { type: 'heading', level: 2 | 3, text: 'Texto del título' },
    { type: 'paragraph', text: 'Texto del párrafo. Usa \\n para saltos de línea.' },
    { type: 'list', items: ['Item 1', 'Item 2'] },
    {
      type: 'circle',
      config: {
        kind: 'chord' | 'scale',
        shapeId: 'maj' | 'min' | 'aug' | 'dim' | 'dim7' | 'maj7' | 'major' | 'minor' | 'penta' | 'whole',
        root: 0,          // 0=Do, 1=Do#, 2=Re, ... 11=Si
        mode: 'chromatic' | 'fifths',
        showMirror?: true // opcional, solo para acordes
      },
      caption?: 'Texto opcional bajo el círculo'
    },
    { type: 'callout', variant: 'info' | 'tip', text: 'Mensaje destacado' }
  ]
}
```

## Formas disponibles (shapeId)

| shapeId | Tipo | Descripción |
|---------|------|-------------|
| `maj` | chord | Tríada Mayor [0,4,7] |
| `min` | chord | Tríada Menor [0,3,7] |
| `aug` | chord | Tríada Aumentada [0,4,8] |
| `dim` | chord | Tríada Disminuida [0,3,6] |
| `dim7` | chord | Séptima Disminuida [0,3,6,9] |
| `maj7` | chord | Séptima Mayor [0,4,7,11] |
| `major` | scale | Escala Mayor [0,2,4,5,7,9,11] |
| `minor` | scale | Escala Menor Natural [0,2,3,5,7,8,10] |
| `penta` | scale | Pentatónica Mayor [0,2,4,7,9] |
| `whole` | scale | Escala de Tonos Enteros [0,2,4,6,8,10] |

## Tónicas (root)

`0`=Do, `1`=Do#, `2`=Re, `3`=Re#, `4`=Mi, `5`=Fa, `6`=Fa#, `7`=Sol, `8`=Sol#, `9`=La, `10`=La#, `11`=Si

## Consejos para mejorar contenido

1. Cada bloque `type: 'circle'` genera un círculo interactivo con botones de "Escuchar" y "Arpegiar". El estudiante puede experimentar con cada concepto visual y sonoramente.
2. Usá bloques `heading` nivel 3 para sub-secciones dentro de un capítulo.
3. Usá `callout variant: 'info'` para notas teóricas importantes y `variant: 'tip'` para sugerencias prácticas.
4. Las explicaciones deben ser autónomas (cada capítulo se lee independientemente).
5. Relacioná conceptos visuales (polígonos, simetría, rotación) con su efecto sonoro.
6. Máximo 6-8 bloques por capítulo para no saturar visualmente.
7. El capítulo 1 (reloj cromático) es la base conceptual — debe explicar Z₁₂, intervalos como ángulos.

## Para probar cambios

```bash
npm run dev    # Servidor local en http://localhost:5173
```

Solo modificar `src/data/lessonsContent.ts` — el hot-reload de Vite aplica los cambios automáticamente.
