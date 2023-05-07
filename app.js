const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const Game = require('./models/games'); // Importar el modelo

// Conexión a la base de datos
mongoose.connect('mongodb://127.0.0.1:27017/videojuegos', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conectado a MongoDB');
}).catch((error) => {
  console.error(error);
});

// Middleware para procesar datos de formularios
app.use(express.urlencoded({ extended: true }));

// Vista para ingresar datos
app.get('/new', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Nuevo juego</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
  integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
      </head>
      <body>
        <div class="container">
          <h1 class="mt-5">Nuevo juego</h1>
          <form method="POST" action="/">
            <div class="form-group">
              <label for="title">Título</label>
              <input type="text" class="form-control" id="title" name="title" required>
            </div>
            <div class="form-group">
              <label for="genre">Género</label>
              <input type="text" class="form-control" id="genre" name="genre" required>
            </div>
            <div class="form-group">
              <label for="year">Año de lanzamiento</label>
              <input type="number" class="form-control" id="year" name="year" required>
            </div>
            <button type="submit" class="btn btn-primary">Guardar</button>
          </form>
        </div>
      </body>
    </html>
  `);
});



// Vista para mostrar los datos almacenados
app.get('/', async (req, res) => {
  const games = await Game.find();
  res.send(`
    <html>
      <head>
        <title>Juegos</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
  integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
      </head>
      <body>
        <div class="container">
          <h1 class="mt-5">Juegos</h1>
          <a href="/new" class="btn btn-primary mb-3">Agregar nuevo juego</a>
          <ul class="list-group">
            ${games.map(game => `
              <li class="list-group-item">
                ${game.title} (${game.year})
              </li>
            `).join('')}
          </ul>
        </div>
      </body>
    </html>
  `);
});




// Ruta para procesar el formulario
app.post('/', (req, res) => {
  const game = new Game({
    title: req.body.title,
    genre: req.body.genre,
    year: req.body.year
  });

  game.save()
    .then(() => {
      res.redirect('/'); // Redirección a la ruta '/games'
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

// Ruta para eliminar un juego


// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor ejecutandose en el puerto : ${port}`);
});
