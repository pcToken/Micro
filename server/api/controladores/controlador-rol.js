var mongoose = require("mongoose");
var Rol = mongoose.model("Rol");
//crear rol
module.exports.crearRol = function(req, res){
    if(!req.body.nombre){
        res.status(400).json("nombre de rol necesario");
    }
    var rol = {
        nombre : req.body.nombre,
        empresa: req.params.idEmpresa
    };
    Rol.create(rol,function(err, rol){
        var response= {
            status : 201,
            message : ""
        }
        if (err){
            console.log(err);
            response.status = 500;
            response.message = " Server Error ";
        }
        else if(!rol){
            response.status = 400;
            response.message = " Bad Request ";
        }
        else{
            response.status = 201;
            response.message = "Creado";
        }
        res.status(response.status).json(response);
        
    });
};
//mostrar todos los roles activos de la empresa
module.exports.mostrarRoles = function(req, res) {
    Rol.find({activo:true, empresa : req.params.idEmpresa}).exec(function(err, roles){
        var response= {
            status : 200,
            message : roles
        }
        if (err){
            response.status = 500;
            response.message = " Server Error ";
        }
        else if(!roles){
            response.status = 400;
            response.message = " Bad Request ";
        }
        res.status(response.status).json(response.message);
    });
}
//mostrar todos los roles de la empresa
module.exports.mostrarRolesCompleto = function(req, res) {
    Rol.find({empresa : req.params.idEmpresa}).exec(function(err, roles){
        var response= {
            status : 200,
            message : roles
        }
        if (err){
            response.status = 500;
            response.message = " Server Error ";
        }
        else if(!roles){
            response.status = 400;
            response.message = " Bad Request ";
        }
        res.status(response.status).json(response.message);
    });
}
//borrar rol
module.exports.borrarRol = function(req, res) {
    var idRol = req.params.idRol;
    var idEmpresa = req.params.idEmpresa;
    Rol.findOne({_id:idRol,empresa:idEmpresa}).exec(function(err, rol){
        var response= {
            status : 204,
            message : ""
        };
        if (err){
            response.status = 500;
            response.message = " Server Error ";
        }
        else if(!rol){
            response.status = 404;
            response.message = " Rol no existente ";
        }
        else{
            rol.activo = false;
            rol.save(function(err, rol){
                if (err){
                    response.status = 500;
                    response.message = " Server Error ";
                }
                else{
                    response.message = rol;
                }
                res.status(response.status).json(response.message);
                return;
            });
        }
        if(response.status != 204)res.status(response.status).json(response.message);
    });
}
//mostrar rol
module.exports.mostrarRol = function(req, res) {
    var idRol = req.params.idRol;
    var idEmpresa = req.params.idEmpresa;
    Rol.findOne({_id:idRol,empresa:idEmpresa}).exec(function(err, rol){
        var response= {
            status : 200,
            message : rol
        };
        if (err){
            response.status = 500;
            response.message = " Server Error ";
        }
        else if(!rol){
            response.status = 404;
            response.message = " Rol no existente ";
        }
        res.status(response.status).json(response.message);
    });
}
// actualizar rol
module.exports.actualizarRol = function(req, res) {
    var idRol = req.params.idRol;
    var idEmpresa = req.params.idEmpresa;
    Rol.findOne({_id:idRol,empresa:idEmpresa}).exec(function(err, rol){
        var response= {
            status : 200,
            message : rol
        };
        if (err){
            response.status = 500;
            response.message = " Server Error ";
        }
        else if(!rol){
            response.status = 404;
            response.message = " Rol no existente ";
        }
        if(response.status != 200)res.status(response.status).json(response.message);
        rol.nombre = (req.body.nombre)? req.body.nombre:rol.nombre;
        rol.activo = (req.body.activo)? req.body.activo : rol.activo;
        rol.save(function(err, rol){
            if (err){
                response.status = 500;
                response.message = " Server Error ";
            }
            else{
                response.message = rol;
            }
            res.status(response.status).json(response.message);
        });
        
    });
};