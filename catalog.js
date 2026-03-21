(function (global) {

  // === Crear contenedores automáticamente ===
  const catalogContainer = document.createElement('div');
  catalogContainer.id = 'catalog-container';
  catalogContainer.style.margin = '10px';
  document.body.appendChild(catalogContainer);

  const vhContainer = document.createElement('div');
  vhContainer.id = 'vh-container';
  vhContainer.classList.add('vh-scene');
  vhContainer.style.width = '100%';
  vhContainer.style.height = '400px';
  vhContainer.style.margin = '10px 0';
  document.body.appendChild(vhContainer);

  const watermark = document.createElement('img');
  watermark.id = 'catalog-watermark';
  watermark.className = 'catalog-watermark';
  watermark.src = 'https://viewer.3dtwins.tech/puntero_3dtwinsStar.png';
  watermark.style.position = 'fixed';
  watermark.style.bottom = '10px';
  watermark.style.right = '10px';
  watermark.style.width = '40px';
  watermark.style.cursor = 'pointer';
  document.body.appendChild(watermark);

  watermark.addEventListener('click', () =>
    window.open('https://www.3dtwins.es', '_blank')
  );

  // === Funciones internas ===
  function loadScene(base64Scene, card) {
    if (!base64Scene) return;
    vhContainer.setAttribute('data-scene', base64Scene);
    if (typeof VH !== 'undefined' && VH.init) VH.init({ containerId: 'vh-container' });
    document.querySelectorAll('.scene-card').forEach(c => c.classList.remove('active'));
    if (card) card.classList.add('active');
  }

  function copyIframe(base64Scene) {
    const iframeCode = `<iframe src="/encapsulado.html?edit=${btoa(base64Scene)}" style="width:600px;height:400px;"></iframe>`;
    navigator.clipboard.writeText(iframeCode).then(() => alert('Iframe copiado')).catch(console.error);
  }

  function downloadModelFromScene(base64Scene) {
    try {
      const decodedUrl = atob(decodeURIComponent(base64Scene));
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
      const decodedUrl = atob(decodeURIComponent(base64Scene));
      const match = decodedUrl.match(/modelUrl=([^&]+)/i);
      if (!match) return 'Escena';
      let fileName = decodeURIComponent(match[1]).split('/').pop().split('?')[0];
      return fileName.replace('.glb','').replace(/[-_]/g,' ');
    } catch {
      return 'Escena';
    }
  }

  function renderCatalog(scenes) {
    catalogContainer.innerHTML = '';
    if (!scenes || !scenes.length) return;

    scenes.forEach((scene, idx) => {
      const card = document.createElement('div');
      card.className = 'scene-card';
      card.style.border = '1px solid #ccc';
      card.style.padding = '5px';
      card.style.margin = '5px';
      card.style.display = 'inline-block';
      card.style.width = '150px';
      card.style.textAlign = 'center';

      const preview = document.createElement('div');
      preview.className = 'scene-preview';
      preview.textContent = 'Preview';
      preview.style.height = '80px';
      preview.style.background = '#eee';
      preview.style.marginBottom = '5px';
      card.appendChild(preview);

      const title = document.createElement('div');
      title.className = 'scene-title';
      title.textContent = extractSceneName(scene.scene);
      title.style.fontSize = '12px';
      title.style.marginBottom = '5px';
      card.appendChild(title);

      const buttonsDiv = document.createElement('div');
      buttonsDiv.className = 'scene-buttons';

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

  // === SDK global ===
  global.VH_Catalog_SDK = {
    init: function(scenes) {
      if (!Array.isArray(scenes)) return console.warn('VH_Catalog_SDK: scenes debe ser un array');
      renderCatalog(scenes);
    }
  };

})(window);
