var express = require("express");
var router = express.Router();
var novedadesModel = require("../../models/novedadesModels");
var util = require('util');
var cloudinary = require('cloudinary').v2;
const uploader = util.promisify(cloudinary.uploader.upload);

router.get("/", async function(req, res, next){
    
    var novedades = await novedadesModel.getNovedades();
    
    novedades = novedades.map(novedad => {
        if(novedad.img_id){
            const imagen = cloudinary.image(novedad.img_id,{
                width: 100,
                height: 100,
                crop:'fill'
            });
            return{
                ...novedad,
                imagen
            }
        }else{
                return{
                    ...novedad,
                    imagen: ''
                }
            }

    });
    
    res.render("admin/novedades",{
        layout: "admin/layout",
        usuario: req.session.nombre, //este layout es el novedades.hbs
        novedades 
    });
})


//Vista del Formulario Agregar

router.get("/agregar", function(req, res, next){
    res.render("admin/agregar", {
        layout: "admin/layout"
    });
})

router.post('/agregar', async(req,res,next) =>{
    try{

        // console.log(req.body)
        var img_id = ''
        if(req.files && Object.keys(req.files).length > 0){
            imagen = req.files.imagen;
            img_id = (await uploader(imagen.tempFilePath)).public_id;

        }


        if(req.body.titulo != "" && req.body.subtitulo != "" && req.body.cuerpo !=""){
            // await novedadesModel.insertNovedad(req.body);
            await novedadesModel.insertNovedad({
                ...req.body, img_id
            })
        

            res.redirect("/admin/novedades");
        }
        
        else{
            res.render("admin/agregar",{
                layout:"admin/layout",
                error:true,
                message: "Todos los campos son requeridos"
            })
        }

    }catch(error){
        console.log(error);
        res.render("admin/agregar", {
                    layout: "admin/layout", 
                    error: true,
                    message: "No se cargo la novedad"
        }) //propiedades
    } //cierre catch
    
}) //cierro router.post

//funcionamiento eliminar
router.get("/eliminar/:id", async(req,res,next) =>{
    var id = req.params.id;
    await novedadesModel.deleteNovedadById(id);
    res.redirect("/admin/novedades");

})

//Para que me muestre modificar cargado con una novedad

router.get('/modificar/:id', async(req,res,next) =>{
    var id = req.params.id;
    var novedad = await novedadesModel.getNovedadesById(id);
    res.render('admin/modificar',{
        layout:'admin/layout',
        novedad
    })
})

// Para UPDATE

router.post('/modificar', async(req, res, next) =>{
    console.log(req.body)

    try{
        
        var obj ={
            Titulo: req.body.titulo,
            Subtitulo: req.body.subtitulo,
            Cuerpo: req.body.cuerpo
        }
        console.log(obj)


       await novedadesModel.modificarNovedadById(obj, req.body.id);
       res.redirect('/admin/novedades');

    }catch(error){
        res.render('admin/modificar',{
            layout:'admin/layout',
            error: true,
            message: 'NO se modifico la novedad'
        })
    }
})


module.exports = router;