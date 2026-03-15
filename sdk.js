
(function(global){
  function init(options){
    const container = document.getElementById(options.containerId);
    if(!container) return;
    let base64Scene = container.dataset.scene || '';
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('scene')) {
      base64Scene = urlParams.get('scene');
    }

    if(!base64Scene) {
      console.error("No se ha proporcionado Base64 de la escena.");
      return;
    }
    
    const visorURL = `https://viewer.3dtwins.tech/embeb.html?t=${base64Scene}`;
    const iframe = document.createElement('iframe');
    iframe.src = visorURL;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.border = 'none';
    container.innerHTML = '';
    container.appendChild(iframe);
    console.log("SDK cargado: iframe con escena:", base64Scene);
  }

  global.VH = { init };
})(window);
