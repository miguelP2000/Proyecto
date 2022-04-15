function ingresarCliente() {
    let cedula = document.getElementById("cedula").value;
    let contraseña = document.getElementById("contraseña").value;
    if (!isNaN(cedula)) {
        if (parseInt(cedula) > 0) {
            if (cedula != "" && contraseña != "") {
                if (existeCliente(cedula)) {
                    if (coincideCedulaContraseña(cedula, contraseña)) {
                        sessionStorage.setItem("Login Actual", cedula);
                        location.href = 'index.html';
                    } else {
                        alert("La contraseña es incorrecta");
                    }
                } else {
                    alert("No se ha registrado")
                }
            } else {
                alert("Faltan campos por llenar")
            }
        } else {
            alert("No es una cédula válida");
        }
    } else {
        alert("La cédula deben ser solo dígitos");
    }
}

function coincideCedulaContraseña(cedula, contraseña) {
    let arr = JSON.parse(localStorage.getItem(cedula));
    if (arr[0].contraseña == contraseña) {
        return true;
    } else {
        return false;
    }
}