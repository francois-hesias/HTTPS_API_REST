const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();
const fetch = require('node-fetch');
app.set("view engine", "ejs");
const options = {
    key: fs.readFileSync('./CERT/key.pem'),
    passphrase: 'hesias',
    cert: fs.readFileSync('./CERT/cert.pem')
};

app.use (express.static('./mirko'));
app.get('/toto', (req,res)=>{
    res.sendFile(__dirname +'/mirko/index.html');
    })

app.get('/utilisateurs', (req,res)=>{
    let listUsers;
        listUsers = [
            {nom : 'utilisateur1', age : 10},
            {nom : 'utilisateur2', age : 15},
            {nom : 'jacquouille', age : 2000}
        ];
        console.log(listUsers);
        let data = {title: "liste utilisateurs" , utilisateurs : listUsers} ;
        res.render('utilisateurs',data);
});
app.get('/movies', (async(req, res) => {
    const title = "movies";
    try {
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        const result = await fetch("http://127.0.0.1:5600/movies", {insecureHTTPParser: true});
        const listMovies = await result.json();
        console.log(listMovies);
        res.render(__dirname+'/views/plan.ejs', { title: title, movies:listMovies.data});
    } catch (error) {
        throw new Error(error);
    }
}));


app.get('/', (req,res)=>{
       let listOffre = [
            {typeOffre : 'BASIC BUNDLE', description : 'oui oui oui oui oui oui', content : 'Lorem ipsum dolor sit amet.', prix: 24},
            {typeOffre : 'BUSINESS BUNDLE', description : 'oui oui oui oui oui oui', content : 'Lorem ipsum dolor sit amet.', prix: 99},
            {typeOffre : 'PREMIUM BUNDLE', description : 'oui oui oui oui oui oui', content : 'Lorem ipsum dolor sit amet.', prix: 199}
        ];
        res.render('index', {title: 'jaimelepain', offres : listOffre});
});
app.use(function(req, res, next) {
    res.status(404).send('404 NOT FOUND');
    });

https.createServer(options, app ).listen(8866);