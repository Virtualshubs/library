buyButton.onclick = () => {

  if (!sceneParam) {
    alert("No hay configuración disponible");
    return;
  }

  let sceneBuyURL = '';

  try {
    const decodedScene = atob(decodeURIComponent(sceneParam));
    const sceneURL = new URL(decodedScene);
    const buyParam = sceneURL.searchParams.get("buyURL");

    if (buyParam) {
      sceneBuyURL = decodeURIComponent(buyParam);
    }
  } catch (e) {
    console.warn("Error leyendo buyURL:", e);
  }

 
  if (sceneBuyURL && sceneBuyURL.startsWith("https://")) {

    const baseURL = sceneBuyURL.endsWith('/')
      ? sceneBuyURL.slice(0, -1)
      : sceneBuyURL;

    const finalBuyURL = `${baseURL}/products/personalizado?scene=${encodeURIComponent(sceneParam)}`;

 
    window.location.href = finalBuyURL;
    return;
  }

 
  const newURL = window.location.href.replace(
    "product.3dtwins.tech",
    "scene.3dtwins.tech"
  );

  window.history.replaceState({}, '', newURL);


  VH.init({
    containerId: 'vh-container',
    scene: sceneParam
  });
};
