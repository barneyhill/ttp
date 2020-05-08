module.exports = Object.freeze({
  PLAYER_RADIUS: 30,
  PLAYER_MAX_HP: 100,
  PLAYER_SPEED: 400,
  PLAYER_FIRE_COOLDOWN: 5,

  BULLET_RADIUS: 10,
  BULLET_SPEED: 500,
  BULLET_DAMAGE: 25,
  BULLET_LIFESPAN: 4,

  SCORE_BULLET_HIT: 20,
  SCORE_PER_SECOND: 1,

  MAZE_NCELLS: 5,
  WALL_THICKNESS: 10,


  MAP_SIZE: 1000,
  MSG_TYPES: {
    JOIN_GAME: 'join_game',
    GAME_UPDATE: 'update',
    PIVOT: 'pivot',
    ACCELERATE: 'accelerate',
    KEYS: 'keys',
    GAME_OVER: 'dead',
  },
});
