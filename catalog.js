// 🔥 Estado
let catalogInitialized = false;

let catalogContainer;
let vhContainer;
let watermark;

// 🔥 Inicializar DOM de forma segura
function initDOM() {
  catalogContainer = document.getElementById('catalog-container');
  vhContainer = document.getElementById('vh-container');
  watermark = document.getElementById('catalog-watermark');

  if (watermark) {
    watermark.addEventListener('click', () =>
      window.open('https://www.3dtwins.es', '_blank')
    );
  }
}

// 🔥 Inicialización principal
function initCatalog(scenes) {
  if (catalogInitialized) return;
  catalogInitialized = true;

  initDOM();

  if (!scenes || !scenes.length) {
    console.warn('No hay escenas');
    if (catalogContainer) {
      catalogContainer.innerHTML = '<p style="padding:20px">No hay escenas disponibles</p>';
    }
    return;
  }

  renderCatalog(scenes);
}

// 🔥 Escuchar datos desde iframe (wrapper)
window.addEventListener('message', (event) => {
  if (!event.data || event.data.type !== 'LOAD_SCENES') return;

  console.log('📦 Escenas recibidas desde wrapper');

  initCatalog(event.data.payload);
});

// 🔥 Fallback (HTML directo con scenesArray)
window.addEventListener('DOMContentLoaded', () => {
  if (window.scenesArray && window.scenesArray.length) {
    console.log('📦 Escenas cargadas desde script local');

    initCatalog(window.scenesArray);
  }
});

// 🔥 Cargar escena en visor
function loadScene(base64Scene, card) {
  if (!base64Scene || !vhContainer) return;

  vhContainer.setAttribute('data-scene', base64Scene);
  VH.init({ containerId: 'vh-container' });

  document.querySelectorAll('.scene-card').forEach(c => c.classList.remove('active'));
  if (card) card.classList.add('active');
}

// 🔥 Copiar iframe
function copyIframe(base64Scene) {
  const iframeCode = `<iframe src="/encapsulado.html?edit=${btoa(base64Scene)}" style="width:600px;height:400px;"></iframe>`;

  navigator.clipboard.writeText(iframeCode)
    .then(() => alert('Iframe copiado'))
    .catch(err => console.error(err));
}

// 🔥 Descargar modelo
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

// 🔥 Extraer nombre desde modelo
function extractSceneName(base64Scene) {
  try {
    const cleanBase64 = decodeURIComponent(base64Scene);
    const decodedUrl = atob(cleanBase64);

    const match = decodedUrl.match(/modelUrl=([^&]+)/i);
    if (!match) return 'Escena';

    const modelUrl = decodeURIComponent(match[1]);

    let fileName = modelUrl.split('/').pop().split('?')[0];
    fileName = fileName.replace('.glb', '').replace(/[-_]/g, ' ');

    return fileName || 'Escena';

  } catch {
    return 'Escena';
  }
}

// 🔥 Render catálogo
function renderCatalog(scenes) {
  if (!catalogContainer) return;

  catalogContainer.innerHTML = '';

  scenes.forEach((scene, idx) => {
    const card = document.createElement('div');
    card.classList.add('scene-card');

    // 🔹 Preview (placeholder)
    const preview = document.createElement('div');
    preview.classList.add('scene-preview');
    preview.textContent = 'Preview';
    card.appendChild(preview);

    // 🔹 Título
    const title = document.createElement('div');
    title.classList.add('scene-title');
    title.textContent = extractSceneName(scene.scene);
    card.appendChild(title);

    // 🔹 Botones
    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('scene-buttons');

    // Ver escena
    const loadBtn = document.createElement('button');
    loadBtn.textContent = 'Ver';
    loadBtn.onclick = () => loadScene(scene.scene, card);
    buttonsDiv.appendChild(loadBtn);

    // Iframe
    if (scene.allowEmbed) {
      const copyBtn = document.createElement('button');
      copyBtn.textContent = 'Iframe';
      copyBtn.onclick = () => copyIframe(scene.scene);
      buttonsDiv.appendChild(copyBtn);
    }

    // Descargar
    if (scene.allowDownload) {
      const downloadBtn = document.createElement('button');
      downloadBtn.textContent = 'Descargar';
      downloadBtn.onclick = () => downloadModelFromScene(scene.scene);
      buttonsDiv.appendChild(downloadBtn);
    }

    card.appendChild(buttonsDiv);
    catalogContainer.appendChild(card);

    // 🔥 Cargar primera escena automáticamente
    if (idx === 0) loadScene(scene.scene, card);
  });
}


