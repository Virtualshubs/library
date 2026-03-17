(async function(){
  const urlParams = new URLSearchParams(window.location.search);
  let base64Scene = '';
  if(urlParams.has('scene')) base64Scene = urlParams.get('scene');
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

  const colorsContainer = document.getElementById('colors');
  let productName = '';
  let productAuthor = '';
  try {
    const decoded = atob(base64Scene);
    const params = new URLSearchParams(decoded.split('?')[1]);
    productName = params.get('name') || '';
    productAuthor = params.get('author') || 'Desconocido';
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
            console.log('Color seleccionado:', colorHex);
          });
          colorsContainer.appendChild(circle);
        }
      });
    }
  } catch(e){
    console.warn("No se pudo decodificar base64:", e);
  }

  // PDF
  const saveBtn = document.getElementById('save-button');
  saveBtn.addEventListener('click', async () => {
    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF('p', 'pt', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 40;

    pdf.setFillColor(245, 245, 245);
    pdf.roundedRect(margin, 50, pageWidth - 2*margin, 260, 10, 10, 'F');

    pdf.setFontSize(14);
    pdf.setTextColor(0,0,0);
    pdf.text(`Producto: ${productName}`, margin + 20, 80);
    pdf.setFontSize(12);
    pdf.text(`Autor: ${productAuthor}`, margin + 20, 110);

    const colorXStart = margin + 20;
    const colorY = 130;
    const colorSize = 12;
    const selectedColors = Array.from(document.querySelectorAll('.color-circle')).map(c => c.dataset.color);
    selectedColors.forEach((c, i) => {
      pdf.setFillColor(...hexToRgb(c));
      pdf.rect(colorXStart + i*(colorSize+5), colorY, colorSize, colorSize, 'F');
    });

    const qrCanvas = document.createElement('canvas');
    await QRCode.toCanvas(qrCanvas, window.location.href, { width: 128 });
    const qrX = pageWidth - margin - 138 - 10; 
    const qrY = 60; 
    pdf.addImage(qrCanvas.toDataURL('image/png'), qrX, qrY, 128, 128);

    pdf.setTextColor(0,0,255);
    pdf.setFontSize(10);
    const urlMaxWidth = pageWidth - 2*margin - 20;
    const urlLines = pdf.splitTextToSize(window.location.href, urlMaxWidth);

    let yPos = qrY + 128 + 10;
    urlLines.forEach(line => {
      pdf.textWithLink(line, margin + 20, yPos, { url: window.location.href });
      yPos += 12;
    });

    pdf.save('producto-personalizado-3dtwins.pdf');
  });

  function hexToRgb(hex) {
    hex = hex.replace('#','');
    const bigint = parseInt(hex,16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r,g,b];
  }

// -----------------------------
// Botón de compra dinámico con modal para editar URL
// -----------------------------
const encodedBuyURL = urlParams.get("buyURL");
let finalBuyURL = encodedBuyURL ? atob(decodeURIComponent(encodedBuyURL)) : '';

if(finalBuyURL && !finalBuyURL.startsWith("https://")) {
  console.warn("La URL de compra no es segura:", finalBuyURL);
  finalBuyURL = '';
}

// Creamos botón solo si hay URL o se va a definir
const container = document.getElementById('vh-container') || document.body;
if(getComputedStyle(container).position === 'static'){
  container.style.position = 'relative';
}

// Modal para permitir editar la URL de compra
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
modal.style.visibility = 'hidden'; // oculto al inicio

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
modalInput.value = finalBuyURL;
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

// Creamos el botón de compra pero inicialmente oculto
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
buyButton.style.display = 'none'; // oculto hasta que se defina URL
container.appendChild(buyButton);

// Función para actualizar el botón
function showBuyButton(url){
  if(url && url.startsWith('https://')){
    buyButton.style.display = 'inline-block';
    buyButton.onclick = () => window.open(url, '_blank');
  } else {
    buyButton.style.display = 'none';
    console.warn("URL de compra inválida:", url);
  }
}

// Si ya había URL en la query, mostramos el botón directamente
if(finalBuyURL) showBuyButton(finalBuyURL);
else modal.style.visibility = 'visible'; // mostramos modal si no hay URL

// Evento de guardar modal
modalBtn.addEventListener('click', () => {
  const inputVal = modalInput.value.trim();
  if(inputVal.startsWith('https://')){
    finalBuyURL = inputVal;
    showBuyButton(finalBuyURL);
    modal.style.visibility = 'hidden';
  } else {
    alert('La URL debe empezar por https://');
  }
});

})();
