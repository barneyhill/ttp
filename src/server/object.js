const Game = require('./game')

class Object {
  constructor(id, x, y, dir, speed) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.direction = dir;
    this.speed = speed;
    this.collide = 0;
  }

  update(dt, walls) {

    var nx = this.x + dt * this.speed * Math.sin(this.direction);
    var ny = this.y - dt * this.speed * Math.cos(this.direction);

    if (!(this.collision(nx,ny,walls))){
      this.collide = 0;
      this.x = nx;
      this.y = ny;
    } else {
      this.collide += 1;
    }
  }

  distanceTo(object) {
    const dx = this.x - object.x;
    const dy = this.y - object.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  collision(x,y, walls){
    var collide = false;
    walls.forEach(wall => {
      if (x > wall.x && x < wall.x + wall.width){
        if (y > wall.y && y < wall.y + wall.height){
          collide = true;
          return;
        }
      }
    });

    return collide;
  }

  setDirection(dir) {
    this.direction = dir;
  }

  serializeForUpdate() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
    };
  }
}

module.exports = Object;
