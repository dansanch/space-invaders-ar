document.addEventListener("DOMContentLoaded", () => {
  const scene = document.querySelector("a-scene");
  const player = document.getElementById("player");
  const aliens = Array.from(document.getElementsByClassName("alien"));
  const scoreText = document.getElementById("score-text");

  let bullets = [];
  let score = 0;
  let alienDirection = 1;
  let alienSpeed = 0.005;
  let alienDownSpeed = 0.5;

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      const bullet = document.createElement("a-sphere");
      bullet.setAttribute("radius", 0.1);
      bullet.setAttribute("color", "red");

      const playerPosition = player.getAttribute("position");
      bullet.setAttribute(
        "position",
        `${playerPosition.x} ${playerPosition.y + 0.3} ${playerPosition.z - 0.4}`
      );

      scene.appendChild(bullet);
      bullets.push(bullet);
    }
  });

  function animateBullets() {
     bullets.forEach((bullet, index) => {
      let position = bullet.getAttribute("position");
      position.z -= 0.1;

      if (position.z < -20) {
        scene.removeChild(bullet);
        bullets.splice(index, 1);
      } else {
        bullet.setAttribute("position", position);
      }
    });
  }

  function moveAliens() {
    let moveDown = false;

    aliens.forEach((alien) => {
      let position = alien.getAttribute("position");
      position.x += alienDirection * alienSpeed;

      if (position.x >= 3 || position.x <= -3) {
        moveDown = true;
      }
    });

    if (moveDown) {
      alienDirection = -alienDirection;
      aliens.forEach((alien) => {
        let position = alien.getAttribute("position");
        position.y -= alienDownSpeed;
        alien.setAttribute("position", position);
      });
    }
  }

  function checkCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
      const bulletPosition = bullet.getAttribute("position");

      aliens.forEach((alien, alienIndex) => {
        const alienPosition = alien.getAttribute("position");
        const distance = Math.sqrt(
          Math.pow(alienPosition.x - bulletPosition.x, 2) +
            Math.pow(alienPosition.y - bulletPosition.y, 2) +
            Math.pow(alienPosition.z - bulletPosition.z, 2)
        );

        if (distance < 0.5) {
          scene.removeChild(bullet);
          scene.removeChild(alien);
          bullets.splice(bulletIndex, 1);
          aliens.splice(alienIndex, 1);
          score += 10;
          scoreText.setAttribute("value", `Score: ${score}`);
        }
      });
    });
  }

  function gameLoop() {
    animateBullets();
    moveAliens();
    checkCollisions();

    requestAnimationFrame(gameLoop);
  }

  gameLoop();
});