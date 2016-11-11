var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = {
  user: 'suryachintu',
  database: 'suryachintu',
  password: process.env.DB_PASSWORD,
  port:'5432',
  host: 'db.imad.hasura-app.io'
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
  secret: 'random',
  cookie: { maxAge : 1000*60*60*24*30 }
}));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function createTemplate(data){
    var title=data.title;
    var heading =data.heading;
    var date=data.date;
    var content=data.content;
        var htmlTemplate=`
        <html>
        <head>
        <title>${title}</title>
        <meta name="viewport" content="width-device-width,initial-scale=1"/>
        <link href="/ui/style.css" rel="stylesheet" />
        </head>    
        <body>
        <div class="container">
        <div>
        <a href="/">Home</a>
        </div>
        <hr/>
        <h3>${heading}</h3>
        <div>
        ${date.toDateString()}
        </div>    
        <div>
        ${content} 
        </div> 
        <div>
        <h3>Comments</h3>
        <div class="form-group">
          <textarea name="message" id="message" class="form-control" rows="4" placeholder="Message" required="" aria-invalid="false"></textarea>
          <p class="help-block text-danger"></p>
        </div>
        </div>
        </div>
        </body>    
        </html>
        `;
        return htmlTemplate;
}

function hash(input,salt){
    
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2",10000,salt,hashed.toString('hex')].join('$');
}

app.get('/hash/:input', function (req, res) {
    
    var hashedString = hash(req.params.input,"random");
    res.send(hashedString);
    
});

app.post('/login', function (req, res) {
    
    //{"username":"surya","password":"dummy"}
    
    var username = req.body.username;
    var password = req.body.password;
    
    pool.query('SELECT * FROM "user" WHERE username = $1',[username],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            if(result.rows.length === 0){
                res.status(403).send("username/password is invalid");
            }else{
                var dbString = result.rows[0].password;
                var salt = dbString.split('$')[2];
                var hashedPassword = hash(password,salt);
                if(hashedPassword === dbString){
                    
                    //Set a session
                    req.session.auth = {userId : result.rows[0].id};
                    //set a cookie with session id
                    //internally on the server it maps the session id to an object
                    //{auth.....}
                    
                    
                    res.send("credentials correct");
                    
                }else{
                    res.status(403).send("username/password is invalid");
                }
            }
        }
    });
    
});

app.get('/check-login',function(req,res){
   
   if(req.session && req.session.auth && req.session.auth.userId){
       res.send("You are logged in " + req.session.auth.userId.toString());
   }else{
       res.send("You are not logged in ");
       
   }
    
});

app.get('/logout',function(req,res){
   
   delete req.session.auth;
   
   res.send("You are logged out");
   
    
});



app.post('/create-user', function (req, res) {
    
    //{"username":"surya","password":"dummy"}
    
    var username = req.body.username;
    var password = req.body.password;
    var salt = crypto.randomBytes(128).toString('hex');
    var dbString = hash(password,salt);
    
    pool.query('INSERT INTO "user" (username,password) VALUES ($1,$2)',[username,dbString],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            res.send("User successfully created "  + username);
        }
    });
    
});


var pool = new Pool(config);
app.get('/test-db', function (req, res) {
    //make a select request 
    // return the result from the response
    pool.query('SELECT * FROM test',function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            res.send(JSON.stringify(result.rows));
        }
    });
});

var names = [];
app.get('/submit-name', function (req, res) {
    //get he name from the request
    var name = req.query.name;
    names.push(name);
    res.send(JSON.stringify(names));
});

//my urls
app.get('/articles/:articleName',function(req,res){
    
    pool.query("SELECT * FROM article WHERE title = $1",[req.params.articleName],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            if(result.rows === 0){
                res.status(404).send("Article Not Found");
            }else{
                var articleData = result.rows[0];
                res.send(createTemplate(articleData));
            }
        }
    });
    
}
);
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

var counter = 0;
app.get('/counter',function(req,res){
   counter = counter + 1;
   res.send(counter.toString()); 
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});


app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
