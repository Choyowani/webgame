// src/main.js - 이거로 교체하면 GitHub Pages 100% 성공!!!
import Phaser from "phaser";
import GameScene from "./game.js";

const config = {
  type: Phaser.AUTO,
  width: 1080,
  height: 720,
  backgroundColor: "#228B22",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: GameScene,
};

// 여기서 game 변수를 전역으로 선언 (이게 핵심!!!)
window.game = new Phaser.Game(config);

// 리사이즈도 정상 작동하게
window.addEventListener("resize", () => {
  window.game.scale.resize(window.innerWidth, window.innerHeight);
});
