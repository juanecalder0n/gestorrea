function habilitarInteraccionREA(tarjeta, idUsuario, tareasRetroREA, promediosRea){
  const reaDivs = tarjeta.querySelectorAll('.rea');
  const cargandoRea = new Set();

  const recuadro = tarjeta.querySelector('.recuadro');
  const { notaEnvio, cajaRetro, areaTexto, boton, listaActividades, metaRetro } = crearElementosRetro(recuadro);

  let reaSeleccionada = null;

  areaTexto.addEventListener('input', () => autoExpandirAreaTexto(areaTexto));

  function limpiarSeleccion(){
    reaDivs.forEach(d => {
      const celda = d.querySelector('.rea-celda');
      d.querySelector('.rea-encabezado').classList.remove('nocalifica');
      celda.classList.remove('nocalifica');
      const colorOriginal = celda.dataset.color;
      if(colorOriginal) celda.classList.add(colorOriginal);
    });
    notaEnvio.style.display = 'none';
    cajaRetro.style.display = 'none';
    metaRetro.style.display = 'none';
    boton.style.display = 'none';
    listaActividades.style.display = 'none';
    reaSeleccionada = null;
  }

  precargarMarcasREA(reaDivs, idUsuario, tareasRetroREA);

  reaDivs.forEach((reaDiv, indice) => {
    const n = indice + 1;

    const infoRea = promediosRea[n];
    const reaCompleta = !!(infoRea && infoRea.completo);

    reaDiv.style.cursor = 'pointer';

    reaDiv.addEventListener('click', () => {

      if(!reaCompleta){
        const detalle = (infoRea && infoRea.detalle) || [];
        const total = detalle.length;
        const calificadas = detalle.filter(actividad => actividad.nota !== null && actividad.nota !== undefined).length;

        alert('REA ' + n + ' no está completamente calificada. ' + '(' + calificadas + '/' + total + ')');
        return;
      }

      if(cargandoRea.has(n)){
        return;
      }

      if(reaSeleccionada === n){
        if(!areaTexto.readOnly){
          borradores[idUsuario + '-' + n] = areaTexto.value;
        }
        limpiarSeleccion();
        return;
      }
      if(reaSeleccionada !== null && !areaTexto.readOnly){
        borradores[idUsuario + '-' + reaSeleccionada] = areaTexto.value;
      }
      reaSeleccionada = n;

      reaDivs.forEach((d, i) => {
        const encabezado = d.querySelector('.rea-encabezado');
        const celda = d.querySelector('.rea-celda');
        const colorOriginal = celda.dataset.color;

        if(i === indice){
          encabezado.classList.remove('nocalifica');
          celda.classList.remove('nocalifica');
          if(colorOriginal) celda.classList.add(colorOriginal);
        }else{
          encabezado.classList.add('nocalifica');
          if(colorOriginal) celda.classList.remove(colorOriginal);
          celda.classList.add('nocalifica');
        }

      });

      listaActividades.innerHTML = tablaActividades(n, promediosRea[n]);
      listaActividades.style.display = 'block';

      const clave = idUsuario + '-' + n;
      const idTarea = tareasRetroREA ? tareasRetroREA[n] : null;

      notaEnvio.textContent = 'Esta será enviada automáticamente a la actividad "Retroalimentación REA ' + n + '"';
      notaEnvio.style.display = 'block';

      areaTexto.placeholder = 'Ingrese la retroalimentación para el creador de oportunidades según su desempeño en el REA ' + n;

      function actualizarMetaRetro(){
        const marcaTiempo = idTarea ? Modificacion[idTarea + '-'+ idUsuario] : null;
        if (marcaTiempo){
          metaRetro.textContent = 'Modificado por ultima vez: ' + formatearFecha(marcaTiempo);
          metaRetro.style.display = 'block';
        } else {
          metaRetro.style.display = 'none';
        }
      }

      areaTexto.readOnly = true;
      boton.textContent = '✎ Editar';
      boton.className = 'btn-editar';
      cajaRetro.style.display = 'flex';
      metaRetro.style.display = 'none';
      boton.style.display = 'inline-block';

      if(borradores[clave] !== undefined){
        areaTexto.value = borradores[clave];
        areaTexto.readOnly = false;
        boton.textContent = 'Guardar';
        boton.className = '';
        actualizarMetaRetro();
        autoExpandirAreaTexto(areaTexto);
      }else if(idTarea){
        areaTexto.value = 'Cargando...';
        autoExpandirAreaTexto(areaTexto);
        cargandoRea.add(n);
        obtenerComentarioGuardado(idTarea, idUsuario)
          .then(texto => {
            areaTexto.value = texto;
            if(texto){ almacenRetro[clave] = texto; } else { delete almacenRetro[clave]; }
            actualizarMarcaREA(reaDivs, indice, !!texto);
            actualizarMetaRetro();
            autoExpandirAreaTexto(areaTexto);
          })
          .catch(() => {
            areaTexto.value = almacenRetro[clave] || '';
            autoExpandirAreaTexto(areaTexto);
          })
          .finally(() => {
            cargandoRea.delete(n);
          });
      }else{
        areaTexto.value = almacenRetro[clave] || '(no existe la actividad "Retroalimentación REA ' + n + '" en este curso)';
        actualizarMetaRetro();
        autoExpandirAreaTexto(areaTexto);
      }

      function entrarEdicion(){
        if(areaTexto.readOnly){
          areaTexto.readOnly = false;
          areaTexto.focus();
          boton.textContent = 'Guardar';
          boton.className = '';
        }
      }

      areaTexto.onclick = entrarEdicion;

      boton.onclick = async () => {
        if(areaTexto.readOnly){
          entrarEdicion();
        }else{
          const texto = areaTexto.value.trim();

          if(!idTarea){
            alert('No existe la actividad "Retroalimentación REA ' + n + '" en este curso.');
            return;
          }

          boton.disabled = true;
          boton.textContent = 'Guardando...';

          try{
            await guardarComentario(idTarea, idUsuario, texto);

            if(texto){ almacenRetro[clave] = texto; } else { delete almacenRetro[clave]; }
            delete borradores[clave];
            Modificacion[idTarea + '-' + idUsuario] = Math.floor(Date.now() / 1000);
            areaTexto.value = texto;
            areaTexto.readOnly = true;
            boton.disabled = false;
            boton.textContent = '✎ Editar';
            boton.className = 'btn-editar';
            actualizarMarcaREA(reaDivs, indice, texto.length > 0);
            actualizarMetaRetro();
          }catch(error){
            boton.disabled = false;
            boton.textContent = 'Guardar';
            alert('No se pudo guardar en Moodle: ' + error.message);
          }
        }
      };
    });
  });
}
