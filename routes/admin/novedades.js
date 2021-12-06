var express = require("express");
var router = express.Router();
var novedadesModel = require("../../models/novedadesModels");

router.get("/", async function(req, res, next){
    
    var novedades = await novedadesModel.getNovedades();
    
    
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

        console.log(req.body)
        if(req.body.titulo != "" && req.body.subtitulo != "" && req.body.cuerpo !=""){
            await novedadesModel.insertNovedad(req.body);
            res.redirect("/admin/novedades");
        }else{
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


module.exports = router;