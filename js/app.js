let client = {
    table: '',
    hour: '',
    pedido: []
};

const e = document;

const category = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
}

const btnSaveClient = document.getElementById('guardar-cliente');
btnSaveClient.addEventListener('click', savedCliente);

function savedCliente() {
    const table = document.getElementById('mesa').value
    const hour = document.getElementById('hora').value

    //Revisar si ay campos vacios

    const fieldsEmptys = [ table, hour].some(field => field === '' )

    if(fieldsEmptys) {
        const existAlert = document.querySelector('.invalid-feedback');
        if(!existAlert) {
            const alert = document.createElement('div');
            alert.classList.add('invalid-feedback', 'd-block', 'text-center');
            alert.textContent = 'Todos los campos son obligatorios';
            document.querySelector('.modal-body form').appendChild(alert);

            setTimeout(() => {
                alert.remove();
            }, 3000);
        }

        return;
        
    }
    //Asignar datos del formulario a cliente
    client = { ...client, table, hour, };

    // console.log(client)

    //ocultar modal
    const modalForm = document.getElementById('formulario');
    const modalBoostrap = bootstrap.Modal.getInstance(modalForm);
    modalBoostrap.hide()

    //mostrar secciones

    showSections();

    //obtener platillos de la apo

    getPlatillos()

}

function showSections() {
    const sectionsHiden = document.querySelectorAll('.d-none');
    sectionsHiden.forEach( section => section.classList.remove('d-none'));
}

function getPlatillos() {
    const url = 'http://localhost:4000/platillos';

    fetch(url)
        .then(res => res.json())
        .then(result => showPlatillos(result))
        .catch(error => console.log(error))
}

function showPlatillos(platillos) {
    // console.log(platillos)
    const content = document.querySelector('#platillos .contenido');

    platillos.forEach(platillo => {
        // console.log(platillo)
        const row = document.createElement('div');
        row.classList.add('row', 'py-3', 'border-top');

        const name = document.createElement('div');
        name.classList.add('col-md-4');
        name.textContent = platillo.nombre;

        const price = document.createElement('div');
        price.classList.add('col-md-3', 'fw-bold');
        price.textContent = `$${platillo.precio}`

        const categroy = document.createElement('div');
        categroy.classList.add('col-md-3');
        categroy.textContent = category[platillo.categoria]

        const inputCanti = document.createElement('input');
        inputCanti.type = 'number';
        inputCanti.min = 0;
        inputCanti.value = 0;
        inputCanti.id = `producto-${platillo.id}`;
        inputCanti.classList.add('form-control')

        // Funcion que detecta la cantidad y el platillo que se esta adding

        inputCanti.onchange = () => {
            const cantidad = parseInt(inputCanti.value)
            addPlatilo({...platillo, cantidad});
            // console.log(cantidad)
        }


        const add = document.createElement('div');
        add.classList.add('col-md-2');
        add.appendChild(inputCanti)

        row.appendChild(name);
        row.appendChild(price);
        row.appendChild(categroy);
        row.appendChild(add);
        content.appendChild(row);
    })

}

function addPlatilo(producto) {
    // console.log(producto)
    let {pedido }= client
    // Reviasr que la cantidad sea mayor a cero
    if(producto.cantidad > 0) {
        if(pedido.some(articulo => articulo.id === producto.id)) {
            // el artticulo ya existe
            const pedidoUpdate = pedido.map( articulo => {
                if(articulo.id === producto.id ) {
                    articulo.cantidad = producto.cantidad;
                }
                return articulo
            });
            clearInterval.pedido = [...pedidoUpdate]
        } else {
            client.pedido = [...pedido, producto]
        }
    }else {
        // Eliminar elementos cuabdi es 
        const result = pedido.filter(articulo => articulo.id !== producto.id )
        client.pedido = [...result]
    }
    // console.log(client.pedido)

    //Limoiar html
    clearhtml()

    if(client.pedido.length) {
        // mostrar resumen
         uppdateResumen()
    }else {
        mensajePedidoVacio()
    }
    
}

