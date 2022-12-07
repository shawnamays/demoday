// const { ObjectID } = require("mongodb");


module.exports = function (app, passport, db) {
  ObjectID = require('mongodb').ObjectID

  // normal routes ===============================================================

  // show the home page (will also have our login links)



  app.get('/', function (req, res) {
    res.render('index.ejs');
  });

  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout(() => {
      console.log('User has logged out!')
    });
    res.redirect('/');
  });

  //this is to get to the apothecary cabinet page ===============




  // PROFILE SECTION DASHBOARD PAGE =========================
  // this retrieves the profile route from the ejs file
  app.get('/profile', isLoggedIn, function (req, res) {
    db.collection('brews').find({ userid: req.user._id }).toArray((err, brews) => {
      db.collection('herbs').find({ userid: req.user._id }).toArray((err, herbs) => {
        db.collection('journey').find({ userid: req.user._id }).sort({ date: -1 }).toArray((err, result) => {
          let totalDays = 0
          if (result.length > 0) {
            const lastEntry = result[0].date
            const firstEntry = result[result.length - 1].date
            console.log(firstEntry, lastEntry)
            totalDays = Math.floor(lastEntry.getTime() - firstEntry.getTime()) / (1000 * 60 * 60 * 24)
            console.log(totalDays)
          }
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user: req.user,
            totalDays: Math.ceil(totalDays),
            herbs,
            brews
          })
        })
      })
    })
  });




  //APOTHECARY CABINET ============


  app.get('/apothecary', isLoggedIn, function (req, res) {
    db.collection('herbs').find({ userid: req.user._id }).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('apothecary.ejs', {
        herbs: result
      })
    })
  });

  // POSTING AN HERB FROM THE FORM INTO THE CABINET

  app.post('/post', (req, res) => {
    db.collection('herbs').insertOne({ userid: req.user._id, name: req.body.ingredients, taste: req.body.taste, pairsWith: req.body.pair, medicinalBenefits: req.body.benefits, url: req.body.url }, (err, result) => {

      if (err) return res.send(500, err)
      console.log("Insert Finished", new Date(), result)
      res.send({ status: "ok" })
    })
  })


  // DELETING AN HERB FROM THE CABINET

  app.delete('/delete', isLoggedIn, (req, res) => {
    console.log("deleting herb")
    db.collection('herbs').findOneAndDelete({
      userid: req.user._id,
      _id: ObjectID(req.body.herbid)

    }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })





  //I WANT TO BREW ===================================
  app.get('/brew', isLoggedIn, function (req, res) {
    db.collection('herbs').find({ userid: req.user._id }).toArray((err, herbs) => {
      db.collection('brews').find({ userid: req.user._id }).toArray((err, result) => {
        if (err) return console.log(err)
        res.render('brew.ejs', {
          brews: result,
          herbs
        })
      })
    })
  });



  //FORM POST TO REMEDIES SIDEBAR ON THE RIGHT ===========

  app.post('/newRemedies', (req, res) => {
    let herbSelection = req.body.herbSelection
    if (typeof herbSelection === "string" ) {

      herbSelection = [herbSelection]
    }
    db.collection('brews').insertOne(
      { userid: req.user._id, name: req.body.brewName, base: req.body.base, herbSelection: herbSelection, instructions: req.body.instructions }
    )
    res.redirect("/brew")

  })

  //DELETE A REMEDY FROM BREW PAGE
  app.delete('/deleteHerbs', isLoggedIn, (req, res) => {
    db.collection('brews').findOneAndDelete({
      userid: req.user._id,
      _id: ObjectID(req.body.brewid)

    }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('recipe deleted!')
    })
  })

  app.delete('/deleteBrews', isLoggedIn, (req, res) => {
    console.log('deleting brew')
    console.log(`User id=${req.user._id},brewName=${req.body.brewName}`)
console.log("brew herb selection=", req.body.brewHerbSelection)
    db.collection('brews').findOneAndDelete({
      userid: req.user._id,
      name: req.body.brewName,
      herbSelection: req.body.brewHerbSelection

    }, (err, result) => {
      if (err) return res.send(500, err)
      console.log(result)
      res.send('recipe deleted!')
    })
  })




  // HEALING PROGRESS TRACKER ==============================
  app.get('/healingtracker', isLoggedIn, function (req, res) {
    db.collection('journey').find({ userid: req.user._id }).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('healingtracker.ejs', {
        moods: result
      })
    })
  });

  //THIS IS POSTING THE HEALING JOURNAL ENTRY FORM 

  app.post('/trackJourney', (req, res) => {
    console.log(req.body)
    db.collection('journey').insertOne({
      userid: req.user._id,
      date: new Date(),
      mood: req.body.mood,
      energy: req.body.energy,
      usedRemedy: Boolean(req.body.usedRemedy),
      remedy: req.body.remedy,
      notes: req.body.notes

    }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')

    })
    res.redirect('/healingTracker');
  })


  // LOGOUT ==============================
  // get is the read in CRUD
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
    // the backslash is the home page
  });



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
