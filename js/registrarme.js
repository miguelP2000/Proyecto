function registrarCliente() {
    let nombre = document.getElementById("nombre").value;
    let cedula = document.getElementById("cedula").value;
    let contraseña = document.getElementById("contraseña").value;
    if (!isNaN(cedula)) {
        if (parseInt(cedula) > 0) {
            if (nombre != "" && cedula != "" && contraseña != "") {
                if (!existeCliente(cedula)) {
                    agregarClienteLocal(nombre, cedula, contraseña);
                    location.href = 'login.html';
                } else {
                    alert("Cliente con cédula ya registrada");
                }
            }
        } else {
            alert("No es una cédula válida");
        }
    } else {
        alert("La cédula deben ser solo dígitos");
    }
}

function existeCliente(cedula) {
    for (let i = 0; i < localStorage.length; i++) {
        let clave = localStorage.key(i);
        if (cedula == clave) {
            return true;
        }
    }
    return false;
}

function agregarClienteLocal(nombre, cedula, contraseña) {
    let arrCliente = [];
    let datosCliente = {
        nombre: nombre,
        cedula: cedula,
        contraseña: contraseña
    };
    let arrCarritoCliente = [];
    arrCliente.push(datosCliente);
    arrCliente.push(arrCarritoCliente);
    let arrClienteJson = JSON.stringify(arrCliente);
    localStorage.setItem(cedula, arrClienteJson);
}