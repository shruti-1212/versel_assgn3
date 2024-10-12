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
app.use(express.static(__dirname + '/public'));
 

 
//Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});
 
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
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


  //start the server and gives output
// app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
legoData.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on port ${HTTP_PORT}`);
    });
  }).catch(err => {
    console.log(`Error: ${err}`);
  });
 