// Variables y Selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');



// Eventos

eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded',preguntarPresupuesto);
    formulario.addEventListener('submit',agregarGasto);
}


// Clases
class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto (gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante (){
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter( gasto => gasto.id !== id);
        this.calcularRestante();

    }
}

class UI {
    insertarPresupuesto( cantidad ){
        const {presupuesto, restante} = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('alert', 'text-center');
        if (tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }
        divMensaje.textContent = mensaje; //mensaje del div
        document.querySelector('.primario').insertBefore(divMensaje, formulario);// insertar en el html

        setTimeout(() => {
            divMensaje.remove();
        }, 3000)
    }

    agregarGastosLista (gastos){
        this.limpiarHTML(); //eliminar el html previo
        gastos.forEach(gasto => {
            const { cantidad, nombre, id } = gasto;

            // crear li 
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            // nuevoGasto.setAttribute('data-id',id);
            nuevoGasto.dataset.id = id;

            //agregar el html del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad} </span>`


            //boton para el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn','btn-danger', 'btn-gasto');
            btnBorrar.textContent = 'X';
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            //agregar al DOM
            gastoListado.appendChild(nuevoGasto);
        })
    }

    limpiarHTML (){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){
        const { presupuesto, restante } = presupuestoObj;
        const restanteDiv = document.querySelector(".restante");
        // Comprobar 25%
        if ( (presupuesto / 4) >= restante ){
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if ( (presupuesto / 2) > restante){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }
        //SI el total es menor a cero
        if (restante <=0 ){
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled=true;
        }
    }
}

//Instanciar 
const ui = new UI();
let presupuesto;

// Funciones
function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('Cual es tu presupuesto?');
    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        window.location.reload();
    }
    //presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);
    ui.insertarPresupuesto(presupuesto);
}

//Agregar gasto
function agregarGasto (e){
    e.preventDefault();
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);
    // Validar
    if (nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;   
    } else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no valida', 'error');
        return;
    }

    //Generar object con el gasto
    const gasto = { nombre, cantidad, id: Date.now() }

    // agrega un nuevo gasto
    presupuesto.nuevoGasto( gasto );
    ui.imprimirAlerta('Gasto agregado correctamente'); //agregado correctamente

    //imprimir objeto
    const {gastos, restante} = presupuesto;
    ui.agregarGastosLista(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
    
    formulario.reset(); //reinicia el form
}

function eliminarGasto(id){
    presupuesto.eliminarGasto(id);
    const {gastos, restante} = presupuesto;
    ui.agregarGastosLista(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}