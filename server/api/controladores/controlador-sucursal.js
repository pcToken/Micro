var mongoose = require("mongoose");
var Empresa = mongoose.model('Empresa');
var funciones = require("./funciones.js");

module.exports.crearSucursal = function(req, res){
    var sucursal = {
      nombreSucursal:req.body.nombreSucursal,
      ciudad:req.body.ciudad,
      direccion:req.body.direccion,
      georef:[req.body.long, req.body.lat],
      telefono:req.body.telefono,
      email:req.body.email
    };
    
    //guardando horarios en sucursal
    var horario = [];
    var dias = funciones._splitArray(req.body.dias);
    var horarios= funciones._splitArray(req.body.horarios);
    for(i =0;i<horarios.length;i++){
        horario.push({dia:dias[i],horario:horarios[i]});
    }
    sucursal.horario = horario;
    
    //agregar la sucursal a la empresa
    Empresa.findById(req.params.idEmpresa).exec(function(err, empresa){
        if(err) {
            console.log("error buscando empresa para agregar sucursal");
            res.status(404).json(err);
        }
        if(empresa.sucursal){
            empresa.sucursal.push(sucursal);
        }
        else{
            empresa.sucursal = [sucursal];
        }
        empresa.save(function(err, empresa){
            if(err) {
                console.log("error agregando sucursal");
                res.status(500).json(err);
            }
            console.log("Empresa con nueva sucursal ", empresa);
            res.status(201).json();
            
        });
    });
    
};
// mostrar todas las sucursales de una empresa
module.exports.mostrarSucursales = function(req, res){
    var idEmpresa = req.params.idEmpresa;
    Empresa.findById(idEmpresa).select("sucursal").exec(function(err,empresa){
        var sucursales = [];
        empresa.sucursal.map(function(e){
            if(e.activo){
                sucursales.push(e);
            }
        });
        var response = {
            status : 200,
            message: sucursales
        };

        if(err){
            console.log("error consiguiendo surcursales de empresa " + empresaId);
            response.status = 500;
            response.message = err;
        }
        else if(!empresa){
            response.status = 404;
            response.message = {
                "message" : "empresa no encontrado"
                };
        }

        res
            .status(response.status)
            .json(response.message);

        }); 
};
// mostrar todas las sucursales de una empresa incluyendo los eliminados
module.exports.mostrarSucursalesCompleto = function(req, res){
    var idEmpresa = req.params.idEmpresa;
    Empresa.findById(idEmpresa).select("sucursal").exec(function(err,empresa){
        var response = {
            status : 200,
            message: empresa.sucursal
        };

        if(err){
            console.log("error consiguiendo surcursales de empresa " + empresaId);
            response.status = 500;
            response.message = err;
        }
        else if(!empresa){
            response.status = 404;
            response.message = {
                "message" : "empresa no encontrado"
                };
        }

        res
            .status(response.status)
            .json(response.message);

        }); 
};
//mostrar una sucursal en especifico
module.exports.mostrarSucursal = function(req, res){
    var idEmpresa = req.params.idEmpresa;
    var idSucursal = req.params.idSucursal;
    Empresa.findById(idEmpresa).select("sucursal").exec(function(err,empresa){
        var response = {
                status : 200,
                message: empresa.sucursal.id(idSucursal)
            };

            if(err){
                console.log("error consiguiendo surcursal de empresa " + empresaId);
                response.status = 500;
                response.message = err;
            }
            else if(!empresa){
                response.status = 404;
                response.message = {
                    "message" : "empresa no encontrada"
                    };
            }
                res
                    .status(response.status)
                    .json(response.message);

        }); 
};
//actualizar una sucursal de una empresa
module.exports.actualizarSucursal = function(req, res){
    Empresa.findById(req.params.idEmpresa)
        .select("sucursal")
        .exec(function(err, empresa) {
            var sucursal = empresa.sucursal.id(req.params.idSucursal);
            var response = {
                status : 200,
                message: ""
            };

            if(err){
                console.log("error consiguiendo empresa " + empresaId);
                response.status = 500;
                response.message = err;
            }
            else if(!empresa){
                response.status = 404;
                response.message = {
                    "message" : "empresaID no encontrado"
                    };
            }
            else if(!sucursal){
                response.status = 404;
                response.message = {
                    "message" : "sucursal no encontrada"
                    };
            }
            if(response.status != 200){
                res
                .status(response.status)
                .json(response.message);
            }
            else{
                if(req.body.nombreSucursal) sucursal.nombreSucursal =req.body.nombreSucursal;
                if(req.body.ciudad) sucursal.ciudad =req.body.ciudad;
                if(req.body.direccion) sucursal.direccion =req.body.direccion;
                if(req.body.long) sucursal.georef[0] = req.body.long;
                if(req.body.lat) sucursal.georef[1] = req.body.lat;
                if(req.body.telefono) sucursal.telefono = req.body.telefono;
                if(req.body.horario){
                    //guardando horarios en sucursal
                    var dias = funciones._splitArray(req.body.dias);
                    var horarios= funciones._splitArray(req.body.horarios);
                    for(i =0;i<horarios.length;i++){
                        horario.push({dia:dias[i],horario:horarios[i]});
                    }
                    sucursal.horario = horario;
                } 
                if(req.body.email) sucursal.email = req.body.email;
                if(req.body.activo) sucursal.activo = req.body.activo;
                //save the updated instance
                empresa.save(function(err, empresaActualizada) {
                    if(err){
                        console.log("error actualizando empresa");
                        res
                        .status(500)
                        .json(err);
                    }
                    else{
                        console.log("sucursal actualizada = " + empresaActualizada);
                        res
                            .status(204)
                            .json();
                    }
                });
            }

        });
};
//eliminar una sucursal
module.exports.borrarSucursal = function(req, res){
    Empresa.findById(req.params.idEmpresa)
        .select("sucursal")
        .exec(function(err, empresa) {
            var sucursal = empresa.sucursal.id(req.params.idSucursal);
            var response = {
                status : 200,
                message: ""
            };

            if(err){
                console.log("error consiguiendo empresa " + empresaId);
                response.status = 500;
                response.message = err;
            }
            else if(!empresa){
                response.status = 404;
                response.message = {
                    "message" : "empresaID no encontrado"
                    };
            }
            else if(!sucursal){
                response.status = 404;
                response.message = {
                    "message" : "sucursal no encontrada"
                    };
            }
            if(response.status != 200){
                res
                .status(response.status)
                .json(response.message);
            }
            else{
                
                sucursal.activo = false;
                //save the updated instance
                empresa.save(function(err, empresaActualizada) {
                    if(err){
                        console.log("error actualizando empresa");
                        res
                        .status(500)
                        .json(err);
                    }
                    else{
                        console.log("sucursal actualizada = " + empresaActualizada);
                        res
                            .status(204)
                            .json();
                    }
                });
            }

        });
};