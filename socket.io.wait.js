
"use strict"






// If included in a web page
if(typeof(io) != "undefined" && typeof(window) != "undefined")
{
	// automatically overwrite the io constructor
	io = OverwriteClientCreation(io);
}
else
{
	module.exports = function(io)
	{
		// socket.io-client has a method called Manager while the server does not
		if(io.Manager)
			return OverwriteClientCreation(io);
		else
			return OverwriteServerCreation(io);
	};

	function OverwriteServerCreation(io)
	{
		io.originalOn = io.on;

		io.on = function(...args)
		{
			if(args[0] && args[0] == "connection")
			{
				let originalCallback = args[1];

				args[1] = function(client)
				{
					client.originalOn = client.on;

					client.on = function(eventName, cb, ...args)
					{
						this.originalOn(eventName, async (...args) =>
						{
							if(args[0] && args[0] == "emit_wait")
							{
								// Extract the resolve function
								let resolve = args.splice(-1)[0];

								// Extract the emit_wait key
								args.splice(0, 1);

								// call the original on callback
								let res = await cb(...args);
					
								// call it
								if(typeof(resolve) == "function")
									resolve(res);
							}
							else
							{
								cb(...args);
							}
						});
					}

					originalCallback(client);
				}
			}

			this.originalOn(...args);
		}

		return io;
	}
}

function OverwriteClientCreation(io)
{
	var originalIO = io;

	io = function(...args)
	{
		let result = originalIO(...args);

		result.emitWaitTimeout = 30000;
		result.emitWaitReject = false;

		result.emitWait = function(eventName, ...args)
		{
			// Create a promise
			return new Promise((resolve, reject) =>
			{
				setTimeout(function()
				{
					if(io.emitWaitReject == true)
						reject();
					else
						resolve(null);
				}, result.emitWaitTimeout);

				// call the emit with the event, the resolve, and the original args
				this.emit(eventName, "emit_wait", ...args, resolve);
			});			
		}
		
		return result;
	}

	return io;
}
