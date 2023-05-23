const fs = require("fs");
const express = require('express');
const { Client } = require('pg');

const host = 'localhost';
const port = 8080;

const app = express();

// Client pour la base de données
const client = new Client({
    //user: 'postgres',
    //password: 'root',
    database: 'photo', // Mettre le nom de votre base de données  !!
    //port : process.env.UID
});

//Connection à la base de données
client.connect()
.then(() => {
    console.log('Connected to database');
})
.catch((e) => {
    console.log('Error connecting to database');
    console.log(e);
});

// Les ROUTES

// Route statique 
// le premier paramètre est le chemin de la route
// le deuxième paramètre est le chemin du répertoire
app.use('/public', express.static('./public'));

app.get('/',  (req, res) => {
    res.redirect('/public/index.html');
});

app.get('/index', (req, res) => {
    res.redirect('/public/index.html');
});

app.get('/index.html', (req, res) => {
    res.redirect('/public/index.html'); 
});

app.get('/image/:num',(req,res) => {
    let num = req.params.num;
    res.redirect(`/image${num}.jpg`);
})

app.get('/mur-images',async (req, res) => {
    
    try {
        const sqlQuery = 'SELECT fichier from photos'; //Requête SQL
        const sqlResult = await client.query(sqlQuery); 

        const fichiersImage = sqlResult.rows.map(row => row.fichier);

        res.render('mûr',{mûr: fichiersImage});        
    } catch (e) {
        console.log(e);
        console.log("erreur connecting");
        res.end(e);
    }
});

app.get('/image:num', async (req, res) => {
    const sqlQuery = 'SELECT fichier from photos'; //Requête SQL
    const sqlResult = await client.query(sqlQuery); 
    const fichiersImage = sqlResult.rows.map(row => row.fichier);

    res.render('page',{page: fichiersImage }); 
});


// EJS 
app.set('view engine', 'ejs');
app.set ('views', './ejs-templates');

app.get('/ejs-test', (req, res) => {
  res.render('test', {name: 'slim'});
});

app.get('/ejs-mûr',async (req,res) => {
    const sqlQuery = 'SELECT fichier from photos'; 
    const sqlResult = await client.query(sqlQuery); 
    const fichiersImage = sqlResult.rows.map(row => row.fichier);
    res.render('mûr',{mûr: fichiersImage});
});

app.get('/ejs-image', (req, res) =>{
    let num = req.params.num;
    res.render('image', {num: `num`});
  });

/*app.get('/ejs-page', (req,res) => {
    const sqlQuery = 'SELECT fichier from photos'; 
    const sqlResult = await client.query(sqlQuery); 
    const fichiersImage = sqlResult.rows.map(row => row.fichier);
    res.render('page', {page: fichiersImage})

});*/

app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});
