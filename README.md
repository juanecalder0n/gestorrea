# Plug-in para Moodle que mejora la experiencia del gestor en la fase 8 de la Metodología Campo de Aprendizaje

Extensión (plug-in) local para Moodle que apoya la **fase 8** (retroalimentación, mejora y transformación) de la Metodología Campo de Aprendizaje (MCA) del MEDIT.

Reúne en una sola pantalla el desempeño de cada creador de oportunidades por resultado esperado de aprendizaje (REA) y permite al gestor del conocimiento y del aprendizaje escribir, editar y guardar la retroalimentación **sin modificar las calificaciones**.

## Qué hace

- Muestra una tarjeta por cada creador de oportunidades matriculado, con su promedio en los REA 1, 2 y 3.
- Clasifica el desempeño de cada REA en tres niveles de color.
- Permite registrar, editar y guardar la retroalimentación individual de cada REA.
- Permite buscar, ordenar y filtrar a los creadores de oportunidades.

### Niveles de desempeño

| Nivel | Promedio | Color |
|-------|----------|-------|
| Bajo  | 0 - 2,9  | 🔴 |
| Medio | 3,0 - 3,9 | 🟡 |
| Bueno | 4,0 - 5,0 | 🟢 |

El promedio de cada REA se calcula con las tareas, los cuestionarios y los foros calificados de ese REA. No cuentan las actividades con tipo de calificación "Ninguna" ni las actividades "Retroalimentación REA".

## Requisitos

- Moodle 4.2 o superior.
- Navegador reciente (Chrome, Edge, Firefox o Safari).
- Usuarios con el permiso `local/gestorrea:view` en el campo de aprendizaje.

## Estructura del campo de aprendizaje

El campo debe tener:

- Secciones llamadas **REA 1**, **REA 2** y **REA 3**, con las actividades calificadas de cada REA.
- Una tarea por REA llamada **Retroalimentación REA 1**, **Retroalimentación REA 2** y **Retroalimentación REA 3**.
- Actividades (tareas, cuestionarios y foros) con tipo de calificación **Puntuación**.
- Notas en escala de 0 a 5. El plug-in usa el valor tal como está en Moodle.

## Instalación

1. Descargue el ZIP de la última versión desde la sección **Releases** del repositorio.
2. En Moodle, entre como administrador a **Administración del sitio > Extensiones > Instalar complementos**.
3. Cargue el ZIP, valide e instale.
4. Si el plug-in no aparece después de instalarlo, purgue los cachés desde **Administración del sitio > Desarrollo > Purgar cachés**.

## Uso

En el campo de aprendizaje, abra el menú **Más** y haga clic en **Gestor de retroalimentación REA**.

## Permisos

El acceso se controla con la capacidad `local/gestorrea:view` ("Usar el gestor de retroalimentación REA"). Por defecto la tienen los roles Profesor y Profesor con permiso de edición. El estudiante no debe tenerla.

Para activarla en otro rol, vaya a **Administración del sitio > Usuarios > Permisos > Definir roles**, elija el rol (por ejemplo, Teacher-CADI) y permita `local/gestorrea:view`.

## Seguridad

- Cada solicitud valida la sesión, el `sesskey` y el permiso en el campo.
- Solo se permiten seis funciones de Moodle, definidas en una lista.
- No se usa ningún token de Moodle.

## Limitaciones conocidas

- Soporta tres REA por campo de aprendizaje.
- Asume que las notas están en escala de 0 a 5.
- El borrador de la retroalimentación solo se conserva mientras la pantalla permanece abierta.