function uppdateResumen() {
    // console.log('acsdsd')
    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('div');
    resumen.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow');
    // informacion de la mesa
    const mesa = document.createElement('p');
    mesa.textContent = `Mesa: `;
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('span');
    mesaSpan.textContent = client.table;
    mesaSpan.classList.add('fw-normal');

    // informacion de la hora
    const hora = document.createElement('p');
    hora.textContent = `Hora: `;
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('span');
    horaSpan.textContent = client.hour;
    horaSpan.classList.add('fw-normal');

    const heading = document.createElement('h3');
    heading.textContent = 'Platillos consumidos';
    heading.classList.add('my-4', 'text-center')

    //Iterar

    const grupo = document.createElement('ul');
    grupo.classList.add('list-group');
    const {pedido} = client;
    pedido.forEach( articulo => {
        const { nombre, cantidad, precio} = articulo;
        const lista = document.createElement('li');
        lista.classList.add('list-group-item');

        const nombreEL = document.createElement('h4');
        nombreEL.classList.add('my-4');
        nombreEL.textContent = nombre;

        const cantidadEl = e.createElement('p');
        cantidadEl.classList.add('fw-bold');
        cantidadEl.textContent = 'Cantidad: '

        const cantidadValor = e.createElement('span');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad

        const precioEl = e.createElement('p');
        precioEl.classList.add('fw-bold');
        precioEl.textContent = 'Precio: $'

        const precioValor = e.createElement('span');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = precio

        const subtotalEl = e.createElement('p');
        subtotalEl.classList.add('fw-bold');
        subtotalEl.textContent = 'Subtotal: $'

        const subtotalValor = e.createElement('span');
        subtotalValor.classList.add('fw-normal');
        subtotalValor.textContent = calcularSubTotal(precio, cantidad)

        const btnEliminar = e.createElement('button');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent = 'Eliminar del pedido';

        btnEliminar.onclick = function() {
            eliminarProducto(articulo.id)
        }

        cantidadEl.appendChild(cantidadValor);
        precioEl.appendChild(precioValor);
        subtotalEl.appendChild(subtotalValor);
        


        lista.appendChild(nombreEL)
        lista.appendChild(cantidadEl)
        lista.appendChild(precioEl)
        lista.appendChild(subtotalEl)
        lista.appendChild(btnEliminar)

        grupo.appendChild(lista)
    })
    

    mesa.appendChild(mesaSpan)
    hora.appendChild(horaSpan)


    resumen.appendChild(heading)

    resumen.appendChild(mesa)
    resumen.appendChild(hora)
    resumen.appendChild(grupo)

    contenido.appendChild(resumen)

    // Mostrar formulario de propinas
    formPropinas()
}

function clearhtml() {
    const contenido = document.querySelector('#resumen .contenido');

    while( contenido.firstChild) {
        contenido.removeChild(contenido.firstChild)
    }
}

function calcularSubTotal(precio, cantidad) {
    return precio * cantidad;
}

function eliminarProducto(id) {
    const {pedido} = client
    const result = pedido.filter(articulo => articulo.id !== id )
    client.pedido = [...result]

     //Limoiar html
     clearhtml()
     if(client.pedido.length) {
        // mostrar resumen
         uppdateResumen()
    }else {
        mensajePedidoVacio()
    }

    //el producto se elimino
    const productoEliminado = `#producto-${id}`
    const inputEliminado = e.querySelector(productoEliminado)
    inputEliminado.value = 0
    
}

function mensajePedidoVacio () {
    const contenido = document.querySelector('#resumen .contenido');

    const texto = e.createElement('p');
    texto.classList.add('text-center');
    texto.textContent = 'Añade los elementos del pedido';

    contenido.appendChild(texto)

}

