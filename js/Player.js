/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


var Player = BaseObject.extend({
    lastDirection: {
        x: 0,
        y: -1
    },
    _construct: function(name,pos,speed,id){
        if(typeof name === "object")
        {
            var object = name;
            name = object.name;
            pos = object.position;
            speed = object.speed;
            id = object.id;
            this.color = object.color;
        }

        this.name = name;
        this.position = pos;
        this.speed = speed || 5;
        this.id = id;
        
    }
    
    
    
});


