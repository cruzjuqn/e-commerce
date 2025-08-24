// ====== VARIABLES GLOBALES ======
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

// ====== AGREGAR AL CARRITO ======
function agregarAlCarrito(producto) {
  carrito.push(producto);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  alert(`${producto.nombre} fue agregado al carrito 🛒`);
}

// ====== AGREGAR/QUITAR FAVORITOS ======
function toggleFavorito(producto) {
  const existe = favoritos.find(p => p.nombre === producto.nombre);
  
  if (existe) {
    favoritos = favoritos.filter(p => p.nombre !== producto.nombre);
    alert(`${producto.nombre} fue eliminado de favoritos 💔`);
  } else {
    favoritos.push(producto);
    alert(`${producto.nombre} fue agregado a favoritos ❤️`);
  }
  
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

// ====== ASIGNAR EVENTOS ======
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    const nombre = card.querySelector("h3").innerText;
    const precio = card.querySelector(".price").innerText;
    const img = card.querySelector("img").src;

    const producto = {
      nombre,
      precio,
      img
    };

    card.querySelector(".add-btn").addEventListener("click", () => {
      agregarAlCarrito(producto);
    });
    card.querySelector(".heart-icon").addEventListener("click", () => {
      toggleFavorito(producto);
    });
  });
});
