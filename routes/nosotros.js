var express = require('express');
var router = express.Router();

router.get("/", function(res, res, next){
    res.render("nosotros", {isNosotros: true})

})

module.exports = router;