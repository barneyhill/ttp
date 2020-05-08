const Constants = require('../shared/constants');
const Wall = require('./wall');
class Maze {
  constructor(walls, cells) {
    this.walls = walls;
    this.cells = cells;
    this.N = 1;
    this.E = 2;
    this.S = 4;
    this.W = 8;
    this.dx = {'N': 0, 'E': 1, 'S': 0, 'W': -1};
  	this.dy = {'N': -1, 'E': 0, 'S': 1, 'W': 0};
  	this.dirs = {'N': this.N, 'E': this.E, 'S': this.S, 'W': this.W};
  	this.reverse = {'N': this.S, 'E': this.W, 'S': this.N, 'W': this.E};
  	this.positions = {'N': [-Constants.WALL_THICKNESS/2, -Constants.WALL_THICKNESS/2, Constants.WALL_THICKNESS, Constants.MAP_SIZE/Constants.MAZE_NCELLS + Constants.WALL_THICKNESS],
  					  'E': [Constants.MAP_SIZE/Constants.MAZE_NCELLS - Constants.WALL_THICKNESS/2, -Constants.WALL_THICKNESS/2, Constants.MAP_SIZE/Constants.MAZE_NCELLS + Constants.WALL_THICKNESS, Constants.WALL_THICKNESS],
  					  'S': [-Constants.WALL_THICKNESS/2, Constants.MAP_SIZE/Constants.MAZE_NCELLS - Constants.WALL_THICKNESS/2, Constants.WALL_THICKNESS, Constants.MAP_SIZE/Constants.MAZE_NCELLS + Constants.WALL_THICKNESS],
  					  'W': [-Constants.WALL_THICKNESS/2, -Constants.WALL_THICKNESS/2, Constants.MAP_SIZE/Constants.MAZE_NCELLS + Constants.WALL_THICKNESS, Constants.WALL_THICKNESS]}
  }

  shuffle(array) {
	  var currentIndex = array.length, temporaryValue, randomIndex;

	  // While there remain elements to shuffle...
	  while (0 !== currentIndex) {

	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;

	    // And swap it with the current element.
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	  }

	  return array;
	}

  carvePassagesFrom(cx, cy, grid){

  	var directions = this.shuffle(['N','E','S','W']);

  	directions.forEach(direction => {
  		var nx = cx + this.dx[direction];
  		var ny = cy + this.dy[direction];

  		if (nx >= 0 && nx <= this.cells - 1 &&
  			ny >= 0 && ny <= this.cells - 1 && 
  			grid[ny][nx] == 0){

  			grid[cy][cx] |= this.dirs[direction];
  			grid[ny][nx] |= this.reverse[direction];
  			this.carvePassagesFrom(nx,ny,grid);
  		}
  	});
  	return grid;
  }

  createWall(direction, x, y){
  	var parameters = this.positions[direction]
  	var wall = new Wall(parameters[0] + x * (Constants.MAP_SIZE/Constants.MAZE_NCELLS),
  						parameters[1] + y * (Constants.MAP_SIZE/Constants.MAZE_NCELLS),
  					    parameters[2],
  					    parameters[3]);
  	this.walls.push(wall);	
  }

  initMaze(){
  	this.walls = new Array();
  	var grid = new Array(this.cells).fill('.').map(() => new Array(this.cells).fill(0));
  	grid = this.carvePassagesFrom(0,0,grid);
  	console.log(grid);

  	for (var y = 0; y < grid.length; y++){
		for (var x = 0; x < grid.length; x++){
  			['N','E','S','W'].forEach(direction => {

				var nx = x + this.dx[direction];
				var ny = y + this.dy[direction];

				if (!(0 <= nx && 0 <= ny && nx < grid.length && ny < grid.length)){
					this.createWall(direction, x, y);
					return;
				} else if (((grid[y][x] & this.dirs[direction]) == 0) &&
						   ((grid[ny][nx] & this.reverse[direction]) == 0)){
					if (direction == 'N' || direction == 'W') 
						this.createWall(direction, x, y);
				}
  			});
  		}  		
  	}
  	console.log(this.walls);
  }

}

module.exports = Maze;
