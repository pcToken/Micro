var express = require('express');
var path  = require("path");
var router = express.Router();
var ctrlArticulo = require('../controladores/controlador-articulos.js');
var ctrlEmpresa = require('../controladores/controlador-empresas.js');
var ctrlCargo = require("../controladores/controlador-cargo.js");
var ctrlSucursal = require("../controladores/controlador-sucursal.js");
var ctrlEmpleado = require("../controladores/controlador-empleado.js");
var ctrlRol = require("../controladores/controlador-rol.js");
var multer = require("multer");
var upload= multer({ dest: './uploads/'});
router
    .route('/empresa/:idEmpresa/articulo')
//    mostrar todos los articulos
//    {
//        devuelve: {
//            exito: [200,"Arreglo Json con todos los articulos activos"],
//            fracaso: [404,500]
//        },
//        recibe: {}
//    }
    .get(ctrlEmpleado.authenticate,ctrlArticulo.mostrarArticulos)
    // crea articulo:
//    {
//        devuelve: {
//            exito: [201,"objeto json con el articulo creado"],
//            fracaso: [400,500,404]
//        },
//        recibe: {
//            codigo : ["String","obligatorio"],
//            nombre : ["String","obligatorio"],
//            fotos : ["Arreglo de fotos(binarios)", "opcional"],
//            nombresFotos: ["String","opcional,obligatorio si envia fotos", "nombres de las fotos separados por ; ej: gatito.jpg;perrito.jpg"],
//            descripcionesFotos: ["String","opcional,obligatorio si envia fotos"],
//            enlaces: ["String","opcional","enlaces del articulo separados por ; ej: http://www.google.com;http://www.facebook.com"],
//            caracteristica:["String","opcional","breve descripcion del articulo"],
//            embalaje:["String","opcional","define si es articulo o paquete u otra forma(formas posibles definidas en el modelo)"],
//            cantidadPorPaquete:["Entero","opcional","indica que cantidad de de articulos vienen dentro en caso de ser necesario"],
//            precio:["Numero","obligatorio"],
//            moneda:["String","obligatorio","monedas posibles definidas en el modelo"],
//            stock:["Numero","obligatorio"],
//            clasificacion:["objeto json","opcional"],
//            padre:["String","opcional","codigo del articulo padre"]
//        }
//    }
    .post( ctrlEmpleado.authenticate,upload.array("fotos"), ctrlArticulo.crearArticulo);

router
    .route('/empresa/:idEmpresa/articulo/completo')
//    mostrar todos los articulos completo
//    {
//        devuelve: {
//            exito: [200,"Arreglo Json con todos los articulos incluyendo los no activos"],
//            fracaso: [404,500]
//        },
//        recibe: {}
//    }
    .get(ctrlEmpleado.authenticate,ctrlArticulo.mostrarArticulosCompleto);

router
    .route("/empresa/:idEmpresa/articulo/:codigoArticulo")
//    mostrar un articulo
//    {
//        devuelve: {
//            exito: [200,"objeto json con articulo especificado en los parametros del URL"],
//            fracaso: [404,500]
//        },
//        recibe: {}
//    }
    .get(ctrlEmpleado.authenticate,ctrlEmpleado.authenticate,ctrlArticulo.mostrarArticulo)
//actualizar articulo
//    {
//        devuelve: {
//            exito: [204,""],
//            fracaso: [404,500]
//        },
//        recibe: {
//            codigo : ["String","opcional"],
//            nombre : ["String","opcional"],
//            enlaces: ["String","opcional","enlaces del articulo separados por ; ej: http://www.google.com;http://www.facebook.com"],
//            caracteristica:["String","opcional","breve descripcion del articulo"],
//            embalaje:["String","opcional","define si es articulo o paquete u otra forma(formas posibles definidas en el modelo)"],
//            cantidadPorPaquete:["Entero","opcional","indica que cantidad de de articulos vienen dentro en caso de ser necesario"],
//            precio:["Numero","opcional"],
//            moneda:["String","opcional","monedas posibles definidas en el modelo"],
//            stock:["Numero","opcional"],
//            clasificacion:["objeto json","opcional"],
//            padre:["String","opcional","codigo del articulo"]
//        }
//    }
    .put(ctrlEmpleado.authenticate,ctrlArticulo.actualizarArticulo)
//    borrar articulo
//    {
//        devuelve:{
//            exito: [204],
//            fracaso:[404,500];
//        },
//        recibe:{}
//    }
    .delete(ctrlEmpleado.authenticate,ctrlArticulo.borrarArticulo);
router
    .route("/empresa/:idEmpresa/articulo/:codigoArticulo/fotos")
