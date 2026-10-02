async function obtenerTareasRetroREA(idCurso){
  const resultado = { 1: null, 2: null, 3: null };
  try{
    const datos = await llamarMoodle('mod_assign_get_assignments', { 'courseids[0]': idCurso });
    const datosCurso = (datos.courses && datos.courses[0]) || { assignments: [] };
    (datosCurso.assignments || []).forEach(tarea => {
      const n = numeroRetroREA(tarea.name);
      if(n !== null && resultado[n] !== undefined){
        resultado[n] = tarea.id;
      }
    });
  }catch(error){
    console.error('[retro-assign] ', error);
  }
  return resultado;
}

const Modificacion = {};

async function obtenerComentarioGuardado(idTarea, idUsuario){
  const estado = await llamarMoodle('mod_assign_get_submission_status', {
    assignid: idTarea,
    userid: idUsuario
  });

  const retro = estado.feedback;
  if(!retro) return '';

  if(retro.grade && retro.grade.timemodified){
    Modificacion[idTarea + '-' + idUsuario] = retro.grade.timemodified;
  }

  const complemento = (retro.plugins || []).find(p => p.type === 'comments');
  if(!complemento || !complemento.editorfields || complemento.editorfields.length === 0) return '';

  return complemento.editorfields[0].text || '';
}

function guardarComentario(idTarea, idUsuario, texto){
  return llamarMoodle('mod_assign_save_grade', {
    assignmentid: idTarea,
    userid: idUsuario,
    grade: -1,
    attemptnumber: -1,
    addattempt: 0,
    workflowstate: '',
    applytoall: 0,
    'plugindata[assignfeedbackcomments_editor][text]': texto,
    'plugindata[assignfeedbackcomments_editor][format]': 1,
    'plugindata[files_filemanager]': 0
  });
}
