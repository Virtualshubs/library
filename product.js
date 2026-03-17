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
})();
