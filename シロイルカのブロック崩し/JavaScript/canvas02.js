"use strick";
// 壁に当たるたびにボールの色が変わります
let c = document.querySelector("canvas");
let ctx = c.getContext("2d");
let colors = [
  //複数の色を配列で用意
  "#c85179",
  "#a0d8ef",
  "#f39800",
  "#fabf14",
  "#005c42",
  "#f3a68c",
  "#00947a",
];
// ボール関連の変数
let dx = 2; //横方向の速度
let dy = 2; //縦方向の速度
let x = 50; //ボールの初期位置X
let y = c.height / 2; //ボールの初期位置Y
let r = 15; //ボールの半径
// パドル関連の変数
let pw = 75; //パドルの幅
let ph = 10; //パドルの高さ
let px = (c.width - pw) / 2; //パドルの位置Ｘ座標
let py = c.height - 20; //パドルの位置Y座標
// ブロック関連の変数
let blockPadding = 10; //ブロック同士の間隔
// forでループさせる回数⇒ブロック数
let blockRow = 2; //縦のブロック数
let blockColumn = 3; //横のブロック数
let blockHeight = 20; //ブロックの高さ
let blockOffsetTop = 10; //ブロック上端の基準点（左上のブロック）
let blockOffsetLeft = 15; //ブロック左端の基準点
let blockWidth = c.width / blockColumn - blockOffsetLeft; //ブロックの幅/均等割で計算
let blocks = []; //ブロックデータを保存する配列
let score = 0;
let clearKey = false;
function drawScore() {
  ctx.beginPath();
  ctx.font = "1.2rem Arial";
  ctx.fillStyle = "white";
  ctx.fillText(`Score:${score}`, 18, c.height - 5);
  ctx.fill();
  ctx.closePath();
}

