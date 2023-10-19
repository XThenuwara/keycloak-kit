// cpu stress test
// get cores
var os = require('os');
var numCPUs = 1000000000;

// create workers
var cluster = require('cluster');
var workers = [];

if (cluster.isMaster) {

    // create the workers
    for (var i = 0; i < numCPUs; i++) {
      console.log("sas")
        workers.push(cluster.fork());
    }

    // when a worker dies, create a new one
    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
        workers.push(cluster.fork());
    });

}else{

  // worker code
  var http = require('http');
  http.createServer(function(req, res) {
      res.writeHead(200);
      res.end("hello world\n");
  }).listen(8000);



  
  }

// run the test


