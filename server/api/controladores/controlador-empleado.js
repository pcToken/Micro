var mongoose = require("mongoose");
var Empleado = mongoose.model("Empleado");
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var secret = require("../data/secret.js");
var funciones =require("./funciones.js");

//agregar rol
module.exports.agregarRol = function(req, res){
    var idEmpleado = req.params.idEmpleado;
    Empleado.findOne({_id : idEmpleado}).select("-clave").exec(function(err, empleado){
        if(err){
            res.status(404).json(err);
        }
        else{
            if (empleado){
              if(req.body.rol)empleado.rol=empleado.rol.concat(funciones._splitArray(req.body.rol).map(mongoose.Types.ObjectId));
                empleado.save(function(err, empleado){
                    if(err){
                        res.status(500).json(err);
                    }
                    else{
                        res.status(200).json(empleado);
                    }
                });
            }
            else{
                res.status(404).json();
            }
        }
    });
};
//borrar rol
module.exports.borrarRol = function(req, res){
    var idEmpleado = req.params.idEmpleado;
    Empleado.findOne({_id : idEmpleado}).select("-clave").exec(function(err, empleado){
        if(err){
            res.status(404).json(err);
        }
        else{
            if (empleado){
                var rolesABorrar = [];
                if(req.body.rol)rolesABorrar= funciones._splitArray(req.body.rol);
                rolesQueQuedan = [];
                empleado.rol.map(function(rol){
                    if(rolesABorrar.indexOf(rol._id.toString())==-1){
                        rolesQueQuedan.push(rol._id);
                    }
                });
                empleado.rol = rolesQueQuedan;
                empleado.save(function(err, empleado){
                    if(err){
                        res.status(500).json(err);
                    }
                    else{
                        res.status(200).json(rolesABorrar);
                    }
                });
            }
            else{
                res.status(404).json();
            }
        }
    });
};
//mostrar roles
module.exports.mostrarRoles = function(req, res) {
    var idEmpleado = req.params.idEmpleado;
    Empleado.findById(idEmpleado).select("-clave").exec(function(err, empleado){
        if(err){
            res.status(404).json(err);
        }
        else{
            if (empleado){
                //muestro solo los roles activos
                rolesActivos = [];
                empleado.rol.map(function(e){
                    if(e.activo)rolesActivos.push(e);
                });
                res.status(200).json(rolesActivos);
            }
            else{
                res.status(404).json();
            }
        }
    });
}
//crear empleado
module.exports.crearEmpleado = function(req, res){
    
     var empleado = {
         _id : req.params.idEmpresa+"-"+ req.body.login,
         empresa: req.params.idEmpresa,
         nombre: req.body.nombre,
         cargo:mongoose.Types.ObjectId(req.body.cargo),
         login:req.body.login,
         clave: bcrypt.hashSync(req.body.clave)
     };
    console.log("YEI");
    if(req.body.sucursal) empleado.sucursal = mongoose.Types.ObjectId(req.body.sucursal);
    if(req.body.celular) empleado.celular = req.body.celular;
    if(req.body.email) empleado.email = req.body.email;
    if(req.body.direccion) empleado.direccion = req.body.direccion;
    if(req.body.sexo) empleado.sexo = req.body.sexo;
    if(req.body.fechaNacimiento) empleado.fechaNacimiento = Date.parse(req.body.fechaNacimiento);
    //enviar Horarios en horarioDias lista separada por ; y horarios lista de los horarios en mismo orden de Horario dias
    if(req.body.dias) {
        var dias = funciones._splitArray(req.body.dias);
        var horarios = funciones._splitArray(req.body.horarios);
        var horario = [];
        for(i =0;i<horarios.length;i++){
            horario.push({dia:dias[i],horario:horarios[i]});
        }
        empleado.horario = horario;
    }
    
    Empleado.create(empleado, function(err, empleado){
       if(err){
           res.status(400).json(err);
           console.log("error creando empleado");
       }
        else{
            res.status(201).json();
            console.log("Nuevo empleado creado");
        }
    });
};
//mostrar todos los empleados
module.exports.mostrarEmpleados = function(req, res){
    Empleado.find({activo:true,empresa:req.params.idEmpresa}).select("-clave").exec(function(err, empleados){
        if(err){
            res
                .status(404)
                .json(err);
        }
        else{
            //muestro solo los roles activos
            empleados.map(function(empleado){
                rolesActivos = [];
                empleado.rol.map(function(e){
                    if(e.activo)rolesActivos.push(e);
                });
                empleado.rol = rolesActivos;
            });
            empleados.rol = rolesActivos;
            res.status(200).json(empleados);
        }
    });
};
//mostrar todos los empleados
module.exports.mostrarEmpleadosCompleto = function(req, res){
    Empleado.find({empresa:req.params.idEmpresa}).select("-clave").exec(function(err, empleados){
        if(err){
            res
                .status(404)
                .json(err);
        }
        else{
            res.status(200).json(empleados);
        }
    });
};
//mostrar un empleado
module.exports.mostrarEmpleado = function(req, res){
    var idEmpleado = req.params.idEmpleado;
    Empleado.findById(idEmpleado).select("-clave").exec(function(err, empleado){
        if(err){
            res.status(404).json(err);
        }
        else{
            if (empleado){
                //muestro solo los roles activos
                rolesActivos = [];
                empleado.rol.map(function(e){
                    if(e.activo)rolesActivos.push(e);
                });
                empleado.rol = rolesActivos;
                console.log("empleado encontrado : ", empleado);
                res.status(200).json(empleado);
            }
            else{
                res.status(404).json();
            }
        }
    });
};
//actualizar empleado
module.exports.actualizarEmpleado = function(req, res){
     Empleado.findById(req.params.idEmpleado)
        .select("-clave")
        .exec(function(err, empleado) {
        
            var response = {
                status : 200,
                message: empleado
            };

            if(err){
                console.log("error consiguiendo empleado " + empleadoId);
                response.status = 500;
                response.message = err;
            }
            else if(!empleado){
                response.status = 404;
                response.message = {
                    "message" : "empleadoID no encontrado"
                    };
            }
            if(response.status != 200){
                res
                .status(response.status)
                .json(response.message);
            }
            else{
                if(req.body.sucursal) empleado.sucursal = mongoose.Types.ObjectId(req.body.sucursal);
                if(req.body.celular) empleado.celular = req.body.celular;
                if(req.body.email) empleado.email = req.body.email;
                if(req.body.direccion) empleado.direccion = req.body.direccion;
                if(req.body.sexo) empleado.sexo = req.body.sexo;
                if(req.body.fechaNacimiento) empleado.fechaNacimiento = Date.parse(req.body.fechaNacimiento);
                if(req.body.empresa)empleado.empresa= req.params.idEmpresa;
                if(req.body.nombre)empleado.nombre= req.body.nombre;
                if(req.body.cargo)empleado.cargo=mongoose.Types.ObjectId(req.body.cargo);
                if(req.body.rol)empleado.rol= funciones._splitArray(req.body.rol).map(mongoose.Types.ObjectId);
                if(req.body.login)empleado.login=req.body.login;
                if(req.body.clave)clave= bcrypt.hashSync(req.body.clave);
                if(req.body.activo)empleado.activo = req.body.activo;
                //enviar Horarios en horarioDias lista separada por ; y horarios lista de los horarios en mismo orden de Horario dias
                if(req.body.horarioDias) {
                    var dias = funciones._splitArray(req.body.horarioDias);
                    var horarios = funciones._splitArray(req.body.horarios);
                    var horario = [];
                    for(i =0;i<horarios.length;i++){
                        horario.push({dia:dias[i],horario:horarios[i]});
                    }
                    empleado.horario = horario;
                }
                //save the updated instance
                empleado.save(function(err, empleadoActualizado) {
                    if(err){
                        console.log("error actualizando empleado");
                        res
                        .status(500)
                        .json(err);
                    }
                    else{
                        console.log("empleado actualizado = " + empleadoActualizado);
                        res
                            .status(204)
                            .json();
                    }
                });
            }

        });
};
//borrar empleado
module.exports.borrarEmpleado = function(req, res){
    Empleado.findById(req.params.idEmpleado)
        .select("activo")
        .exec(function(err, empleado) {
        
            var response = {
                status : 200,
                message: empleado
            };

            if(err){
                console.log("error consiguiendo empleado " + empleadoId);
                response.status = 500;
                response.message = err;
            }
            else if(!empleado){
                response.status = 404;
                response.message = {
                    "message" : "empleadoID no encontrado"
                    };
            }
            if(response.status != 200){
                res
                .status(response.status)
                .json(response.message);
            }
            else{
                empleado.activo = false;
                //save the updated instance
                empleado.save(function(err, empleadoActualizado) {
                    if(err){
                        console.log("error borrando empleado");
                        res
                        .status(500)
                        .json(err);
                    }
                    else{
                        console.log("empleado borrado = " + empleadoActualizado);
                        res
                            .status(204)
                            .json();
                    }
                });
            }

        });
};
//login
module.exports.login = function(req, res) {
    console.log("login empleado");
    var _id = req.params.idEmpresa +"-" + req.body.login;
    var clave = req.body.clave;
    
    Empleado.findById(_id).exec(function(err, empleado) {
       if(err){
           console.log("error logging in ");
           res
            .status(404)
            .json(err);
       }
        else if(!empleado){
            res.status(404).json();
        }
        else{
            if(bcrypt.compareSync(clave, empleado.clave)){
                console.log("empleado found :",empleado);
                
                var token = jwt.sign(
                    {
                        login: empleado.login,
                        idEmpresa: empleado.empresa
                    },
                    secret.word,
                    {
                        expiresIn: 3600
                    });

                res
                    .status(200)
                    .json({
                    success: true,
                    token: token
                });
                
            }
            else{
                console.log("clave incorrecta");
                res
                    .status(401)
                    .json("NO AUTORIZADO");
            }
        }
    });
    
};
module.exports.authenticate = function(req, res, next){
    if(req.path == '/api/empresa/UPSA/empleado/login') return next();
    var headerExists= req.headers.authorization;
    // the authorization token must come in the header of the request
    if(headerExists){
        var token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, secret.word, function(err, decoded) {
           if(err){
               console.log("this request is not authorized");
               res
                .status(401)
                .json("Unauthorized");
           }
            else{
                console.log("AQUI", req.params);
                if(req.params.idEmpresa && decoded.idEmpresa == req.params.idEmpresa){
                    req.empleado = decoded.login;
                    next();
                }
                else{
                    res
                        .status(401)
                        .json("Unauthorized");
                }
                
            }
        });
    }
    else{
        res
            .status(403)
            .json('No token provided');
    }
};
