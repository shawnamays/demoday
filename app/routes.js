module.exports = function (app, passport, db) {

  // normal routes ===============================================================

  // show the home page (will also have our login links)



  app.get('/', function (req, res) {
    res.render('index.ejs');
  });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });


  // PROFILE SECTION =========================
  // this retrieves the profile route from the ejs file
  app.get('/profile', isLoggedIn, function (req, res) {
    db.collection('demoDay').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('profile.ejs', {
        user: req.user,
        messages: result
      })
    })
  });
// this code was given by void with help from a mentor named Mark


//   app.get('/inventory', async (req, res) => {
//     const groceryResult = await fetch("https://jsonplaceholder.typicode.com/todos/") //later on put grocery api here
//     let groceryJson = await groceryResult.json()

//     const drinkResult = await fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a") //later on put grocery api here
//     let drinkJson = await drinkResult.json()

//     //slice returns new array , splice mutates it
//     console.log(groceryJson.length);

//     groceryJson = groceryJson.slice(0, 10)
//     drinkJson = drinkJson.drinks.slice(0, 3)
//     console.log(groceryJson.length);
//     //const result = await db.collection('cart').find().toArray() //can use this logic structure later to loop through grocery items and try to find them in the cart, then do stuff based on that
//     res.render('inventory.ejs', { inventory: groceryJson, drink: drinkJson })
// })

  // LOGOUT ==============================
  // get is the read in CRUD
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
    // the backslash is the home page
  });

  // message board routes ===============================================================

  // create part of crud 
  app.post('/messages', (req, res) => {
    db.collection('messages').save({
      name: req.body.name,
      msg: req.body.msg,
      thumbUp: 0,
      thumbDown: 0
    }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/profile')
    })
  })

  //thumbs up and down----------------------------------------

  //THIS IS THE CREATE PART OF CRUD AND THE THUMB DOWN LOGIC
  app.put('/thumbup', (req, res) => {
    db.collection('messages').findOneAndUpdate({
      name: req.body.name,
      msg: req.body.msg
    }, {
      $set: {
        thumbUp: req.body.thumbUp + 1,
      }
    }, {
      sort: { _id: -1 },
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
  })


  app.put('/thumbDown', (req, res) => {
    db.collection('messages').findOneAndUpdate({
      name: req.body.name,
      msg: req.body.msg
    }, {
      $set: {
        thumbDown: req.body.thumbDown + 1,
      }
    }, {
      sort: { _id: -1 },
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
  })

  //THIS ROUTE SPECIFIES THAT WE WANT TO DELETE THE COMMENT

  app.delete('/messages', (req, res) => {
    db.collection('messages').findOneAndDelete({
      name: req.body.name,
      msg: req.body.msg
    }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
