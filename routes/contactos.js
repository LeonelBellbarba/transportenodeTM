var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer')



router.get("/", function(req, res, next){
    res.render("contactos", {isContactos: true});

})



//Funcionamiento del formulario
router.post('/', async function(req, res, next){
    //aca va a procesar lo que pase en el formulario
    var nombre = req.body.nombre;
    var email = req.body.email;
    var tel = req.body.tel;
    var mensaje = req.body.comentarios;

    var obj ={
        to: 'leo16_b10@hotmail.com',
        subjet: 'Contacto desde la web de transporte',
        html: nombre + ' se contacto a traves de la web y quieres saber mas info sobre a este correo: ' + email + '.<br> su Tel es ' + tel + '.<br> y su comentario es: ' + mensaje + ' .' 
    }

    var transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST, //escribir para que se comunique con  .env
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      var info = await transport.sendMail(obj); //envio de los datos
      res.render('contactos',{
          message: 'Mensaje enviado correctamente',
          isContactos: true
      })
});



module.exports = router;