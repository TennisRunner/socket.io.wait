


// Create a server
var server = require("http").createServer();

// Get the socket.io constructor
var io = require("socket.io")(server);

// add emitWait support to it
io = require("socket.io.wait")(io);



// You can also use it on a nodejs server to emitWait 
// To another server that has socket.io.wait in use
// let ioClient = require("socket.io-client");
// ioClient = require("socket.io.wait")(ioClient);




io.on("connection", (socket) => 
{
	// make an async callback
	socket.on("get_info", async function(first, second, waitTime)
	{
		// Waits the set amount of time before continuing
		await new Promise((resolve, reject) =>
		{
			setTimeout(resolve, waitTime);
		});

		// return an object
		var result = 
		{
			sum:first + second,
			foo:"LET'S GOOOOOOO"
		}

		return result;
	});
});

server.listen(3000);






