document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("carrito-body");
  const tbodyFav = document.getElementById("favoritos-body");

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

  let productos = [];
  fetch("data/datos.json")
    .then(res => res.json())
    .then(data => {
      productos = data;
      renderFavoritos();
    })
    .catch(err => console.error("Error cargando productos:", err));

  function renderCarrito() {
    if (!tbody) return;
    tbody.innerHTML = "";
    let total = 0;

    carrito.forEach((prod, index) => {
      const tr = document.createElement("tr");
      const totalProducto = prod.price * prod.cantidad;
      tr.innerHTML = `
        <td data-label="Producto">${prod.title}</td>
        <td data-label="Precio">$${prod.price.toLocaleString()}</td>
        <td data-label="Cantidad">
          <input type="number" min="1" value="${prod.cantidad}" data-index="${index}">
        </td>
        <td data-label="Total">$${totalProducto.toLocaleString()}</td>
        <td data-label="Acción">
          <button class="eliminar-btn" data-index="${index}">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
      total += totalProducto;
    });

    const totalPago = document.querySelector(".carrito-footer strong");
    if (totalPago) totalPago.textContent = `$${total.toLocaleString()}`;
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  function renderFavoritos() {
    if (!tbodyFav || !productos.length) return;
    tbodyFav.innerHTML = "";

    favoritos.forEach(favId => {
      const prod = productos.find(p => p.id === Number(favId));
      if (!prod) return; 

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td data-label="Producto">${prod.title}</td>
        <td data-label="Precio">$${prod.price.toLocaleString()}</td>
        <td data-label="Acción"><button class="eliminar-fav" data-id="${prod.id}">Eliminar</button></td>
      `;
      tbodyFav.appendChild(tr);
    });

    tbodyFav.querySelectorAll(".eliminar-fav").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.dataset.id);
        favoritos = favoritos.filter(fav => fav !== id);
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
        renderFavoritos();
      });
    });
  }

  if (tbody) {
    tbody.addEventListener("input", (e) => {
      if (e.target.type === "number") {
        const index = e.target.dataset.index;
        carrito[index].cantidad = parseInt(e.target.value);
        renderCarrito();
      }
    });

    tbody.addEventListener("click", (e) => {
      if (e.target.classList.contains("eliminar-btn")) {
        const index = e.target.dataset.index;
        carrito.splice(index, 1);
        renderCarrito();
      }
    });
  }

  renderCarrito();
});
