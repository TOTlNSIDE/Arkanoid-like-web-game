ArkGame.UI = class {
    constructor(layer) {
        const Config = ArkGame.Config, fieldCenter = (Config.FieldLeft + Config.FieldRight) / 2;
        this.time = 0;
        this.style = (size, fill) => new PIXI.TextStyle({ fontFamily: '"Press Start 2P", monospace', fontSize: size, fill, stroke: 0x000000, strokeThickness: 3, align: 'center' });
        const element = (txt, x, y, size, fill, anchorx = 0) => {
            const t = new PIXI.Text(txt, this.style(size, fill));
            t.position.set(x, y);
            t.anchor.set(anchorx, 0);
            layer.addChild(t);
            return t;
        };
        element('SCORE', 16, 30, 12, 0xff5a4d); this.score = element('0', 16, 52, 14, 0xffffff);
        element('HIGH', 16, 100, 12, 0xff5a4d); this.high = element('0', 16, 122, 14, 0xffffff);
        element('ROUND', 16, 170, 12, 0xff5a4d); this.round = element('1', 16, 192, 14, 0xffffff);
        element('LIVES', 16, 240, 12, 0xff5a4d); this.lives = layer.addChild(new PIXI.Container()); this.lives.position.set(16, 266);
        ['CONTROLS', '◀ ▶ MOVE', '↑ ↓ MENU', 'SPACEBAR START', 'P PAUSE', 'R RESTART', 'ESC SKIP TUT'].forEach((label, i) => element(label, Config.FieldRight + 22, 400 + i * 22, 9, i ? 0xaab4d8 : 0xff5a4d));

        this.dim = layer.addChild(new PIXI.Graphics());
        this.dim.beginFill(0x000000, .55).drawRect(Config.FieldLeft, Config.FieldTop, Config.FieldRight - Config.FieldLeft, Config.CanvasHeight - Config.FieldTop).endFill();
        this.dim.visible = false;
        this.title = element('', fieldCenter, 270, 22, 0xffe14d, .5);
        this.subtext = element('', fieldCenter, 330, 11, 0xffffff, .5);
        this.hint = element('', fieldCenter, 470, 10, 0x7fe3ff, .5);
        this.fieldCenter = fieldCenter;
        this.layer = layer;
        this.items = [];
        this.element = element;
        this.hide();
    }
    setScore(value) { this.score.text = String(value); }
    setHighScore(value) { this.high.text = String(value); }
    setRound(value) { this.round.text = String(value); }
    setLives(value) {
        this.lives.removeChildren().forEach(child => child.destroy());
        for (let i = 0; i < value; i++) {
            const platform = new PIXI.Sprite(ArkGame.Assets.Texture.platform);
            platform.scale.set(.5); platform.x = i * 42;
            this.lives.addChild(platform);
        }
    }
    setHint(text) { if (this.hint.text !== text) this.hint.text = text; }

    show(title, subtext = '', options = {}) {
        this.title.text = title;
        this.title.style.fontSize = options.size || 22;
        this.subtext.text = subtext;
        this.title.visible = this.subtext.visible = true;
        this.dim.visible = options.dim !== false;
    }
    hide() { this.title.visible = this.subtext.visible = this.dim.visible = false; }

    showMenu(labels, index) {
        labels.forEach((label, i) => {
            if (!this.items[i]) this.items[i] = this.element('', this.fieldCenter, 340 + i * 40, 14, 0xffffff, .5);
            const item = this.items[i];
            item.text = (i === index ? '> ' : '  ') + label + (i === index ? ' <' : '  ');
            item.style.fill = i === index ? 0xffe14d : 0x9aa6cc;
            item.visible = true;
        });
    }
    hideMenu() { this.items.forEach(item => (item.visible = false)); }

    update(dt) {
        this.time += dt;
        this.subtext.alpha = .65 + .35 * Math.sin(this.time * 6);
        this.title.scale.set(1 + .02 * Math.sin(this.time * 3));
    }
};