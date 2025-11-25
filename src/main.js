// src/main.js - GitHub Pages 100% 성공 보장 버전
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

// 전역 game 변수 없이 리사이즈 제거 (이게 핵심!!!)
const game = new Phaser.Game(config);

// 리사이즈는 Phaser가 알아서 하게 맡김 (이 줄 삭제)
