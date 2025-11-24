// src/main.js - 이거 하나만 바꾸면 진짜 다 해결됨
import Phaser from "phaser";
import GameScene from "./game.js";

const config = {
  type: Phaser.AUTO,
  parent: document.body, // 이 줄이 진짜 핵심!!!
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "#228B22",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: GameScene,
};

new Phaser.Game(config);

// 창 크기 바뀔 때마다 자동 리사이즈
window.addEventListener("resize", () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});
