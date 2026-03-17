(async function(){
  const urlParams = new URLSearchParams(window.location.search);
  let base64Scene = urlParams.get('scene') || '';
  if(!base64Scene) {
    console.error("No se ha proporcionado escena en la URL");
    return;
  }

  // Inicializamos el visor
  VH.init({
    containerId: 'vh-container',
    scene: base64Scene
  });

  history.replaceState({}, '', `?scene=${base64Scene}`);

  // -----------------------------
  // Procesar información de producto
  // -----------------------------
  const colorsContainer = document.getElementById('colors');
  let productName = '';
  let productAuthor = '';
  let sceneBuyURL = '';

  try {
    const decoded = atob(base64Scene);
    const params = new URLSearchParams(decoded.split('?')[1]);

    productName = params.get('name') || '';
    productAuthor = params.get('author') || 'Desconocido';
    sceneBuyURL = params.get('buyURL') ? atob(params.get('buyURL')) : '';

    document.getElementById('product-name').innerText = productName;
    document.getElementById('product-author').innerText = 'Autor: ' + productAuthor;

    const config = params.get('config') || '';
    if(config){
      config.split('|').forEach((item,index)=>{
        const [objName, colorHex] = item.split(':');
        if(colorHex){
          const circle = document.createElement('span');
          circle.className = 'color-circle';
          circle.style.backgroundColor = colorHex;
          circle.dataset.color = colorHex;
          if(index===0) circle.classList.add('selected');
          circle.addEventListener('click', () => {
            document.querySelectorAll('.color-circle').forEach(c=>c.classList.remove('selected'));
            circle.classList.add('selected');
          });
          colorsContainer.appendChild(circle);
        }
      });
    }
  } catch(e){
    console.warn("No se pudo decodificar base64:", e);
  }

  // -----------------------------
  // Botón de compra dinámico
  // -----------------------------
  if(sceneBuyURL && sceneBuyURL.startsWith('https://')){
    const container = document.getElementById('vh-container') || document.body;
    if(getComputedStyle(container).position === 'static'){
      container.style.position = 'relative';
    }

    const buyButton = document.createElement('button');
    buyButton.className = 'buy-button';
    buyButton.innerText = 'Comprar';
    buyButton.style.position = 'absolute';
    buyButton.style.top = '20px';
    buyButton.style.right = '20px';
    buyButton.style.zIndex = '9999';
    buyButton.style.padding = '10px 20px';
    buyButton.style.background = '#007bff';
    buyButton.style.color = '#fff';
    buyButton.style.border = 'none';
    buyButton.style.borderRadius = '4px';
    buyButton.style.cursor = 'pointer';
    buyButton.onclick = () => window.open(sceneBuyURL, '_blank');

    container.appendChild(buyButton);
  }

})();
