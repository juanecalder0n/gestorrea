const TIPOS_PARA_PROMEDIO = ['assign', 'quiz', 'forum'];

async function obtenerActividadesPorREA(idCurso){
  const resultado = { 1: [], 2: [], 3: [] };
  try{
    const secciones = await llamarMoodle('core_course_get_contents', { courseid: idCurso });
    secciones.forEach(seccion => {
      const coincidencia = normalizarNombre(seccion.name).match(/^REA ?(\d+)$/);
      const reaSeccion = coincidencia ? Number(coincidencia[1]) : null;

      (seccion.modules || []).forEach(modulo => {
        if(!TIPOS_PARA_PROMEDIO.includes(modulo.modname)) return;
        if(numeroRetroREA(modulo.name) !== null) return;

        const n = numeroREAdeActividad(modulo.name) ?? reaSeccion;
        if(!resultado[n]) return;
        if(resultado[n].some(a => a.modname === modulo.modname && a.instance === modulo.instance)) return;

        resultado[n].push({ modname: modulo.modname, instance: modulo.instance, name: modulo.name });
      });
    });
  }catch(error){
    console.error('[actividades] ', error);
  }
  return resultado;
}

async function obtenerPromediosPorREA(idCurso, idUsuario, actividadesPorREA){
  const resultado = { 1: null, 2: null, 3: null };
  try{
    const respuesta = await llamarMoodle('gradereport_user_get_grade_items', {
      courseid: idCurso,
      userid: idUsuario
    });
    const elementos = (respuesta.usergrades && respuesta.usergrades[0] && respuesta.usergrades[0].gradeitems) || [];

    const notasPorActividad = {};
    elementos.forEach(elemento => {
      if(elemento.itemtype === 'mod'){
        const clave = elemento.itemmodule + ':' + elemento.iteminstance;
        notasPorActividad[clave] = (elemento.graderaw !== null && elemento.graderaw !== undefined) ? parseFloat(elemento.graderaw) : null;
      }
    });

    for(let n = 1; n <= 3; n++){
      const actividades = actividadesPorREA[n] || [];
      if(actividades.length === 0) continue;

      let completo = true;
      const suma = actividades.reduce((acumulado, actividad) => {
        const nota = notasPorActividad[actividad.modname + ':' + actividad.instance];
        if(nota === null || nota === undefined){
          completo = false;
          return acumulado;
        }
        return acumulado + nota;
      }, 0);

      resultado[n] = {
        valor: suma / actividades.length,
        completo: completo,
        detalle: actividades.map(actividad => ({
          nombre: actividad.name, nota: notasPorActividad[actividad.modname + ':' + actividad.instance]
        }))
      };
    }
  }catch(error){
    console.error('[promedios] userId=' + idUsuario, error);
  }
  return resultado;
}
