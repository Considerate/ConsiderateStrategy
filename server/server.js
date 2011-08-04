var io = require('socket.io').listen(80);
io.set('log level', 1); 

var fs = require('fs');

// Read and eval library
var filedata = fs.readFileSync('./BaseObject.js','utf8');
eval(filedata);


var Server = BaseObject.extend(
{
    framerate: 80,
    info: {
        lastFrameTime: 0,
        runningFrameTime: 0        
    },
    _construct: function()
    {
        var self = this;
        var cache = {};
        cache.bullets = {};
        cache.players = {}; 
        self.cache = cache;

        io.sockets.on('connection', function (socket) {
            //Ask location and send positions of other players
            socket.emit("where are you?",self.cache.players); 
    
            //Player joined
            socket.on("player joined", function(data)
            {
                if(self.cache.players[socket.id] === undefined)
                {
                    self.cache.players[socket.id] = {};
                }
                //Set color and position to cache
                self.cache.players[socket.id].color = self.randomizeColor();
                self.cache.players[socket.id].position = {
                    x: 50, 
                    y: 50
                };
        
                //Send results to other players
                self.cache.players[socket.id].id = socket.id;
                io.sockets.emit("player update",self.cache.players[socket.id]);
            });
            
            //move player left and resend back to clients
            socket.on("left", function()
            {
                if(self.cache.players[socket.id] === undefined)
                {
                    self.cache.players[socket.id] = {};
                }
                
                if(self.cache.players[socket.id].position === undefined)
                {
                    self.cache.players[socket.id].position = {
                        x:0, 
                        y: 0
                    };
                }
                
                self.cache.players[socket.id].position.x -= 1;
        
                //Send results to other players
                self.cache.players[socket.id].id = socket.id;
                io.sockets.emit("player update",self.cache.players[socket.id]);
            });
            
            //move player right and resend back to clients
            socket.on("right", function()
            {
                if(self.cache.players[socket.id] === undefined)
                {
                    self.cache.players[socket.id] = {};
                }
                
                if(self.cache.players[socket.id].position === undefined)
                {
                    self.cache.players[socket.id].position = {
                        x:0, 
                        y: 0
                    };
                }
                
                self.cache.players[socket.id].position.x += 1;
                
                //Send results to other players
                self.cache.players[socket.id].id = socket.id;
                io.sockets.emit("player update",self.cache.players[socket.id]);
            });
            
            //move player up and resend back to clients
            socket.on("up", function()
            {
                if(self.cache.players[socket.id] === undefined)
                {
                    self.cache.players[socket.id] = {};
                }
        
                if(self.cache.players[socket.id].position === undefined)
                {
                    self.cache.players[socket.id].position = {
                        x:0, 
                        y: 0
                    };
                }
                
                self.cache.players[socket.id].position.y -= 1;
                
                //Send results to other players
                self.cache.players[socket.id].id = socket.id;
                io.sockets.emit("player update",self.cache.players[socket.id]);
            });
            
            //move player down and resend back to clients
            socket.on("down", function()
            {
                if(self.cache.players[socket.id] === undefined)
                {
                    self.cache.players[socket.id] = {};
                }
                
                if(self.cache.players[socket.id].position === undefined)
                {
                    self.cache.players[socket.id].position = {
                        x:0, 
                        y: 0
                    };
                }
                
                self.cache.players[socket.id].position.y += 1;
                
                //Send results to other players
                self.cache.players[socket.id].id = socket.id;
                io.sockets.emit("player update",self.cache.players[socket.id]);
            });
            
            socket.on("shoot", function()
            {
                if(self.cache.players[socket.id] === undefined)
                {
                    self.cache.players[socket.id] = {};
                }
                
                if(self.cache.players[socket.id].position === undefined)
                {
                    self.cache.players[socket.id].position = {
                        x:0, 
                        y: 0
                    };
                }
                
                self.cache.players[socket.id].position.y += 1;
                
                //Send results to other players
                self.cache.players[socket.id].id = socket.id;
                io.sockets.emit("player update",self.cache.players[socket.id]);
            });
    
    
            socket.on('disconnect', function () {
                console.log(socket.id,"disconnected");
                //Remove disconnected player from player cache
                delete self.cache.players[socket.id];
                io.sockets.emit("player disconnected",socket.id);
            });
    
        });
    },
    update: function(time) {
        
    },
    gameLoop: function() {
        //Handle time
        this.numFrames++;
        if (!this.info.lastFrameTime) {
            this.info.lastFrameTime = new Date().getTime();
        } else {
            var now = new Date().getTime();
            var timeToDraw = now - this.info.lastFrameTime;
            this.info.runningFrameTime = this.info.runningFrameTime * .8 + timeToDraw * .2;
            this.info.lastFrameTime = now;
        }
        var time = this.info.runningFrameTime;
        
        //Call functions
        this.update(time);
        
        //Recursively call this function again after some time
        var self = this;
        this.gameLoopTimeout = setTimeout(function () {
            self.gameLoop();
        },1000/this.framerate);
    },
    randomizeColor: function()
    {
        return "AAA";
    },
    generateId: function(){
        return Math.abs(Math.random() * Math.random() * Date.now() | 0).toString()
        + Math.abs(Math.random() * Math.random() * Date.now() | 0).toString();
    }
});
Server.create();