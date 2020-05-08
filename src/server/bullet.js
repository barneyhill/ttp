const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Bullet extends ObjectClass {
  constructor(parentID, x, y, dir) {
    super(shortid(), x, y, dir, Constants.BULLET_SPEED);
    this.parentID = parentID;
    this.lifespan = Constants.BULLET_LIFESPAN;
  }

  // Returns true if the bullet should be destroyed
  update(dt, walls) {
    super.update(dt, walls);
    this.lifespan -= dt;

    if (this.collide == 1){
    	this.direction = (this.direction % (2 * Math.PI)) + Math.PI/2;
    } else if (this.collide == 2){
    	this.direction = (this.direction % (2 * Math.PI)) - Math.PI;
    }

    if (this.lifespan < 0){
    	return true;
    } else {
    	return false;
    }
  }
}

module.exports = Bullet;
