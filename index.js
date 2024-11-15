const { createServer } = require("http");
const url = require("url");
const Libro = require("./clases/Libro.js");
const port = 3000;


createServer(async (request, response) => {
    const urlParsed = url.parse(request.url, true);
    const path = urlParsed.pathname;
    const method = request.method;

    // console.log(urlParsed);

    response.setHeader("Content-type","application/json");

    if(method == 'GET' && path == '/libro/listar') {
        const libro = new Libro();
        const result = await libro.listar();
        return response.end(JSON.stringify({ "message": "Libros registrados", data: result}));
    }

    if(method == 'GET' && path == '/libro/describir') {
        const id = urlParsed.query.id;
        const libro = new Libro(id);
        const description = await libro.describir();
        if(!description) {
            response.writeHead(404);
            return response.end(JSON.stringify({ "message": "Libro no existente"}));
        }
        return response.end(JSON.stringify({ "message": "Datos descriptivos del libro", description: description }));
    }
    
    if(method == 'POST' && path == '/libro/prestar') {
        let body = "";
        request.on("data", (chunk) => {
            body += chunk.toString();
        });

        return request.on("end", async () => {
            body = JSON.parse(body);
            const libro = new Libro(body.id)
            const result = await libro.prestar();
            response.writeHead(result.code);
            return response.end(JSON.stringify({ "message": result.message }));
        })
    }

    if(method == 'POST' && path == '/libro/devolver') {
        let body = "";
        request.on("data", (chunk) => {
            body += chunk.toString();
        });

        return request.on("end", async () => {
            body = JSON.parse(body);
            const libro = new Libro(body.id);
            const result = await libro.devolver();
            response.writeHead(result.code);
            return response.end(JSON.stringify({ "message": result.message }));
        })
    }

    if(method == 'POST' && path == '/libro/registrar') {
        let body = "";
        request.on("data", (chunk) =>{
            body += chunk.toString();
        })

        return request.on("end", async () => {
            body = JSON.parse(body);

            const libro = new Libro(null, body.titulo, body.autor, body.anio);
            
            if(!(await libro.validarRegistro())) {
                response.writeHead(409);
                return response.end(JSON.stringify({message: "Libro registrado previamente"}))
            }


            const [result] = await libro.registrar();
            return response.end(JSON.stringify({ message: "Libro registrado exitosamente", data: result }))
        })
        
    }

    if(method == 'PUT' && path == '/libro/editar') {
        let body = "";
        request.on("data", (chunk) =>{
            body += chunk.toString();
        })

        return request.on("end", async () => {
            body = JSON.parse(body);
            const libro = new Libro(urlParsed.query.id, body.titulo, body.autor, body.anio);
            const [result] = await libro.editar();
            return response.end(JSON.stringify({ message: "Libro editado exitosamente", data: result }))
        })
        
    }
    
    
    
    response.end(JSON.stringify({ "message": "Ruta no existente"}));

}).listen(port, () => console.log(`Aplicación ejecutándose por el puerto ${port}`));

// Ejemplo de registro de libro
// const libro1 = new Libro(null ,"El viejo y el mar", "Ernest Hemingway", 1952)
// const result = libro1.registrar();
// console.log({ result });

// Ejemplo de consulta de libro
// (async () => {
//     const libro2 = new Libro(2);
//     await libro2.consultar()
//     console.log({ libro2 });
// })()

// Ejemplo de describir libro
// (async () => {
//     const libro2 = new Libro(2);
//     const respuesta = await libro2.describir();
//     console.log(respuesta);
// })()



// Ejemplo de prestar libro.
// (async () => {
//     const libro2 = new Libro(2);
//     console.log(await libro2.describir());
//     const respuesta = await libro2.prestar();
//     // console.log(respuesta);
//     console.log(await libro2.describir());
// })()


// Ejemplo para devolver libro
// (async () => {
//     const libro2 = new Libro(2);
//     console.log(await libro2.describir());
//     const respuesta = await libro2.devolver();
//     // console.log(respuesta);
//     console.log(await libro2.describir());
// })()



