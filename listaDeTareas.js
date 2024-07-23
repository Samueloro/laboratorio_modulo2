class Tarea {
    constructor(id, descripcion, prioridad, estado) {
        this.id = id;
        this.descripcion = descripcion;
        this.prioridad = prioridad;
        this.estado = estado;
    }

    //Método para revisar la tarea 
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
        //si la cabeza está vacía coloca un nuevo nodo
        if (this.cabeza === null) {
            this.cabeza = nuevoNodo;
        } else {
            //variable para identificar el nodo actual
            let actual = this.cabeza;
            //siempre que un nodo esté ocupado va a buscar uno vacío
            while (actual.siguiente) {
                actual = actual.siguiente;
            }
            //asigna un nuevo nodo 
            actual.siguiente = nuevoNodo;
        }
    }

}

//COLA TAREAS EN PROGRESO 
class Cola {
    constructor() {
        this.items = [];
    }

    //colocar una nueva tarea 
    encolar(tarea) {
        this.items.push(tarea);
    }

    //eliminar tarea de la cola 
    desencolar() {
        //si está vacía la cola retorna el string
        if (this.estaVacia()) {
            return "Cola vacía";
        }
        return this.items.shift();
    }

    //vizualizar la cola de tareas 
    mostrar() {
        this.items.forEach(tarea => console.log(tarea.toString()));
    }
}

//PILA DE TAREAS COMPLETADAS 
class Pila {
    constructor() {
        this.items = [];
    }

    //poner nueva tarea
    apilar(tarea) {
        this.items.push(tarea);
    }

    //quitar tarea
    desapilar() {
        if (this.estaVacia()) {
            return "Pila vacía";
        }
        return this.items.pop();
    }

    //vizualizar la pila de tareas 
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

    //agregar tarea al arbol
    agregar(tarea) {
        //variable para el nuevo nodo 
        const nuevoNodo = new NodoArbol(tarea);
        //si la raiz está vacía la crea con un nuevo nodo 
        if (this.raiz === null) {
            this.raiz = nuevoNodo;
        } else {
            this._agregarNodo(this.raiz, nuevoNodo);
        }
    }

    _agregarNodo(nodo, nuevoNodo) {
        //comparar la prioridad de la tarea nueava con la del nodo actual

        if (nuevoNodo.tarea.prioridad < nodo.tarea.prioridad) {
            //si la prioridad es menor la insertta en el subarbol izquierdo 
            if (nodo.izquierda === null) {
                //si el hijo izquierdo está vacío lo agrega ahí 
                nodo.izquierda = nuevoNodo;
            } else {
                // llamado recursivo si el hijo izquierdo no está vacío
                this._agregarNodo(nodo.izquierda, nuevoNodo);
            }
        } else {
            //si la prioridad es mayor o igual la insertta en el subarbol derecho
            if (nodo.derecha === null) {
                //si el hijo derecho está vacío lo inserta ahí
                nodo.derecha = nuevoNodo;
            } else {
                 // llamado recursivo si el hijo derecho no está vacío
                this._agregarNodo(nodo.derecha, nuevoNodo);
            }
        }
    }

}

//GRAFO DEPENDENCIA ENTRE TAREAS 
class Grafo {
    constructor() {
        //inicializar nueva estancia de Map para almacenar vertices del grafo
        this.vertices = new Map();
    }

    agregarVertice(tarea) {
        //vrifica que no exista la tarea ya en el grafo
        if (!this.vertices.has(tarea.id)) {
            //si no existe la agrega al grafo
            this.vertices.set(tarea.id, []);
        }
    }

    agregarArista(tarea1, tarea2) {
        //verifica si ya existen los vertices tarea 1 y 2 
        if (this.vertices.has(tarea1.id) && this.vertices.has(tarea2.id)) {
            //si existen agrega una arista desde tarea 1 hacia tarea 2
            this.vertices.get(tarea1.id).push(tarea2.id);
        }
    }

}

//AGREGAR TAREA 
function agregarTarea(lista, arbol, tarea) {
    //agrega la tarea a la lista
    lista.agregar(tarea);
    //agrega la tarea al arbol
    arbol.agregar(tarea);
}
//MOVER TAREAS
function moverTarea(lista, cola, tareaId) {
    let actual = lista.cabeza;//cabeza de la lista
    let anterior = null;

    //recorre la lista hasta encontrar el ID o llegar al final de la lista 
    while (actual !== null && actual.tarea.id !== tareaId) {
        anterior = actual; // actualiza el nodo anterior
        actual = actual.siguiente; // avanza al siguiente nodo 
    }
    //si se encuentra el nodo con ID 
    if (actual !== null) {
        //si el nodo a mover es la cabeza de la lista 
        if (anterior === null) {
            lista.cabeza = actual.siguiente;//actualiza la cabeza de la lista al siguiente nodo 
        } else {
            //si no es la cabeza, actualiza el enlace al nodo anterior
            anterior.siguiente = actual.siguiente;
        }
        //encola la tarea encontrada 
        cola.encolar(actual.tarea);
    }
}


