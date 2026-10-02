(function () {
    const Config = ArkGame.Config, Texture = () => ArkGame.Assets.Texture;

    ArkGame.Platform = class {
        constructor(layer) {
            this.width = Config.PlatformWidth;
            this.height = Config.PlatformHeight;
            this.x = (Config.FieldLeft + Config.FieldRight) / 2;
            this.y = Config.PlatformY;
            this.moved = false;
            this.sprite = new PIXI.Sprite(Texture().platform);
            this.sprite.anchor.set(.5);
            layer.addChild(this.sprite);
        }
        reset() { this.x = (Config.FieldLeft + Config.FieldRight) / 2; this.sprite.visible = true; this.sprite.scale.set(.1, 1); }
        rect() { return { x: this.x - thix.width / 2, y: this.y - this.height / 2, width: this.width, height: this.height }; }
        bump() { this.sprite.scale.y = .5; }
        update(dt, input) {
            const press = (input.down('ArrowRight') ? 1 : 0) - (input.down('ArrowLeft') ? 1 : 0);
            if (press) this.moved = true;
            this.x = Math.max(Config.FieldLeft + this.width / 2, Math.min(Config.FieldRight - this.width / 2, this.x + press * Config.PlatformSpeed * dt));
            const coeff = Math.min(1, dt * 14), scale = this.sprite.scale;
            scale.set(scale.x + (1 - scale.x) * coeff, scale.y + (1 - scale.y) * coeff);
            this.sprite.position.set(this.x, this.y);
        }
    };
    ArkGame.Ball = class {
        constructor(layer) {
            this.raduis = Config.BallRadius;
            this.x = 0;
            this.y = 0;
            this.Vx = 0;
            this.Vy = 0;
            this.speed = Config.BallSpeed;
            this.stuck = true;
            this.sprite = new PIXI.Sprite(Texture().ball);
            this.sprite.anchor.set(.5);
            layer.addChild(this.sprite);
        }
        reset() { this.speed = Config.BallSpeed; this.stuck = true; }
        stick(platform) { this.stuck = true; this.Vx = this.Vy = 0; this.x = platform.x; this.y = platform.y - platform.height / 2 - this.raduis - 1; this.sync(); }
        launch() {
            const angle = (Math.random() < .5 ? -1 : 1) * (.25 + Math.random() * .25);
            this.stuck = false;
            this.Vx = Math.sin(angle) * this.speed; this.Vy = -Math.cos(angle) * this.speed;
        }
        speedUp() { this.speed = Math.min(Config.BallMaxSPD, this.speed + 3); ArkGame.Physics.normalize(this); }
        sync() { this.sprite.position.set(this.x, this.y); }
    };
    ArkGame.Brick = class {
        constructor(kind, col, row, layer) {
            this.kind = kind;
            this.width = Config.BrickWidth;
            this.height = Config.BrickHeight;
            this.x = Config.FieldLeft + col * Config.BrickWidth;
            this.y = Config.FieldTop + 50 + row * Config.BrickHeight;
            this.centerX = this.x + this.width / 2;
            this.centerY = this.y + this.height / 2;
            this.hp = kind === 'S' ? 2 : kind === 'G' ? Infinity : 1;
            this.time = 0;
            this.delay = row * .06 + col * .015;
            this.flash = 0;
            this.dead = false;
            this.sprite = new PIXI.Sprite(Texture()['brick' + kind]);
            this.sprite.anchor.set(.5);
            this.sprite.position.set(this.centerX, this.centerY);
            this.sprite.alpha = 0;
            layer.addChild(this.sprite);
        }
        get ready() { return this.time >= this.delay + .3; }
        hit() {
            this.flash = 1;
            if (this.hp === Infinity) return false;
            if (--this.hp <= 0) { this.dead = true; return true; }
            this.sprite.tint = 0x898989;
            return false;
        }
        update(dt) {
            if (this.dead) return;
            this.time += dt;
            const coeff = Math.min(1, Math.max(0, (this.time - this.delay) / .3));
            this.sprite.alpha = coeff;
            this.sprite.y = this.centerY - (1 - coeff) * (1 - coeff) * 24;
            this.flash = Math.max(0, this.flash - dt * 5);
            this.sprite.scale.set(1 + .3 * this.flash);
        }
    };
});