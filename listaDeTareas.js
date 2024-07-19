class Tarea {
    constructor(id, descripcion, prioridad, estado) {
        this.id = id;
        this.descripcion = descripcion;
        this.prioridad = prioridad;
        this.estado = estado;
    }

    toString() {
        return `Tarea(id=${this.id}, descripcion='${this.descripcion}', prioridad=${this.prioridad}, estado='${this.estado}')`;
    }
}

// ESTRUCTURAS PARA GESTIONAR TAREAS 
// LISTA ENLAZADA
class Nodo {
    constructor(tarea, siguiente = null) {
        this.tarea = tarea;
        this.siguiente = siguiente;
    }
}

class ListaEnlazada {
    constructor() {
        this.cabeza = null;
    }

    agregar(tarea) {
        const nuevoNodo = new Nodo(tarea);
        if (this.cabeza === null) {
            this.cabeza = nuevoNodo;
        } else {
            let actual = this.cabeza;
            while (actual.siguiente) {
                actual = actual.siguiente;
            }
            actual.siguiente = nuevoNodo;
        }
    }

    mostrar() {
        let actual = this.cabeza;
        while (actual) {
            console.log(actual.tarea.toString());
            actual = actual.siguiente;
        }
    }
}

//COLA TAREAS EN PROGRESO 
class Cola {
    constructor() {
        this.items = [];
    }

    encolar(tarea) {
        this.items.push(tarea);
    }

    desencolar() {
        if (this.estaVacia()) {
            return "Cola vacía";
        }
        return this.items.shift();
    }

    estaVacia() {
        return this.items.length === 0;
    }

    mostrar() {
        this.items.forEach(tarea => console.log(tarea.toString()));
    }
}

//PILA DE TAREAS COMPLETADAS 
class Pila {
    constructor() {
        this.items = [];
    }

    apilar(tarea) {
        this.items.push(tarea);
    }

    desapilar() {
        if (this.estaVacia()) {
            return "Pila vacía";
        }
        return this.items.pop();
    }

    estaVacia() {
        return this.items.length === 0;
    }

    mostrar() {
        this.items.forEach(tarea => console.log(tarea.toString()));
    }
}

//ARBOL BINARIO BUSQUEDA POR PRIORIDAD 

class NodoArbol {
    constructor(tarea) {
        this.tarea = tarea;
        this.izquierda = null;
        this.derecha = null;
    }
}

class ArbolBinarioBusqueda {
    constructor() {
        this.raiz = null;
    }

    agregar(tarea) {
        const nuevoNodo = new NodoArbol(tarea);
        if (this.raiz === null) {
            this.raiz = nuevoNodo;
        } else {
            this._agregarNodo(this.raiz, nuevoNodo);
        }
    }

    _agregarNodo(nodo, nuevoNodo) {
        if (nuevoNodo.tarea.prioridad < nodo.tarea.prioridad) {
            if (nodo.izquierda === null) {
                nodo.izquierda = nuevoNodo;
            } else {
                this._agregarNodo(nodo.izquierda, nuevoNodo);
            }
        } else {
            if (nodo.derecha === null) {
                nodo.derecha = nuevoNodo;
            } else {
                this._agregarNodo(nodo.derecha, nuevoNodo);
            }
        }
    }

    mostrar() {
        this._mostrarNodo(this.raiz);
    }

    _mostrarNodo(nodo) {
        if (nodo !== null) {
            this._mostrarNodo(nodo.izquierda);
            console.log(nodo.tarea.toString());
            this._mostrarNodo(nodo.derecha);
        }
    }
}

//GRAFO DEPENDENCIA ENTRE TAREAS 
class Grafo {
    constructor() {
        this.vertices = new Map();
    }

    agregarVertice(tarea) {
        if (!this.vertices.has(tarea.id)) {
            this.vertices.set(tarea.id, []);
        }
    }

