var express = require('express');
var router = express.Router();
var novedadesModel = require("../models/novedadesModels");

router.get("/", async function(res, res, next){

    var novedades = await novedadesModel.getNovedades();
    res.render("novedades", {isNovedades: true, novedades});

    



})




module.exports = router;