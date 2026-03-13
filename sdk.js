// sdk.js
(function(global){
  function init(options){
    const container = document.getElementById(options.containerId);
    if(!container) return;

    const base64Scene = container.dataset.scene;

    // Construir la URL que el visor original va a interpretar
    const visorURL = `https://viewer.3dtwins.tech/embeb.html?t=${encodeURIComponent(base64Scene)}`;

    // Crear iframe
    const iframe = document.createElement('iframe');
    iframe.src = visorURL;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.border = 'none';

    // Limpiar contenedor y agregar iframe
    container.innerHTML = '';
    container.appendChild(iframe);
  }

  // Exponer función global para que el usuario pueda iniciar la escena
  global.VH = { init };
})(window);
