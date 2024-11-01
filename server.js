/********************************************************************************
* WEB700 – Assignment 03
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Shruti Hande Student ID: 111559233 Date: 11-10-2024
*
* Published URL: https://versel-assgn3-4g96x85x9-shruti-1212s-projects.vercel.app/
*
********************************************************************************/




require('pg'); // explicitly require the "pg" module
const Sequelize = require('sequelize');
const express = require('express');
const app = express();
const path = require('path');
const LegoData = require("./modules/legoSets");
const legoData = new LegoData();
 
 
const HTTP_PORT = process.env.PORT || 8080;
 
// Set views directory (optional, if you plan to use a template engine)
app.set('views', __dirname + '/views');
 
// Serve static files (optional, if you have a 'public' folder for assets)
// app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
 
//start the server and give s output
// app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
legoData.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on port ${HTTP_PORT}`);
    });
  }).catch(err => {
    console.log(`Error: ${err}`);
  });
 
 
//Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});
 
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});


  // Route to add a new Lego set
app.get('/lego/add-test', (req, res) => {
    let testSet = {
        set_num: "123",
        name: "testSet name",
        year: "2024",
        theme_id: "366",
        num_parts: "123",
        img_url: "https://fakeimg.pl/375x375?text=[+Lego+]"
    };

    legoData.addSet(testSet)
        .then(() => res.redirect('/lego/sets')) // Redirect if addition is successful
        .catch(error => res.status(422).json({ error })); // Send error if addition fails
  });


//  handle the /lego/sets route
app.get('/lego/sets', (req, res) => {
    const theme = req.query.theme;
 
    if (theme) {
      legoData.getSetsByTheme(theme).then((sets) => {
        res.json(sets);
      }).catch(err => {
        res.status(404).send(err);
      });
    } else {
      legoData.getAllSets().then((sets) => {
        res.json(sets);
      }).catch(err => {
        res.status(404).send(err);
      });
    }
  });
 
  // /lego/sets/:set_num Route:
  app.get('/lego/sets/:set_num', (req, res) => {
    const setNum = req.params.set_num;
 
    legoData.getSetByNum(setNum).then((set) => {
      res.json(set);
    }).catch(err => {
      res.status(404).send(err);
    });
  });
 
 
  //404 error
  app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
  });