//    agregar fotos
//    {
//        devuelve:{
//            exito:[204],
//            fracaso[500,400]
//        },
//        recibe:{
//            fotos : ["Arreglo de fotos(binarios)", "opcional"],
//            nombresFotos: ["String","opcional,obligatorio si envia fotos", "nombres de las fotos separados por ; ej: gatito.jpg;perrito.jpg"],
//            descripcionesFotos: ["String","opcional,obligatorio si envia fotos"],
//        }
//    }
    .post(ctrlEmpleado.authenticate,upload.array("fotos"),ctrlArticulo.agregarFotos)
//    borrar fotos
//    {
//        devuelve:{
//            exito:[204],
//            fracaso:[500,404,400]
//        },
//        recibe:{
//            idFotos:["String","obligatorio","string con los id de las fotos que se desea borrar separados por ;"]
//        }
//    }
    .delete(ctrlEmpleado.authenticate,ctrlArticulo.borrarFotos);

router
    .route("/empresa")
//    mostrar empresa
//    {
//        devuelve: {
//            exito: [200,"Arreglo Json con todas las empresas activas"],
//            fracaso: [500]
//        },
//        recibe: {}
//    }
    .get(ctrlEmpresa.mostrarEmpresas)
//    crear empresa
//    {
//        devuelve: {
//            exito: [201],
//            fracaso: [400,500]
//        },
//        recibe: {
//            _id:["String","obligatorio","palabra que represente el nombre de la empresa"],
//            nombre:["String","obligatorio","nombre oficial de la empresa"]
//        }
//    }
    .post(ctrlEmpresa.crearEmpresa);

router
    .route("/empresa/:idEmpresa")
//    mostrar empresa
//    {
//        devuelve: {
//            exito: [200,"Arreglo json con todas las empresas activas"],
//            fracaso: [404,500]
//        },
//        recibe: {
//            _id:["String","obligatorio","palabra que represente el nombre de la empresa"],
//            nombre:["String","obligatorio","nombre oficial de la empresa"]
//        }
//    }
    .get(ctrlEmpresa.mostrarEmpresa)
//    actualizar empresa 
//     {
//        devuelve: {
//            exito: [204],
//            fracaso: [404,500]
//        },
//        recibe: {
//            nombre:["String","opcional","nombre oficial de la empresa"]
//        }
//    }
    .put(ctrlEmpleado.authenticate,ctrlEmpresa.actualizarEmpresa)
//    borrar empresa 
//     {
//        devuelve: {
//            exito: [204],
//            fracaso: [404,500]
//        },
//        recibe: {}
//    }
    .delete(ctrlEmpleado.authenticate,ctrlEmpresa.borrarEmpresa);

router
    .route("/empresa/:idEmpresa/cargo")
//    mostrar cargos
//     {
//        devuelve: {
//            exito: [200,"Arreglo json con todos los cargos activos de la empresa"],
//            fracaso: [404,500]
//        },
//        recibe: {}
//    }
    .get(ctrlEmpleado.authenticate,ctrlCargo.mostrarCargos)
//    crear cargo
//     {
//        devuelve: {
//            exito: [201],
//            fracaso: [404,500]
//        },
//        recibe: {
//            esArea:["Boolean","obligatorio","indica si el cargo es un area o un cargo individual"],
//            nombre:["String","obligatorio"],
//            padre: ["Object Id","opcional","id del articulo padre, si no se coloca este campo se asume que este cargo sera la cabeza de la empresa"];
//        }
//    }
    .post(ctrlEmpleado.authenticate,ctrlCargo.crearCargo);
router
    .route("/empresa/:idEmpresa/cargo/completo")
//    mostrar cargos completo
//     {
//        devuelve: {
//            exito: [200,"Arreglo json con todos los cargos de la empresa incluyendo los no activos"],
//            fracaso: [404,500]
//        },
//        recibe: {}
//    }
    .get(ctrlEmpleado.authenticate,ctrlCargo.mostrarCargosCompleto);

router
    .route("/empresa/:idEmpresa/cargo/:idCargo")
//    mostrar cargo
//     {
//        devuelve: {
//            exito: [200,"objeto json"],
//            fracaso: [404,500]
//        },
//        recibe: {}
//    }    
    .get(ctrlEmpleado.authenticate,ctrlCargo.mostrarCargo)
//    actualizar cargo
//     {
//        devuelve: {
//            exito: [204],
//            fracaso: [404,500]
//        },
//        recibe: {
//            esArea:["Boolean","opcional","indica si el cargo es un area o un cargo individual"],
//            nombre:["String","opcional"],
//            activo:["Boolean","opcional","indica si el cargo esta eliminado o activo"],
//            padre: ["Object Id","opcional","id del articulo padre, si envias 'none' se eliminara el padre"];
//        }
//    }
    .put(ctrlEmpleado.authenticate,ctrlEmpleado.authenticate,ctrlCargo.actualizarCargo)
