# SLEPPY - Calculadora de Ciclos de Sueño

SLEPPY es una sencilla pero útil aplicación web diseñada para ayudarte a calcular la mejor hora para despertarte, basándose en la duración típica de los ciclos de sueño. Si alguna vez te has despertado sintiéndote muy cansado a pesar de haber dormido varias horas, es muy probable que hayas interrumpido un ciclo de sueño profundo. Esta herramienta busca evitar exactamente eso.

## ¿Cómo funciona?

La aplicación toma como punto de partida:
1. **La hora a la que te vas a dormir** (por defecto, la hora actual).
2. **El tiempo que normalmente tardas en quedarte dormido** (latencia).

Con estos datos, suma ventanas de tiempo correspondientes a ciclos de sueño completos (que duran aproximadamente entre 80 y 100 minutos cada uno, con un promedio de 90 minutos) y te sugiere las horas óptimas para poner tu alarma.

## Características

- **Cálculo en tiempo real:** Cambia los minutos de latencia o la hora de dormir y los resultados se actualizan al instante.
- **Consejos por ciclo:** Te muestra qué se siente al despertar después de 1 a 6 ciclos completos, destacando los recomendados (5 a 6 ciclos para adultos).
- **Ventanas a evitar:** Te avisa en qué rangos de tiempo es mejor no despertar, ya que podrías interrumpir el sueño profundo.

## Base Científica

Los cálculos de la aplicación se basan en recomendaciones de instituciones de salud y sueño:
- **NHLBI/NIH:** Los ciclos de sueño suelen repetirse cada 80 a 100 minutos.
- **AASM y Sleep Research Society:** Recomiendan 7 a 9 horas de sueño regular para adultos sanos (alrededor de 5 a 6 ciclos completos).
- **Sleep Foundation:** La latencia del sueño (tiempo que se tarda en dormir) suele ser de 10 a 20 minutos para un adulto sano.

## Instalación y Uso

Este es un proyecto puramente estático (Frontend). Para ejecutarlo:
1. Clona el repositorio o descarga los archivos.
2. Abre `index.html` en cualquier navegador web moderno.
3. ¡Listo! No requiere servidor ni base de datos.
