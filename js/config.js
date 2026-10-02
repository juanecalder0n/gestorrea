const GESTOR = window.GESTOR_REA;

async function llamarMoodle(funcion, parametros = {}){
  const cuerpo = new URLSearchParams({
    sesskey: GESTOR.sesskey,
    gestor_curso: GESTOR.curso.id,
    gestor_fn: funcion
  });
  Object.entries(parametros).forEach(([clave, valor]) => cuerpo.append(clave, valor));

  const respuesta = await fetch(GESTOR.ajaxurl, {
    method: 'POST',
    body: cuerpo,
    credentials: 'same-origin'
  });
  const datos = await respuesta.json();
  if(datos && (datos.exception || datos.error)){
    throw new Error(datos.message || datos.error || datos.errorcode);
  }
  return datos;
}
