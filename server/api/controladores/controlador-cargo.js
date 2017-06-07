var mongoose = require('mongoose');
var Cargo = mongoose.model('Cargo');
var Empresa  = mongoose.model("Empresa");
var promise = require("bluebird");
//guardar cargo, actualiza los datos de un cargo
function guardarCargo(cargo){
    return new promise(function(success, fail){
       cargo.save(function(err, cargoActualizado) {
                        if(err){
                            console.log(err);
                            fail(err);
                        }
                        else{
                            console.log("cargo actualizado = " + cargoActualizado);
                            success("actualizado");
                        }
                    }); 
    });
}
//crea un cargo nuevo y devuelve su id
function crearCargo(req, res, cargo, func){
    
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
    if(!req.body.esArea || !req.body.nombre){
        res.status(400).json("esArea y nombre son necesarios");
        return;
    }
    var cargo= {
        esArea: req.body.esArea,
        nombre: req.body.nombre,
        empresa:req.params.idEmpresa
    };
    if(req.body.padre){
        Cargo.findById(req.body.padre).exec(function(err, cargoPadre){
            if(err){
                res.status(500).json();
                console.log(err);
            }
            else if(!cargoPadre){
                res.status(404).json("padre no encontrado");
                return;
            }
            else{
                console.log("CARGO PADRE", cargoPadre);
                cargo.padre = cargoPadre._id;
                var cargoId;
                crearCargo(req, res, cargo, function(cargoId){
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
                            res.status(201).json();
                        }
                    });
                });
                
            }
        });
    }
    else{
        Empresa.findById(cargo.empresa).exec(function(err, empresa){
            if(err){
                res.status(500).json();
                console.log(err);
            }
            else{
                crearCargo(req, res, cargo, function(cargoId){
                    empresa.gerenteGeneral = cargoId;
                    empresa.save(function(err, guardada){
                        if(err){
                            res.status(500).json(err);
                            console.log();
                        }
                        else{
                            res.status(201).json();
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
                console.log(err);
                response.status = 500;
                response.message = "";
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
                response.message = "";
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
                console.log(err);
                response.status = 500;
                response.message ="";
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
module.exports.actualizarCargo = function(req, res, next){
     Cargo.findById(req.params.idCargo)
        .select("-hijos")
        .exec(function(err, cargo) {
            var response = {
                status : 204,
                message: cargo
            };

            if(err){
                console.log(err);
                response.status = 500;
                response.message = "";
            }
            else if(!cargo){
                response.status = 404;
                response.message = {
                    "message" : "cargoID no encontrado"
                    };
            }
            if(response.status != 204){
                res
                .status(response.status)
                .json(response.message);
            }
            else{
                if(req.body.nombre) cargo.nombre = req.body.nombre;
                if(req.body.esArea) cargo.esArea = req.body.esArea;
                if(req.body.activo) cargo.activo = req.body.activo;
                if(req.body.padre) 
                {    //cambiando en hijos del padre viejo
                    // creo nuevo array sin el hijo
                    Cargo.findById(cargo.padre).exec(function(err, padre){
                        if(padre){
                            var hijos = [];
                            for(var index = 0, len = padre.hijos.length; index<len; index ++){
                                if(!padre.hijos[index]._id.equals( cargo._id)){
                                    hijos.push(padre.hijos[index]._id);
                                }
                            }
                            padre.hijos = hijos;
                            guardarCargo(padre).then(function(success){
                                console.log("padre viejo acualizado");
                            }).catch(function(err){
                                console.log(err);
                            })
                        }
                    });
                    if(req.body.padre == "none"){
                        cargo.padre = null;
                        guardarCargo(cargo).then(function(response){
                            res.status(204).json();
                        }).catch(function(err){
                            console.log(err);
                            res.status(500).json();
                            return;
                        })
                    }
                    else{
                        //revisando que exista padre y solo ahi guardando
                        cargo.padre = req.body.padre;
                        Cargo.findById(req.body.padre).exec(function(err, padreNuevo){
                           if(err){
                               console.log(err);
                               res.status(500).json();
                           }
                            if(!padreNuevo){
                                res.status(400).json("padre nuevo no existente");
                                return;
                            }
                            else{
                                if(!padreNuevo.hijos) padreNuevo.hijos = [];
                                padreNuevo.hijos.push(cargo._id);
                                guardarCargo(padreNuevo).then(function(success){
                                    console.log("nuevo padre");
                                    guardarCargo(cargo)
                                        .then(function(success){
                                        res
                                            .status(204)
                                            .json();
                                    })
                                        .catch(function(err){
                                        console.log(err);
                                        throw(err);
                                    });
                                }).catch(function(err){
                                    console.log(err);
                                    res.status(500).json();
                                });
                            }
                        });
                    }
                }
                //guardando cargo actualizado y guardandolo en su nuevo padre
                else{
                    guardarCargo(cargo)
                        .then(function(success){
                            res
                                .status(204)
                                .json();
                        })
                        .catch(function(err){
                            console.log(err);
                            res
                            .status(500)
                            .json();
                        });
                }
                
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
            res.status(404).json({message: " NO ENCONTRADO "});
            return;
        }
        var tieneHijoActivo = false;
        
        for (var i = 0;i < cargo.hijos.length; i++)
        {
            tieneHijoActivo= (cargo.hijos[i].activo)? true: cargo.hijos[i].activo;
        }
        var response = {
            status : 202,
            message: ""
        };
        
        if(tieneHijoActivo){
            response.status = 400;
            response.message = "Error: cargo tiene hijos";
            res.status(response.status).json(response.message);
        }
        else{
            cargo.activo = false;
            cargo.save(function(err, cargo){
                 if(err){
                     console.log(err);
                   res.status(500).json({message: " ERROR SERVIDOR "});
                    return; 
                }
                response.status = 202;
                response.message = cargo;
                res.status(response.status).json(response.message);
            });
        }
    });
};