validarSesion();

var arrProductos = [];

fetch('./../js/productos.json')
    .then((respuesta) => respuesta.json())
    .then((data) => {
        arrProductos = data;
        crearProductos(arrProductos);
        actualizarCarrito();
    })


function validarSesion() {
    if (sessionStorage.length == 0) {
        location.href = 'login.html';
    }
}

function cerrarSesion() {
    sessionStorage.clear();
}

function realizarCompra() {
    if (!estaVacioCarrito()) {
        Swal.fire({
            title: 'Confirmar Compra',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, quiero comprar!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Compra confirmada!',
                    'Tu compra ha sido realizada.',
                    'success'
                )
                let cedula = sessionStorage.getItem("Login Actual");
                let arrCliente = JSON.parse(localStorage.getItem(cedula));
                let arrNuevo = [];
                arrCliente[1] = arrNuevo
                localStorage.setItem(cedula, JSON.stringify(arrCliente));
                eliminarTablaCarrito();
                totalPagar();
            }
        })
    } else {
        Swal.fire('No hay productos en el carrito')
    }
}

function crearProductos(arrProductos) {
    let productArea = document.getElementById("content")
    arrProductos.forEach(aux => {
        productArea.innerHTML += `
        <div class="p-3 container rounded text-center carta">
            <div class="row">
                <img src="${aux.imagen}" alt="${aux.nombre}" width="190px" height="190px">
            </div>
            <div class="row mt-3 text-break">
                <p>${aux.nombre}</p>
            </div>
            <div class="row">
                <p>$${aux.precio + " " + "c/u"}</p>
            </div>
            <div class="row">
                <button type="button" class="btn btn-primary" onclick="agregarProductoCarrito(${aux.id});totalPagar()">Agregar al Carrito</button>
            </div>
        </div>`;
    });
}

function agregarProductoCarrito(id) {
    let producto;
    let cedula = sessionStorage.getItem("Login Actual");
    if (!existeProducto(id, cedula)) {
        let arr = JSON.parse(localStorage.getItem(cedula));
        arrProductos.forEach(e => {
            if (e.id == id) {
                producto = e;
                arr[1].push(producto);
                localStorage.setItem(cedula, JSON.stringify(arr));
            }
        });
        let insertarCarrito = document.getElementById("carrito");
        insertarCarrito.innerHTML += `
                <tr id="${producto.id}" class="border text-center ">
                    <td class="centrar">${producto.id}</td>
                    <td><img src="${producto.imagen}" width="55px" height="55px"></td>
                    <td class="centrar">${producto.nombre}</td>
                    <td id="precio-${producto.id}" class="testclass centrar">${producto.precio}</td>
                    <td class="centrar"><input type="number" id="cantidad-${producto.id}" onchange="modificarCantidad(${producto.id});modificarPrecio(${producto.id})" min="1" value="${producto.cantidad}"></td>
                    <td class="centrar-boton"><button class="btn btn-danger" onclick="eliminarProducto(${producto.id})">Eliminar</button></td>
                </tr>`;
        actualizarCantidadCarrito();
        actualizarPrecioCarrito();
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Ya se agrego al carrito',
            timer: 1500,
        });
    }
}

function existeProducto(id, cedula) {
    let res = false;
    let arr = JSON.parse(localStorage.getItem(cedula))[1];
    arr.forEach(e => {
        if (e.id == id) {
            res = true;
            return true;
        }
    });
    return res;
}

