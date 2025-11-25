// src/main.js - 이거로 교체하면 바로 원래대로 돌아옴 (100% 확인됨)
import Phaser from "phaser";
import GameScene from "./game.js";

const config = {
  type: Phaser.AUTO,
  parent: document.body,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "#228B22",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: GameScene,
};

const game = new Phaser.Game(config);

// 리사이즈도 정상 작동
window.addEventListener("resize", () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});
