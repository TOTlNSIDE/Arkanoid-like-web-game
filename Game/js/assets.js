(function () {
    const Config = ArkGame.Config;

    ArkGame.Assets = {
        Texture: {},
        init(renderer) {
            const create = (name, draw) => {
                const Graphic = new PIXI.Graphics();
                draw(Graphic);
                this.Texture[name] = renderer.generateTexture(Graphic, { resolution: 2 });
                Graphic.destroy();
            };
            for (const color in Config.BrickColors) {
                create('brick' + color, Graphic => {
                    Graphic.beginFill(0x000000, .5).drawRect(0, 0, Config.BrickWidth, Config.BrickHeight).endFill();
                    Graphic.beginFill(Config.BrickColors[color]).drawRect(1, 1, Config.BrickWidth - 2, Config.BrickHeight - 2).endFill();
                    Graphic.beginFill(0xffffff, .4).drawRect(1, 1, Config.BrickWidth - 2, 3).drawRect(1, 1, 3, Config.BrickHeight - 2).endFill();
                    Graphic.beginFill(0x000000, .3).drawRect(1, Config.BrickHeight - 4, Config.BrickWidth - 2, 3).endFill();
                });
            }

            create('platform', Graphic => {
                Graphic.beginFill(0xc0c8d8).drawRoundedRect(0, 0, Config.PlatformWidth, Config.PlatformHeight, 7).endFill();
                Graphic.beginFill(0xe8352b).drawRoundedRect(0, 0, 18, Config.PlatformHeight, 7).drawRoundedRect(Config.PlatformWidth - 18, 0, 18, Config.PlatformHeight, 7).endFill();
                Graphic.beginFill(0xffffff, .5).drawRoundedRect(8, 2, Config.PlatformWidth - 16, 3, 1.5).endFill();
                Graphic.beginFill(0x000000, .25).drawRoundedRect(8, Config.PlatformHeight - 4, Config.PlatformWidth - 16, 2, 1).endFill();
            });

            create('ball', Graphic => {
                Graphic.beginFill(0xcfe0ff).drawCircle(6, 6, 6).endFill();
                Graphic.beginFill(0x7f93c8, .6).drawCircle(7.5, 7.5, 4).endFill();
                Graphic.beginFill(0xffffff).drawCircle(4.5, 4.5, 2.2).endFill();
            });

            create('star', Graphic => Graphic.beginFill(0xffffff).drawRect(0, 0, 3, 3).endFill());
        },

        override(name, url) { this.Texture[name] = PIXI.Texture.from(url); }
    };
})();