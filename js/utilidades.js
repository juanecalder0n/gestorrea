function IdentificadorCurso(curso){
  const texto = curso.shortname || curso.idnumber || '';
  const partes = texto.split('/');
  return partes.length >= 4 ? partes : null;
}

function obtenerTituloCurso(curso){
  const partes = IdentificadorCurso(curso);
  if(partes){
    return {
      nombre: partes[1] || curso.fullname,
      subtitulo: partes[3] || curso.idnumber || ''
    };
  }
  return {
    nombre: curso.fullname,
    subtitulo: curso.idnumber || curso.shortname || ''
  };
}

function nombreGrupoCurso(curso){
  const partes = IdentificadorCurso(curso);
  return (partes && partes[4] && partes[4].trim()) || '';
}

function normalizarNombre(texto){
  return (texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, ' ')
    .trim();
}

function numeroRetroREA(nombre){
  const coincidencia = normalizarNombre(nombre).match(/^RETRO ?ALIMENTACION ?REA ?(\d+)$/);
  return coincidencia ? Number(coincidencia[1]) : null;
}

function escaparHTML(texto){
  const contenedor = document.createElement('div');
  contenedor.textContent = texto == null ? '' : String(texto);
  return contenedor.innerHTML;
}

function iniciales(nombreCompleto){
  const partes = nombreCompleto.trim().split(/\s+/);
  return ((partes[0]?.[0] || '') + (partes[1]?.[0] || '')).toUpperCase();
}

function formatearFecha(segundosUnix){
  const fecha = new Date(segundosUnix * 1000);
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  const anio = fecha.getFullYear();

  let horas = fecha.getHours();
  const minutos = String(fecha.getMinutes()).padStart(2, '0');
  const jornada = horas >= 12 ? 'P.M.' : 'A.M.';
  horas = horas % 12;
  if(horas === 0) horas = 12;

  return mes + '-' + dia + '-' + anio + ' ' + String(horas).padStart(2, '0') + ':' + minutos + ' ' + jornada;
}

function claseColorREA(valor, completo){
  if(!completo) return '';
  if(valor === null || valor === undefined) return '';
  if(valor < 3) return 'destacado-b';
  if(valor < 4) return 'destacado-m';
  return 'destacado';
}

function ponerFotoPerfil(circulo, usuario){
  const url = usuario.profileimageurl || usuario.profileimageurlsmall || '';
  if(!url || /\/u\/f\d/.test(url)) return;

  const imagen = new Image();
  imagen.alt = '';
  imagen.onload = () => {
    circulo.textContent = '';
    circulo.appendChild(imagen);
  };
  imagen.src = url;
}

function numeroREAdeActividad(nombre){
  const coincidencia = normalizarNombre(nombre).match(/^R ?(\d+) A ?\d+ S ?\d+/);
  return coincidencia ? Number(coincidencia[1]) : null;
}

const DECIMALES_NOTA = 2;

function formatearNota(valor){
  const factor = Math.pow(10, DECIMALES_NOTA);
  const truncado = Math.floor(valor * factor + 1e-9) / factor;
  const texto = truncado.toFixed(DECIMALES_NOTA);
  return texto.replace(/(\.\d)0+$/, '$1');
}
