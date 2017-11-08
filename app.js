var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    Question                  = require("./models/question"),
    Project                  = require("./models/project")
    
    
mongoose.connect("mongodb://localhost/cera_demo_app4");
var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "I am a developer and Programmer",
    resave: false,
    saveUninitialized: false
}));

var serveStatic = require('serve-static')
app.use(serveStatic('images/'))
app.use(serveStatic('models/'))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// var rankSchema = new mongoose.Schema({
//     name: String,
//     no_of_solved: Number,
//     Rank: Number
// });
// var rankDetail = mongoose.model("rank", rankSchema);

// var newUser = new rankDetail({
//     name: "aditya",
//     no_of_solved: 12,
//     Rank:  284
// });



// newUser.save(function(err, user){
//   if(err){
//       console.log(err);
//   } else {
//       console.log(user);
//   }
// });




app.get("/", function(req, res){
    res.render("home", {currentUser: req.user});
});

app.get("/questionshow", isLoggedIn, function(req, res){
    Question.find({}, function(err, allQuestion){
       if(err){
           console.log(err);
       } else {
          res.render("questionshow",{questions:allQuestion, currentUser: req.user});
       }
    });
});
    ``
app.post("/question", function(req, res){
    var desc = req.body.description;
    var newQuestion = {description: desc}
    
    Question.create(newQuestion, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
           
            res.redirect("/questionshow");
        }
    });
});
app.get("/question/new", isLoggedIn, function(req, res){
   res.render("new",{currentUser: req.user}); 
});



app.get("/codeapi", isLoggedIn, function(req, res){
    res.render("codeapi");
});

app.get("/programming", isLoggedIn, function(req, res){
    res.render("programming");
});

app.get("/project", isLoggedIn, function(req, res){
    Project.find({}, function(err, allProject){
       if(err){
           console.log(err);
       } else {
          res.render("project",{project:allProject, currentUser: req.user});
       }
    });
});
app.post("/project", function(req, res){
    var desc = req.body.description;
    var newProject = {description: desc}
    
    Project.create(newProject, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
           
            res.redirect("/project");
        }
    });
});


app.get("/register", function(req, res){
   res.render("register"); 
});

app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/");
        });
    });
});


app.get("/login", function(req, res){
   res.render("login"); 
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}) ,function(req, res){
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started.......");
})