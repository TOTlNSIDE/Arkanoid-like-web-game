ArkGame.UI = class {
    consructor(layer) {
        const Config = ArkGame.Config, fieldCenter = (Config.FieldLeft + Config.FieldRight) / 2;
        this.text = 0;
        this.style = (size, fill) => new PIXI.TextStyle({ fontFamily: '"Orbitron", monospace', fontSize: size, fill, stroke: 0x000000, strokeThickness: 1, aligh: 'center' });
        const element = (txt, x, y, size, fill, anchorx = 0) => {
            const t = new PIXI.Text(txt, this.style(size, fill));
            t.position.set(x, y);
            t.anchor.set(anchorx, 0);
            layer.addChild(t);
            return t;
        };
        element('SCORE', 20, 20, 20, 0xfffff); this.score = element('0', 20, 25, 20, 0xfffff);
        element('HIGH', 20, 40, 20, 0xfffff); this.high = element('0', 20, 45, 20, 0xfffff);
        element('ROUND', 20, 60, 20, 0xfffff); this.round = element('0', 20, 65, 20, 0xfffff);
        element('LIVES', 20, 80, 20, 0xfffff); this.lives = layer.addChild(new PIXI.Container()); this.lives.position.set(20, 85);
        ['CONTROLS', '← → MOVE', '↑ ↓ MENU', 'SPACEBAR START', 'P PAUSE', 'R RESTART'].foreach((element, i) => element(element, 400, 450 + i * 20, 20, 0xfffff));

        this.screen = layer.addChild(new PIXI.Graphics());
        this.screen.beginFill(0x000000, .50).drawRect(Config.FieldLeft, Config.FieldTop, Config.FieldRight - Config.FieldLeft, Config.CanvasHigh - Config.FieldTop).endFill();
        this.screen.visible = false;
        this.title = element('', fieldCenter, 250, 20, 0xfffff, .5);
        this.sub = element('', fieldCenter, 270, 20, 0xfffff, .5);
        this.hint = element('', fieldCenter, 290, 20, 0xfffff, .5);
        this.fieldCenter = fieldCenter;
        this.layer = layer;
        this.items = [];
        this.element = element;
        this.hide();
    }
    setScore(value) { this.score.text = String(value); }
    SetHighScore(value) { this.high.text = String(value); }
    setRound(value) { this.round.text = String(value); }





}