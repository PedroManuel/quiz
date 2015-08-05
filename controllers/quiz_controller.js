var models = require('../models/models.js');

//Autoload - factoriza el código si ruta incluye :quizId
exports.load=function(req, res, next, quizId){
  models.Quiz.
  find({where: {id: Number(quizId)},
        include: [{model: models.Comment}]
      })
  .then(
    function(quiz){
      if (quiz){
        req.quiz = quiz;
        next();
      } else {
        next(new Error('No existe quizId=' + quizId));
      }
    }
  ).catch(function(error){next(error);});
};

//GET /quizes
exports.index=function(req,res){
    var cadena = req.query.search;
    if (cadena){
      cadena = "%" + cadena.trim().replace(" ","%") + "%";
      models.Quiz.findAll({where:["pregunta like ?", cadena]}).then(function(quizes){
        res.render('quizes/index', {quizes: quizes, errors: []});
      })
    } else {
      models.Quiz.findAll().then(function(quizes){
        res.render('quizes/index', {quizes: quizes, errors: []});
      })
    }
};


//GET /quizes/:id
exports.show=function(req,res){
    res.render('quizes/show', {quiz: req.quiz, errors: []});
};

//GET /quizes/:id/answer
exports.answer=function(req,res){
    if (req.query.respuesta === req.quiz.respuesta){
      res.render('quizes/answer', {quiz:req.quiz, respuesta: 'Correcto', errors: []});
    } else{
      res.render('quizes/answer', {quiz:req.quiz, respuesta: 'Incorrecto', errors: []});
    }
};
/*
//GET /quizes/question

exports.question = function(req, res){
  res.render('quizes/question', {pregunta: 'Capital Italia'});
};

//GET /quizes/answer
exports.answer = function(req, res) {
   if (req.query.respuesta === 'Roma'){
      res.render('quizes/answer', {respuesta: 'Correcto'});
   } else {
      res.render('quizes/answer', {respuesta: 'Incorrecto'});
   }
};
*/
//GET /quizes/author
exports.author = function(req, res){
  res.render('quizes/author');
};

exports.new = function(requ, res){
  var quiz = models.Quiz.build(   //Crea objeto quiz
      {pregunta:"Pregunta", respuesta: "Respuesta", tema:"Tema"}
  );
  res.render('quizes/new',{quiz:quiz, errors: []});
};

//POST /quizes/Create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );

  quiz.validate().then(
    function(err){
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        quiz // save: guarda en DB campos pregunta y respuesta de quiz
        .save({fields: ["pregunta", "respuesta", "tema"]})
        .then( function(){ res.redirect('/quizes')})
      }      // res.redirect: Redirección HTTP a lista de preguntas
    }
  ).catch(function(error){next(error)});
};

exports.edit = function(req, res){
  var quiz = req.quiz; // autoload de instancia de quiz
  res.render('quizes/edit', {quiz: quiz, errors: []});
};

//PUT /quizes/:id
exports.update = function(req, res){
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;


  req.quiz.validate()
  .then(
    function(err){
      if (err){
        res.render('quizes/edit', {quiz:req.quiz, errors: err.errors});
      } else {
        req.quiz  // save: gauarda campos pregunta y respuesta en db
        .save( {fields:["pregunta","respuesta","tema"]})
        .then( function() {res.redirect('/quizes');});
      } // Redirección HTTP a la lista de preguntas (URL relativo)
    }
  ).catch(function(error){next(error)});
};

//DELETE /quizes/:id
exports.destroy = function(req, res){
  req.quiz.destroy().then( function(){
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};
