const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".dot");

let index = 0;

function showSlide(i) {
  slides.forEach(s => s.classList.remove("active"));
  dots.forEach(d => d.classList.remove("active"));

  slides[i].classList.add("active");
  dots[i].classList.add("active");

  index = i;
}

dots.forEach((dot, i) => {
  dot.addEventListener("click", () => showSlide(i));
});

setInterval(() => {
  let next = (index + 1) % slides.length;
  showSlide(next);
}, 5000);


document.getElementById("explore-btn").addEventListener("click", () => {
  const viewer = document.querySelector("#vh-main-container");

  if (viewer) {
    viewer.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
});


let container = document.getElementById("vh-main-container");
const sidebarList = document.getElementById("vh-sidebar-list");
const gridList = document.getElementById("vh-grid-list");

let currentScene = null;
let savedDesigns = new Map();


function removeDuplicates(products) {
  const map = new Map();
  products.forEach(p => map.set(p.id, p));
  return Array.from(map.values());
}

function createCard(p) {
  const card = document.createElement("div");
  card.dataset.scene = p.scene;

  card.innerHTML = `
    <img src="${p.image}" />
    <div class="card-title">${p.title}</div>
    <div class="card-price">${p.price || ""}</div>
    <div class="vh-card-info">${p.meta || ""}</div>
    <button class="vh-add-to-cart">Add to cart ↗</button>
  `;

  return card;
}


function renderProducts() {

  sidebarList.innerHTML = "";
  gridList.innerHTML = "";

  PRODUCTS.forEach(p => {

    const types = Array.isArray(p.type) ? p.type : [p.type];
    const baseCard = createCard(p);

    if (types.includes("vh")) {
      const cardVH = baseCard.cloneNode(true);
      cardVH.className = "vh-card";
      sidebarList.appendChild(cardVH);
    }

    if (types.includes("grid")) {
      const cardGrid = baseCard.cloneNode(true);
      cardGrid.className = "card vh-trigger";
      gridList.appendChild(cardGrid);
    }
  });
}


function renderSidebar(filteredProducts) {

  sidebarList.innerHTML = "";

  filteredProducts.forEach(p => {
    const card = createCard(p);
    card.className = "vh-card";
    sidebarList.appendChild(card);
  });
}


function load(scene, sourceCard = null, shouldScroll = true) {
  if (!scene) return;

  if (currentScene && currentScene !== scene) {
    saveCurrentDesign(currentScene);
  }

  currentScene = scene;

  container.innerHTML = "";
  container.setAttribute("data-scene", scene);

  VH.init({ containerId: "vh-main-container" });

  updateProductPanel(sourceCard);

  if (shouldScroll) {
    const viewer = document.querySelector("#vh-main-container");

    if (viewer && window.scrollY > 200) {
      viewer.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }
}



function updateProductPanel(card) {
  if (!card) return;

  const title = card.querySelector(".card-title")?.textContent || "";
  const price = card.querySelector(".card-price")?.textContent || "";
  const meta = card.querySelector(".vh-card-info")?.textContent || "";

  document.querySelector(".vh-product-title").textContent = title;
  document.querySelector(".vh-product-price").textContent = price;
  document.querySelector(".vh-product-meta").textContent = meta;
}


const designsRow = document.querySelector(".my-designs-row");
const designsSection = document.getElementById("my-designs");

function saveCurrentDesign(scene) { if (!scene || savedDesigns.has(scene)) return; const product = PRODUCTS.find(p => p.scene === scene); if (!product) return; const card = document.createElement("div"); card.className = "my-design-card"; card.dataset.scene = scene; card.innerHTML = <img src="${product.image}" /> <div class="card-info"> <div class="card-title">${product.title}</div> <div class="card-meta">${product.meta || ""}</div> <div class="card-price">${product.price || ""}</div> </div> ; card.addEventListener("click", () => load(scene)); designsRow.appendChild(card); savedDesigns.set(scene, true); designsSection.style.display = "block"; }

document.addEventListener("click", (e) => {

  const card = e.target.closest("[data-scene]");
  if (!card) return;

  if (e.target.classList.contains("vh-add-to-cart")) {
    e.stopPropagation();

    const scene = card.dataset.scene;
    const baseUrl = "https://3dtwins.es/products/personalizado";

    window.open(`${baseUrl}?scene=${scene}`, "_blank");
    return;
  }

  const scene = card.dataset.scene;

  load(scene, card);

  document.querySelectorAll(".vh-card, .card")
    .forEach(c => c.classList.remove("active"));

  card.classList.add("active");
});



const searchInput = document.querySelector(".search input");

searchInput.addEventListener("input", (e) => {

  const query = e.target.value.toLowerCase().trim();

  if (!query) {
    renderProducts();

    document.querySelectorAll(".card").forEach(card => {
      card.style.display = "";
    });

    return;
  }

  let filtered = PRODUCTS
    .map(p => {

      const title = (p.title || "").toLowerCase();
      const meta = (p.meta || "").toLowerCase();
      const tags = (p.tags || []).join(" ").toLowerCase();

      let score = 0;

      if (title.includes(query)) score += 3;
      if (meta.includes(query)) score += 2;
      if (tags.includes(query)) score += 5;

      return { ...p, score };
    })
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score);

  filtered = removeDuplicates(filtered);

  renderSidebar(filtered);

  document.querySelectorAll(".card").forEach(card => {
    const scene = card.dataset.scene;
    card.style.display = filtered.some(p => p.scene === scene) ? "" : "none";
  });

  if (filtered.length > 0) {
    const first = filtered[0];

    setTimeout(() => {
      const firstCard = document.querySelector(`[data-scene="${first.scene}"]`);

      if (firstCard) {
        load(first.scene, firstCard);

        document.querySelectorAll(".vh-card")
          .forEach(c => c.classList.remove("active"));

        firstCard.classList.add("active");
      }
    }, 50);
  }
});


renderProducts();

const first = PRODUCTS[0];
if (first) {
  setTimeout(() => {
    const firstCard = document.querySelector(`[data-scene="${first.scene}"]`);
    load(first.scene, firstCard, false);
  }, 100);
}
