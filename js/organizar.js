function NombreTarjeta(tarjeta){
  const NombreEl = tarjeta.querySelector('.nombre');
  return NombreEl ? NombreEl.textContent.trim() : '';
}


function notaREA(tarjeta, numeroRea){
  const reas = tarjeta.querySelectorAll('.rea');
  const rea = reas[numeroRea - 1];
  if(!rea) return -1;

  const notaEl = rea.querySelector('.rea-nota');
  if (!notaEl) return -1;

  const numero = parseFloat(notaEl.textContent);
  return isNaN(numero) ? - 1 : numero;

}

function promedioTarjeta(tarjeta){
  const valores = [1, 2, 3]
    .map(n => notaREA(tarjeta, n))
    .filter(v => v !== -1);

  if(valores.length === 0) return -1;
  return valores.reduce((acumulado, v) => acumulado + v, 0) / valores.length;
}

function valorParaOrdenar(tarjeta){
  const listaREA = document.getElementById('seleccionarREA');
  if(listaREA && listaREA.value !== 'todas'){
    return notaREA(tarjeta, Number(listaREA.value));
  }
  return promedioTarjeta(tarjeta);
}

function ordenarTarjetas(criterio){
  const contenedor = document.getElementById('listaParticipantes');
  const tarjetas = Array.from(contenedor.querySelectorAll('.contenedor-Estu'));

  tarjetas.sort((a, b) => {
    if(criterio === 'az'){
      return NombreTarjeta(a).localeCompare(NombreTarjeta(b));
    }
    if(criterio === 'za'){
      return NombreTarjeta(b).localeCompare(NombreTarjeta(a));
    }
    if(criterio === 'mayor'){
      return valorParaOrdenar(b) - valorParaOrdenar(a);
    }
    if(criterio === 'menor'){
      return valorParaOrdenar(a) - valorParaOrdenar(b);
    }
    return 0;
  });

  tarjetas.forEach(tarjeta => contenedor.appendChild(tarjeta));
}

function filtrarREA(reaSeleccionada){
  const tarjetas = document.querySelectorAll('#listaParticipantes .contenedor-Estu');

  tarjetas.forEach(tarjeta => {
    const reas = tarjeta.querySelectorAll('.rea');

    reas.forEach((rea, indice) => {
      const numeroRea = indice + 1;

      if(reaSeleccionada === 'todas' || numeroRea === Number(reaSeleccionada)){
        rea.style.display = '';
      }else{
        rea.style.display = 'none';
      }
    });
  });
}


function aplicarOrganizacion(){
  const listaOrden = document.getElementById('ordenarPor');
  const listaREA = document.getElementById('seleccionarREA');

  if (listaREA){
    filtrarREA(listaREA.value)
  }
  if (listaOrden){
    ordenarTarjetas(listaOrden.value);
  }


}

function habilitarOrganizacion(){
  const listaOrden = document.getElementById('ordenarPor');
  const listaREA = document.getElementById('seleccionarREA');

  if(listaOrden){
    listaOrden.addEventListener('change', () => {
      ordenarTarjetas(listaOrden.value);
    });
  }

  if(listaREA){
    listaREA.addEventListener('change', () => {
      filtrarREA(listaREA.value);
      if(listaOrden && (listaOrden.value === 'mayor' || listaOrden.value === 'menor')){
        ordenarTarjetas(listaOrden.value);
      }
    });
  }
}

habilitarOrganizacion();
