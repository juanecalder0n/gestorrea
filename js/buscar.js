function busquedaEstudiante(){
  const campo = document.getElementById('buscarEstudiante');
  if(!campo) return;

  campo.addEventListener('input', () => {
    const texto = campo.value.trim().toLowerCase();
    const tarjetas = document.querySelectorAll('#listaParticipantes .contenedor-Estu');

    tarjetas.forEach(tarjeta => {
      const nombreEl = tarjeta.querySelector('.nombre');
      const nombre = nombreEl ? nombreEl.textContent.toLowerCase() : '';

      if(nombre.includes(texto)){
        tarjeta.style.display = '';
      }else{
        tarjeta.style.display = 'none';
      }
    });
  });
}

busquedaEstudiante();