    agregarArista(tarea1, tarea2) {
        if (this.vertices.has(tarea1.id) && this.vertices.has(tarea2.id)) {
            this.vertices.get(tarea1.id).push(tarea2.id);
        }
    }

    mostrar() {
        for (let [tareaId, adyacentes] of this.vertices.entries()) {
            console.log(`${tareaId} -> ${adyacentes.join(', ')}`);
        }
    }
}

//AGREGAR TAREA 
function agregarTarea(lista, arbol, tarea) {
    lista.agregar(tarea);
    arbol.agregar(tarea);
}
//MOVER TAREAS
function moverTarea(lista, cola, tareaId) {
    let actual = lista.cabeza;
    let anterior = null;
    while (actual !== null && actual.tarea.id !== tareaId) {
        anterior = actual;
        actual = actual.siguiente;
    }
    if (actual !== null) {
        if (anterior === null) {
            lista.cabeza = actual.siguiente;
        } else {
            anterior.siguiente = actual.siguiente;
        }
        cola.encolar(actual.tarea);
    }
}


//BUSCAR POR ID O PRIORIDAD 
function buscarTareaPorId(lista, tareaId) {
    let actual = lista.cabeza;
    while (actual !== null) {
        if (actual.tarea.id === tareaId) {
            return actual.tarea;
        }
        actual = actual.siguiente;
    }
    return null;
}

function buscarTareaPorPrioridad(arbol, prioridad) {
    return _buscarTareaPorPrioridad(arbol.raiz, prioridad);
}

function _buscarTareaPorPrioridad(nodo, prioridad) {
    if (nodo === null) {
        return null;
    }
    if (nodo.tarea.prioridad === prioridad) {
        return nodo.tarea;
    } else if (prioridad < nodo.tarea.prioridad) {
        return _buscarTareaPorPrioridad(nodo.izquierda, prioridad);
    } else {
        return _buscarTareaPorPrioridad(nodo.derecha, prioridad);
    }
}

//ORDENAR POR PRIORIDAD 
function ordenarTareasPorPrioridad(arbol) {
    let resultado = [];
    _inOrden(arbol.raiz, resultado);
    return resultado;
}

function _inOrden(nodo, resultado) {
    if (nodo !== null) {
        _inOrden(nodo.izquierda, resultado);
        resultado.push(nodo.tarea);
        _inOrden(nodo.derecha, resultado);
    }
}

//CICLOS EN EL GRAFO DE DEPENDENCIAS 
function detectarCiclos(grafo) {
    let visitado = new Set();
    let stack = new Set();

    for (let [tareaId] of grafo.vertices.entries()) {
        if (detectarCicloDFS(tareaId, visitado, stack, grafo)) {
            return true;
        }
    }
    return false;
}

function detectarCicloDFS(vertice, visitado, stack, grafo) {
    if (!visitado.has(vertice)) {
        visitado.add(vertice);
        stack.add(vertice);

        for (let vecino of grafo.vertices.get(vertice)) {
            if (!visitado.has(vecino) && detectarCicloDFS(vecino, visitado, stack, grafo)) {
                return true;
            } else if (stack.has(vecino)) {
                return true;
            }
        }
    }
    stack.delete(vertice);
    return false;
}


//FUNCIÓN PARA LOS DATOS DE PRUEBA

//en esta función se llama junto con la cantidad de datos de prueba 100-1000-10000
function generarDatosPrueba(cantidad) {
    let datos = [];
    for (let i = 0; i < cantidad; i++) {
        let tarea = new Tarea(i, `Tarea ${i}`, Math.floor(Math.random() * 10), 'pendiente');
        datos.push(tarea);
    }
    return datos;
}

//Para medir el tiempo esta función toma como argumento la función a la que se desea tomar el tiempo y los argumentos de la función correspondiente 
function medirTiempoEjecucion(func, ...args) {
    console.time('Tiempo de ejecución');
    func(...args);
    console.timeEnd('Tiempo de ejecución');
}

