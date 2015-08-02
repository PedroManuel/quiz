
//GET /quizes
exports.index=function(req,res){
  models.Quiz.findAll().then(function(quizes){
    res.render('quizes/index.ejs', {quizes: quizes});
  })
};


//GET /quizes/:id
exports.show=function(req,res){
  models.Quiz.find(req.params.quizID).then(function(quiz){
    res.render('quizes/show', {quiz: quiz});
  })
};

//GET /quizes/:id/answer
exports.answer=function(req,res){
  models.Quiz.find(req.parms.quizId).then(function(quiz){
      if (req.query.respuesta === quiz.respuesta){
        res.render('quizes/answer', {quiz:quiz, respuesta: 'Correcto'});
      } else{
        res.render('quizes/answer', {quiz:quiz, respuesta: 'Incorrecto'});
      }
  })
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
