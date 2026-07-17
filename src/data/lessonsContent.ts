export interface CircleConfig {
    kind: 'chord' | 'scale';
    shapeId: string;
    root: number;
    mode: 'chromatic' | 'fifths';
    showMirror?: boolean;
}

// Escalas que forman un bloque contiguo en el círculo de quintas
export const DIATONIC_SCALE_IDS = new Set(['major', 'minor']);

export type LessonBlock =
| { type: 'heading'; level: 2 | 3; text: string }
| { type: 'paragraph'; text: string }
| { type: 'list'; items: string[] }
| { type: 'circle'; config: CircleConfig; caption?: string }
| { type: 'callout'; variant: 'info' | 'tip'; text: string };

export interface LessonChapter {
    id: string;
    title: string;
    subtitle: string;
    blocks: LessonBlock[];
}

export const LESSONS: LessonChapter[] = [
    {
        id: 'reloj-cromatico',
        title: '1. El Reloj Cromático',
        subtitle: 'El Espacio de Trabajo Modular (Z₁₂)',
        blocks: [
            {
                type: 'paragraph',
                text: 'En nuestra música occidental tenemos 12 notas antes de volver a empezar en una octava superior. Si las colocamos en un círculo como las horas de un reloj, obtenemos el círculo cromático. Matemáticamente, este círculo se comporta exactamente como la aritmética modular de módulo 12 (Z₁₂):'
            },
            {
                type: 'list',
                items: [
                    'Do (C) se sitúa a las 12:00 (punto 0).',
                    'Do# (C#) a la 1:00 (punto 1).',
                    'Re (D) a las 2:00 (punto 2)... y así sucesivamente hasta Si (B) a las 11:00 (punto 11).'
                ]
            },
            {
                type: 'paragraph',
                text: 'Cualquier intervalo musical (la distancia entre dos notas) es simplemente una distancia angular o longitud de arco en este reloj. Una octava es un giro completo (12 semitonos) y un tritono (el intervalo más tenso de la música) es exactamente media vuelta (6 semitonos), dividiendo el círculo a la mitad.'
            },
            {
                type: 'circle',
                config: { kind: 'chord', shapeId: 'maj', root: 0, mode: 'chromatic' },
                caption: 'Nota Do (C) en el Reloj'
            }
        ]
    },
{
    id: 'acordes-poligonos',
    title: '2. Acordes como Polígonos',
    subtitle: 'Cómo la geometría define la consonancia y disonancia',
    blocks: [
        { type: 'heading', level: 3, text: 'Tríada Aumentada: El Triángulo Equilátero' },
        {
            type: 'paragraph',
            text: 'Si tocas notas separadas por una distancia simétrica perfecta de 4 semitonos (terceras mayores), obtienes:'
        },
        { type: 'list', items: ['Do (0) → Mi (4) → Sol# (8) → Do (12/0)'] },
        {
            type: 'paragraph',
            text: 'Al conectar estos puntos, dibujas un triángulo equilátero perfecto. Al no tener asimetrías, tu cerebro no puede identificar una tónica o "centro de gravedad" claro. Es por eso que el acorde aumentado suena suspendido, misterioso y flotante.'
        },
        {
            type: 'circle',
            config: { kind: 'chord', shapeId: 'aug', root: 0, mode: 'chromatic' },
            caption: 'Tríada Aumentada (Do Aum)'
        },
        { type: 'heading', level: 3, text: 'Séptima Disminuida: El Cuadrado Perfecto' },
        {
            type: 'paragraph',
            text: 'Si apilas intervalos de 3 semitonos (terceras menores):'
        },
        { type: 'list', items: ['Do (0) → Mib (3) → Fa# (6) → La (9) → Do (12/0)'] },
        {
            type: 'paragraph',
            text: 'Obtienes un cuadrado perfecto. Esta simetría absoluta hace que el acorde sea increíblemente inestable y maleable: puede resolver y "viajar" en cuatro direcciones simétricas distintas. Es el acorde de tensión por excelencia en el cine clásico.'
        },
        {
            type: 'circle',
            config: { kind: 'chord', shapeId: 'dim7', root: 0, mode: 'chromatic' },
            caption: 'Séptima Disminuida (Do Dim7)'
        },
        { type: 'heading', level: 3, text: 'Tríada Mayor vs. Tríada Menor: El Espejo Quiral' },
        {
            type: 'paragraph',
            text: 'Aquí ocurre uno de los fenómenos más hermosos de la física musical:'
        },
        {
            type: 'list',
            items: [
                'Tríada Mayor (Do - Mi - Sol): Puntos 0, 4 y 7 en el reloj. La distancia interna es de 4 semitonos (Do a Mi) y 3 semitonos (Mi a Sol). Esto forma un triángulo escaleno asimétrico.',
                'Tríada Menor (Do - Mib - Sol): Puntos 0, 3 y 7 en el reloj. La distancia interna es de 3 semitonos (Do a Mib) y 4 semitonos (Mib a Sol).'
            ]
        },
        {
            type: 'paragraph',
            text: 'Si dibujas ambos triángulos en el círculo, notarás que el acorde menor es el reflejo exacto en el espejo del acorde mayor bajo una inversión musical (I₇). El eje de simetría cruza el círculo entre las notas 3 y 4 (Do# y Re) y su opuesto entre Sol# y La. Esta propiedad de no ser superponible con su reflejo se llama quiralidad. Tu cerebro traduce esta simetría refleja como dos caras de la misma moneda: el brillo/alegría de la tríada mayor frente a la melancolía de la menor.'
        },
        {
            type: 'circle',
            config: { kind: 'chord', shapeId: 'maj', root: 0, mode: 'chromatic', showMirror: true },
            caption: 'Espejo Quiral: Do Mayor vs Menor'
        }
    ]
},
{
    id: 'transposicion-rotacion',
    title: '3. La Transposición es una Rotación',
    subtitle: 'Movimiento espacial dentro del círculo',
    blocks: [
        {
            type: 'paragraph',
            text: 'Cuando un cantante te pide "subir la canción un tono" (transposición), geométricamente no estás cambiando la estructura, solo la estás rotando.'
        },
        {
            type: 'paragraph',
            text: 'Si tienes el triángulo de Do Mayor (0, 4, 7) y lo rotas 2 horas a la derecha en el sentido de las agujas del reloj, obtienes el triángulo de Re Mayor (2, 6, 9). El polígono mantiene exactamente las mismas proporciones e intervalos, pero su orientación espacial ha cambiado.'
        },
        {
            type: 'circle',
            config: { kind: 'chord', shapeId: 'maj', root: 0, mode: 'chromatic' },
            caption: 'Do Mayor (posición original)'
        },
        {
            type: 'circle',
            config: { kind: 'chord', shapeId: 'maj', root: 2, mode: 'chromatic' },
            caption: 'Re Mayor (rotado 2 horas)'
        }
    ]
},
{
    id: 'circulo-quintas',
    title: '4. El Círculo de Quintas',
    subtitle: 'Un Cambio de Coordenadas Geométrico',
    blocks: [
        {
            type: 'paragraph',
            text: 'En el reloj cromático, las notas adyacentes están a un semitono de distancia. Pero en la música, el intervalo más estable y consonante (después de la octava) es la quinta justa, que equivale a un salto de 7 semitonos.'
        },
        {
            type: 'paragraph',
            text: '¿Qué pasa si rediseñamos nuestro reloj para que, en lugar de avanzar de 1 en 1, avancemos de 7 en 7? Matemáticamente, estamos multiplicando por 7 en nuestra aritmética modular de módulo 12: x ↦ 7x (mod 12).'
        },
        {
            type: 'paragraph',
            text: 'Como el máximo común divisor de 7 y 12 es 1, esta operación es un isomorfismo: pasaremos exactamente por las 12 notas sin repetir ninguna. Si empezamos en Do (0) y avanzamos de 7 en 7 obtenemos:'
        },
        {
            type: 'list',
            items: ['Do (0) → Sol (7) → Re (2) → La (9) → Mi (4) → Si (11) → Fa# (6) → Do# (1) → Sol# (8) → Re# (3) → La# (10) → Fa (5) → Do']
        },
        {
            type: 'paragraph',
            text: 'Lo maravilloso de este nuevo "mapa" es que la distancia física en el círculo ahora representa la afinidad armónica. Las notas adyacentes suenan extremadamente bien juntas, mientras que las que están en extremos opuestos (como Do y Fa#) entran en conflicto.'
        },
        {
            type: 'circle',
            config: { kind: 'chord', shapeId: 'maj', root: 0, mode: 'fifths' },
            caption: 'Mapa en Quintas: Do Mayor'
        }
    ]
},
{
    id: 'maxima-regularidad',
    title: '5. Escalas y "Máxima Regularidad"',
    subtitle: 'Velas distribuidas en el pastel musical',
    blocks: [
        {
            type: 'paragraph',
            text: '¿Por qué la escala mayor tiene 7 notas y no 5, 8 o 10? ¿Y por qué son esas notas específicas? La geometría tiene la respuesta a través de un concepto llamado Máxima Regularidad (Maximal Evenness).'
        },
        {
            type: 'paragraph',
            text: 'Imagina que tienes un pastel redondo (nuestro círculo de 12 notas) y quieres colocar 7 velas de la manera más distribuida y simétrica posible. Como 12 no es divisible entre 7, no puedes lograr una simetría perfecta.'
        },
        {
            type: 'paragraph',
            text: 'Sin embargo, puedes intentar que estén lo más esparcidas posible. Si haces el cálculo para distribuir 7 puntos en 12 espacios de forma óptima, el patrón de pasos que obtienes es exactamente: 2 - 2 - 1 - 2 - 2 - 2 - 1 (Tono - Tono - Semitono - Tono - Tono - Tono - Semitono). ¡Esta es la estructura de la Escala Mayor!'
        },
        {
            type: 'paragraph',
            text: 'Si proyectas la escala mayor de Do (Do, Re, Mi, Fa, Sol, La, Si) en el Círculo de Quintas, se convierte en un bloque continuo de 7 notas consecutivas: [Fa - Do - Sol - Re - La - Mi - Si].'
        },
        {
            type: 'paragraph',
            text: 'Una escala diatónica es, geométricamente, una "rebanada" continua en el Círculo de Quintas. Esta es la razón de su cohesión y belleza.'
        },
        {
            type: 'circle',
            config: { kind: 'scale', shapeId: 'major', root: 0, mode: 'fifths' },
            caption: 'Escala Mayor en Quintas'
        }
    ]
},
{
    id: 'armaduras-clave',
    title: '6. Armaduras: Rotación y Mutación',
    subtitle: 'Desplazando la rebanada geométrica',
    blocks: [
        {
            type: 'paragraph',
            text: 'Cuando cambias de tonalidad (de Do Mayor a Sol Mayor), estás deslizando esa "rebanada" de 7 notas un paso hacia la derecha en el Círculo de Quintas:'
        },
        {
            type: 'list',
            items: [
                'Escala de Do Mayor: [Fa - Do - Sol - Re - La - Mi - Si]',
                'Escala de Sol Mayor: [Do - Sol - Re - La - Mi - Si - Fa#]'
            ]
        },
        {
            type: 'paragraph',
            text: 'Al rotar la rebanada un paso a la derecha, "perdemos" el Fa por la izquierda y "ganamos" el Fa# por la derecha. ¡Por eso Sol Mayor tiene exactamente un sostenido (Fa#)!'
        },
        {
            type: 'paragraph',
            text: 'Si rotas dos pasos a la derecha (Re Mayor), ganas otro sostenido (Do#), teniendo ahora dos. Las armaduras de clave no son más que un registro de cuántos pasos has rotado tu rebanada geométrica.'
        },
        {
            type: 'circle',
            config: { kind: 'scale', shapeId: 'major', root: 0, mode: 'fifths' },
            caption: 'Escala de Do Mayor (0 sostenidos)'
        },
        {
            type: 'circle',
            config: { kind: 'scale', shapeId: 'major', root: 7, mode: 'fifths' },
            caption: 'Escala de Sol Mayor (+1 sostenido)'
        }
    ]
}
];
