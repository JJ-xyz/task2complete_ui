var express = require('express');
var app     = express();
var path    = require('path');

app.use(express.static(path.join(__dirname,'public')));

app.get('/', function(req, res){
    res.render('index');
});

app.listen(process.env.PORT || 4000, function(){
    console.log("=== task2complete :: listening on port [4000] ===");
});