//   eliminar cargo
//     {
//        devuelve: {
//            exito: [200],
//            fracaso: [404,400,500]
//        },
//        recibe: {}
//    }
    .delete(ctrlEmpleado.authenticate,ctrlCargo.borrarCargo);

router
    .route("/empresa/:idEmpresa/sucursal")
//   crear sucursal
//     {
//        devuelve: {
//            exito: [201],
//            fracaso: [400,500]
//        },
//        recibe: {
//            nombreSucursal:["String","obligatorio"],
//            ciudad:["String","opcional"],
//            direccion:["String","opcional"],
//            long:["Numero","opcional"],
//            lat:["Numero","opcional"],
//            telefono:["String","opcional"],
//            email:["String","opcional"],
//            dias:["String","opcional","string con dias separados por ; ej: lunes;martes"]
//            horarios:["String","opcional","string con horarios separados por ; ej: 8am-12pm;10am-5pm"]
//        }
//    }
    .post(ctrlEmpleado.authenticate,ctrlSucursal.crearSucursal)
//    mostrar sucursales
//     {
//        devuelve: {
//            exito: [200,"Arreglo json con todas las sucursales de la empresa"],
//            fracaso: [404,500]
//        },
//        recibe: {}
//    }
    .get(ctrlEmpleado.authenticate,ctrlSucursal.mostrarSucursales);
router
    .route("/empresa/:idEmpresa/sucursal/completo")
//    mostrar sucursales
//     {
//        devuelve: {
//            exito: [200,"Arreglo json con todas las sucursales de la empresa incluyendo las no activas"],
//            fracaso: [404,500]
//        },
//        recibe: {}
//    }
    .get(ctrlEmpleado.authenticate,ctrlSucursal.mostrarSucursalesCompleto);

router
    .route("/empresa/:idEmpresa/sucursal/:idSucursal")
//    mostrar sucursales
//     {
//        devuelve: {
//            exito: [200,"objeto json"],
//            fracaso: [404,500]
//        },
//        recibe: {}
//    }
    .get(ctrlEmpleado.authenticate,ctrlSucursal.mostrarSucursal)
//   actualizar sucursal
//     {
//        devuelve: {
//            exito: [2014],
//            fracaso: [400,500]
//        },
//        recibe: {
//            nombreSucursal:["String","opcional"],
//            ciudad:["String","opcional"],
//            direccion:["String","opcional"],
//            long:["Numero","opcional"],
//            lat:["Numero","opcional"],
//            telefono:["String","opcional"],
//            email:["String","opcional"],
//            dias:["String","opcional","string con dias separados por ; ej: lunes;martes"]
//            horarios:["String","opcional","string con horarios separados por ; ej: 8am-12pm;10am-5pm"]
//        }
//    }
    .put(ctrlEmpleado.authenticate,ctrlSucursal.actualizarSucursal)
//    borrar sucursal
//     {
//        devuelve: {
//            exito: [204],
//            fracaso: [404,500]
//        },
//        recibe: {}
//    }
    .delete(ctrlEmpleado.authenticate,ctrlSucursal.borrarSucursal);

router
    .route("/empresa/:idEmpresa/empleado")
//    crear empleado
//     {
//        devuelve: {
//            exito: [200,"Arreglo json con todas las sucursales de la empresa incluyendo las no activas"],
//            fracaso: [404,500]
//        },
//        recibe: {
//            nombre:["String","obligatorio"],
//            cargo:["String","obligatorio"],
//            login:["String","obligatorio"],
//            clave:["String","obligatorio"],["String","opcional"],
//            sucursal:["String","opcional"],
//            celular:["String","opcional"],
//            email:["String","opcional"],
//            direccion:["String","opcional"],
//            sexo:["String","opcional"],
//            fechaNacimiento:["String","opcional","formato MM/DD/YYYY"],
//            dias:["String","opcional"],
//            horarios:["String","opcional"]
//        }
//    }
    .post(ctrlEmpleado.authenticate,ctrlEmpleado.crearEmpleado)
//    mostrar empleados
//     {
//        devuelve: {
//            exito: [200,"Arreglo json con todos los empleados activos de una empresa"],
//            fracaso: [500]
//        },
//        recibe: {}
//    }
    .get(ctrlEmpleado.authenticate,ctrlEmpleado.mostrarEmpleados);
router
    .route("/empresa/:idEmpresa/empleado/completo")
//    mostrar empleados
//     {
//        devuelve: {
//            exito: [200,"Arreglo json con todos los empleados activos de una empresa incluyendo los no activos"],
//            fracaso: [500]
//        },
//        recibe: {}
//    }
    .get(ctrlEmpleado.authenticate,ctrlEmpleado.mostrarEmpleadosCompleto);

router
    .route("/empresa/:idEmpresa/empleado/login")
