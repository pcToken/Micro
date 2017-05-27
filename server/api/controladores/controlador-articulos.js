var mongoose = require("mongoose");
var Articulo = mongoose.model('Articulo');
var fs = require("fs");
var funciones = require("./funciones.js");
//funcion ayuda para borrar fotos no activas
function filtrarFotos(articulo){
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
//funcion para eliminar foto con el path
function borrarFotos(fotos){
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
//borrar fotos
module.exports.borrarFotos = function(req, res){
    Articulo.findOne({empresa:req.params.idEmpresa,codigo:req.params.idArticulo}).exec(function(err, articulo){
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
    Articulo.findOne({empresa:req.params.idEmpresa,codigo:req.params.idArticulo}).exec(function(err, articulo){
        
        if(req.files){
            var nombresFotos = funciones._splitArray(req.body.nombresFotos);
            var fotos = req.files;
            var descripcionesFotos = funciones._splitArray(req.body.descripcionesFotos);

            if(!articulo.detalle) articulo.detalle = {};
            if(!articulo.detalle.fotos)articulo.detalle.fotos = [];

            if(nombresFotos.length != fotos.length) {
                console.log("ERROR numero de nombres no es igual a numero de fotos enviadas");
                return;
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
    var idArticulo = req.params.idArticulo;
    Articulo.findOneAndUpdate({empresa:req.params.idEmpresa,codigo:idArticulo},{$set:{activo:false}},function(err,articulo){
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
    var idArticulo = req.params.idArticulo;
    Articulo.findById(idArticulo).exec(function(err, articulo){
        if(err){
            console.log(err);
            res.status(500).json();
        } else if(!articulo){
            res.status(404).json();
        }
        else{
            if(req.body.enlaces) articulo.detalle.enlaces = funciones._splitArray(req.body.enlaces);
            if(req.body.caracteristica) articulo.caracteristica = req.body.caracteristica;
            if(req.body.embalaje) articulo.embalaje = req.body.embalaje;
            if(req.body.cantidadPorPaquete) articulo.cantidadPorPaquete = req.body.cantidadPorPaquete;
            if(req.body.precio) articulo.precio = req.body.precio;
            if(req.body.moneda) articulo.moneda = req.body.moneda;
            if(req.body.stock) articulo.stock = req.body.stock;
            if(req.body.clasificacion) articulo.clasificacion = JSON.parse(req.body.clasificacion);
            if(req.body.nombre) articulo.nombre = req.body.nombre;
            if(req.body.activo) articulo.activo = req.body.activo;
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
    Articulo.findById(req.params.idArticulo).exec(function(err, articulo){
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
    if(!req.body.codigo || !req.body.nombre){
        res.status(400).json("Nombre, codigo necesario");
        return;
    } 
    var articulo = {
        codigo: req.body.codigo,
        nombre: req.body.nombre,
        empresa: req.params.idEmpresa
    };
    // si hay fotos guardarlas en el articulo
    //!!! ver si es correcto hacerlo de forma synchronica
    if(req.files){
        var nombresFotos = funciones._splitArray(req.body.nombresFotos);
        var fotos = req.files;
        var descripcionesFotos = funciones._splitArray(req.body.descripcionesFotos);
        
        articulo.detalle = {};
        articulo.detalle.fotos = [];
        
        if(nombresFotos.length != fotos.length) console.log("ERROR numero de nombres no es igual a numero de fotos enviadas");
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
    if(req.body.embalaje) articulo.cantidadPorPaquete = req.body.cantidadPorPaquete;
    if(req.body.precio) articulo.precio = req.body.precio;
    if(req.body.precio) articulo.moneda = req.body.moneda;
    if(req.body.stock) articulo.stock = req.body.stock;
    if(req.body.clasificacion) articulo.clasificacion = JSON.parse(req.body.clasificacion);
    //si tengo padre tengo que guardar este articulo en los hijos de su padre
    if(req.body.padre){
        Articulo.findOne({codigo: req.body.padre}).exec(function(err,padre){
            if(err){
                console.log("padre no encontrado",err);
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
                                borrarFotos(req.files);
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
            borrarFotos(req.files);
            res.status(201).json(articulo);
            console.log(articulo);
        });
    }
};