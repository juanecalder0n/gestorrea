async function cargarParticipantes(){
  const curso = GESTOR.curso;
  const contenedor = document.getElementById('listaParticipantes');

  document.getElementById('tituloCurso').textContent = obtenerTituloCurso(curso).nombre;
  document.getElementById('tituloGrupo').textContent = nombreGrupoCurso(curso);

  contenedor.innerHTML = '<p class="mensaje-gestor">Cargando participantes...</p>';

  try{
    const usuarios = await llamarMoodle('core_enrol_get_enrolled_users', { courseid: curso.id });
    const estudiantes = usuarios.filter(estudiante =>
      Array.isArray(estudiante.roles) && estudiante.roles.some(r => r.shortname === 'student')
    );

    contenedor.innerHTML = '';
    if(estudiantes.length === 0){
      contenedor.innerHTML = '<p class="mensaje-gestor">Este curso no tiene estudiantes.</p>';
      return;
    }

    const [actividadesPorREA, tareasRetroREA] = await Promise.all([
      obtenerActividadesPorREA(curso.id),
      obtenerTareasRetroREA(curso.id)
    ]);

    for(const estudiante of estudiantes){
      const promediosRea = await obtenerPromediosPorREA(curso.id, estudiante.id, actividadesPorREA);

      const celdasRea = [1, 2, 3].map(n => {
        const infoRea = promediosRea[n];
        const clase = infoRea ? claseColorREA(infoRea.valor, infoRea.completo) : '';
        const texto = infoRea ? formatearNota(infoRea.valor) : '-';
        const detalle = (infoRea && infoRea.detalle) || [];
        const total = detalle.length;
        const calificadas = detalle.filter(a => a.nota !== null && a.nota !== undefined).length;
        const progreso = total > 0 ? `<span class="rea-progreso">${calificadas}/${total}</span>` : '';

        return `
            <div class="rea">
              <div class="rea-encabezado">REA ${n}</div>
              <div class="rea-celda ${clase}" data-color="${clase}">
                <span class="rea-nota">${texto}</span>
                ${progreso}
              </div>
            </div>`;
      }).join('');

      const tarjeta = document.createElement('div');
      tarjeta.className = 'contenedor-Estu';
      tarjeta.innerHTML = `
        <div class="encabezado-tarjeta">
          <div class="enc-retro">Retroalimentación por REA</div>
          <div class="enc-promedios">Promedios REA</div>
        </div>
        <div class="recuadro">
          <div class="fila-tabla">
            <div class="informacion">
              <div class="circulo">${escaparHTML(iniciales(estudiante.fullname))}</div>
              <h1 class="nombre">${escaparHTML(estudiante.fullname)}</h1>
            </div>
            ${celdasRea}
          </div>
        </div>
      `;
      contenedor.appendChild(tarjeta);
      ponerFotoPerfil(tarjeta.querySelector('.circulo'), estudiante);
      habilitarInteraccionREA(tarjeta, estudiante.id, tareasRetroREA, promediosRea);
    }

    aplicarOrganizacion();

  }catch(error){
    contenedor.innerHTML = '<p class="mensaje-gestor error">Error al cargar participantes: ' + escaparHTML(error.message) + '</p>';
  }
}
