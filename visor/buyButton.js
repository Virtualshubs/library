    
document.getElementById("buyButton").onclick = function () {
  if (!currentModel) {
    alert("No hay modelo cargado.");
    return;
  }

  const fullURL = window.location.href;
  const parts = fullURL.split("?");

  if (parts.length < 2) {
    alert("No hay parámetros en la URL");
    return;
  }

  const base = parts[0];
  let params = parts[1];


  const newBase = base.replace(
    /https:\/\/[^/]+/,
    "https://product.3dtwins.tech"
  );

  params = params.replace(/^t=/, "scene=");
 
  try {
    const decoded = atob(decodeURIComponent(params.split("=")[1]));
    const urlObj = new URL(decoded);

    const configItems = [];
    currentModel.traverse((child) => {
      if (child.isMesh) {
        const objName = child.name || "unnamed";
        let colorHex = child.userData?.config?.color;
        if (!colorHex && child.material?.color) {
          colorHex = "#" + child.material.color.getHexString();
        }
        if (colorHex) configItems.push(`${objName}:${colorHex}`);
      }
    });

    if (configItems.length) {
      urlObj.searchParams.set("config", configItems.join("|"));
    }
   
    params = "scene=" + encodeURIComponent(btoa(urlObj.toString()));
  } catch (err) {
    console.warn("Error actualizando config:", err);
  }

  const finalURL = newBase + "?" + params;

window.location.href = finalURL;
};
