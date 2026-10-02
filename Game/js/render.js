ArkGame.Render = class {
    constructor(host) {
        const Config = ArkGame.Config;
        this.app = new PIXI.Application({
            width: Config.CanvasWidth, height: Config.CanvasHeight, backgroundColor: 0x000000,
            antialias: true, resolution: window.devicePixelRatio || 1, autoDensity: true
        });
        host.appendChild(this.app.view);
        ArkGame.Assets.init(this.app.render);

        const layer = parent => parent.addChild(new PIXI.Container());
        this.stage = layer(this.app.stage);
        this.background = layer(this.stage);
        this.bricks = layer(this.stage);
        this.actors = layer(this.stage);
        this.fx = layer(this.stage);
        this.frame = this.stage.addChild(new PIXI.Graphics());
        this.ui = layer(this.app.stage);
        this.field = this.background.addChild(new PIXI.Graphics());
        this.stars = [];
        for (let i = 0; i < 30; i++)
        {
            const star = new PIXI.Sprite(ArkGame.Assets.Texture)
            star.position.set(Config.FieldLeft + Math.random() * (Config.FieldRight - Config.FieldLeft), Config.FieldTop + Math.random() * (Config.CanvasHeight - Config.FieldTop));
            star.alpha = .2 + Math.random() * .2;
            star.speed = 10 + Math.random() * 20;
            this.background.addChild(star);
            this.stars.push(star);
        }
        this.drawFrame();
        this.setTheme(0x000435);
    }

    setTheme(color) {
        const Config = ArkGame.Config, Graphic = this.field;
        Graphic.clear().beginFill(color).drawRect(Config.FieldLeft, Config.FieldTop, Config.FieldRight - Config.FieldLeft, Config.CanvasHeight - Config.FieldTop).endFill();
        Graphic.lineStyle(1, 0xffffff, .05);
        for (let x = Config.FieldLeft; x < Config.FieldRight; x += Config.BrickWidth) { Graphic.moveTo(x, Config.FieldTop); Graphic.lineTo(x, Config.CanvasHeight); }
        for (let y = Config.FieldTop; y < Config.CanvasHeight; y += Config.BrickHeight) { Graphic.moveTo(Config.FieldLeft, y); Graphic.lineTo(Config.FieldRight, y); }
    }

    drawFrame() {
        const Config = ArkGame.Config, frame = this.frame;
        const wall = (x, y, w, h) => {
            frame.beginFill(0x000000).drawRect(x, y, w, h).endFill();
            frame.beginFill(0x000000).drawRect(x + 2, y + 2, w - 4, h - 4).endFill();
            frame.beginFill(0x000000, .5).drawRect(x + 2, y + 2, w - 4, 2).endFill();
        };
        wall(Config.FieldLeft - 20, Config.FieldTop - 20, 20, Config.FieldTop);
        wall(Config.FieldRight, Config.FieldTop - 20, 20, Config.CanvasHeight);
        wall(Config.FieldLeft - 20, Config.FieldTop - 20, Config.FieldRight + 20, 12);
    }

    update(dt) {
        const Config = ArkGame.Config;
        for (const star of this.stars) { star.y += star.speed * dt; if (star.y > Config.CanvasHeight) star.y = Config.FieldTop; }
    }
};