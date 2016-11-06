var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var config = {
  user: 'suryachintu',
  database: 'suryachintu',
  password: process.env.DB_PASSWORD,
  port:'5432',
  host: 'db.imad.hasura-app.io'
};

var app = express();
app.use(morgan('combined'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
var articles={
   'article-one':{
    title:'Article One',
    heading:'Article One',
    date:'13 October 2016',
    content:`<p>
               this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.
            </p>
            <p>
               this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.
            </p>   
            <p>
               this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.this is the content for Article one.
            </p>`
},
   'article-two':{
       title:'Article Two',
       heading:'Article Two',
       date:'13 October 2016',
       content:`<p>
               this is the content for Article Two.
            </p>`
       
   },
   'article-three':{
       title:'Article Three',
       heading:'Article Three',
       date:'13 October 2016',
       content:`<p>
               this is the content for Article Three.
            </p>`
   }
};



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
        ${date}
        </div>    
        <div>
        ${content} 
        </div>  
        </div>
        </body>    
        </html>
        `;
        return htmlTemplate;
}

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
    
    pool.query("SELECT * FROM article WHERE title = '" + req.params.articleName + "'" ,function(err,result){
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
