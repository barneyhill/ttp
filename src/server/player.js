const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');

class Player extends ObjectClass {
  constructor(id, username, x, y) {
    super(id, x, y, Math.random() * 2 * Math.PI, 0);
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.fireCooldown = 0;
    this.score = 0;
    this.keys = {
                  up: false,
                  down: false,
                  left: false,
                  right: false,
                  space: false
    }
    this.fire = false;
  }

  // Returns a newly created bullet, or null.
  update(dt) {
    super.update(dt);

    if (this.speed > 0)
      this.speed -= Constants.PLAYER_SPEED / 5;
    else if (this.speed < 0)
      this.speed += Constants.PLAYER_SPEED / 5;

    if (this.keys.up)
      this.speed = Constants.PLAYER_SPEED;
    else if (this.keys.down)
      this.speed = -Constants.PLAYER_SPEED;

    if (this.keys.left)
      this.direction -= 0.05;
    if (this.keys.right)
      this.direction += 0.05;
    // Update score
    this.score += dt * Constants.SCORE_PER_SECOND;

    // Make sure the player stays in bounds
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));

    // Fire a bullet, if needed
    this.fireCooldown -= dt;
    if (this.fireCooldown <= 0 && this.fire) {
      this.fireCooldown += Constants.PLAYER_FIRE_COOLDOWN;
      this.fire = false;
      return new Bullet(this.id, this.x, this.y, this.direction);
    }

    return null;
  }

  takeBulletDamage() {
    this.hp -= Constants.BULLET_DAMAGE;
  }

  onDealtDamage() {
    this.score += Constants.SCORE_BULLET_HIT;
  }

  updateInput(keys) {
    this.keys = keys;
    if (this.keys.space)
      this.fire = true;
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      direction: this.direction,
      hp: this.hp,
      username: this.username,
    };
  }
}

module.exports = Player;
