/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


var Bullet = Circle.extend({
    _construct: function(pos,radius,velocity,shotBy){
        this._super(Bullet,[pos,radius]);
        this.velocity = velocity;
        this.shotBy = shotBy;
    }
});


