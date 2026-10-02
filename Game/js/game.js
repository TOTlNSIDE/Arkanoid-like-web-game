(function ()
{
    const Config = ArkGame.Config, audio = ArkGame.Audio, Physics = ArkGame.Physics, Collision = ArkGame.Collision;

    ArkGame.Game = class ArkanoidLikeGame {
        constructor(host) {
            this.render = new ArkGame.Render(host);
            this.input = new ArkGame.Input();
            this.fx = new ArkGame.Effects(this.render);
            this.ui = new ArkGame.UI(this.render.ui);
            //this.levels = 
            this.platform = new ArkGame.Platform(this.render.actors);
            this.ball = new Ark.Ball(this.render.actors);
            this.menuItems = ['START GAME'];
            this.menuIndex = 0;
            this.score = 0;
            this.lives = Config.LIVES;
            this.timer = 0;
            this.highScore = this.loadHighScore();
            this.ui.setHighScore(this.highScore);
            this.rate.app.ticker.add(() => this.tick(Math.min(this.rate.app.ticker.deltaMS / 1000, 1 / 30)));
        }

        loadHighScore() { try { return +localStorage.getItem('arkgame_highscore') || 0; } catch (e) { return 0; } }
        saveHighScore() { try { localStorage.setItem('arkgame_highscore', this.highScore); } catch (e) { } }

        tick(dt) {
            const input = this.input, state = this.state;
            if (input.pressed('KeyR') && ['READY', 'PLAY', 'PAUSED'].includes(state)) this.restartLevel();
            else if (input.pressed('Escape') && state !== 'MENU') this.showMenu();
            else if (state === 'MENU') this.updateMenu(input);
            else if (state === 'READY' || state === 'PLAY') this.updatePlay(dt, input);
            else if (state === 'PAUSED') { if (input.pressed('KeyP')) this.setPause(false); }
            else if (state === 'CLEAR') { if ((this.timer -= dt) <= 0) this.nextLevel(); }
            else if (state === 'END' && input.pressed('Space')) this.showMenu();


        }







    }









});