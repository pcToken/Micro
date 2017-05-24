var mongoose = require("mongoose");
var Empresa = mongoose.model('Empresa');
var Cargo = mongoose.model('Cargo');
// anadir empresas
// se anhade el id, nombre y el gerente general
module.exports.crearEmpresa = function(req,res){
  var empresa = {
      _id : req.body._id,
      nombre: req.body.nombre
  };
    Empresa.create(empresa, function(err, empresa){
       if(err){
           res.status(400).json(err);
           console.log("error creando empresa");
       }
        else{
            res.status(201).json();
            console.log("Nueva Empresa creada : ", empresa);
        }
    });
};
//devuelve una empresa especificada en el idEmpresa
module.exports.mostrarEmpresa= function(req,res){
    var idEmpresa = req.params.idEmpresa;
    Empresa.findById(idEmpresa).populate("gerenteGeneral").exec(function(err, empresa){
        if(err){
            res.status(404).json(err);
        }
        else{
            if (empresa){
                console.log("empresa encontrada : ", empresa);
                res.status(200).json(empresa);
            }
            else{
                res.status(404).json();
            }
        }
    });
};
//devuelve todas las empresas menos el organigrama
module.exports.mostrarEmpresas = function(req, res) {
    Empresa.find().exec(function(err, empresas){
        if(err){
            res
                .status(404)
                .json(err);
        }
        else{
            res.status(200).json(empresas);
        }
    });
};


//actualiza los datos de una empresa en especifico
module.exports.actualizarEmpresa = function(req, res){
    Empresa.findById(req.params.idEmpresa)
        .select("-sucursal -gerenteGeneral")
        .exec(function(err, empresa) {
        
            var response = {
                status : 200,
                message: empresa
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
            if(response.status != 200){
                res
                .status(response.status)
                .json(response.message);
            }
            else{
                empresa.nombre = req.body.nombre;
                //save the updated instance
                empresa.save(function(err, empresaActualizada) {
                    if(err){
                        console.log("error actualizando empresa");
                        res
                        .status(500)
                        .json(err);
                    }
                    else{
                        console.log("empresa actualizada = " + empresaActualizada);
                        res
                            .status(204)
                            .json();
                    }
                });
            }

        });
};
//borrar una empresa
module.exports.borrarEmpresa = function(req, res){
    Empresa.findById(req.params.idEmpresa)
        .select("activo")
        .exec(function(err, empresa) {
        
            var response = {
                status : 200,
                message: empresa
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
            if(response.status != 200){
                res
                .status(response.status)
                .json(response.message);
            }
            else{
                empresa.activo = false;
                //guardar
                empresa.save(function(err, empresaBorrada) {
                    if(err){
                        console.log("error borrando empresa");
                        res
                        .status(500)
                        .json(err);
                    }
                    else{
                        console.log("empresa borrada = " + empresaBorrada);
                        res
                            .status(204)
                            .json();
                    }
                });
            }

        });
};
