const express = require('express');
const app = express();
var favicon = require('serve-favicon')
const path = require('path');


app.use(express.static(__dirname+'/dist/angularOffline'));
app.use(favicon(__dirname + '/dist/angularOffline/favicon.ico'));
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname +'/dist/angularOffline/index.html'));
});

app.listen(process.env.PORT || 8080);

