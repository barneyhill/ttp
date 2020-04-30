module.exports = Object.freeze({
  PLAYER_RADIUS: 20,
  PLAYER_MAX_HP: 100,
  PLAYER_SPEED: 400,
  PLAYER_FIRE_COOLDOWN: 1,

  BULLET_RADIUS: 6,
  BULLET_SPEED: 500,
  BULLET_DAMAGE: 25,

  SCORE_BULLET_HIT: 20,
  SCORE_PER_SECOND: 1,

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
