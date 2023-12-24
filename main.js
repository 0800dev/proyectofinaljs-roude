let productos = [];
let carrito = [];
carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const urlLocal = "productos.json";

fetch(urlLocal)
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(data);
    })
    .catch(error => console.log(error));

const contenedorProductos = document.getElementById("contenedorProductos");

function cargarProductos(productos) {
    productos.forEach(producto => {
        const card = document.createElement("div");
        card.classList.add("col-xl-3", "col-md-6", "col-xs-12");
        card.innerHTML = `
            <div class="card">
                <img src="${producto.img}" class="card-img-top imgProductos" alt="${producto.nombre}">
                <div class="card-body">
                    <h5 class="card-title"> ${producto.nombre} </h5>
                    <p class="card-text"> ${producto.precio} </p>
                    <button class="btn colorBoton" id="boton${producto.id}"> Agregar al Carrito </button>
                </div>
            </div>
        `
        contenedorProductos.appendChild(card);
        const boton = document.getElementById(`boton${producto.id}`);
        boton.addEventListener("click", () => {
            agregarAlCarrito(producto.id);
            Toastify({
                text: "Producto agregado al carrito",
                duration: 3000,
                close: true,
                gravity: "top",
                position: 'right',
                backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
            }).showToast();
        })
    });
}


const agregarAlCarrito = (id) => {
    const producto = productos.find((producto) => producto.id === id);
    const productoEnCarrito = carrito.find((producto) => producto.id === id);
    if(productoEnCarrito){
        productoEnCarrito.cantidad++;
    }else {
        carrito.push(producto);
       
    }
    localStorage.setItem("carrito",JSON.stringify(carrito));
    calcularTotal();
    console.log(carrito);
}

const contenedorCarrito = document.getElementById("contenedorCarrito");

const verCarrito = document.getElementById("verCarrito");

verCarrito.addEventListener("click", () => {
    mostrarCarrito();
});

const mostrarCarrito = () => {
    contenedorCarrito.innerHTML="";
    carrito.forEach((producto) => {
        const card = document.createElement("div");
        card.classList.add("col-xl-3", "col-md-6", "col-xs-12");
        
        card.innerHTML = `
            <div class="card">
                <img src="${producto.img}" class="card-img-top imgProductos" alt="${producto.nombre}">
                <div class="card-body">
                    <h5 class="card-title"> ${producto.nombre} </h5>
                    <p class="card-text"> ${producto.precio} </p>
                    <p class="card-text"> ${producto.cantidad} </p>
                    <button class="btn colorBoton" id="eliminar${producto.id}"> Eliminar Producto </button> <br><br>
                    <button class="btn colorBoton" id="aumentar${producto.id}"> + </button>
                    <button class="btn colorBoton" id="disminuir${producto.id}"> - </button>
                </div>
            </div>
        `
        contenedorCarrito.appendChild(card);

        const eliminar = document.getElementById(`disminuir${producto.id}`);
        eliminar.addEventListener("click", () => {
            disminuirCantidad(producto.id);
        })

        const aumentar = document.getElementById(`aumentar${producto.id}`);
        aumentar.addEventListener("click", () => {
            aumentarCantidad(producto.id)
        })

        const boton = document.getElementById(`eliminar${producto.id}`);
        boton.addEventListener("click", () => {
            eliminarDelCarrito(producto.id);
        })
    })
    calcularTotal();
}

const aumentarCantidad = (id) => {
    const producto = carrito.find((producto) => producto.id === id);
    producto.cantidad++;
    localStorage.setItem("carrito",JSON.stringify(carrito));
    mostrarCarrito();
}
const disminuirCantidad = (id) => {
    const producto = carrito.find((producto) => producto.id === id);
    producto.cantidad--;
    if(producto.cantidad === 0){
        eliminarDelCarrito(id);
    }else{
        localStorage.setItem("carrito",JSON.stringify(carrito));
    }
    mostrarCarrito();
}

const eliminarDelCarrito = (id) => {
    const producto = carrito.find((producto) => producto.id === id);
    const indice = carrito.indexOf(producto);
    carrito.splice(indice, 1);
    mostrarCarrito();
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

const vaciarCarrito = document.getElementById("vaciarCarrito");

vaciarCarrito.addEventListener("click", () => {
    eliminarTodoElCarrito();
})

const eliminarTodoElCarrito = () => {
    carrito = [];
    mostrarCarrito();    
    localStorage.clear();
}

const total = document.getElementById("total");

const calcularTotal = () => {
    let totalCompra = 0; 
    carrito.forEach((producto) => {
        totalCompra += producto.precio * producto.cantidad;
        
    })
    total.innerHTML = `Total: $${totalCompra}`;
}

