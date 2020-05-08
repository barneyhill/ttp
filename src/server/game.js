const Constants = require('../shared/constants');
const Player = require('./player');
const applyCollisions = require('./collisions');
const Maze = require('./maze')
class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.bullets = [];
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    this.maze = this.initMap();
    setInterval(this.update.bind(this), 1000 / 60);
  }

  initMap(){
    var maze = new Maze(0, 5);
    maze.initMaze();
    return maze.walls;
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;

    // Generate a position to start this player at.
    const x = (Constants.MAP_SIZE/Constants.MAZE_NCELLS) / 2 + Math.floor(Math.random() * (Constants.MAZE_NCELLS)) * (Constants.MAP_SIZE/Constants.MAZE_NCELLS);
    const y = (Constants.MAP_SIZE/Constants.MAZE_NCELLS) / 2 + Math.floor(Math.random() * (Constants.MAZE_NCELLS)) * (Constants.MAP_SIZE/Constants.MAZE_NCELLS);
    console.log(x,y);

    this.players[socket.id] = new Player(socket.id, username, x, y);
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  updateInput(socket, keys) {
    if (this.players[socket.id]) {
      this.players[socket.id].updateInput(keys);
    }
  }

  update() {

    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    // Update each bullet
    const bulletsToRemove = [];
    this.bullets.forEach(bullet => {
      if (bullet.update(dt, this.maze)) {
        // Destroy this bullet
        bulletsToRemove.push(bullet);
      }
    });
    this.bullets = this.bullets.filter(bullet => !bulletsToRemove.includes(bullet));

    // Update each player
    Object.keys(this.sockets).forEach(playerID => {
      const player = this.players[playerID];
      const newBullet = player.update(dt, this.maze);
      if (newBullet) {
        this.bullets.push(newBullet);
      }
    });

    // Apply collisions, give players score for hitting bullets
    const destroyedBullets = applyCollisions(Object.values(this.players), this.bullets);
    destroyedBullets.forEach(b => {
      if (this.players[b.parentID]) {
        this.players[b.parentID].onDealtDamage();
      }
    });
    this.bullets = this.bullets.filter(bullet => !destroyedBullets.includes(bullet));

    // Check if any players are dead
    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      const player = this.players[playerID];
      if (player.hp <= 0) {
        socket.emit(Constants.MSG_TYPES.GAME_OVER);
        this.removePlayer(socket);
      }
    });

    // Send a game update to each player every other time
    if (this.shouldSendUpdate) {
      const leaderboard = this.getLeaderboard();
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player, leaderboard));
      });
      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }
  }

  getLeaderboard() {
    return Object.values(this.players)
      .sort((p1, p2) => p2.score - p1.score)
      .slice(0, 5)
      .map(p => ({ username: p.username, score: Math.round(p.score) }));
  }

  createUpdate(player, leaderboard) {
    const nearbyPlayers = Object.values(this.players).filter(
      p => p !== player && p.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );
    const nearbyBullets = this.bullets.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );

    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      others: Object.values(this.players).map(p => p.serializeForUpdate()),
      bullets: Object.values(this.bullets).map(b => b.serializeForUpdate()),
      leaderboard,
      maze: this.maze,
    };
  }
}

module.exports = Game;