// ２重ループで空の配列と座標とスイッチ、オブジェクトをブロック数分セットする
for (let i = 0; i < blockRow; i++) {
  blocks[i] = [];
  for (let j = 0; j < blockColumn; j++) {
    blocks[i][j] = { x: 0, y: 0, status: 1 };
  }
}
// console.log(blocks);
// ブロックを描画する関数
function drawBlocks() {
  for (let i = 0; i < blockRow; i++) {
    for (let j = 0; j < blockColumn; j++) {
      // statusが１なら処理を行う
      if (blocks[i][j].status == 1) {
        // ブロックのX座標を取得、幅で計測
        let blockX = j * (blockWidth + blockPadding) + blockOffsetLeft;
        // ブロックのY座標を取得、高さで計測
        let blockY = i * (blockHeight + blockPadding) + blockOffsetTop;
        // 取得した座標を配列のオブジェクトX,Yに代入する
        blocks[i][j].x = blockX;
        blocks[i][j].y = blockY;
        // 座標を元にブロックを描画
        ctx.beginPath();
        ctx.rect(blockX, blockY, blockWidth, blockHeight);
        ctx.fillStyle = "skyblue";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}
// ブロックとボールの衝突を検知する関数
// collisionDetectionは訳すと「衝突検知」
function collisionDetection() {
  for (let i = 0; i < blockRow; i++) {
    for (let j = 0; j < blockColumn; j++) {
      let b = blocks[i][j];
      // statusが1のブロックのみ衝突検知を行う
      if (b.status == 1) {
        if (
          // b.x < x < b.x + blockWidth
          x > b.x &&
          x < b.x + blockWidth &&
          // 縦軸はボール半径分の半分を微調整
          // ブロックの上端とボールの下端の衝突検知
          y + r > b.y &&
          // ブロックの下端とボールの衝突検知
          y < b.y + blockHeight
        ) {
          dy *= -1;
          b.status = 0;
          score++;
          if (score == blockColumn * blockRow) {
            // ここで関数を実行させるとブロックが破壊されないので動作をずらすキーを設定
            clearKey = true;
          }
        }
      }
    }
  }
}
//パドルの描画関数
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(px, py, pw, ph);
  ctx.fillStyle = "fuchsia";
  ctx.fill();
  ctx.closePath();
}
// ゲームオーバーの描画用関数
function drawGameOver() {
  ctx.beginPath();
  ctx.fillStyle = "pink";
  ctx.font = "bold 2rem Arial"; //太さ・大きさ・フォントどれかが欠けると正しく表示されないので、全て入力する事
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillText("GAME-OVER", c.width / 2, c.height / 2 + 20);
  ctx.fill();
  ctx.closePath();
}
// ゲームクリアーの描画
function gameClear() {
  ctx.beginPath();
  ctx.fillStyle = "gold";
  ctx.font = "bold 2rem Arial"; //太さ・大きさ・フォントどれかが欠けると正しく表示されないので、全て入力する事
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillText("GAME-CLEAR", c.width / 2, c.height / 2 + 20);
  ctx.fill();
  ctx.closePath();
  // document.location.reload();
  clearInterval(interval);
}
// ボールの描画
function drawBall() {
  if (clearKey) {
    gameClear();
  }
  ctx.beginPath();
  ctx.fillStyle = "greenyellow";
  ctx.arc(
    x + dx, //ボールのＸ座標
    y + dy, //ボールのＹ座標
    r, //円の半径
    0, //円の開始角（単位ラジアン
    (180 * Math.PI) / 180 //角度を180にして半円に
  );
  ctx.fill();
  ctx.closePath();
}
// 纏めの描画と当たり判定の処理
function draw() {
  x += dx;
  y += dy;
  // 呼び出される度に変化させるので関数内で
  // let random = Math.floor(Math.random() * colors.length);
  ctx.clearRect(0, 0, c.width, c.height);
  drawScore();
  drawBlocks();
  drawBall();
  drawPaddle();
  collisionDetection();

  // ボールが上の壁に当たった時の判定
  if (y < 0) {
    // ctx.fillStyle = colors[random];
    dy *= -1.005;
    // ボールが左右の壁に当たった時の判定
  } else if (x > c.width - r || x < r) {
    // ctx.fillStyle = colors[random];
    dx *= -1.005;
    // パドルとボールの当たり判定
    // 課題：ボールの角度が浅いとパドルに詰まるバグあり
  } else if (
    // ボールのY座標（中心）＜パドルのY座標+パドルの高さ（パドルの下端）
    y < py + ph &&
    // ボールの下端＞パドルのY座標（パドルの上）
    y + r > py &&
    // ボールのX座標＞パドルの左端
    x > px &&
    // ボールのX座標 < パドルの右端
    x < px + pw
  ) {
    dy *= -1;
  } else if (y > c.height) {
    drawGameOver();

    // document.location.reload();
    clearInterval(interval);
  }
  // パドルの移動判定右
  if (rightPress && px < c.width - pw) {
    px += 7;
    // パドルの移動判定左
  } else if (leftPress && px > 0) {
    px -= 7;
  }

  // requestAnimationFrame(draw);
} //ここまでdrawメソッド

// キー操作のON/OFF設定、デフォルトではオフfalseにする
let rightPress = false;
let leftPress = false;
// キーを押した時ONにする
document.addEventListener("keydown", keyDownHandler, false);
function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPress = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPress = true;
  }
}
// キーを離した時、OFFにする
document.addEventListener("keyup", keyUpHandler, false);
function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPress = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPress = false;
  }
}
//パドル操作用タッチボタンの設定
let leftBtn = document.querySelector(".btn-base--left");
leftBtn.addEventListener("touchstart", () => {
  leftPress = true;
});
leftBtn.addEventListener("mousedown", () => {
  leftPress = true;
});
leftBtn.addEventListener("touchend", () => {
  leftPress = false;
});
leftBtn.addEventListener("mouseup", () => {
  leftPress = false;
});
let rightBtn = document.querySelector(".btn-base--right");
rightBtn.addEventListener("touchstart", () => {
  rightPress = true;
});
rightBtn.addEventListener("mousedown", () => {
  rightPress = true;
});
rightBtn.addEventListener("touchend", () => {
  rightPress = false;
});
rightBtn.addEventListener("mouseup", () => {
  rightPress = false;
});

let interval = setInterval(draw, 20);
