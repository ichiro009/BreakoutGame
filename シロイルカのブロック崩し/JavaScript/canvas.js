"use strick";
// 壁に当たるたびにボールの色が変わります
let c = document.querySelector("canvas");
let ctx = c.getContext("2d");
let colors = ["#c85179","#a0d8ef","#f39800","#fabf14","#005c42","#f3a68c","#00947a"];
ctx.fillStyle = "skyblue";
let dx = 2;//横方向の速度
let dy = 2;//縦方向の速度
let x = 30;//ボールの初期位置X
let y = 30;//ボールの初期位置Y
let r = 20;//ボールの半径
function draw() {
  x += dx;
  y += dy;
  // 呼びがされる度に変化させるので関数内で
  let random = Math.floor(Math.random()* colors.length);
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.beginPath();
  ctx.arc(x + dx, y + dy, r, 0, 180 * (Math.PI) / 180);
  if (y > c.height - r || y < 0) {
    ctx.fillStyle = colors[random];
    dy *= -1.08;
  } else if (x > c.width - r || x < r) {
    ctx.fillStyle = colors[random];
    dx *= -1.08;
  }
  ctx.fill();
  // requestAnimationFrame(draw);
}
draw();
