(function(){
  const params = new URLSearchParams(window.location.search);
  const sceneBase64 = params.get("scene");
  if (!sceneBase64) return;

  let decoded;
  try { decoded = atob(sceneBase64); } 
  catch(e) { return; }

  let sceneURL;
  try { sceneURL = new URL(decoded); } 
  catch(e) { return; }

  const name = sceneURL.searchParams.get("name");
  const config = sceneURL.searchParams.get("config");

  if(!name) return;

  function toHandle(name){
    return name.trim().toLowerCase()
      .replace(/\s+/g,'-')
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w-]/g,'');
  }

  // COLOR ENGINE
  function hexToRgb(hex){
    hex = hex.replace("#","");
    return { r: parseInt(hex.substring(0,2),16), g: parseInt(hex.substring(2,4),16), b: parseInt(hex.substring(4,6),16) };
  }

  function nameToRgb(name){
    name = name.toLowerCase();
    if(name.includes("rojo")) return {r:255,g:0,b:0};
    if(name.includes("azul")) return {r:0,g:0,b:255};
    if(name.includes("verde")) return {r:0,g:255,b:0};
    if(name.includes("negro")) return {r:0,g:0,b:0};
    if(name.includes("blanco")) return {r:255,g:255,b:255};
    if(name.includes("gris")) return {r:128,g:128,b:128};
    if(name.includes("amarillo")) return {r:255,g:255,b:0};
    return null;
  }

  function colorDistance(c1, c2){
    return Math.sqrt(
      Math.pow(c1.r - c2.r, 2) +
      Math.pow(c1.g - c2.g, 2) +
      Math.pow(c1.b - c2.b, 2)
    );
  }

  function findClosestVariantByColor(product, hex){
    if(!hex) return null;
    const target = hexToRgb(hex);
    let bestVariant = null;
    let minDistance = Infinity;

    product.variants.forEach(v => {
      [v.option1, v.option2, v.option3].forEach(opt => {
        if(!opt) return;
        const rgb = nameToRgb(opt);
        if(!rgb) return;

        const dist = colorDistance(target, rgb);
        if(dist < minDistance){
          minDistance = dist;
          bestVariant = v;
        }
      });
    });

    return bestVariant;
  }

  const productHandle = toHandle(name);
  const container = document.getElementById("vh-personalizacion");
  container.innerHTML = "";
  container.style.fontFamily = "system-ui, -apple-system, sans-serif";

  // IFRAME
  const iframeWrapper = document.createElement("div");
  iframeWrapper.style.height = "400px";
  iframeWrapper.style.overflow = "hidden";
  iframeWrapper.style.position = "relative";
  iframeWrapper.style.borderRadius = "20px";
  iframeWrapper.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
  container.appendChild(iframeWrapper);

  const iframe = document.createElement("iframe");
  iframe.src = `https://scene.3dtwins.tech?scene=${sceneBase64}`;
  iframe.style.width = "150%";
  iframe.style.height = "150%";
  iframe.style.position = "absolute";
  iframe.style.top = "50%";
  iframe.style.left = "50%";
  iframe.style.transform = "translate(-50%, -50%) scale(1.2)";
  iframe.style.border = "0";
  iframeWrapper.appendChild(iframe);

  // FETCH PRODUCTO + UI
  fetch(`/products/${productHandle}.js`)
    .then(res => res.json())
    .then(product => {
      let currentVariant = product.variants[0];
      if(config && config.includes("#")){
        const hex = config.split("#")[1];
        const matched = findClosestVariantByColor(product, hex);
        if(matched) currentVariant = matched;
      }

      const infoDiv = document.createElement("div");
      infoDiv.style.marginTop = "18px";
      infoDiv.style.padding = "18px";
      infoDiv.style.borderRadius = "18px";
      infoDiv.style.background = "#fff";
      infoDiv.style.boxShadow = "0 8px 24px rgba(0,0,0,0.05)";
      infoDiv.style.display = "flex";
      infoDiv.style.flexDirection = "column";
      infoDiv.style.gap = "14px";

      const header = document.createElement("div");
      header.style.display = "flex";
      header.style.alignItems = "center";
      header.style.gap = "12px";

      const img = document.createElement("img");
      img.style.width = "64px";
      img.style.height = "64px";
      img.style.borderRadius = "12px";
      img.style.objectFit = "cover";

      const textDiv = document.createElement("div");
      header.appendChild(img);
      header.appendChild(textDiv);
      infoDiv.appendChild(header);

      const selectors = [];
      product.options.forEach((opt, i) => {
        const select = document.createElement("select");
        select.style.padding = "12px";
        select.style.borderRadius = "12px";
        select.style.border = "1px solid #eee";
        select.style.background = "#fff";

        opt.values.forEach(val => {
          const option = document.createElement("option");
          option.value = val;
          option.textContent = val;
          select.appendChild(option);
        });

        selectors.push(select);
        infoDiv.appendChild(select);
      });

      if(currentVariant){
        selectors.forEach((select, i) => {
          const val = currentVariant[`option${i+1}`];
          if(val) select.value = val;
        });
      }

      const stockDiv = document.createElement("div");
      const qtyInput = document.createElement("input");
      qtyInput.type = "number";
      qtyInput.value = 1;
      qtyInput.min = 1;
      qtyInput.style.width = "90px";
      qtyInput.style.padding = "12px";
      qtyInput.style.borderRadius = "12px";
      qtyInput.style.border = "1px solid #eee";
      qtyInput.style.textAlign = "center";

      infoDiv.appendChild(stockDiv);
      infoDiv.appendChild(qtyInput);
      container.appendChild(infoDiv);

      const btn = document.createElement("a");
      btn.textContent = "Finalizar compra";
      btn.style.display = "block";
      btn.style.padding = "16px";
      btn.style.marginTop = "16px";
      btn.style.borderRadius = "14px";
      btn.style.background = "#0071e3";
      btn.style.color = "#fff";
      btn.style.textAlign = "center";
      btn.style.fontWeight = "600";
      btn.style.textDecoration = "none";
      btn.target = "_blank";
      container.appendChild(btn);

      function updateVariant(){
        const selected = selectors.map(s => s.value.toLowerCase());

        const match = product.variants.find(v => {
          return [v.option1, v.option2, v.option3]
            .map(o => o ? o.toLowerCase() : '')
            .every((opt, i) => !selected[i] || opt === selected[i]);
        });

        if(match) currentVariant = match;

        img.src = currentVariant.featured_image || product.images[0];

        textDiv.innerHTML = `
          <div style="font-weight:600; font-size:15px;">${product.title}</div>
          <div style="color:#666; font-size:14px;">${(currentVariant.price/100).toFixed(2)} €</div>
        `;

        let stockText = "";
        let maxQty = 1;

        if (typeof currentVariant.inventory_quantity === "number" && currentVariant.inventory_quantity > 0) {
          stockText = `<span style="color:#2e7d32;">● Disponible (${currentVariant.inventory_quantity})</span>`;
          maxQty = currentVariant.inventory_quantity;
        } 
        else if (currentVariant.available === true) {
          stockText = `<span style="color:#2e7d32;">● Disponible</span>`;
          maxQty = 10;
        } 
        else {
          stockText = `<span style="color:#d32f2f;">● Sin stock</span>`;
          maxQty = 1;
        }

        stockDiv.innerHTML = stockText;
        qtyInput.max = maxQty;

        if (qtyInput.value > maxQty) qtyInput.value = maxQty;

        // ==== Shopify Add to Cart con properties ====
        const customProperties = {};
        selectors.forEach((s, i) => {
          customProperties[`Option ${i+1}`] = s.value;
        });
        customProperties["Scene URL"] = `https://scene.3dtwins.tech?scene=${sceneBase64}`;
        customProperties["Config"] = config || "";

        const propsString = Object.entries(customProperties)
          .map(([k,v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
          .join('&');

        btn.href = `/cart/${currentVariant.id}:${qtyInput.value}?${propsString}`;
      }

      selectors.forEach(s => s.addEventListener("change", updateVariant));
      qtyInput.addEventListener("input", updateVariant);
      updateVariant();
    });

})();
