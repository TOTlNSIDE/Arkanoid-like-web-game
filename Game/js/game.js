(function ()
{
    const Config = ArkGame.Config, Audio = ArkGame.Audio, Physics = ArkGame.Physics, Collision = ArkGame.Collision;

    ArkGame.Game = class ArkanoidLikeGame {
        constructor(host) {
            this.render = new ArkGame.Render(host);
            this.input = new ArkGame.Input();
            this.fx = new ArkGame.Effects(this.render);
            this.ui = new ArkGame.UI(this.render.ui);
            this.levels = new ArkGame.LoadLevel(this.render.bricks);
            this.levelIndex = 0;
            this.platform = new ArkGame.Platform(this.render.actors);
            this.ball = new ArkGame.Ball(this.render.actors);
            this.menuItems = ['START GAME', 'TUTORIAL'];
            this.menuIndex = 0;
            this.score = 0;
            this.lives = Config.Lives;
            this.timer = 0;
            this.highScore = this.loadHighScore();
            this.ui.setHighScore(this.highScore);
            this.startTutorial();
            this.render.app.ticker.add(() => this.tick(Math.min(this.render.app.ticker.deltaMS / 1000, 1 / 30)));
        }

        loadHighScore() { try { return +localStorage.getItem('arkgame_highscore') || 0; } catch (e) { return 0; } }
        saveHighScore() { try { localStorage.setItem('arkgame_highscore', this.highScore); } catch (e) { } }

        tick(dt) {
            const input = this.input, state = this.state;
            if (input.pressed('KeyR') && ['READY', 'PLAY', 'PAUSED'].includes(state)) this.reloadLevel();
            else if (input.pressed('Escape') && this.tut && state !== 'MENU') this.showMenu();
            else if (state === 'MENU') this.updateMenu(input);
            else if (state === 'READY' || state === 'PLAY') this.updatePlay(dt, input);
            else if (state === 'PAUSED') { if (input.pressed('KeyP')) this.setPause(false); }
            else if (state === 'CLEAR') { if ((this.timer -= dt) <= 0) this.nextLevel(); }
            else if (state === 'END' && input.pressed('Space')) this.showMenu();

            if (this.state !== 'PAUSED') { this.levels.update(dt); this.fx.update(dt); }
            this.render.update(dt);
            this.ui.update(dt);
            input.endFrame();
        }

        showMenu() {
            this.tut = false;
            this.state = 'MENU';
            this.levels.load(ArkGame.Levels.data[0]);
            this.render.setTheme(ArkGame.Levels.data[0].theme);
            this.ball.sprite.visible = this.platform.sprite.visible = false;
            this.ui.setHint('');
            this.ui.show('ARKANOID-like', '', { size: 34, dim: false });
            this.ui.showMenu(this.menuItems, this.menuIndex);
        }

        updateMenu(input) {
            const scroll = (input.pressed('ArrowDown') ? 1 : 0) - (input.pressed('ArrowUp') ? 1 : 0);

            if (scroll) {
                this.menuIndex = (this.menuIndex + scroll + this.menuItems.length) % this.menuItems.length;
                this.ui.showMenu(this.menuItems, this.menuIndex);
                Audio.play('wall');
            }

            if (input.pressed('Space')) { Audio.play('launch'); this.menuIndex ? this.startTutorial() : this.startGame(); }
        }

        startTutorial() {
            this.tut = true; this.score = 0; this.lives = Config.Lives;
            this.platform.moved = false;
            this.loadLevel();
        }

        startGame() {
            this.tut = false;
            this.score = 0;
            this.lives = Config.Lives;
            this.levelIndex = 0;
            this.beginLevel();
        }

        beginLevel() {
            this.startScore = this.score;
            this.startLives = this.lives;
            this.loadLevel();
        }

        reloadLevel() {
            if (this.tut) return this.startTutorial();
            this.score = this.startScore;
            this.lives = this.startLives;
            this.loadLevel();
        }

        loadLevel() {
            const level = this.tut ? ArkGame.Levels.tutorial : ArkGame.Levels.data[this.levelIndex];
            this.levels.load(level);
            this.render.setTheme(level.theme);
            this.platform.reset();
            this.ball.reset();
            this.ball.sprite.visible = true;
            this.ball.stick(this.platform);
            this.ui.hideMenu();
            this.ui.setScore(this.score); this.ui.setLives(this.lives);
            this.ui.setRound(this.tut ? 'TUT' : this.levelIndex + 1);
            this.ui.setHint('');
            this.state = 'READY';
            if (this.tut) this.ui.hide();
            else this.ui.show('ROUND ' + (this.levelIndex + 1), 'PRESS SPACE', { dim: false });
        }

        setPause(state) {
            this.state = state ? 'PAUSED' : 'PLAY';

            if (state) this.ui.show('PAUSED', 'PRESS P TO RESUME'); else this.ui.hide();
        }

        endGame(title, subtext) {
            this.state = 'END'; this.ball.sprite.visible = false;
            this.saveHighScore();
            this.ui.setHint('');
            this.ui.show(title, subtext);
        }

        nextLevel() {
            if (++this.levelIndex >= ArkGame.Levels.data.length) {
                this.endGame('YOU WIN!', 'SCORE ' + this.score + '  PRESS SPACE');
            } else this.beginLevel();
        }

        clearLevel() {
            Audio.play('win'); this.fx.shake(4);
            this.ball.sprite.visible = false;

            for (let i = 0; i < 6; i++) {
                this.fx.burst(Config.FieldLeft + Math.random() * (Config.FieldRight - Config.FieldLeft), 120 + Math.random() * 200,
                    Object.values(Config.BrickColors)[i], 18);
            }
            if (this.tut) { this.ui.setHint(''); this.endGame('TUTORIAL DONE', 'PRESS SPACE'); }
            else { this.state = 'CLEAR'; this.timer = 1.8; this.ui.show('ROUND CLEAR', '', { dim: false }); }
        }

        updatePlay(dt, input) {
            const platform = this.platform, ball = this.ball;

            if (input.pressed('KeyP') && this.state === 'PLAY') return this.setPause(true);
            platform.update(dt, input);

            if (this.tut) {
                this.ui.setHint(!platform.moved ? 'USE ◀ ▶ TO MOVE THE PLATFORM'
                    : this.state === 'READY' ? 'PRESS SPACE TO LAUNCH THE BALL'
                        : 'BREAK ALL BRICKS!\nBOUNCE THE BALL WITH YOUR PLATFORM');
            }

            if (this.state === 'READY') {
                ball.stick(platform);
                if (input.pressed('Space')) { ball.launch(); this.state = 'PLAY'; Audio.play('launch'); if (!this.tut) this.ui.hide(); }
            } else this.stepBall(dt);
        }

        stepBall(dt) {
            const ball = this.ball, n = Math.ceil(ball.speed * dt / 4), h = dt / n;
            for (let i = 0; i < n && this.state === 'PLAY'; i++) {
                ball.x += ball.Vx * h; ball.y += ball.Vy * h;
                this.collideWalls(ball); this.collidePlatform(ball); this.collideBricks(ball);
            }
            if (this.state === 'PLAY' && ball.y > Config.CanvasHeight + ball.radius) this.loseBall();
            ball.sync();
            if (this.state === 'PLAY') this.fx.trail(ball.x, ball.y);
        }

        collideWalls(ball) {
            let hit = false;
            if (ball.x < Config.FieldLeft + ball.radius) { ball.x = Config.FieldLeft + ball.radius; ball.Vx = Math.abs(ball.Vx); hit = true; }
            else if (ball.x > Config.FieldRight - ball.radius) { ball.x = Config.FieldRight - ball.radius; ball.Vx = -Math.abs(ball.Vx); hit = true; }
            if (ball.y < Config.FieldTop + ball.radius) { ball.y = Config.FieldTop + ball.radius; ball.Vy = Math.abs(ball.Vy); hit = true; }
            if (hit) { Physics.normalize(ball); Audio.play('wall'); this.fx.burst(ball.x, ball.y, 0x9fd0ff, 3); }
        }

        collidePlatform(ball) {
            const platform = this.platform;
            if (ball.Vy > 0 && ball.y < platform.y && Collision.circleRect(ball, platform.rect())) {
                ball.y = platform.y - platform.height / 2 - ball.radius;
                Physics.platformBounce(ball, platform);
                platform.bump(); Audio.play('platform');
            }
        }

        collideBricks(ball) {
            for (const brick of this.levels.bricks) {
                if (brick.dead || !brick.ready) continue;
                const hit = Collision.circleRect(ball, brick);
                if (!hit) continue;
                ball.x += hit.normalX * (hit.pen + .01); ball.y += hit.normalY * (hit.pen + .01);
                Physics.reflect(ball, hit);
                this.hitBrick(brick);
                break;
            }
        }

        hitBrick(brick) {
            if (brick.hit()) {
                this.score += Config.Points[brick.kind];
                if (this.score > this.highScore) { this.highScore = this.score; this.ui.setHighScore(this.highScore); }
                this.ui.setScore(this.score);
                Audio.play('brick');
                this.fx.burst(brick.centerX, brick.centerY, Config.BrickColors[brick.kind], 14);
                this.fx.dying(brick.sprite);
                this.fx.shake(2);
                this.ball.speedUp();
                if (this.levels.remaining() === 0) this.clearLevel();
            } else Audio.play('hard');
        }

        loseBall() {
            Audio.play('life'); this.fx.shake(8);
            this.fx.burst(this.ball.x, Config.CanvasHeight - 10, 0xff5555, 20);
            if (!this.tut) this.lives--;
            this.ui.setLives(this.lives);
            if (this.lives <= 0) return this.endGame('GAME OVER', 'PRESS SPACE');
            this.ball.reset(); this.ball.stick(this.platform);
            this.state = 'READY';
        }
    };
})();