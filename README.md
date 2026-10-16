# Plug-in para Moodle que mejore la experiencia del gestor del conocimiento y del aprendizaje en la fase 8 del MEDIT

Gestorrea es una extension (plug-in) para Moode que apoya la fase 8 (retroalimentacion, mejora y transformacion) de la Metodologia Campo de Aprendizaje (MCA) del MEDIT

Agrupa en una sola pantalla el desempeño de cada creador de oportunidades en cada resultado esperado de aprendizaje (REA) y permite al gestor del conocimiento y el aprendizaje escribir, editar y guardad la retroalimentacion sin modificar las calificaciones.

## Que hace

- Muestra una tarjeta por cada creador de oportunidades matriculado, con su promedio en los REA 1, 2 y 3.
- Clasifica el nivel de logro de cada REA en 3 niveles de color.
- Permite registrar, editar y guardar la retroalimentacion individual REA.
- Permite buscar y organizar a los creadores de oportunidades.
- No modifica las calificaciones

### Niveles de logro

| Nivel | Promedio | Color |
| :--- | :---: | :---: |
| bajo | 0 - 2,9 | 🔴 |
| medio | 3,0 - 3,9 | 🟡 |
| bueno | 4,0 - 5,0 | 🟢 |

El promedio de cada REA se calcula con las tareas, los cuestionarios y los foros calificados de ese REA. Las actividades con tipo de calificacion "Ninguna" y las actividades "Retroalimentacion REA" no cuentan.

## Requisitos

- Moodle 4.2 o superior.
- Navegador Web recientes (Chrome, Edge, Firefox o Safari).
- Usuarios con permiso "View:gestorrea:view" en el campo de aprendizaje.

## Estructura que debe tener el campo de aprendizaje

Los campos de aprendizaje deben contar con:
- Secciones llamadas "REA 1", "REA 2" y "REA 3", con las actividades calificadas de cada REA.
- Una tarea por REA llamada "Retroalimentacion REA 1", "Retroalimentacion REA 2" y "Retroalimentacion REA 3".
- Actividades (tareas, cuestionarios y foros) con tipo de calificacion **puntuacion**. Las que tienen tipo de califcacion "ninguna" no se tienen en cuenta en el promedio.
- Notas registradas en la escala de 0 a 5. El plug-in usa el valor de la nota tal como esta en Moodle.

## Instalacion

1. Descargar el ZIP de la ultima version desde la pagina principal del repositorio o desde el apartado de "Releases".
2. En Moodle, entre como administrador a Administración del sitio > Complementos > Instalar complementos.
3. Cargue el ZIP, valide e instale.
4. En caso de que el plugin no no se encuentre disponible despues de la instalacion, entonces purgue los cachés para actualizar la base de datos de Moodle.

## Uso

En el campo de aprendizaje, abra el menu **Mas** y haga clic en **Gestor de retroalimentacion REA**.

##Permisos