function actualizarCarrito() {
    let cedula = sessionStorage.getItem("Login Actual");
    let arr = JSON.parse(localStorage.getItem(cedula))[1];
    arr.forEach(e => {
        let insertarCarrito = document.getElementById("carrito");
        insertarCarrito.innerHTML += `
                <tr id="${e.id}" class="border text-center ">
                    <td class="centrar">${e.id}</td>
                    <td><img src="${e.imagen}" width="55px" height="55px"></td>
                    <td class="centrar">${e.nombre}</td>
                    <td id="precio-${e.id}" class="testclass centrar">${e.precio}</td>
                    <td class="centrar"><input type="number" id="cantidad-${e.id}" onchange="modificarCantidad(${e.id});modificarPrecio(${e.id})" min="1" value="${e.cantidad}"></td>
                    <td class="centrar-boton"><button class="btn btn-danger" onclick="eliminarProducto(${e.id})">Eliminar</button></td>
                </tr>`;
    });
    totalPagar();
}

function eliminarProducto(id) {
    let cedula = sessionStorage.getItem("Login Actual");
    let arr = JSON.parse(localStorage.getItem(cedula))[1];
    let arrModificado = arr.filter(e => e.id !== id);
    let arrCliente = JSON.parse(localStorage.getItem(cedula));
    arrCliente[1] = arrModificado;
    localStorage.setItem(cedula, (JSON.stringify(arrCliente)));
    document.getElementById(id).remove();
    totalPagar();
    Swal.fire({
        icon: 'error',
        title: 'Se ha eliminado',
        timer: 1500,
    });
}

function eliminarTablaCarrito() {
    var tableHeaderRowCount = 1;
    var table = document.getElementById('miTabla');
    var rowCount = table.rows.length;
    for (var i = tableHeaderRowCount; i < rowCount; i++) {
        table.deleteRow(tableHeaderRowCount);
    }
}

function estaVacioCarrito() {
    let cedula = sessionStorage.getItem("Login Actual");
    let arr = JSON.parse(localStorage.getItem(cedula))[1];
    if (!arr[0]) {
        return true;
    } else {
        return false;
    }
}

function modificarCantidad(id) {
    let cedula = sessionStorage.getItem("Login Actual");
    let arr = JSON.parse(localStorage.getItem(cedula))[1];
    let cantNueva = parseInt(document.getElementById("cantidad-" + id).value);
    let arrCliente = JSON.parse(localStorage.getItem(cedula));
    arr.forEach(e => {
        if (e.id == id) {
            e.cantidad = cantNueva;
        }
    });
    arrCliente[1] = arr;
    localStorage.setItem(cedula, JSON.stringify(arrCliente));
    totalPagar();

}

function actualizarCantidadCarrito() {
    let cedula = sessionStorage.getItem("Login Actual");
    let arr = JSON.parse(localStorage.getItem(cedula))[1];
    arr.forEach(e => {
        let clave = e.id;
        document.getElementById("cantidad-" + clave).value = e.cantidad;
    });
    totalPagar();
}

function modificarPrecio(id) {
    let cedula = sessionStorage.getItem("Login Actual");
    let arr = JSON.parse(localStorage.getItem(cedula))[1];
    let arrCliente = JSON.parse(localStorage.getItem(cedula));
    let cantNueva = parseInt(document.getElementById("cantidad-" + id).value)
    let precio;
    arrProductos.forEach(aux => {
        if (aux.id == id) {
            precio = aux.precio;
        }
    });
    arr.forEach(e => {
        if (e.id == id) {
            e.precio = precio * cantNueva;
            document.getElementById("precio-" + id).innerText = e.precio;
        }
    });
    arrCliente[1] = arr;
    localStorage.setItem(cedula, JSON.stringify(arrCliente));
    totalPagar();
}

function actualizarPrecioCarrito() {
    let cedula = sessionStorage.getItem("Login Actual");
    let arr = JSON.parse(localStorage.getItem(cedula))[1];
    arr.forEach(e => {
        let clave = e.id;
        document.getElementById("precio-" + clave).innerText = e.precio;
    });
    totalPagar();
}

function totalPagar() {
    let precioFinal = 0;
    document.querySelectorAll(".testclass").forEach((j) => {
        precioFinal += parseInt(j.innerHTML);
    });
    document.getElementById("monto").innerHTML = "$" + " " + precioFinal;
}