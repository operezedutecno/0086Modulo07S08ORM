const conexion = require("./../conexion.js");

class Libro {

    constructor(id, titulo, autor, anio, disponible) {
        this._id = id;
        this._titulo = titulo;
        this._autor = autor;
        this._anio = anio;
        this._disponible = disponible;
    }

    // Métodos personalizados.
    async describir() {
        const consulta = await this.consultar();
        if(!consulta) {
            return null
        }
        const descripcion = `Titulo: ${this._titulo}, Autor: ${this._autor}, Año: ${this._anio}, Disponible: ${this._disponible ? 'Si' : 'No'}`
        return descripcion;
    }

    async prestar() {
        const consulta = await this.consultar();

        if(!consulta) {
            return { message: "Libro no existente", code: 404 }
        }

        if(!this._disponible) {
            return { message: "Libro no disponible", code: 422 }
        }
        const argumentos = {
            text:"UPDATE libros SET disponible=false WHERE id=$1 RETURNING *",
            values: [this._id]
        };
        const result = await conexion.query(argumentos);
        return { message: "Libro prestado exitosamente", code: 200 }
    }

    async devolver() {
        const consulta = await this.consultar();

        if(!consulta) {
            return { message: "Libro no existente", code: 404 }
        }

        if(this._disponible) {
            return { message: "Imposible devolver, el libro se encuentra disponible", code: 422 }
        }

        const argumentos = {
            text:"UPDATE libros SET disponible=true WHERE id=$1 RETURNING *",
            values: [this._id]
        };
        const result = await conexion.query(argumentos);
        return { message: "Libro devuelto con éxito", code: 200 }

    }

    async registrar() {
        const argumentos = {
            text:"INSERT INTO libros(titulo,autor,anio) VALUES($1,$2,$3) RETURNING *",
            values: [this._titulo, this._autor, this._anio]
        };
        const result = await conexion.query(argumentos);
        return result.rows;
    }

    async editar() {
        const argumentos = {
            text:"UPDATE libros SET titulo=$1, autor=$2, anio=$3 WHERE id=$4 RETURNING *",
            values: [this._titulo, this._autor, this._anio, this._id]
        }
        const result = await conexion.query(argumentos);
        return result.rows;
    }

    async validarRegistro() {
        const argumentos = {
            text:"SELECT * FROM libros WHERE titulo=$1 AND anio=$3 AND autor=$2",
            values: [this._titulo, this._autor, this._anio]
        };
        const result = await conexion.query(argumentos);
        return result.rowCount == 0;
    }

    async validarActualizacion() {
        const argumentos = {
            text:"SELECT * FROM libros WHERE titulo=$1 AND anio=$3 AND autor=$2 AND id <> $4",
            values: [this._titulo, this._autor, this._anio, this._id]
        };
        const result = await conexion.query(argumentos);
        return result.rowCount == 0;
    }

    async consultar() {
        const result = await conexion.query("SELECT * FROM libros WHERE id=$1",[this._id]);
        if(result.rowCount == 0)
            return null
        const libro = result.rows[0];
        this._titulo = libro.titulo;
        this._anio = libro.anio;
        this._autor = libro.autor;
        this._disponible = libro.disponible;
        return true
    }

    async listar() {
        const result = await conexion.query("SELECT * FROM libros ORDER BY titulo ASC");
        return result.rows;
    }

    // Accesadores y mutadores (Getters y Setters)
    get titulo() {
        return this._titulo
    }
    set titulo(valor) {
        this._titulo = valor
    }

    get autor() {
        return this._autor
    }
    set autor(valor) {
        this._autor = valor
    }

    get anio() {
        return this._anio
    }
    set anio(valor) {
        this._anio = valor
    }

    get disponible() {
        return this._disponible
    }
    set disponible(valor) {
        this._disponible = valor
    }
}

module.exports = Libro