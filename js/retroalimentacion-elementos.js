const almacenRetro = {};
const borradores = {};

function crearElementosRetro(recuadro){
  const notaEnvio = document.createElement('div');
  notaEnvio.className = 'nota-envio';
  notaEnvio.style.display = 'none';

  const cajaRetro = document.createElement('div');
  cajaRetro.className = 'retroalimentacion';
  cajaRetro.style.display = 'none';

  const areaTexto = document.createElement('textarea');
  areaTexto.rows = 1;
  areaTexto.readOnly = true;
  cajaRetro.appendChild(areaTexto);

  const metaRetro = document.createElement('div');
  metaRetro.className = 'meta-retro';
  metaRetro.style.display = 'none';

  const boton = document.createElement('button');
  boton.type = 'button';
  boton.style.display = 'none';

  const listaActividades = document.createElement('div');
  listaActividades.className = 'lista-actividades-rea';
  listaActividades.style.display = 'none';

  recuadro.appendChild(notaEnvio);
  recuadro.appendChild(cajaRetro);
  recuadro.appendChild(metaRetro);
  recuadro.appendChild(listaActividades);
  recuadro.appendChild(boton);

  return { notaEnvio, cajaRetro, areaTexto, boton, listaActividades, metaRetro };
}

function tablaActividades(n, infoRea){
  const filas = infoRea.detalle.map(actividad =>
    `<tr><td>${escaparHTML(actividad.nombre)}</td><td class="col-nota">${actividad.nota ?? '-'}</td></tr>`
  ).join('');

  return `
  <table class="tabla-actividades">
  <tr><th>Actividades durante REA ${n}</th><th class="col-nota">Notas</th></tr>
  ${filas}
  <tr class="fila-total">
    <td class="total-etiqueta"><span>PROMEDIO TOTAL</span></td>
    <td class="col-nota total-valor ${claseColorREA(infoRea.valor, infoRea.completo)}">${formatearNota(infoRea.valor)}</td>
  </tr>
  </table>`;
}

function autoExpandirAreaTexto(areaTexto){
  areaTexto.style.height = 'auto';
  areaTexto.style.height = areaTexto.scrollHeight + 'px';
}

function actualizarMarcaREA(reaDivs, indice, tieneTexto){
  const encabezado = reaDivs[indice].querySelector('.rea-encabezado');
  const base = encabezado.textContent.replace('✔', '').trim();
  encabezado.textContent = base + (tieneTexto ? ' ✔' : '');
}

async function precargarMarcasREA(reaDivs, idUsuario, tareasRetroREA){
  for(let indice = 0; indice < reaDivs.length; indice++){
    const n = indice + 1;
    const idTarea = tareasRetroREA ? tareasRetroREA[n] : null;
    if(!idTarea) continue;

    try{
      const texto = await obtenerComentarioGuardado(idTarea, idUsuario);
      if(texto){
        almacenRetro[idUsuario + '-' + n] = texto;
      }
      actualizarMarcaREA(reaDivs, indice, !!texto);
    }catch(error){
      console.error('[precarga-checks] userId=' + idUsuario + ' REA ' + n + ':', error);
    }
  }
}
