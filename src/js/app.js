const ACCESS_KEY = "jMBn4JdVYyIHAl4cKVZ7ICCtjtZmXHml5iEczZA7BkE";
const gallery = document.getElementById("container-cards");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const modalCaption = document.getElementById("modal-caption");
const modalClose = document.querySelector(".close");

// Mostrar modal al hacer clic en una imagen
gallery.addEventListener("click", (e) => {
  if (e.target.tagName === "IMG") {
    modal.style.display = "flex";
    modalImg.src = e.target.src;
    modalCaption.textContent = e.target.alt || "Imagen de Unsplash";
  }
});

// Cerrar modal al hacer clic en la “X”
modalClose.addEventListener("click", () => {
  modal.style.display = "none";
});

// Cerrar modal al hacer clic fuera de la imagen
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// --- Función para buscar imágenes --- 
async function buscarImagenes() {
  const query = searchInput.value.trim();
  if (!query) return;

  gallery.innerHTML = '<p style="text-align:center;">🔍 Buscando imágenes...</p>';

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&per_page=12&client_id=${ACCESS_KEY}`
    );

    const data = await response.json();
    renderImagenes(data.results);
  } catch (error) {
    console.error("Error:", error);
    gallery.innerHTML =
      '<p style="text-align:center;color:red;">❌ Error al cargar las imágenes</p>';
  }
}

// --- Renderizar imágenes ---
function renderImagenes(imagenes) {
  gallery.innerHTML = "";

  if (!imagenes || imagenes.length === 0) {
    gallery.innerHTML =
      '<p style="text-align:center;">No se encontraron imágenes</p>';
    return;
  }

  imagenes.forEach((imagen) => {
    const imageCard = document.createElement("div");
    imageCard.className = "card";
    imageCard.innerHTML = `
      <img src="${imagen.urls.small}" 
           alt="${imagen.alt_description || "Imagen de Unsplash"}"
           loading="lazy">
      <div class="card-info">
        <p><strong>Autor:</strong> ${imagen.user.name}</p>
        <p class="likes"><strong>Likes:</strong> ${imagen.likes} ❤️</p>
        <a href="${imagen.user.links.html}?utm_source=tu_app&utm_medium=referral" 
           target="_blank"
           rel="noopener noreferrer"
           class="author-link">
           📸 Ver portafolio
        </a>
      </div>
    `;
    gallery.appendChild(imageCard);
  });
}

// --- Cargar imágenes populares al inicio ---
async function imagenesPopulares() {
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos?per_page=12&order_by=popular&client_id=${ACCESS_KEY}`
    );
    const data = await response.json();
    renderImagenes(data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// --- Eventos ---
searchButton.addEventListener("click", buscarImagenes);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") buscarImagenes();
});

// --- Ejecutar por defecto ---
imagenesPopulares();
