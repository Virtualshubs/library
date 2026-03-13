
(function(global){
  function init(options){
    const container = document.getElementById(options.containerId);
    if(!container) return;

    const base64Scene = container.dataset.scene;

    const visorURL = `https://viewer.3dtwins.tech/embeb.html?t=${base64Scene}`;

    
    const iframe = document.createElement('iframe');
    iframe.src = visorURL;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.border = 'none';

    container.innerHTML = '';
    container.appendChild(iframe);
  }

  global.VH = { init };
})(window);
