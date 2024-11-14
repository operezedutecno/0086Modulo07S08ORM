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
        await this.consultar();
        const descripcion = `Titulo: ${this._titulo}, Autor: ${this._autor}, Año: ${this._anio}, Disponible: ${this._disponible ? 'Si' : 'No'}`
        return descripcion;
    }

    async prestar() {
        await this.consultar();

        if(!this._disponible) {
            console.log("Libro no disponible");
            return false
        }
        const argumentos = {
            text:"UPDATE libros SET disponible=false WHERE id=$1 RETURNING *",
            values: [this._id]
        };
        const result = await conexion.query(argumentos);
        console.log("Libro prestado exitosamente");
        return result.rows
    }

    async devolver() {
        await this.consultar();
        if(this._disponible) {
            console.log("Imposible devolver, el libro se encuentra disponible");
            return false;
        }

        const argumentos = {
            text:"UPDATE libros SET disponible=true WHERE id=$1 RETURNING *",
            values: [this._id]
        };
        const result = await conexion.query(argumentos);
        console.log("Libro devuelto con éxito");
        return result.rows;

    }

    async registrar() {
        const argumentos = {
            text:"INSERT INTO libros(titulo,autor,anio) VALUES($1,$2,$3) RETURNING *",
            values: [this._titulo, this._autor, this._anio]
        };
        const result = await conexion.query(argumentos);
        return result.rows;
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