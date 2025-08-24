const contenedorProductos = document.getElementById("contenedor-productos");
const contenedorFavoritos = document.getElementById("contenedor-favoritos");

let productos = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

fetch("data/datos.json")
  .then(res => res.json())
  .then(data => {
    productos = data;
    renderProductos();
    renderFavoritos();
  })
  .catch(err => console.error("Error cargando productos:", err));

function renderProductos() {
  contenedorProductos.innerHTML = "";
  productos.forEach(prod => {
    const imagen = prod.image ? `images/${prod.image}` : "images/placeholder.jpg";
    const isFavorito = favoritos.includes(prod.id);
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <span class="card-favorito ${isFavorito ? 'relleno' : ''}" data-id="${prod.id}">❤</span>
      <img src="${imagen}" alt="${prod.title}" />
      <h3>${prod.title}</h3>
      <p>${prod.description}</p>
      <p class="price">$${prod.price}</p>
      <button class="add-btn" data-id="${prod.id}">Agregar al carrito</button>
    `;
    contenedorProductos.appendChild(card);

    const corazon = card.querySelector(".card-favorito");
    corazon.addEventListener("click", () => {
      const prodId = prod.id;
      if (favoritos.includes(prodId)) {
        favoritos = favoritos.filter(id => id !== prodId);
        corazon.classList.remove("relleno");
        alert(`${prod.title} fue eliminado de favoritos`);
      } else {
        favoritos.push(prodId);
        corazon.classList.add("relleno");
        alert(`${prod.title} agregado a favoritos`);
      }
      localStorage.setItem("favoritos", JSON.stringify(favoritos));
      renderFavoritos();
    });

    const addBtn = card.querySelector(".add-btn");
    addBtn.addEventListener("click", () => {
      const existing = carrito.find(item => item.id === prod.id);
      if (existing) {
        existing.cantidad += 1;
      } else {
        carrito.push({...prod, cantidad: 1});
      }
      localStorage.setItem("carrito", JSON.stringify(carrito));
      alert(`${prod.title} agregado al carrito`);
    });
  });
}

function renderFavoritos() {
  if (!contenedorFavoritos) return;
  contenedorFavoritos.innerHTML = "";

  favoritos.forEach(favId => {
    const prod = productos.find(p => p.id === Number(favId));
    if (!prod) return;

    const imagen = prod.image ? `images/${prod.image}` : "images/placeholder.jpg";
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <span class="card-favorito relleno" data-id="${prod.id}">❤</span>
      <img src="${imagen}" alt="${prod.title}" />
      <h3>${prod.title}</h3>
      <p>${prod.description}</p>
      <p class="price">$${prod.price}</p>
      <button class="add-btn" data-id="${prod.id}">Agregar al carrito</button>
    `;
    contenedorFavoritos.appendChild(card);

    const corazon = card.querySelector(".card-favorito");
    corazon.addEventListener("click", () => {
      favoritos = favoritos.filter(id => id !== prod.id);
      localStorage.setItem("favoritos", JSON.stringify(favoritos));
      renderFavoritos();
      renderProductos();
      alert(`${prod.title} fue eliminado de favoritos`);
    });

    const addBtn = card.querySelector(".add-btn");
    addBtn.addEventListener("click", () => {
      const existing = carrito.find(item => item.id === prod.id);
      if (existing) {
        existing.cantidad += 1;
      } else {
        carrito.push({...prod, cantidad: 1});
      }
      localStorage.setItem("carrito", JSON.stringify(carrito));
      alert(`${prod.title} agregado al carrito`);
    });
  });
}
