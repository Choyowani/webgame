// src/game.js - 진짜 진짜 최종 완성판 (2025.11.24 기준)
import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.strength = 0;
    this.gold = 0;
    this.scarecrows = 1;
    this.minions = 0;
    this.wizards = 0;

    // 구매 시 배경에 쌓일 아이콘들 저장
    this.minionIcons = [];
    this.wizardIcons = [];

    this.quests = [
      { req: 50, time: 10, reward: 15, unlocked: false, timer: 0 },
      { req: 100, time: 15, reward: 40, unlocked: false, timer: 0 },
      { req: 200, time: 20, reward: 100, unlocked: false, timer: 0 },
      { req: 300, time: 30, reward: 200, unlocked: false, timer: 0 },
      { req: 500, time: 45, reward: 350, unlocked: false, timer: 0 },
      { req: 1000, time: 60, reward: 500, unlocked: false, timer: 0 },
      { req: 2000, time: 90, reward: 800, unlocked: false, timer: 0 },
      { req: 5000, time: 120, reward: 1500, unlocked: false, timer: 0 },
      { req: 10000, time: 180, reward: 3000, unlocked: false, timer: 0 },
      { req: 25000, time: 240, reward: 5000, unlocked: false, timer: 0 },
      { req: 50000, time: 300, reward: 10000, unlocked: false, timer: 0 },
      { req: 100000, time: 360, reward: 20000, unlocked: false, timer: 0 },
    ];
  }

  preload() {
    this.load.image("scarecrow", "assets/scarecrow.png");
    this.load.image("minion", "assets/minion.png");
    this.load.image("wizard", "assets/wizard.png");

    // 이미지 없을 때 대비
    this.textures.on("onerror", (key) => {
      const g = this.make.graphics({ add: false });
      if (key === "scarecrow") g.fillStyle(0x8b4513).fillCircle(64, 64, 64);
      if (key === "minion") g.fillStyle(0x4444ff).fillRect(0, 0, 100, 100);
      if (key === "wizard")
        g.fillStyle(0x9400d3).fillTriangle(0, 100, 50, 0, 100, 100);
      g.generateTexture(key, 128, 128);
    });
  }

  create() {
    this.add
      .rectangle(0, 0, 1920, 1080, 0x228b22)
      .setOrigin(0, 0)
      .setDepth(-10);

    // 메인 허수아비
    this.bigScarecrow = this.add
      .image(300, 540, "scarecrow")
      .setScale(0.9)
      .setInteractive({ useHandCursor: true })
      .setDepth(-5);

    // 전체 화면 클릭
    this.input.on("pointerdown", (pointer) => {
      this.strength += this.scarecrows;
      this.updateDisplay();

      const plus = this.add
        .text(pointer.x, pointer.y - 50, `+${this.scarecrows}`, {
          fontSize: "52px",
          color: "#FFD700",
          fontStyle: "bold",
          stroke: "#000",
          strokeThickness: 8,
        })
        .setOrigin(0.5)
        .setDepth(20);

      this.tweens.add({
        targets: plus,
        y: pointer.y - 180,
        alpha: 0,
        duration: 1200,
        ease: "Power2",
        onComplete: () => plus.destroy(),
      });

      this.tweens.add({
        targets: this.bigScarecrow,
        scale: 0.85,
        rotation: 0.15,
        duration: 100,
        yoyo: true,
      });
    });

    // UI 텍스트
    this.strengthText = this.add
      .text(960, 100, "", { fontSize: "56px", color: "#fff" })
      .setOrigin(0.5);
    this.goldText = this.add
      .text(960, 180, "", { fontSize: "48px", color: "#FFD700" })
      .setOrigin(0.5);
    this.spsText = this.add
      .text(960, 250, "", { fontSize: "36px", color: "#fff" })
      .setOrigin(0.5);

    // 상점 버튼
    this.createShopButton(1500, 600, "허수아비 +1 클릭\n비용 100G", () =>
      this.buyScarecrow()
    );
    this.createShopButton(1500, 750, "부하 고용\n비용 200G", () =>
      this.buyMinion()
    );
    this.createShopButton(1500, 900, "마법사 고용\n비용 1000G", () =>
      this.buyWizard()
    );

    // 퀘스트 목록
    this.questTexts = [];
    for (let i = 0; i < this.quests.length; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 100 + col * 400;
      const y = 600 + row * 50;
      const txt = this.add
        .text(x, y, "", { fontSize: "22px", color: "#fff" })
        .setOrigin(0, 0.5);
      this.questTexts.push(txt);
    }

    this.add
      .text(960, 50, "허수아비 때리면 강해지나요", {
        fontSize: "44px",
        color: "#fff",
      })
      .setOrigin(0.5);

    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: this.perSecond,
      callbackScope: this,
    });
    this.loadGame();
    this.updateDisplay();
  }

  createShopButton(x, y, label, callback) {
    const btn = this.add.container(x, y);
    const bg = this.add
      .rectangle(0, 0, 340, 130, 0x000000, 0.8)
      .setStrokeStyle(5, 0xffd700)
      .setInteractive();
    const text = this.add
      .text(0, 0, label, {
        fontSize: "28px",
        color: "#FFD700",
        align: "center",
      })
      .setOrigin(0.5);

    btn.add([bg, text]);

    bg.on("pointerdown", callback);
    bg.on("pointerover", () => btn.setScale(1.08));
    bg.on("pointerout", () => btn.setScale(1));

    return btn;
  }

  perSecond() {
    const multiplier = 1 + this.wizards * 0.3;
    const auto = this.minions * multiplier * this.scarecrows;
    this.strength += auto;

    for (let q of this.quests) {
      if (q.unlocked) {
        q.timer++;
        if (q.timer >= q.time) {
          this.gold += q.reward;
          q.timer = 0;
          this.floatText(`+${q.reward}G`, 960, 400);
        }
      }
    }

    this.checkQuestUnlock();
    this.updateDisplay();
    this.saveGame();
  }

  checkQuestUnlock() {
    for (let q of this.quests) {
      if (!q.unlocked && this.strength >= q.req) {
        q.unlocked = true;
        q.timer = 0;
        this.floatText("퀘스트 언락!", 960, 450, "#00ff00");
      }
    }
  }

  buyScarecrow() {
    if (this.gold >= 100) {
      this.gold -= 100;
      this.scarecrows++;
      if (this.scarecrows > 1) {
        this.add
          .image(
            Phaser.Math.Between(100, 500),
            Phaser.Math.Between(600, 900),
            "scarecrow"
          )
          .setScale(0.25)
          .setAlpha(0.7)
          .setDepth(-6);
      }
      this.updateDisplay();
    }
  }

  buyMinion() {
    if (this.gold >= 200) {
      this.gold -= 200;
      this.minions++;
      const icon = this.add
        .image(
          Phaser.Math.Between(100, 800),
          Phaser.Math.Between(300, 800),
          "minion"
        )
        .setScale(0.03)
        .setAlpha(0.85)
        .setDepth(-6);
      this.minionIcons.push(icon);
      this.updateDisplay();
    }
  }

  buyWizard() {
    if (this.gold >= 1000) {
      this.gold -= 1000;
      this.wizards++;
      const icon = this.add
        .image(
          Phaser.Math.Between(1100, 1700),
          Phaser.Math.Between(200, 600),
          "wizard"
        )
        .setScale(0.1)
        .setAlpha(0.9)
        .setDepth(-6)
        .setTint(0xddddff);
      this.wizardIcons.push(icon);
      this.updateDisplay();
    }
  }

  floatText(text, x, y, color = "#FFD700") {
    const t = this.add
      .text(x, y, text, {
        fontSize: "42px",
        color,
        fontStyle: "bold",
        stroke: "#000",
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setDepth(20);
    this.tweens.add({
      targets: t,
      y: y - 120,
      alpha: 0,
      duration: 1600,
      onComplete: () => t.destroy(),
    });
  }

  updateDisplay() {
    const sps = (
      this.minions *
      (1 + this.wizards * 0.3) *
      this.scarecrows
    ).toFixed(1);
    this.strengthText.setText(
      `내공: ${Math.floor(this.strength).toLocaleString()}`
    );
    this.goldText.setText(`골드: ${Math.floor(this.gold).toLocaleString()}`);
    this.spsText.setText(
      `초당 상승 내공: ${sps} | 허수아비 ${this.scarecrows} 부하 ${this.minions} 마법사 ${this.wizards}`
    );

    this.questTexts.forEach((txt, i) => {
      const q = this.quests[i];
      if (q.unlocked) {
        txt
          .setText(`퀘${i + 1} ${q.time}s/${q.reward}G [${q.timer}/${q.time}]`)
          .setColor("#00ff44");
      } else {
        txt
          .setText(`퀘${i + 1} ${q.req.toLocaleString()} 필요`)
          .setColor(this.strength >= q.req ? "#ffaa00" : "#888");
      }
    });
  }

  saveGame() {
    const data = {
      strength: this.strength,
      gold: this.gold,
      scarecrows: this.scarecrows,
      minions: this.minions,
      wizards: this.wizards,
      quests: this.quests,
    };
    localStorage.setItem("scarecrowSave", JSON.stringify(data));
  }

  loadGame() {
    const saved = localStorage.getItem("scarecrowSave");
    if (saved) Object.assign(this, JSON.parse(saved));
  }
}
