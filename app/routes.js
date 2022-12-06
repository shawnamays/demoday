// const { ObjectID } = require("mongodb");


module.exports = function (app, passport, db) {
ObjectID = require('mongodb').ObjectID

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

    //this is to get to the apothecary cabinet page ===============

  


  // PROFILE SECTION DASHBOARD PAGE =========================
  // this retrieves the profile route from the ejs file
  app.get('/profile', isLoggedIn, function (req, res) {
    db.collection('brews').find().toArray((err, brews) => {
    db.collection('herbs').find().toArray((err, herbs) => {
    db.collection('journey').find().sort({date: -1}).toArray((err, result) => {
      const lastEntry = result[0].date
      const firstEntry = result[result.length - 1].date
      console.log(firstEntry, lastEntry)
      const totalDays = Math.floor(lastEntry.getTime()-firstEntry.getTime()) / (1000*60*60*24)
  console.log(totalDays)
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


// ======= THIS IS GOING TO BE A NUMBER THAT SHOWS A NUMBER OF SAVED HERBS IN MY CABINET



  ///this is RETREIEVING THE SAVED RECIPES
  


  // THIS IS GOING TO SHOW A PROGRESS BAR OF THE MONTHLY HEALING PROGRESS ==========
//   db.collection('journey').find().sort({date: -1}).toArray((err, result) => {
//     const lastEntry = result[0].date
//     const firstEntry = result[result.length - 1].date
//     console.log(firstEntry, lastEntry)
//     const totalDays = Math.floor(lastEntry.getTime()-firstEntry.getTime()) / (1000*60*60*24)
// console.log(totalDays)
//     if (err) return console.log(err)
//     res.render('profile.ejs', {
//       user: req.user,
//       totalDays: Math.ceil(totalDays)
//     })
//   })
// });


// THIS IS GOING TO BE A NUMBER THAT COUNTS SAVED RECIPES



//==============================================================================================

// THIS IS GOING TO BE A NUMBER THAT SHOWS HOW MANY TIMES USER HAS BREWED A REMEDY





 //APOTHECARY CABINET ============


 app.get('/apothecary', isLoggedIn, function (req, res) {
  db.collection('herbs').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('apothecary.ejs', {
      herbs: result
    })
  })
});

// POSTING AN HERB FROM THE FORM INTO THE CABINET

app.post('/post', (req, res) => {
  db.collection('herbs').insertOne({name: req.body.ingredients, taste: req.body.taste, pairsWith: req.body.pair, medicinalBenefits: req.body.benefits, url: req.body.url})
res.redirect("/apothecary")


})

// DELETING AN HERB FROM THE CABINET

app.delete('/delete', isLoggedIn, (req, res) => {
  db.collection('herbs').findOneAndDelete({
    email: req.body.email
  }, {
    $pull: {
      cabinet: req.body.herb
    }
  }, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})

// app.put('/saved', isLoggedIn, (req, res) => {
   
//     db.collection('herbs').findOneAndUpdate({
//     _id: ObjectID(req.body.id)
  
//     }, {
//       $set: {
//         saved: true 
//       }
//     }, (err, result) => {
//       if (err) return res.send(err)
//       res.send(result)
//     })
//   })





  //I WANT TO BREW ===================================
  app.get('/brew', isLoggedIn, function (req, res) {
    db.collection('herbs').find().toArray((err, herbs) => {
    db.collection('brews').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('brew.ejs', {
        brews: result,
        herbs
      })
    })
    })
  });
 


  //FORM POST TO SIDEBAR ON THE RIGHT ===========




  app.post('/newRemedies', (req, res) => {
    db.collection('brews').insertOne({name: req.body.brewName, base: req.body.base, herbSelection: req.body.herbSelection, instructions: req.body.instructions})
  res.redirect("/brew")
  
  
  })


  //RETRIEVE DATA FROM SAVED DATABASE TO POPULATE IN CHOOSE HERBS OPTION===============================

  // app.get('/apothecary', isLoggedIn, function (req, res) {
  //   db.collection('herbs').find().toArray((err, result) => {
  //     if (err) return console.log(err)
  //     res.render('apothecary.ejs', {
  //       herbs: result
  //     })
  //   })
  // });

  // app.put('/update', isLoggedIn, (req, res) => {
   
  //   db.collection('herbs').findOneAndUpdate({
  //   _id: ObjectID(req.body.id)
  
  //   }, {
  //     $addToSet: {
  //       herb: req.body.herb
  //     }
  //   }, {
  //     sort: { _id: -1 },
  //     upsert: true
  //   }, (err, result) => {
  //     if (err) return res.send(err)
  //     res.send(result)
  //   })
  // })





  
  // HEALING PROGRESS TRACKER ==============================
  app.get('/healingtracker', isLoggedIn, function (req, res) {
    db.collection('journey').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('healingtracker.ejs', {
        moods: result
      })
    })
  });

  app.post('/trackJourney', (req, res) => {
    console.log(req.body)
    db.collection('journey').insertOne({
      user: req.user.local.email,
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

  // message board routes ===============================================================

  // // create part of crud 
  // app.post('/messages', (req, res) => {
  //   db.collection('messages').save({
  //     name: req.body.name,
  //     msg: req.body.msg,
  //     thumbUp: 0,
  //     thumbDown: 0
  //   }, (err, result) => {
  //     if (err) return console.log(err)
  //     console.log('saved to database')
  //     res.redirect('/profile')
  //   })
  // })







// app.post('/post', (req, res) => {
//     db.collection('herbs').find().toArray({
//       herb: [req.body.herb],
      

//     }, (err, result) => {
//       if (err) return console.log(err)
//       console.log('saved to database')
    
//     })
//   })



  app.delete('/delete', isLoggedIn, (req, res) => {
    db.collection('myCabinet').findOneAndDelete({
      email: req.body.email
    }, {
      $pull: {
        cabinet: req.body.herb
      }
    }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })


  app.put('/update', isLoggedIn, (req, res) => {
    console.log(req.body.id)
    db.collection('myCabinet').findOneAndUpdate({
    _id: ObjectID(req.body.id)
  
    }, {
      $addToSet: {
        herb: req.body.herb
      }
    }, {
      sort: { _id: -1 },
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
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
