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
    .get(ctrlEmpleado.authenticate,ctrlArticulo.mostrarArticulos)
    .post( ctrlEmpleado.authenticate,upload.array("fotos"), ctrlArticulo.crearArticulo);
router
    .route('/empresa/:idEmpresa/articulo/completo')
    .get(ctrlEmpleado.authenticate,ctrlArticulo.mostrarArticulosCompleto);

router
    .route("/empresa/:idEmpresa/articulo/:idArticulo")
    .get(ctrlEmpleado.authenticate,ctrlEmpleado.authenticate,ctrlArticulo.mostrarArticulo)
    .put(ctrlEmpleado.authenticate,ctrlArticulo.actualizarArticulo)
    .delete(ctrlEmpleado.authenticate,ctrlArticulo.borrarArticulo);
router
    .route("/empresa/:idEmpresa/articulo/:idArticulo/fotos")
    .post(ctrlEmpleado.authenticate,upload.array("fotos"),ctrlArticulo.agregarFotos)
    .delete(ctrlEmpleado.authenticate,ctrlArticulo.borrarFotos);

router
    .route("/empresa")
    .get(ctrlEmpresa.mostrarEmpresas)
    .post(ctrlEmpresa.crearEmpresa);

router
    .route("/empresa/:idEmpresa")
    .get(ctrlEmpresa.mostrarEmpresa)
    .put(ctrlEmpleado.authenticate,ctrlEmpresa.actualizarEmpresa)
    .delete(ctrlEmpleado.authenticate,ctrlEmpresa.borrarEmpresa);

router
    .route("/empresa/:idEmpresa/cargo")
    .get(ctrlEmpleado.authenticate,ctrlCargo.mostrarCargos)
    .post(ctrlEmpleado.authenticate,ctrlCargo.crearCargo);
router
    .route("/empresa/:idEmpresa/cargo/completo")
    .get(ctrlEmpleado.authenticate,ctrlCargo.mostrarCargosCompleto);

router
    .route("/empresa/:idEmpresa/cargo/:idCargo")
    .get(ctrlEmpleado.authenticate,ctrlCargo.mostrarCargo)
    .put(ctrlEmpleado.authenticate,ctrlEmpleado.authenticate,ctrlCargo.actualizarCargo)
    .delete(ctrlEmpleado.authenticate,ctrlCargo.borrarCargo);

router
    .route("/empresa/:idEmpresa/sucursal")
    .post(ctrlEmpleado.authenticate,ctrlSucursal.crearSucursal)
    .get(ctrlEmpleado.authenticate,ctrlSucursal.mostrarSucursales);
router
    .route("/empresa/:idEmpresa/sucursal/completo")
    .get(ctrlEmpleado.authenticate,ctrlSucursal.mostrarSucursalesCompleto);

router
    .route("/empresa/:idEmpresa/sucursal/:idSucursal")
    .get(ctrlEmpleado.authenticate,ctrlSucursal.mostrarSucursal)
    .put(ctrlEmpleado.authenticate,ctrlSucursal.actualizarSucursal)
    .delete(ctrlEmpleado.authenticate,ctrlSucursal.borrarSucursal);

router
    .route("/empresa/:idEmpresa/empleado")
    .post(ctrlEmpleado.authenticate,ctrlEmpleado.crearEmpleado)
    .get(ctrlEmpleado.authenticate,ctrlEmpleado.mostrarEmpleados);
router
    .route("/empresa/:idEmpresa/empleado/completo")
    .get(ctrlEmpleado.authenticate,ctrlEmpleado.mostrarEmpleadosCompleto);

router
    .route("/empresa/:idEmpresa/empleado/login")
    .post(ctrlEmpleado.login);

router
    .route("/empresa/:idEmpresa/empleado/:idEmpleado")
    .get(ctrlEmpleado.authenticate,ctrlEmpleado.authenticate,ctrlEmpleado.mostrarEmpleado)
    .put(ctrlEmpleado.authenticate,ctrlEmpleado.authenticate,ctrlEmpleado.actualizarEmpleado)
    .delete(ctrlEmpleado.authenticate,ctrlEmpleado.authenticate,ctrlEmpleado.borrarEmpleado);

router
    .route("/empresa/:idEmpresa/empleado/:idEmpleado/rol")
    .post(ctrlEmpleado.authenticate,ctrlEmpleado.agregarRol)
    .get(ctrlEmpleado.authenticate,ctrlEmpleado.mostrarRoles)
    .delete(ctrlEmpleado.authenticate,ctrlEmpleado.borrarRol);

router
    .route("/empresa/:idEmpresa/rol")
    .post(ctrlEmpleado.authenticate,ctrlRol.crearRol)
    .get(ctrlEmpleado.authenticate,ctrlRol.mostrarRoles);
router
    .route("/empresa/:idEmpresa/rol/completo")
    .get(ctrlEmpleado.authenticate,ctrlRol.mostrarRolesCompleto);

router
    .route("/empresa/:idEmpresa/rol/:idRol")
    .put(ctrlEmpleado.authenticate,ctrlRol.actualizarRol)
    .delete(ctrlEmpleado.authenticate,ctrlRol.borrarRol)
    .get(ctrlEmpleado.authenticate,ctrlRol.mostrarRol);



module.exports=router;



