import { sendKeys } from './networking';

var keyStates = {
    up: false,
    down: false,
    left: false,
    right: false,
    space: false
}

function handleInput(key) {
  if (key.code == "ArrowLeft") updateDirection(-Math.PI * 0.05);
  else if (key.code == 'ArrowRight') updateDirection(Math.PI * 0.05);
  if (key.code == 'ArrowUp') setAcceleration(1);
  else if (key.code == 'ArrowDown') setAcceleration(-1);
}

function updateKeyStates(code, value) {
    if(code == 68 || code == 39)  
        keyStates.right = value;
    else if(code == 83 || code == 40)
        keyStates.down = value;
    else if(code == 65 || code == 37) 
        keyStates.left = value;
    else if(code == 87 || code == 38)
        keyStates.up = value;
    else if (code == 32)
        keyStates.space = value;

    sendKeys(keyStates);
}

export function startCapturingInput() {
  window.addEventListener('keydown', function(event) {
    console.log(`Pressed: ${event.which}`); 
    updateKeyStates(event.which, true);
  });
  window.addEventListener('keyup', function(event) {
    console.log(`Released: ${event.which}`);
    updateKeyStates(event.which, false);
  });
}

export function stopCapturingInput() {
  window.removeEventListener('keydown', event);
  window.removeEventListener('keyup', event);
}