function formPropinas() {
    const contenido = document.querySelector('#resumen .contenido');

    const formulario = e.createElement('div');
    formulario.classList.add('col-md-6', 'formulario');

    // Radio Button

    const radio10 = e.createElement('input');
    radio10.type = 'radio';
    radio10.name = 'propina';
    radio10.value = "10";
    radio10.classList.add('form-check-input');
    radio10.onclick = () => calcularPropina();

    const radio10Label = e.createElement('label');
    radio10Label.textContent = '10%';
    radio10Label.classList.add('form-check-label');

    const radio10Div = e.createElement('div');
    radio10Div.classList.add('form-check');

    radio10Div.appendChild(radio10)
    radio10Div.appendChild(radio10Label)

    //Radio 25 %

    const radio25 = e.createElement('input');
    radio25.type = 'radio';
    radio25.name = 'propina';
    radio25.value = "25";
    radio25.classList.add('form-check-input');
    radio25.onclick = () => calcularPropina()

    const radio25Label = e.createElement('label');
    radio25Label.textContent = '25%';
    radio25Label.classList.add('form-check-label');

    const radio25Div = e.createElement('div');
    radio25Div.classList.add('form-check');

    radio25Div.appendChild(radio25)
    radio25Div.appendChild(radio25Label)

    //Radio 50

    const radio50 = e.createElement('input');
    radio50.type = 'radio';
    radio50.name = 'propina';
    radio50.value = "50";
    radio50.classList.add('form-check-input');
    radio50.onclick = () => calcularPropina();

    const radio50Label = e.createElement('label');
    radio50Label.textContent = '50%';
    radio50Label.classList.add('form-check-label');

    const radio50Div = e.createElement('div');
    radio50Div.classList.add('form-check');

    radio50Div.appendChild(radio50)
    radio50Div.appendChild(radio50Label)

    const divFormulario = e.createElement('div');
    divFormulario.classList.add('card', 'py-2', 'px-3', 'shadow')


    const heading = e.createElement('h3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Propina';

    divFormulario.appendChild(heading)
    divFormulario.appendChild(radio10Div)
    divFormulario.appendChild(radio25Div)
    divFormulario.appendChild(radio50Div)
    
    formulario.appendChild(divFormulario);

    contenido.appendChild(formulario);

}

function calcularPropina() {
    // console.log('adadadadadad')
    let subtotal = 0;
    const {pedido} = client;

    //Calcular el subtotal a pagar
    pedido.forEach( articulo => {
        subtotal += articulo.cantidad * articulo.precio
    });

    //Selecionar el radio
    const propinaSelecionada = e.querySelector('[name="propina"]:checked').value
    // console.log(propinaSelecionada)

    // console.log(subtotal);
    const propina = ( (subtotal * parseInt(propinaSelecionada))) / 100

    const total = subtotal + propina
    console.log(total)

    mostrarTotalHTML( subtotal, total, propina)
}

function mostrarTotalHTML( subtotal, total, propina) {

    const divTotales = e.createElement('div');
    divTotales.classList.add('total-pagar', 'my-5')

    // subtotal
    const subParrafo = e.createElement('p');
    subParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
    subParrafo.textContent = 'Subtotal Consumo ';

    const subSpan = e.createElement('span');
    subSpan.classList.add('fw-normal');
    subSpan.textContent = `$${subtotal}`

    subParrafo.appendChild(subSpan);

    // propina
    const proParrafo = e.createElement('p');
    proParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
    proParrafo.textContent = 'Propina ';
 
    const proSpan = e.createElement('span');
    proSpan.classList.add('fw-normal');
    proSpan.textContent = `$${propina}`
 
    proParrafo.appendChild(proSpan);

    // total
    const totalParrafo = e.createElement('p');
    totalParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
    totalParrafo.textContent = 'Total Consumo ';
 
    const totalSpan = e.createElement('span');
    totalSpan.classList.add('fw-normal');
    totalSpan.textContent = `$${total}`
 
    totalParrafo.appendChild(totalSpan);

    //Elimiinar ultimo resultado
    const totalPagarDiv = e.querySelector('.total-pagar');
    if(totalPagarDiv) {
        totalPagarDiv.remove()
    }

    divTotales.appendChild(subParrafo);
    divTotales.appendChild(proParrafo);
    divTotales.appendChild(totalParrafo);

    const formulario = e.querySelector('.formulario > div');

    formulario.appendChild(divTotales);

}