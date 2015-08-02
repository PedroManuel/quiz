var models = require('../models/models.js');

//Autoload - factoriza el código si ruta incluye :quizId
exports.load=function(req, res, next, quizId){
  models.Quiz.find(quizId).then(
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
        res.render('quizes/index', {quizes: quizes});
      })
    } else {
      models.Quiz.findAll().then(function(quizes){
        res.render('quizes/index', {quizes: quizes});
      })
    }
};


//GET /quizes/:id
exports.show=function(req,res){
    res.render('quizes/show', {quiz: req.quiz});
};

//GET /quizes/:id/answer
exports.answer=function(req,res){
    if (req.query.respuesta === req.quiz.respuesta){
      res.render('quizes/answer', {quiz:req.quiz, respuesta: 'Correcto'});
    } else{
      res.render('quizes/answer', {quiz:req.quiz, respuesta: 'Incorrecto'});
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
