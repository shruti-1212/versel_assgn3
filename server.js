/********************************************************************************
* WEB700 – Assignment 06
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Shruti Hande Student ID: 111559233 Date: 06-12-2024
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
app.set('views', path.join(__dirname, 'views'));

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Serve static files (optional, if you have a 'public' folder for assets)
// app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// Add middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

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
  res.render("home");
});
 
app.get('/about', (req, res) => {
  res.render("about");
});


//  handle the /lego/sets route
app.get('/lego/sets', (req, res) => {
    const theme = req.query.theme;
 
    if (theme) {
      legoData.getSetsByTheme(theme).then(
        sets => {
          res.render("sets", { sets: sets });
        }
      ).catch(err => {
        res.render("404", {message: "I'm sorry, we're unable to find what you'relooking for."});
      });
    } else {
      legoData.getAllSets().then(
        sets => {
          res.render("sets", { sets: sets });}
      ).catch(err => {
        res.render("404", {message: "I'm sorry, we're unable to find what you'relooking for."});
      });
    }
  });
 
  // /lego/sets/:set_num Route:
  app.get('/lego/sets/:set_num', (req, res) => {
    const setNum = req.params.set_num;
 
    legoData.getSetByNum(setNum).then(
      set => {
        res.render("set", { set: set });
      }
    ).catch(err => {
      res.render("404", {message: "I'm sorry, we're unable to find what you'relooking for."});
    });
  });
 
  app.get('/lego/addSet', (req, res) => {
    legoData.getAllThemes().then(
      sets => {
        res.render("addSet", { themes: themes });}
    ).catch(err => {
      res.render("404", {message: "I'm sorry, we're unable to find what you'relooking for."});
    });
  });
  
  // POST route to handle adding a new Lego set
  app.post('/lego/addSet', async (req, res) => {
    // Extract form data from the request body

    const setData = {
    
      name: req.body.name,
      year: req.body.year,
      num_parts: req.body.num_parts,
      img_url: req.body.img_url,
      theme_id: req.body.theme_id,
      set_num: req.body.set_num,
      theme: req.body.theme,
    };

    // Call the addSet method and handle the promise
    await legoData.addSet(setData)
      .then(() => {
        // Redirect to /lego/sets if successful
        res.redirect('/lego/sets');
      })
      .catch(error => {
        // Send error response if the Promise is rejected
        res.status(422).json({ error: error });
      });
  });

  // New GET route to handle deleting a Lego set by set_num
  app.get("/lego/deleteSet/:set_num", async (req, res) => {
  try {
    await legoData.deleteSetByNum(req.params.set_num);

    res.redirect("/lego/sets");
  } catch (err) {
    res.render("404", {message: "I'm sorry, we're unable to find what you'relooking for."});
  }
});

  //404 error
  app.use((req, res) => {
    res.status(404).render("404");
  });