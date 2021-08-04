const criptomonedasSelect = document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

const obtenerCriptomonedas = criptomonedas => new Promise(resolve => resolve(criptomonedas));

const objBusqueda = {
    moneda: "",
    criptomoneda: ""
}

document.addEventListener("DOMContentLoaded", () => {
    consultarCriptomoneda();
    formulario.addEventListener("submit", submitFormulario);
    criptomonedasSelect.addEventListener("change", leerValor);
    monedaSelect.addEventListener("change", leerValor);
});

async function consultarCriptomoneda() {
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;

    try {
        const response = await fetch(url);
        const result = await response.json();
        const criptomonedas = await obtenerCriptomonedas(result.Data);
        selectCriptomonedas(criptomonedas);
    } catch (error) {
        console.log(error);
    }
}

function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(criptomoneda => {
        const option = document.createElement('option');
        const { FullName, Name} = criptomoneda.CoinInfo;
        option.value = Name;
        option.textContent = FullName;

        criptomonedasSelect.appendChild(option);
    })
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
    e.preventDefault();
    const { moneda, criptomoneda } = objBusqueda;

    if(moneda === "" || criptomoneda === "") {
        mostrarAlerta("Ambos campos son obligatorios.");
        return;
    }

    // Consultar la API
    consultarAPI();
}

function mostrarAlerta(mensaje) {
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("error");
    divMensaje.textContent = mensaje;

    if(!document.querySelector(".error")) {
        formulario.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
}

async function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    try {
        const response = await fetch(url);
        const result = await response.json();
        mostrarCotizacionHTML(result.DISPLAY[criptomoneda][moneda]);
    } catch (error) {
        console.log(error);
    }
}

function mostrarSpinner() {
    limpiarHTML();

    const spinner = document.createElement("div");
    spinner.classList.add("spinner");

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    resultado.appendChild(spinner);
}

function mostrarCotizacionHTML(cotizacion) {
    limpiarHTML();

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    const precio = document.createElement("p");
    precio.classList.add("precio");
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement("p");
    precioAlto.innerHTML = `El precio más alto del día: <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement("p");
    precioBajo.innerHTML = `El precio más bajo del día: <span>${LOWDAY}</span>`;

    const ultimasHoras = document.createElement("p");
    ultimasHoras.innerHTML = `Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}</span>`;

    const ultimaActualizacion = document.createElement("p");
    ultimaActualizacion.innerHTML = `Última actualización: <span>${LASTUPDATE}</span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
}

function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}