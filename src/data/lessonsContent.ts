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
                text: 'En la música occidental tenemos exactamente 12 notas antes de volver a empezar en una octava superior. Si colocamos estas notas en un círculo, como las horas de un reloj, obtenemos el **círculo cromático**. Matemáticamente, este reloj no es solo una metáfora: se comporta exactamente como la aritmética modular de módulo 12 (Z₁₂).'
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
                text: 'En este modelo, cualquier intervalo musical (la distancia entre dos notas) se convierte simplemente en una longitud de arco. Una octava es un giro completo de 360 grados (12 semitonos), y el temido tritono —el intervalo más inestable de la música— es exactamente media vuelta (6 semitonos), cortando el círculo en dos mitades perfectas.'
            },
            {
                type: 'callout',
                variant: 'info',
                text: 'A diferencia de un piano, donde el teclado parece infinito y lineal, el reloj cromático nos revela la verdadera naturaleza de la música: es un bucle cerrado. Al llegar a la nota 12, no vamos a un "lugar nuevo", sino que volvemos al inicio.'
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
                text: 'Si tocas notas separadas por una distancia simétrica perfecta de 4 semitonos (terceras mayores), obtienes una secuencia matemática cerrada:'
            },
            { type: 'list', items: ['Do (0) → Mi (4) → Sol# (8) → Do (12/0)'] },
            {
                type: 'paragraph',
                text: 'Al conectar estos puntos en el reloj, dibujas un **triángulo equilátero perfecto**. Al no tener ninguna asimetría, el oído humano no puede identificar cuál es la tónica o "centro de gravedad". Por eso, el acorde aumentado suena suspendido, misterioso y flotante: nunca sabemos cuándo o dónde aterrizar.'
            },
            {
                type: 'circle',
                config: { kind: 'chord', shapeId: 'aug', root: 0, mode: 'chromatic' },
                caption: 'Tríada Aumentada (Do Aum)'
            },
            { type: 'heading', level: 3, text: 'Séptima Disminuida: El Cuadrado Perfecto' },
            {
                type: 'paragraph',
                text: 'Si en lugar de 4 semitonos apilamos intervalos de 3 semitonos (terceras menores), el patrón cierra después de cuatro notas:'
            },
            { type: 'list', items: ['Do (0) → Mib (3) → Fa# (6) → La (9) → Do (12/0)'] },
            {
                type: 'paragraph',
                text: 'Obtienes un **cuadrado perfecto**. Esta simetría absoluta hace que el acorde sea increíblemente inestable y maleable. Geométricamente, puede "rotar" y resolver en cuatro direcciones distintas. Es el acorde de tensión por excelencia en el cine clásico de suspenso y terror.'
            },
            {
                type: 'circle',
                config: { kind: 'chord', shapeId: 'dim7', root: 0, mode: 'chromatic' },
                caption: 'Séptima Disminuida (Do Dim7)'
            },
            { type: 'heading', level: 3, text: 'Tríada Mayor vs. Menor: El Espejo Quiral' },
            {
                type: 'paragraph',
                text: 'Aquí ocurre uno de los fenómenos más hermosos de la acústica musical. Observemos las distancias internas de las tríadas básicas:'
            },
            {
                type: 'list',
                items: [
                    'Tríada Mayor (Do - Mi - Sol): Puntos 0, 4 y 7. La distancia es 4 semitonos (Do a Mi) y luego 3 semitonos (Mi a Sol). Forma un triángulo asimétrico.',
                    'Tríada Menor (Do - Mib - Sol): Puntos 0, 3 y 7. La distancia se invierte: 3 semitonos (Do a Mib) y 4 semitonos (Mib a Sol).'
                ]
            },
            {
                type: 'paragraph',
                text: 'Si dibujas ambos triángulos en el mismo círculo, notarás que el acorde menor es el **reflejo exacto en el espejo** del acorde mayor. El eje de simetría cruza el círculo entre las notas 3 y 4, y su opuesto entre el 9 y el 10. Esta propiedad de no poder superponerse con su propio reflejo se llama *quiralidad*.'
            },
            {
                type: 'callout',
                variant: 'tip',
                text: 'Regla de oro geométrica: Tu cerebro traduce esta simetría refleja como dos caras de la misma moneda. El "brillo" de la tríada mayor y la "melancolía" de la menor no son más que objetos geométricos zurdos y diestros.'
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
                text: 'Cuando un cantante te pide "subir la canción un tono" (transposición), geométricamente no estás alterando la estructura musical: solo la estás **rotando** sobre su eje.'
            },
            {
                type: 'paragraph',
                text: 'Si tienes el triángulo de Do Mayor (puntos 0, 4, 7) y lo rotas 2 horas en el sentido de las agujas del reloj, obtienes el triángulo de Re Mayor (puntos 2, 6, 9). El polígono mantiene exactamente las mismas proporciones y ángulos internos, pero su posición espacial ha cambiado.'
            },
            {
                type: 'callout',
                variant: 'info',
                text: 'Este es el secreto de los instrumentos transpositores (como el saxofón o la trompeta) y de las cejillas en la guitarra (capo): no cambian la "forma" de la música, solo la rotan hacia una nueva zona del reloj para adaptarse a la comodidad del intérprete.'
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
                text: 'En el reloj cromático, las notas adyacentes están a un semitono de distancia (muy disonantes). Sin embargo, en la música, el intervalo más estable y consonante (después de la octava) es la **quinta justa**, que equivale a un salto de 7 semitonos.'
            },
            {
                type: 'paragraph',
                text: '¿Qué pasa si rediseñamos nuestro reloj para que, en lugar de avanzar de 1 en 1, avancemos de 7 en 7? Matemáticamente, estamos multiplicando por 7 en nuestra aritmética modular: x ↦ 7x (mod 12).'
            },
            {
                type: 'paragraph',
                text: 'Como el máximo común divisor de 7 y 12 es 1, esta operación es un "isomorfismo": un cambio de coordenadas que nos permite pasar por las 12 notas sin repetir ninguna. Si empezamos en Do (0) y avanzamos de 7 en 7 obtenemos la famosa sucesión:'
            },
            {
                type: 'list',
                items: ['Do (0) → Sol (7) → Re (2) → La (9) → Mi (4) → Si (11) → Fa# (6) → Do# (1) → Sol# (8) → Re# (3) → La# (10) → Fa (5) → Do']
            },
            {
                type: 'callout',
                variant: 'tip',
                text: 'Lo maravilloso de este nuevo mapa es que la "distancia física" en el círculo ahora equivale a "afinidad armónica". Las notas adyacentes comparten muchas frecuencias y suenan estables juntas. Las que están en extremos opuestos (como Do y Fa#, el tritono) generan fricción y conflicto acústico.'
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
                text: '¿Por qué la escala mayor tiene 7 notas y no 5, 8 o 10? ¿Y por qué esos intervalos específicos? La respuesta viene de un concepto matemático llamado **Máxima Regularidad** (Maximal Evenness).'
            },
            {
                type: 'paragraph',
                text: 'Imagina que tienes un pastel redondo (nuestro círculo de 12 notas) y quieres colocar 7 velas de la manera más equidistante y simétrica posible. Como 12 no es divisible entre 7, es imposible lograr una simetría perfecta.'
            },
            {
                type: 'paragraph',
                text: 'Sin embargo, la matemática nos permite encontrar la distribución óptima para esparcir esos puntos. Si haces este cálculo, el patrón de pasos que obtienes es exactamente: 2 - 2 - 1 - 2 - 2 - 2 - 1 (Tono - Tono - Semitono - Tono - Tono - Tono - Semitono). ¡Esta es la estructura exacta de la Escala Mayor!'
            },
            {
                type: 'paragraph',
                text: 'Si proyectas la escala mayor de Do (Do, Re, Mi, Fa, Sol, La, Si) en el Círculo de Quintas, ocurre magia: se convierte en un **bloque continuo de 7 notas consecutivas** [Fa - Do - Sol - Re - La - Mi - Si]. Una escala diatónica es, geométricamente, una "rebanada" contigua en el Círculo de Quintas. Esta es la razón profunda de su cohesión y belleza.'
            },
            {
                type: 'callout',
                variant: 'info',
                text: '¿Y la escala menor? La escala menor natural no es más que otra rebanada de 7 velas en el mismo pastel, pero empezando desde un punto diferente: [La - Mi - Si - Fa# - Do# - Sol# - Re#]. Es la misma forma geométrica, desplazada.'
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
                text: 'Cuando cambias de tonalidad (por ejemplo, de Do Mayor a Sol Mayor), estás **deslizando esa "rebanada"** de 7 notas un paso hacia la derecha en el Círculo de Quintas:'
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
                text: 'Al rotar la rebanada un paso a la derecha, "perdemos" el Fa natural por la izquierda y "ganamos" el Fa# por la derecha. ¡Por eso Sol Mayor tiene exactamente un sostenido en su armadura! Si rotas dos pasos (Re Mayor), ganas otro sostenido (Do#), y así sucesivamente.'
            },
            {
                type: 'callout',
                variant: 'tip',
                text: 'La dualidad Sostenidos/Bemoles: Si rotamos la rebanada hacia la izquierda (hacia Fa, Sib, Mib), el proceso se invierte. En lugar de sumar sostenidos por la derecha, sumamos bemoles por la izquierda. Las armaduras de clave en el pentagrama son, literalmente, un mapa de cuántos grados has rotado tu polígono en el círculo.'
            },
            {
                type: 'paragraph',
                text: 'Las armaduras no son reglas arbitrarias inventadas por compositores aburridos; son la forma gráfica de representar un desplazamiento geométrico en el espacio modular.'
            },
            {
                type: 'circle',
                config: { kind: 'scale', shapeId: 'major', root: 0, mode: 'fifths' },
                caption: 'Escala de Do Mayor (0 alteraciones)'
            },
            {
                type: 'circle',
                config: { kind: 'scale', shapeId: 'major', root: 7, mode: 'fifths' },
                caption: 'Escala de Sol Mayor (+1 sostenido)'
            }
        ]
    }
];
