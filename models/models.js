var path=require('path');

//Postgres DATABASE_URL= postgres://user:passwd@host:port/DATABASE_URL
//SQLite  DATABASE_URL = sqlite://:@:/
var expRegular = /(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/;
var infoDatabase = process.env.DATABASE_URL;
var url = infoDatabase.match(expRegular);
var DB_name = (url[6] || null);
var user =    (url[2] || null);
var pwd =     (url[3] || null);
var protocol =(url[1] || null);
var dialect = (url[1] || null);
var port =    (url[5] || null);
var host =    (url[4] || null);
var storage = process.env.DATABASE_STORAGE;

//Carga Modelo ORM
var Sequelize = require('sequelize');

//USar BBDD sqlite3
var sequelize = new Sequelize(DB_name, user, pwd,
                    {
                      dialect: protocol,
                      protocol: protocol,
                      port:   port,
                      host:   host,
                      storage:  storage,  //Solo SQLite (.env)
                      omitNull: true    //Solo Postgres
                    }
            );

//Importar la definición de la tabla Quiz en quiz.js
//var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

// Importar definición de la tabla Comment
var comment_path = path.join(__dirname, 'comment');
var Comment = sequelize.import(comment_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; // exportar definición de la tabla Quiz
exports.Comment = Comment;
//sequilize.sync() crea e inicializa tabla de pregunta en DB
sequelize.sync().success(function(){
  //sucess(..) ejecuta el manejador una vez creada la tabla
  Quiz.count().success(function(count){
    if (count === 0){ //La tabal se inicializa solo si está vacía
      Quiz.create( { pregunta: 'Capital de Italia', respuesta: 'Roma', tema: 'humanidades'});
      Quiz.create( { pregunta: 'Capital de Portugal', respuesta: 'Lisboa', tema: 'humanidades'})
      .success(function(){console.log('Base de datos inicializada')});
    }
  });
});
