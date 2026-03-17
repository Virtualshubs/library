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
  buyButton.style.display = 'none';
  container.appendChild(buyButton);

  function showBuyButton(url){
    if(url && url.startsWith('https://')){
      buyButton.style.display = 'inline-block';
      buyButton.onclick = () => window.open(url, '_blank');
    }
  }

  // Si el scene ya trae buyURL válido, mostramos botón directamente
  if(sceneBuyURL && sceneBuyURL.startsWith('https://')){
    showBuyButton(sceneBuyURL);
  } else {
    // Modal para agregar URL manual si no hay buyURL en scene
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.background = 'rgba(0,0,0,0.6)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '10000';
    modal.style.visibility = 'visible';

    const modalContent = document.createElement('div');
    modalContent.style.background = '#fff';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '8px';
    modalContent.style.minWidth = '300px';
    modalContent.style.textAlign = 'center';
    modal.appendChild(modalContent);

    const modalInput = document.createElement('input');
    modalInput.type = 'url';
    modalInput.placeholder = 'https://...';
    modalInput.style.width = '80%';
    modalInput.style.marginBottom = '10px';
    modalContent.appendChild(modalInput);

    const modalBtn = document.createElement('button');
    modalBtn.innerText = 'Guardar y mostrar botón';
    modalBtn.style.padding = '8px 16px';
    modalBtn.style.cursor = 'pointer';
    modalBtn.style.background = '#28a745';
    modalBtn.style.color = '#fff';
    modalBtn.style.border = 'none';
    modalBtn.style.borderRadius = '4px';
    modalContent.appendChild(modalBtn);

    document.body.appendChild(modal);

    modalBtn.addEventListener('click', () => {
      const inputVal = modalInput.value.trim();
      if(inputVal.startsWith('https://')){
        showBuyButton(inputVal);
        modal.style.visibility = 'hidden';
      } else {
        alert('La URL debe empezar por https://');
      }
    });
  }

})();
