document.addEventListener("DOMContentLoaded", () => {
  const buyButton = document.getElementById("buyButton");
  const editButton = document.getElementById("editButton");
  buyButton.style.display = "inline-block";
  editButton.style.display = "inline-block";

  const urlParams = new URLSearchParams(window.location.search);
  const sceneParam = urlParams.get("scene");
  let sceneBuyURL = '';

  if (sceneParam) {
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
  }

  // Mostrar u ocultar botón de comprar según existencia de URL
  if (!sceneBuyURL || !sceneBuyURL.startsWith("https://")) {
    buyButton.style.display = "none"; // ocultamos botón
  }

  // Comprar
  buyButton.onclick = () => {
    if (sceneBuyURL && sceneBuyURL.startsWith("https://")) {
      const baseURL = sceneBuyURL.endsWith('/') ? sceneBuyURL.slice(0, -1) : sceneBuyURL;
      const finalBuyURL = `${baseURL}/products/personalizado?scene=${encodeURIComponent(sceneParam)}`;
      window.open(finalBuyURL, "_blank");
    } else {
      alert("Producto no disponible");
    }
  };

  // Volver a personalizar
  editButton.onclick = () => {
    if (!sceneParam) {
      alert("No hay escena disponible para personalizar");
      return;
    }

    const newURL = window.location.href.replace(
      "https://product.3dtwins.tech/",
      "https://scene.3dtwins.tech/"
    );

   
    window.location.href = newURL;
  };
});
