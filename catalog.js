
const catalogContainer = document.getElementById('catalog-container');
const vhContainer = document.getElementById('vh-container');
let watermark = document.getElementById('catalog-watermark');

if (!watermark) {
  watermark = document.createElement('img');
  watermark.id = 'catalog-watermark';
  watermark.className = 'catalog-watermark';
  watermark.src = 'https://viewer.3dtwins.tech/puntero_3dtwinsStar.png';

watermark.style.position = 'fixed';
watermark.style.bottom = '10px';
watermark.style.left = '40%';
watermark.style.transform = 'translateX(-50%)';
watermark.style.width = '40px';
watermark.style.cursor = 'pointer';

  document.body.appendChild(watermark);
}

watermark.addEventListener('click', () =>
  window.open('https://www.3dtwins.es', '_blank')
);

function loadScene(base64Scene, card) {
  if (!base64Scene) return;

  vhContainer.setAttribute('data-scene', base64Scene);
  VH.init({ containerId: 'vh-container' });

  document.querySelectorAll('.scene-card').forEach(c => c.classList.remove('active'));
  if (card) card.classList.add('active');
}

function copyIframe(base64Scene) {
  if (!base64Scene) return;

  const cleanScene = encodeURIComponent(base64Scene);

  const iframeCode = `
<iframe 
  src="https://scene.3dtwins.tech?scene=${cleanScene}" 
  style="width:100%;height:400px;border:none;" 
  allow="fullscreen"
  allowfullscreen
  loading="lazy">
</iframe>`.trim();

  navigator.clipboard.writeText(iframeCode)
    .then(() => alert('Iframe copiado'))
    .catch(err => console.error(err));
}

function downloadModelFromScene(base64Scene) {
  try {
    const cleanBase64 = decodeURIComponent(base64Scene);
    const decodedUrl = atob(cleanBase64);

    const match = decodedUrl.match(/modelUrl=([^&]+)/i);
    if (!match) return alert('No se encontró modelUrl');

    const modelUrl = decodeURIComponent(match[1]);

    const a = document.createElement('a');
    a.href = modelUrl;
    a.download = modelUrl.split('/').pop().split('?')[0];
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

  } catch (err) {
    console.error(err);
    alert('Error al procesar la escena');
  }
}


function extractSceneName(base64Scene) {
  try {
    const cleanBase64 = decodeURIComponent(base64Scene);
    const decodedUrl = atob(cleanBase64);

    const match = decodedUrl.match(/modelUrl=([^&]+)/i);
    if (!match) return 'Escena';

    const modelUrl = decodeURIComponent(match[1]);

    let fileName = modelUrl.split('/').pop().split('?')[0];
    fileName = fileName.replace('.glb', '').replace(/[-_]/g, ' ');

    return fileName;

  } catch {
    return 'Escena';
  }
}


function renderCatalog(scenes) {
  catalogContainer.innerHTML = '';
  if (!scenes.length) return;

  scenes.forEach((scene, idx) => {
    const card = document.createElement('div');
    card.classList.add('scene-card');

    const preview = document.createElement('div');
    preview.classList.add('scene-preview');
    preview.textContent = 'Preview';
    card.appendChild(preview);

    const title = document.createElement('div');
    title.classList.add('scene-title');
    title.textContent = extractSceneName(scene.scene);
    card.appendChild(title);

    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('scene-buttons');

    const loadBtn = document.createElement('button');
    loadBtn.textContent = 'Ver';
    loadBtn.onclick = () => loadScene(scene.scene, card);
    buttonsDiv.appendChild(loadBtn);

    if (scene.allowEmbed) {
      const copyBtn = document.createElement('button');
      copyBtn.textContent = 'Iframe';
      copyBtn.onclick = () => copyIframe(scene.scene);
      buttonsDiv.appendChild(copyBtn);
    }

    if (scene.allowDownload) {
      const downloadBtn = document.createElement('button');
      downloadBtn.textContent = 'Descargar';
      downloadBtn.onclick = () => downloadModelFromScene(scene.scene);
      buttonsDiv.appendChild(downloadBtn);
    }

    card.appendChild(buttonsDiv);
    catalogContainer.appendChild(card);

    if (idx === 0) loadScene(scene.scene, card);
  });
}

renderCatalog(scenesArray);