//    login
//     {
//        devuelve: {
//            exito: [200,"objeto json con token de autorizacion {token: "12312nkjadsf"}],
//            fracaso: [500,401,404]
//        },
//        recibe: {
//            login: ["String","obligatorio"],
//            clave: ["String","obligatorio"]
//        }
//    }
    .post(ctrlEmpleado.login);

router
    .route("/empresa/:idEmpresa/empleado/:idEmpleado")
//    mostrar empleado
//     {
//        devuelve: {
//            exito: [200,"objeto json"],
//            fracaso: [500,404,400]
//        },
//        recibe: {}
//    }
    .get(ctrlEmpleado.authenticate,ctrlEmpleado.authenticate,ctrlEmpleado.mostrarEmpleado)
//    actualizar empleado
//     {
//        devuelve: {
//            exito: [204],
//            fracaso: [404,500]
//        },
//        recibe: {
//            nombre:["String","opcional"],
//            cargo:["String","obligatorio"],
//            login:["String","opcional"],
//            clave:["String","opcional"],["String","opcional"],
//            sucursal:["String","opcional"],
//            celular:["String","opcional"],
//            email:["String","opcional"],
//            direccion:["String","opcional"],
//            sexo:["String","opcional"],
//            fechaNacimiento:["String","opcional","formato MM/DD/YYYY"],
//            dias:["String","opcional"],
//            horarios:["String","opcional"]
//        }
//    }
    .put(ctrlEmpleado.authenticate,ctrlEmpleado.authenticate,ctrlEmpleado.actualizarEmpleado)
//    crear empleado
//     {
//        devuelve: {
//            exito: [200],
//            fracaso: [404,500]
//        },
//        recibe: {}
//    }
    .delete(ctrlEmpleado.authenticate,ctrlEmpleado.authenticate,ctrlEmpleado.borrarEmpleado);

router
    .route("/empresa/:idEmpresa/empleado/:idEmpleado/rol")
//    crear empleado
//     {
//        devuelve: {
//            exito: [200,"objeto json empleado al que se agrego el rol"],
//            fracaso: [404,500]
//        },
//        recibe: {
//            idEmpleado:["String","obligatorio"],
//            rol:["String","obligatorio","String on los objectId de os roles separados por ;"]
//        }
//    }
    .post(ctrlEmpleado.authenticate,ctrlEmpleado.agregarRol)
//    mostrar roles
//     {
//        devuelve: {
//            exito: [200,"Arreglo json con todos los roles activos de un empleado"],
//            fracaso: [500,400]
//        },
//        recibe: {}
//    }
    .get(ctrlEmpleado.authenticate,ctrlEmpleado.mostrarRoles)
//    borrar rol de un empleado
//     {
//        devuelve: {
//            exito: [204],
//            fracaso: [500,404]
//        },
//        recibe: {}
//    }
    .delete(ctrlEmpleado.authenticate,ctrlEmpleado.borrarRol);

router
    .route("/empresa/:idEmpresa/rol")
//    crear rol
//     {
//        devuelve: {
//            exito: [201],
//            fracaso: [500,400]
//        },
//        recibe: {
//            nombre:["String","obligatorio"]
//        }
//    }
    .post(ctrlEmpleado.authenticate,ctrlRol.crearRol)
//    mostrar roles
//     {
//        devuelve: {
//            exito: [200,"Arreglo json con todos los roles activos de una empresa"],
//            fracaso: [500,400]
//        },
//        recibe: {}
//    }
    .get(ctrlEmpleado.authenticate,ctrlRol.mostrarRoles);
router
    .route("/empresa/:idEmpresa/rol/completo")
//    mostrar roles
//     {
//        devuelve: {
//            exito: [200,"Arreglo json con todos los roles activos de una empresa incluyendo los no activos"],
//            fracaso: [500,400]
//        },
//        recibe: {}
//    }
    .get(ctrlEmpleado.authenticate,ctrlRol.mostrarRolesCompleto);

router
    .route("/empresa/:idEmpresa/rol/:idRol")
//    actualizar rol
//     {
//        devuelve: {
//            exito: [201],
//            fracaso: [500,400,404]
//        },
//        recibe: {
//            nombre:["String","opcional"],
//            activo:["Boolean","opcional"]
//        }
//    }
    .put(ctrlEmpleado.authenticate,ctrlRol.actualizarRol)
//    borrar rol
//     {
//        devuelve: {
//            exito: [204],
//            fracaso: [500,400,404]
//        },
//        recibe: {}
//    }
    .delete(ctrlEmpleado.authenticate,ctrlRol.borrarRol)
//    mostrar rol
//     {
//        devuelve: {
//            exito: [200,"objeto json del rol"],
//            fracaso: [500,400,404]
//        },
//        recibe: {}
//    }
    .get(ctrlEmpleado.authenticate,ctrlRol.mostrarRol);



module.exports=router;



