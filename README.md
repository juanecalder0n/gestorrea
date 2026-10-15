# Plug-in para Moodle que mejora la experiencia del gestor del conocimiento y del aprendizaje en la fase 8 del MEDIT

Gestorrea es una extensión (plug-in) para Moodle que apoya la fase 8 (retroalimentación, mejora y transformación) de la Metodología Campo de Aprendizaje (MCA) del MEDIT.

Agrupa en una sola pantalla el desempeño de cada creador de oportunidades en cada resultado esperado de aprendizaje (REA) y permite al gestor del conocimiento y el aprendizaje escribir, editar y guardar la retroalimentación sin modificar las calificaciones.

## Qué hace

- Muestra una tarjeta por cada creador de oportunidades matriculado, con su promedio en los REA 1, 2 y 3.
- Clasifica el nivel de logro de cada REA en 3 niveles de color.
- Permite registrar, editar y guardar la retroalimentación individual REA.
- Permite buscar y organizar a los creadores de oportunidades.
- No modifica las calificaciones.

### Niveles de logro
| Nivel | Promedio | Color |
|---|---|---|
| Bajo | De 0 a 2,9 | Rojo |
| Medio| De 3 a 3,9 | Amarillo |
| Bueno | De 4 a 5 | Verde |

El promedio de cada REA se calcula con las tareas, los cuestionarios y los foros calificados de ese REA. Las actividades con tipo de calificación "Ninguna" y la tarea "Retroalimentación REA" no cuentan. 

## Requisitos
- Moodle 4.2 o superior
- Navegador reciente (Chrome, Edge, Firefox o Safari)
- Usuario con permisos "View/gestorrea:view" en el campo de aprendizaje.

## Estructura que debe tener el campo de aprendizaje

Los campos de aprendizaje deben contar con:
- Secciones llamadas `REA 1`, `REA 2` y `REA 3`, con las actividades calificadas de cada REA.
- Una tarea por REA llamada `Retroalimentación REA 1`, `Retroalimentación REA 2` y `Retroalimentación REA 3`.
- Actividades (tareas, cuestionarios y foros) con tipo de calificación **Puntuación**. Las que tienen tipo de calificación "Ninguna" no se tienen en cuenta en el promedio.
- Notas registradas en la escala de 0 a 5. El plug-in usa el valor de la nota tal como está en Moodle.

## Instalación

1. Descargue el ZIP de la ultima version desde la seccion de releases "Releases".
2. En Moodle, entre como administrador a Administración del sitio > Complementos > Instalar complementos.
3. Cargue el ZIP, valide e instale.
4. En caso de que el plugin no aprezca entonces purgue las cachés.


## Uso

En el campo de aprendizaje, abra el menú **Más** y haga clic en **Gestor de retroalimentación REA**.

## Permisos

El acceso se controla con `local/gestorrea:view` ("Usar el gestor de retroalimentación REA"). Por defecto lo tienen los roles basados en Profesor y Profesor con permiso de edición. El estudiante no debe tenerlo.

## Seguridad

- Las solicitudes validan la sesión, el `sesskey` y el permiso en el campo.
- Solo se permiten seis funciones de Moodle, definidas en una lista.
- No se usa ningún token de Moodle.

## Limitaciones conocidas

- Soporta tres REA por campo de aprendizaje.
- Asume que las notas están en escala de 0 a 5.
- El promedio de un REA incompleto es provisional.
- El borrador de la retroalimentación solo se conserva mientras la pantalla permanece abierta.
- No tiene pruebas automáticas y está en estado beta.


