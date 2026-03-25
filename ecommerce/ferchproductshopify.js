<div id="vh-personalizacion">
  <p>Procesando tu configuración...</p>
</div>

<style>
.vh-mode .price,
.vh-mode .product__price,
.vh-mode .price-item,
.vh-mode .product__tax,
.vh-mode .product__policies,
.vh-mode .shopify-payment-terms {
  display: none !important;
}
</style>

<script>
(function(){
  const params = new URLSearchParams(window.location.search);
  const sceneBase64 = params.get("scene");
  if (!sceneBase64) return;
  document.body.classList.add("vh-mode");
  const container = document.getElementById("vh-personalizacion");
  container.innerHTML = "";
  const sdkScript = document.createElement("script");
  sdkScript.src = `https://cdn.3dtwins.tech/ecommerce/shopify.js?scene=${sceneBase64}`;
  sdkScript.async = true;
  container.appendChild(sdkScript);
})();
</script>
