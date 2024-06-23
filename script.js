const box = document.getElementById('box');
var stuff = [
  {
    title: "fishy",
    img: "img/fishy.png",
    enemy: false,
  },
  {
    title: "shark",
    img: "img/shark.png",
    enemy: true,
    xposition: 0,
    yposition: 0,
    isHit: false
  },
  {
    title: "starfish",
    img: "img/starfish.png",
    enemy: true,
    xposition: 0,
    yposition: 0,
    isHit: false
  },
];

let bulletArray = [];
let bulletSpeed = 5;
const player = document.getElementById('player');
let xPosition = 0;
let yPosition = 100;
let score = 0

let TIME = 0;
let TI = setInterval(() => {
  moveEnemies(TIME++);
}, 10);
document.addEventListener('keydown', aArrowKeys);
document.addEventListener('keyup', shoot);

function moveypos(enemyhtml, enemyinfo) {
  try {
    enemyhtml.style.bottom = enemyinfo.yposition + "px";
  } catch (error) {
  }
}
function movexpos(enemyhtml, enemyinfo) {
  try {
    enemyhtml.style.right = enemyinfo.xposition + "px";
  } catch (error) {
  }
}

function moveEnemies() {
  for (var i = 1; i < stuff.length; i++) {
    var enemyinfo = stuff[i];

    if (!enemyinfo.enemy) continue;
    if (enemyinfo.isHit) continue;

    enemyinfo.xposition = (enemyinfo.xposition + 2) % 1000;
    var enemyhtml = document.getElementById(enemyinfo.title);
    if (enemyinfo.xposition === 0) {
      enemyinfo.yposition = Math.round(Math.random() * 400);
      moveypos(enemyhtml, enemyinfo);
    }
    movexpos(enemyhtml, enemyinfo);

    const playerRect = player.getBoundingClientRect();
    const enemyRect = enemyhtml.getBoundingClientRect();

    if (
      playerRect.left < enemyRect.right &&
      playerRect.right > enemyRect.left &&
      playerRect.top < enemyRect.bottom &&
      playerRect.bottom > enemyRect.top
    ) {
      console.log('collided');
      gameOver();
      break;
    }
  }
  renderBullets();
  scoredisplay = document.getElementById("score");
  scoredisplay.innerHTML = "Score: " + score;
}

function shoot(e) {
  if (e.code == "Space") {
    const playerRect = player.getBoundingClientRect();

    let bullet = {
      x: playerRect.left + playerRect.width - 10,
      y: playerRect.top + 30,
      width: 20,
      height: 5,
      used: false
    };


    bulletArray.push(bullet);
    console.log("Bullet added:", bulletArray);
  }
}

function enemyhit(enemy) {
  console.log('Enemy hit:', enemy.title);
  enemy.isHit = true;
  score += 1;
  const enemyElement = document.getElementById(enemy.title);
  enemyElement.style.backgroundImage = 'url(img/explode.png)';

  setTimeout(() => {
    enemyElement.remove();

    const newenemyElement = document.createElement('div');
    newenemyElement.id = enemy.title;
    newenemyElement.classList.add('enemy');
    newenemyElement.style.position = 'absolute';
    newenemyElement.style.right = 0;
    //newenemyElement.style.bottom = enemy.yposition + 'px';
    newenemyElement.style.width = enemy.width + 'px';
    newenemyElement.style.height = enemy.height + 'px';
    newenemyElement.style.backgroundImage = `url(${enemy.img})`;
    newenemyElement.style.backgroundSize = 'contain';
    newenemyElement.style.backgroundRepeat = 'no-repeat';
    newenemyElement.style.left = 'auto'
    newenemyElement.xposition = 1000;
    newenemyElement.yposition = Math.round(Math.random() * 400);
    box.appendChild(newenemyElement);
    var enemyhtml = document.getElementById(enemy.title);
    moveypos(enemyhtml, newenemyElement);
    movexpos(enemyhtml, newenemyElement);
    enemy.xposition = 1000;
    enemy.isHit = false;
  }, 100);
}


function renderBullets() {
  document.querySelectorAll('.bullet').forEach(el => el.remove());
  bulletArray.forEach(bullet => {
    const bulletElement = document.createElement('div');
    bulletElement.classList.add('bullet');
    bulletElement.style.left = bullet.x + 'px';
    bulletElement.style.top = bullet.y + 'px';
    bulletElement.style.width = bullet.width + 'px';
    bulletElement.style.height = bullet.height + 'px';
    bulletElement.style.backgroundColor = 'red';
    box.appendChild(bulletElement);

    bullet.x += bulletSpeed;

    if (bullet.x > 1000) {
      bulletArray.splice(bulletArray.indexOf(bullet), 1);
      bulletElement.remove();
    }
    stuff.forEach(enemy => {
      if (enemy.enemy && !enemy.isHit) { // Ensure enemy is active and not already hit
        const enemyElement = document.getElementById(enemy.title);
        const enemyRect = enemyElement.getBoundingClientRect();

        if (
          bullet.x < enemyRect.right &&
          bullet.x + bullet.width > enemyRect.left &&
          bullet.y < enemyRect.bottom &&
          bullet.y + bullet.height > enemyRect.top
        ) {
          // Collision detected
          console.log('Enemy hit by bullet!');
          enemy.isHit = true;
          enemyhit(enemy);
          bullet.used = true;
          bulletArray.splice(bulletArray.indexOf(bullet), 1);
          bulletElement.remove();
        }
      }
    });
  });
}

function aArrowKeys(e) {
  const step = 10;

  if (e.key === 'w') {
    yPosition -= step;
  } else if (e.key === 's') {
    yPosition += step;
  } else if (e.key === 'a') {
    xPosition -= step;
  } else if (e.key === 'd') {
    xPosition += step;
  }

  player.style.left = xPosition + 'px';
  player.style.top = yPosition + 'px';
}

function gameOver() {
  for (var i = 0; i < stuff.length; i++) {
    var element = document.getElementById(stuff[i].title);
    if (element) {
      element.style.display = 'none';
    }
  }
  player.style.display = 'none';
  const gameoverElement = document.getElementById('gameover');
  gameoverElement.style.display = 'block';
  console.log('Game Over Image Displayed');
}


