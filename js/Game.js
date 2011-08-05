var Game = BaseObject.extend({
    framerate: 80,
    info: {
        lastFrameTime: 0,
        runningFrameTime: 0        
    },
    weaponinfo: {
        lastshoottime: 0,
        timepershoot: 100
    },
    keys: {},
    _construct: function() {
        this.init();
        this.gameLoop();
        
        var socket = io.connect('http://78.70.209.11');
        this.socket = socket;
        
        var self = this;
        
        socket.on("where are you?",function (players){
            for (var key in players) {
                if (players.hasOwnProperty(key)) {
                    var player = players[key];                  
                    self.world.players[player.id] = Player.create(player);
                }
            }
            socket.emit("player joined");
        });
        
        socket.on("player update",function(player){
            self.world.players[player.id] = Player.create(player);
        });
        
        socket.on("bullets",function(bullets){
            self.world.bullets = bullets;
        });
        
        socket.on("player disconnected",function(id)
        {
            //Remove disconnected player from cache
            delete self.world.players[id];
        });
 
        $(document).keydown(function (event){
            // handle cursor keys
            if (event.keyCode == 65) {
                // go left
                socket.emit("left");
            }
            if (event.keyCode == 68) {
                // go right
                socket.emit("right");
            }
            if (event.keyCode == 87) {
                // go up
                socket.emit("up");
            }
            if (event.keyCode == 83) {
                // go down
                socket.emit("down");
            }
            if (event.keyCode == 32) {
                // shoot
                socket.emit("shoot");
            }
            
        });
        
        $(window).unload(function() {
            socket.disconnect();
        });
 
    },
    init: function() {
        this.world = World.create();
        var canvas = document.getElementById("gameCanvas");
        var context = canvas.getContext("2d");
        this.context = context;
        
    },
    render: function(time) {
        var key;
        for (key in this.world.players) {
            if (this.world.players.hasOwnProperty(key)) {
                var player = this.world.players[key];
                
                var x = player.position.x;
                var y = player.position.y;
                var oldFillStyle = this.context.fillStyle;
                this.context.fillStyle = "#"+player.color;
                this.context.fillRect(x-5,y-5,10,10);
                this.context.fillStyle = oldFillStyle;
            }
        }
        
        for (key in this.world.bullets) {
            if (this.world.bullets.hasOwnProperty(key)) {
                var bullet = this.world.bullets[key];
                this.context.beginPath();
                this.context.arc(bullet.position.x,bullet.position.y,bullet.radius,0,Math.PI*2,true);
                this.context.closePath();
                this.context.fill();
            }
        }
        /*
        this.world.objects.forEach(function(object){
            if(Bullet.isPrototypeOf(object)) {
                //Draw bullet 
                this.context.beginPath();
                this.context.arc(object.position.x,object.position.y,object.radius,0,Math.PI*2,true);
                this.context.closePath();
                this.context.fill();
            }
            else if(Player.isPrototypeOf(object)) {
                //Draw player 
                var x = object.position.x;
                var y = object.position.y;
                this.context.fillRect(x-5,y-5,10,10);
            }
        },this);*/
    },
    update: function(time) {
        
        
        /*
        //Key Events
        if(this.keys.spacebar === true){
            if(new Date().getTime()-this.weaponinfo.lastshoottime > this.weaponinfo.timepershoot){
                var bullet = Bullet.create({
                    x: this.player.position.x,
                    y: this.player.position.y                   
                },
                4,{
                    x: this.player.lastDirection.x * 1.5,
                    y: this.player.lastDirection.y * 1.5
                },
                this.player); 
                this.world.objects.push(bullet);
                this.weaponinfo.lastshoottime = new Date().getTime();
            }
        }*/
       
        /*
        this.world.objects.forEach(function(object){
            //Move moving objects
            if(Bullet.isPrototypeOf(object)){
                object.position.x += object.velocity.x;
                object.position.y += object.velocity.y;
            }
            
        //Remove objects that are to be removed
        });*/
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
        this.context.clearRect(0,0,this.context.canvas.width,this.context.canvas.height);
        this.update(time);
        this.render(time);
        
        
        //Recursively call this function again after some time
        var self = this;
        this.gameLoopTimeout = setTimeout(function () {
            self.gameLoop();
        },1000/this.framerate);
        
        
    }
});
window.onload = function()
{
    Game.create();
}