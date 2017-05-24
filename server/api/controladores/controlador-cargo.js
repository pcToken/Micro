var mongoose = require('mongoose');
var Cargo = mongoose.model('Cargo');
var Empresa  = mongoose.model("Empresa");
function guardarCargo(req, res, cargo, func){
    
     Cargo.create(cargo,function(err, cargo) {
        if(err){
            res.status(400).json(err);
            console.log(err);
        }
        else{
            func(cargo._id);
            res.status(201).json(cargo);
        }
    });
}
//crear un nuevo cargo para una empresa bajo un cargo o de gerente General
module.exports.crearCargo = function(req, res) {
    var cargo= {
        esArea: req.body.esArea,
        nombre: req.body.nombre,
        empresa:req.params.idEmpresa
    };
    if(req.body.padre){
        Cargo.findById(req.body.padre).exec(function(err, cargoPadre){
            if(err){
                res.status(400).json(err);
                console.log(err);
            }
            else{
                console.log("CARGO PADRE", cargoPadre);
                cargo.padre = cargoPadre._id;
                var cargoId;
                guardarCargo(req, res, cargo, function(cargoId){
                    if(cargoPadre.hijos){
                        cargoPadre.hijos.push(cargoId);    
                    }
                    else{
                        cargoPadre.hijos = [cargoId];
                    }
                    cargoPadre.save(function(err, guardado){
                        if(err){
                            console.log("no se pudo guardar el nuevo hijo al padre especificado");
                        }
                        else{
                            console.log("padre con nuevo hijo: ", guardado);
                        }
                    });
                });
                
            }
        });
    }
    else{
        Empresa.findById(cargo.empresa).exec(function(err, empresa){
            if(err){
                res.status(500).json(err);
                console.log(err);
            }
            else{
                guardarCargo(req, res, cargo, function(cargoId){
                    empresa.gerenteGeneral = cargoId;
                    empresa.save(function(err, guardada){
                        if(err){
                            res.status(500).json(err);
                            console.log(err);
                        }
                        else{
                            console.log("gerente  general agregado: ", guardada);
                        }
                    });
                });
                
            }
        });
    }
};
//mostrar los cargos asociados a una empresa sin los hijos
module.exports.mostrarCargos = function(req, res){
    var idEmpresa = req.params.idEmpresa;
    Cargo.find({empresa:idEmpresa,activo:true}).select("-hijos").exec(function(err,cargos){
        var response = {
                status : 200,
                message: cargos
            };

            if(err){
                console.log("error consiguiendo cargos de empresa " + empresaId);
                response.status = 500;
                response.message = err;
            }
            else if(!cargos){
                response.status = 404;
                response.message = {
                    "message" : "cargos no encontrado"
                    };
            }
            if(response.status != 200){
                res
                .status(response.status)
                .json(response.message);
            }
            else{
                res
                    .status(response.status)
                    .json(response.message);
            }

        }); 
};
//mostrar los cargos asociados a una empresa sin los hijos
module.exports.mostrarCargosCompleto = function(req, res){
    var idEmpresa = req.params.idEmpresa;
    Cargo.find({empresa:idEmpresa}).select("-hijos").exec(function(err,cargos){
        var response = {
                status : 200,
                message: cargos
            };

            if(err){
                console.log("error consiguiendo cargos de empresa " + empresaId);
                response.status = 500;
                response.message = err;
            }
            else if(!cargos){
                response.status = 404;
                response.message = {
                    "message" : "cargos no encontrado"
                    };
            }
            if(response.status != 200){
                res
                .status(response.status)
                .json(response.message);
            }
            else{
                res
                    .status(response.status)
                    .json(response.message);
            }

        }); 
};
//mostrar cargo en especifico
module.exports.mostrarCargo = function(req, res){
    Cargo.findById(req.params.idCargo).exec(function(err,cargo){
        var response = {
                status : 200,
                message: cargo
            };

            if(err){
                console.log("error consiguiendo cargo de empresa " + empresaId);
                response.status = 500;
                response.message = err;
            }
            else if(!cargo){
                response.status = 404;
                response.message = {
                    "message" : "cargo no encontrado"
                    };
            }
            if(response.status != 200){
                res
                .status(response.status)
                .json(response.message);
            }
            else{
                res
                    .status(response.status)
                    .json(response.message);
            }

        }); 
};
//actualizar cargo en especifico
module.exports.actualizarCargo = function(req, res){
     Cargo.findById(req.params.idCargo)
        .select("-hijos")
        .exec(function(err, cargo) {
        
            var response = {
                status : 200,
                message: cargo
            };

            if(err){
                console.log("error consiguiendo cargo " + empresaId);
                response.status = 500;
                response.message = err;
            }
            else if(!cargo){
                response.status = 404;
                response.message = {
                    "message" : "cargoID no encontrado"
                    };
            }
            if(response.status != 200){
                res
                .status(response.status)
                .json(response.message);
            }
            else{
                if(req.body.nombre) cargo.nombre = req.body.nombre;
                if(req.body.esArea) cargo.esArea = req.body.esArea;
                if(req.body.empresa) cargo.empresa = req.body.empresa;
                if(req.body.activo) cargo.activo = req.body.activo;
                if(req.body.padre) 
                {    //cambiando en hijos del padre viejo
                    // creo nuevo array sin el hijo y lo asigno
                    Cargo.findById(cargo.padre).exec(function(err, padre){
                        var hijos = [];
                        for(var index = 0, len = padre.hijos.length; index<len; index ++){
                            if(!padre.hijos[index]._id.equals( cargo._id)){
                                hijos.push(padre.hijos[index]._id);
                            }
                        }
                        padre.hijos = hijos;
                        padre.save(function(err, padre){
                            console.log("Removido de padre viejo: ", padre);
                        });
                    });
                    cargo.padre = req.body.padre;
                }
                //guardando cargo actualizado y guardandolo en su nuevo padre
                cargo.save(function(err, cargoActualizado) {
                    if(err){
                        console.log("error actualizando cargo");
                        res
                        .status(500)
                        .json(err);
                    }
                    else{
                        console.log("cargo actualizado = " + cargoActualizado);
                        if(req.body.padre) {
                            //cambiando en hijos del padre
                            Cargo.findById(req.body.padre).exec(function(err, padre){
                                if(err){
                                    response.status= 500;
                                    response.message = err
                                }
                                if(padre.hijos){
                                    padre.hijos.push(cargoActualizado._id);
                                }
                                else{
                                    padre.hijos= [cargoActualizado._id];
                                }
                                padre.save(function(err, padreGuardado){
                                    if(err){
                                        response.status= 500;
                                        response.message = err
                                    }
                                    else{
                                        console.log("nuevo padre", padreGuardado);
                                    }
                                })
                            });
                        }
                        res
                            .status(204)
                            .json();
                    }
                });
            }

        });
};
//eliminar cargo

module.exports.borrarCargo = function(req, res){
    Cargo.findById(req.params.idCargo)
        .exec(function(err, cargo) {
        if(err){
           res.status(500).json({message: " ERROR SERVIDOR "});
            return; 
        }
        else if(!cargo){
            res.status(400).json({message: " NO ENCONTRADO "});
            return;
        }
        var tieneHijoActivo = false;
        
        for (var i = 0;i < cargo.hijos.length; i++)
        {
            tieneHijoActivo= (cargo.hijos[i].activo)? true: cargo.hijos[i].activo;
        }
        var response = {
            status : 200,
            message: ""
        };
        
        if(tieneHijoActivo){
            response.status = 400;
            response.message = "Error: cargo tiene hijos";
        }
        else{
            cargo.activo = false;
            cargo.save(function(err, cargo){
                 if(err){
                   res.status(500).json({message: " ERROR SERVIDOR "});
                    return; 
                }
                response.status = 202;
                response.message = cargo;
            });
        }
        res.status(response.status).json(response.message);
            
    });
};