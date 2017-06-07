var mongoose = require("mongoose");
var Empresa = mongoose.model('Empresa');
var Cargo = mongoose.model('Cargo');
// anadir empresas
// se anhade el id, nombre y el gerente general
module.exports.crearEmpresa = function(req,res){
    if(!req.body._id || !req.body.nombre){
        res.status(400).json("_id y nombre son obligatorios");
    }
  var empresa = {
      _id : req.body._id,
      nombre: req.body.nombre
  };
    Empresa.create(empresa, function(err, empresa){
       if(err){
           console.log("Creando empresa",err);
           res.status(500).json(err);
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
            console.log(err);
            res.status(500).json();
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
                .status(500)
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
                console.log(err);
                response.status = 500;
                response.message = "";
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
                
                if(req.body.nombre) empresa.nombre = req.body.nombre;
                //save the updated instance
                empresa.save(function(err, empresaActualizada) {
                    if(err){
                        console.log(err);
                        res
                        .status(500)
                        .json();
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
                console.log(err);
                response.status = 500;
                response.message = "";
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
                        console.log(err);
                        res
                        .status(500)
                        .json();
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