//BUSCAR POR ID O PRIORIDAD 
function buscarTareaPorId(lista, tareaId) {
    let actual = lista.cabeza;//iniciar desde la cabeza de la lista 
    //recorrer la lista hasta encontrar el id 
    while (actual !== null) {
        if (actual.tarea.id === tareaId) {
            return actual.tarea;//retorna la tarea encontrada 
        }
        actual = actual.siguiente;//avanza al siguiente nodo en la lista 
    }
    return null;//si no la encuentra 
}

function buscarTareaPorPrioridad(arbol, prioridad) {
    //utilizamos la función auxiliar  para buscar la tarea en el arbol 
    return _buscarTareaPorPrioridad(arbol.raiz, prioridad);
}
//FUNCION AUX
function _buscarTareaPorPrioridad(nodo, prioridad) {
    if (nodo === null) {
        return null;//si no se encuentra la tarea retorna null 
    }
    if (nodo.tarea.prioridad === prioridad) {
        return nodo.tarea; // si la prioridad concide retorna la tarea 
    } else if (prioridad < nodo.tarea.prioridad) { // si la prioridad es menor busca en el nodo izquierdo 
        return _buscarTareaPorPrioridad(nodo.izquierda, prioridad);
    } else { // si es mayor busca en el derecho 
        return _buscarTareaPorPrioridad(nodo.derecha, prioridad);
    }
}

//ORDENAR POR PRIORIDAD 
function ordenarTareasPorPrioridad(arbol) {
    let resultado = []; //variable para almacecaer el resultado 
    //llamamos a la funcion aux para buscar 
    _inOrden(arbol.raiz, resultado);
    return resultado; //retorna el array con las tareas ordenada por prioridad 
}
//Fución AUX
function _inOrden(nodo, resultado) {
    if (nodo !== null) {
        //recorrer subarbol izquierdo 
        _inOrden(nodo.izquierda, resultado);
        //agregar la tarea del nodo actual 
        resultado.push(nodo.tarea);
        //recorrer el arbol derecho 
        _inOrden(nodo.derecha, resultado);
    }
}

//CICLOS EN EL GRAFO DE DEPENDENCIAS 
function detectarCiclos(grafo) {
    let visitado = new Set(); //conjunto para rastrear los vertices visitados
    let stack = new Set();//pila para rastrear el recorrido actual 

    //recorrer sobre cada vertice del grafo 
    for (let [tareaId] of grafo.vertices.entries()) {
        if (detectarCicloDFS(tareaId, visitado, stack, grafo)) {
            return true;
        }
    }
    return false;//si no encuentra ningún ciclo 
}
//DFS Busqueda en profundidad  FUNCION AUX
function detectarCicloDFS(vertice, visitado, stack, grafo) {
    if (!visitado.has(vertice)) {
        visitado.add(vertice);//marcar vertice como visitado 
        stack.add(vertice);//agregar el vertice a la lista de recorrido actual 

        //recorrer sobre cada vecino del vertice actual 
        for (let vecino of grafo.vertices.get(vertice)) {
            //retorna true si el vecino no ha sido visitado y si se detecta un ciclo 
            if (!visitado.has(vecino) && detectarCicloDFS(vecino, visitado, stack, grafo)) {
                return true;
            } else if (stack.has(vecino)) { //si el vecino ya está en la pila del recorrido actual retorna true 
                return true;
            }
        }
    }
    stack.delete(vertice); //elimina el vertice de la pila actual antese de regresar 
    return false;//si no  detecta ningún ciclo 
}


//FUNCIÓN PARA LOS DATOS DE PRUEBA

//en esta función se llama junto con la cantidad de datos de prueba 100-1000-10000
function generarDatosPrueba(cantidad) {
    let datos = []; //almacenar las tareas 
    for (let i = 0; i < cantidad; i++) {
        //crea una tarea con propiedades aleatorias 
        let tarea = new Tarea(i, `Tarea ${i}`, Math.floor(Math.random() * 10), 'pendiente');
        datos.push(tarea); // agrega la tarea al array de datos 
    }
    return datos; //retorna las tareas generadas 
}

//Para medir el tiempo esta función toma como argumento la función a la que se desea tomar el tiempo y los argumentos de la función correspondiente 
function medirTiempoEjecucion(func, ...args) {
    console.time('Tiempo de ejecución'); //inicia el temporizador 
    func(...args);//llama a la función con los argumentos necesarios 
    console.timeEnd('Tiempo de ejecución');// detiene el temporizador 
}

