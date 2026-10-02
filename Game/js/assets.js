(function () {
    const Config = ArkGame.Config;

    ArkGame.Assets = {
        Texture: {},
        init(render) {
            const create = (name, draw) => {
                const Graphic = new PIXI.Graphics();
                draw(Graphic);
                this.Texture[name] = render.generateTexture(Graphic, { resolution: 2 });
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
                Graphic.beginFill(0x000000).drawRoundedRect(0, 0, Config.PlatformWidth, Config.PlatformHeight, 7).endFill();
                Graphic.beginFill(0x000000).drawRoundedRect(0, 0, 20, Config.PlatformHeight, 7).drawRoundedRect(Config.PlatformWidth - 20, 0, 20, Config.PlatformHeight, 8).endFill();
                Graphic.beginFill(0x000000, .5).drawRoundedRect(10, 5, Config.PlatformWidth - 20, 5, 5).endFill();
                Graphic.beginFill(0x000000, .25).drawRoundedRect(10, Config.PlatformHeight - 10, Config.PlatformWidth - 20, 2, 1).endFill();
            });

            create('ball', Graphic => {
                Graphic.beginFill(0x000000).drawCircle(5, 5, 5).endFill();
                Graphic.beginFill(0x000000, 0.5).drawCircle(6, 6, 6).endFill();
                Graphic.beginFill(0x000000).drawCircle(4, 4, 4).endFill();
            });

            create('star', Graphic => Graphic.beginFill(0x000000).drawRect(0, 0, 5, 5).endFill());
        },

        override(name, url) { this.Texture[name] = PIXI.Texture.from(url); }
    };
})();