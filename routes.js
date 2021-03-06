var HomeController = require('./controllers/HomeController');       // Maioria dos Controllers chamados
var CadController  = require('./controllers/CadController');
var ConsultCtrl    = require('./controllers/ConsultCtrl');
var bodyParser     = require('body-parser').json();
var multer         =   require('multer');
var matrs          = "";
var connDB         = require('./models/mysqlmodule.js');

module.exports = function(app,passport) {

app.post('/api/photo/',function(req,res){                           // Api pra gravar a foto
  var archName ="";
  var fs = require('fs');
  var guardar =   multer.diskStorage({                              // Multer seta onde vai gravar o arquivo, seu nome de arquivo, e o callback
                            destination: function (req, file, callback) {
                              callback(null, './uploads');
                            },
                            filename: function (req, file, callback) {

                              var matriculando=    req.body.matriculaSend;
                              var fileName    =    file.originalname;
                              var ext         =    fileName.split(".");

                              var date = new Date();
                              var data = Date.now();
                              archName =  '-' + file.fieldname + '-' + data +'.'+ext[1];
                              callback(null, archName);
      
                        }
                    });

    var upload = multer({ storage : guardar}).any();          

         upload(req,res,function(err){
              if(err) {
                console.log(err);
                return res.end("Error uploading file.");
              } else {
                  matrs = req.body.matriculaSend;
                  var archName_Copy= './uploads/'+matrs+archName;
                  var upcurl= '/uploads/'+matrs+archName;

                    fs.rename('./uploads/'+archName , archName_Copy, function(err) {
                        if ( err ) console.log('ERROR NA COPIA : ' + err);
                    });

                  var qry= "INSERT INTO `user_photo` (`matricula`, `photoID`) VALUES ('"+matrs+"','"+upcurl+"')" ;
                    
                    connDB.query(qry,function(err,rows){
                        if (err)
                          console.log(err);
                    });
               res.redirect('/index');
              }
         });
});

var fs = require('fs');


            app.post('/SaveNotes', CadController.SaveNts);  
           
            app.post('/LoadNotes', ConsultCtrl.LoadNts); 


            app.get('/index',isLogged,HomeController.index);
            app.get('/admin',isLogged,HomeController.admin);

            app.get('/cadastro',HomeController.cadastro);
            app.get('/', HomeController.login);
            app.get('/logout', HomeController.logOut);
            app.get('/cadastroQuest',isLogged, HomeController.cadastroQuest);
            app.get('/cadastroProvas',isLogged, HomeController.cadastroProvas);
            app.get('/cadastroNotas',isLogged, HomeController.cadastroNotas);
            app.get('/diario',isLogged, HomeController.diarioPresenca);
            app.get('/consultaQuest',isLogged, HomeController.consultaQuest);
            app.get('/consultaProf',isLogged, HomeController.consultaProf);
            app.get('/consultaTurma',isLogged, HomeController.consultaTurma);
            app.get('/consultaAluno',isLogged, HomeController.consultaAluno);
            app.get('/calendario', isLogged, HomeController.calendario);
            app.get('/testePDF',isLogged, HomeController.testePDF);
            app.get('/consultaProvas',isLogged, HomeController.consultaProvas);
            app.get('/ADMPage',isLogged, HomeController.ADMPage);

            app.post('/cadastro', passport.authenticate('cadastro', {
                        successRedirect : '/',
                        failureRedirect : '/cadastro',
                        failureFlash : true
                         }));
            app.post('/',
              passport.authenticate('login',{
                 failureRedirect : '/',
                  failureFlash : true
              }),
              function(req, res) {
                //Autenticacao deu certo
                if(req.user.permissao == "Professor") // Checa a permissao do user
                {
                res.redirect('/index');

                }else if(req.user.permissao == "Administrador")
                {
                  res.redirect('/admin');
                }
              });
            app.post('/notas', ConsultCtrl.GetNotas); 
            app.post('/pesqNotas', ConsultCtrl.buscaNotas);
            app.post('/attPass',CadController.attPass);
            app.post('/cadastroQuest', CadController.cadastroQuest); 
            app.post('/cadastroProva', CadController.cadastroProva);
            app.post('/cadastroDiario', CadController.cadastroDiario);
            app.post('/cadnotas', CadController.cadnotas);
            app.post('/deletarQuest', CadController.removerQuest);
            app.post('/pesqMat', ConsultCtrl.pesquisaMat);
            app.post('/pesquisarMateria', ConsultCtrl.pesquisarMateria);
            app.post('/pesqDisc', ConsultCtrl.pesquisaDisc);
            app.post('/pesqDiscProfII', ConsultCtrl.pesquisaDiscProf);
            app.post('/pesqDiscProfIII', ConsultCtrl.pesquisaDiscProfTurma);
            app.post('/pesqQuest', ConsultCtrl.pesquisaQuest);


            app.post('/pescaconsul', ConsultCtrl.pesquisateste);
            app.post('/getprova', ConsultCtrl.provaquests);
            app.post('/enviaremail', CadController.enviaremail);

            app.post('/findTables', CadController.findTables);
            app.post('/mostraturma', ConsultCtrl.pesquisaturma); 

            app.post('/pesqDiscProf',  ConsultCtrl.pesquisaDiscProf);
            app.post('/pegaaluno', ConsultCtrl.listalunos);
            app.post('/pesqProfs', ConsultCtrl.pesquisaProfessores);
            app.post('/pegaaula', ConsultCtrl.pegaPresenca);
            app.post('/consultandoProva', ConsultCtrl.consulProva);
            app.post('/UpPerfil', CadController.UpdatePerfil);
            app.post('/upFile',multer({ dest: './upFile/'}).single('txt'), CadController.upFile);
            app.post('/deleteBD',multer({ dest: './deleteLog/'}).single('txt'), CadController.deleteBD);
            app.post('/putBD',CadController.putBD);
            app.post('/UpFoto', CadController.UpFoto);






      /*-----------Calendario---------------------------------*/
        app.post('/pesquisaEvento', ConsultCtrl.pesquisaEvento); //Te,
        app.post('/cadastroEvento', CadController.cadastroEvento);
        app.post('/editEvento', CadController.editEvento);






};
function isLogged(request, response, next) {      
    if (request.isAuthenticated())
      return next();

    response.redirect('/');
}
