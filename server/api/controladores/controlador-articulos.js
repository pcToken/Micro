var mongoose = require("mongoose");
var Articulo = mongoose.model('Articulo');
var fs = require("fs");
var funciones = require("./funciones.js");
var promise = require("bluebird");

//funcion ayuda para borrar fotos no activas
// recibe objeto articulo
// devuelve objeto articulo solo con fotos activas
function filtrarFotos(articulo){
    if(!articulo.detalle || !articulo.detalle.fotos) return articulo;
    if(articulo instanceof Array){
        articulo.map(function(e,i){
            articulo[i] = filtrarFotos(e);
        });
        return articulo;
    }
    else{
        var fotosActivas = [];
        articulo.detalle.fotos.map(function(e){
            if(e.activo) fotosActivas.push(e);
        });
        articulo.detalle.fotos = fotosActivas;
        return articulo;
    }
}
//funcion para eliminar foto o fotos de los archivos temporales
//recibe  arreglo de objetos foto (objeto definido por multer)
//devuelve nada
function borrarFotos(fotos){
    if(!fotos) return;
    if(fotos instanceof Array){
        fotos.map(function(e){
            fs.unlink(e.path, (err) => {
              if (err) console.log(err);
              console.log('foto borrada',e.path);
            });
        })
    }
    else{
        fs.unlink(fotos.path, (err) => {
          if (err) console.log(err);
          console.log('foto borrada',e.path);
        });
    }
}
//actualiza padre de un articulo
//recibe articulo y un codigo de articulo(el del nuevo padre)
//devuelve promise
function actualizarPadreDeArticulo(req, articulo, codigoPadre){
    return new Promise(function(success, fail){    
        Articulo.findOne({empresa:req.params.idEmpresa, codigo: codigoPadre}).exec(function(err, padreNuevo){
            if(codigoPadre == "none"){
                Articulo.findOne({empresa:req.params.idEmpresa, codigo:articulo.padre}).exec(function(err, padreActual){
                    if(err){ fail(err);}
                    else{
                        var index = padreActual.hijos.indexOf(articulo.codigo);
                        padreActual.hijos.splice(index,1);
                        padreActual.save(function(err){
                            if(err) fail(err);
                            else {
                                articulo.padre="";
                                articulo.save(function(err){
                                    if(err) fail(err);
                                    else success("success");
                                })
                            }
                        });
                    }
                });
            }
            else if(!padreNuevo){
                error = "No se encontro al padre nuevo";
                fail(error);
            }
            else{
                Articulo.findOne({empresa:req.params.idEmpresa, codigo:articulo.padre}).exec(function(err, padreActual){
                    if(err) fail(err);
                    //si no tiene padre y solo se quiere agregar uno
                    else if(!padreActual){
                        if(!padreNuevo.hijos) padreNuevo.hijos = [];
                        padreNuevo.hijos.push(articulo.codigo);
                        padreNuevo.save(function(err){
                            if(err)fail(err);
                            else{
                                articulo.padre = codigoPadre;
                                articulo.save(function(err){
                                    if(err)fail(err);
                                    else{
                                        var mensaje = "Success updating";
                                        success(mensaje);
                                    }
                                })
                            }
                        });
                    }
                    else{
                        var index = padreActual.hijos.indexOf(articulo.codigo);
                        padreActual.hijos.splice(index,1);
                        padreActual.save(function(err){
                            if(err) fail(err);
                            else{
                                if(!padreNuevo.hijos) padreNuevo.hijos = [];
                                padreNuevo.hijos.push(articulo.codigo);
                                padreNuevo.save(function(err){
                                    if(err)fail(err);
                                    else{
                                        articulo.padre = codigoPadre;
                                        articulo.save(function(err){
                                            if(err)fail(err);
                                            else{
                                                var mensaje = "Success updating";
                                                success(mensaje);
                                            }
                                        })
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    })
}
//borrar fotos logicamente
module.exports.borrarFotos = function(req, res){
    Articulo.findOne({empresa:req.params.idEmpresa,codigo:req.params.codigoArticulo}).exec(function(err, articulo){
        if(!req.body.idFotos) res.status(400).json();
        else if(!articulo){
            res.status(404).json();
        }
        else{
            var idFotos = funciones._splitArray(req.body.idFotos);
            for(var i = 0; i<idFotos.length; i++){
                foto = articulo.detalle.fotos.id(idFotos[i]);
                if(foto){
                    foto.activo = false;
                }
            }
            articulo.save(function(err){
                if(err){
                    console.log(err);
                    res.status(500).json();
                }
                else{
                    res.status(204).json();
                }
            });
        }
    });
};
//agregar fotos
module.exports.agregarFotos = function(req, res){
    Articulo.findOne({empresa:req.params.idEmpresa,codigo:req.params.codigoArticulo}).exec(function(err, articulo){
        
        if(req.files){
            var nombresFotos = funciones._splitArray(req.body.nombresFotos);
            var fotos = req.files;
            var descripcionesFotos = funciones._splitArray(req.body.descripcionesFotos);

            if(!articulo.detalle) articulo.detalle = {};
            if(!articulo.detalle.fotos)articulo.detalle.fotos = [];

            if(nombresFotos.length != fotos.length) {
                console.log("ERROR numero de nombres no es igual a numero de fotos enviadas");
                res.status(400).json();
            }
            // llenar arreglo con las fotos sus nombres y sus descripciones
            for(var i = 0; i < fotos.length ; i++){
                //conviritiendo imagen en base64
                var fotoBase64 = fs.readFileSync(fotos[i].path).toString("base64");
                articulo.detalle.fotos.push({
                    imagen: fotoBase64,
                    nombre: nombresFotos[i],
                    descripcion: descripcionesFotos[i]
                });
            }
            articulo.save(function(err, articulo){
                if(err){
                    console.log(err);
                    res.status(500).json();
                }
                else{
                    borrarFotos(req.files);
                    res.status(204).json();
                }
            });
        }
    });
};
//borrar articulo
module.exports.borrarArticulo = function(req, res){
    var codigoArticulo = req.params.codigoArticulo;
    Articulo.findOneAndUpdate({empresa:req.params.idEmpresa,codigo:req.params.codigoArticulo},{$set:{activo:false}},function(err,articulo){
        if(err){
            console.log(err);
            res.status(500).json();
        }
        else if(!articulo){
            res.status(404).json();
        }
        else{
            res.status(204).json();
        }
    })
};
//actualizar un articulo
module.exports.actualizarArticulo = function(req, res){
    var codigoArticulo = req.params.codigoArticulo;
    Articulo.findOne({empresa:req.params.idEmpresa,codigo:req.params.codigoArticulo}).exec(function(err, articulo){
        if(err){
            console.log(err);
            res.status(500).json();
        } else if(!articulo){
            res.status(404).json();
        }
        else{
            if(req.body.enlaces) articulo.detalle.enlaces = funciones._splitArray(req.body.enlaces);
            if(req.body.caracteristica) articulo.caracteristica = req.body.caracteristica;
            if(req.body.codigo) articulo.codigo = req.body.codigo;
            if(req.body.embalaje) articulo.embalaje = req.body.embalaje;
            if(req.body.cantidadPorPaquete) articulo.cantidadPorPaquete = req.body.cantidadPorPaquete;
            if(req.body.precio) articulo.precio = req.body.precio;
            if(req.body.moneda) articulo.moneda = req.body.moneda;
            if(req.body.stock) articulo.stock = req.body.stock;
            if(req.body.clasificacion) articulo.clasificacion = JSON.parse(req.body.clasificacion);
            if(req.body.nombre) articulo.nombre = req.body.nombre;
            if(req.body.activo) articulo.activo = req.body.activo;
            if(req.body.padre){
                actualizarPadreDeArticulo(req,articulo,req.body.padre).then(function(success){
                console.log(success);
            }).catch(function(err){
               console.log(err);
                res.status(400).json();
            });
                              }
            articulo.save(function(err, articulo){
                if(err){
                    console.log(err);
                    res.status(500).json();
                } else{
                    res.status(204).json();
                }
            });
        }
    });
};
// mostrar un articulo en especifico
module.exports.mostrarArticulo = function(req, res){
    Articulo.findOne({empresa:req.params.idEmpresa,codigo:req.params.codigoArticulo}).exec(function(err, articulo){
        if(err){
            console.log(err);
            res.status(500).json();
        } else if(!articulo){
            res.status(404).json();
        }
        else{
            res.status(200).json(filtrarFotos(articulo));
        }
    });
    
};
//mostrar articulos
module.exports.mostrarArticulosCompleto = function(req, res) {
    Articulo.find({empresa:req.params.idEmpresa}).exec(function(err,articulos){
        if(err){
            console.log(err);
            res.status(500).json();
        } else if(!articulos){
            res.status(404).json();
        }
        else{
            res.status(200).json(articulos);
        }
    });
};
//mostrar todos los articulos activos
module.exports.mostrarArticulos = function(req, res) {
    Articulo.find({empresa:req.params.idEmpresa, activo: true}).exec(function(err,articulos){
        if(err){
            console.log(err);
            res.status(500).json();
        } else if(!articulos){
            res.status(404).json();
        }
        else{
            res.status(200).json(filtrarFotos(articulos));
        }
    });
};
// crear un articulo
module.exports.crearArticulo = function(req, res) {
    if(!req.body.codigo || !req.body.nombre || !req.body.precio || !req.body.moneda || !req.body.stock){
        res.status(400).json("dato faltante");
        return;
    } 
    var articulo = {
        codigo: req.body.codigo,
        nombre: req.body.nombre,
        empresa: req.params.idEmpresa,
        precio : req.body.precio,
        moneda : req.body.moneda,
        stock : req.body.stock,
    };
    // si hay fotos guardarlas en el articulo
    if(req.files){
        var nombresFotos = funciones._splitArray(req.body.nombresFotos);
        var fotos = req.files;
        var descripcionesFotos = funciones._splitArray(req.body.descripcionesFotos);
        
        articulo.detalle = {};
        articulo.detalle.fotos = [];
        
        if(nombresFotos.length != fotos.length){
            console.log("ERROR numero de nombres no es igual a numero de fotos enviadas");
            res.status(400).json();
        }
        // llenar arreglo con las fotos sus nombres y sus descripciones
        for(var i = 0; i < fotos.length ; i++){
            var fotoBase64 = fs.readFileSync(fotos[i].path).toString("base64");
            articulo.detalle.fotos.push({
                imagen: fotoBase64,
                nombre: nombresFotos[i],
                descripcion: descripcionesFotos[i]
            });
        }
    }
    if(req.body.enlaces) articulo.detalle.enlaces = funciones._splitArray(req.body.enlaces);
    if(req.body.caracteristica) articulo.caracteristica = req.body.caracteristica;
    if(req.body.embalaje) articulo.embalaje = req.body.embalaje;
    if(req.body.cantidadPorPaquete) articulo.cantidadPorPaquete = req.body.cantidadPorPaquete;
    if(req.body.clasificacion) articulo.clasificacion = JSON.parse(req.body.clasificacion);
    //si tengo padre tengo que guardar este articulo en los hijos de su padre
    if(req.body.padre){
        Articulo.findOne({empresa:req.params.idEmpresa, codigo: req.body.padre}).exec(function(err,padre){
            if(err){
                console.log("ctrArticulo-crear-buscando padre",err);
                res.status(500).json();
            } else if(!padre){
                res.status(404).json();
            }
            else{
                if(padre.hijos){
                    padre.hijos.push(articulo.codigo);
                }
                else{
                    padre.hijos = [articulo.codigo];
                }
                articulo.padre = padre.codigo;
                Articulo.create(articulo,function(err, articulo){
                   if(err){
                        console.log(err);
                        res.status(500).json();
                    } 
                    else{
                        //guardando el articulo padre
                        padre.save(function(err,padre){
                            if(err){
                                console.log(err);
                                res.status(500).json();
                            } 
                            else{
                                res.status(201).json(articulo);
                            }
                        });
                        
                    }
                });
            }
        });
    }
    else{
        Articulo.create(articulo,function(err, articulo) {
            res.status(201).json(articulo);
            console.log(articulo);
        });
    }
};