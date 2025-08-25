document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("carrito-body");

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

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
