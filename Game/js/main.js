(function ()
{
    const start = () => { ArkGame.instance = new ArkGame.Game(document.getElementById('game')); };
    Promise.race([document.fonts.load('12px "Press Start 2P"'),new Promise(resolve => setTimeout(resolve, 1000))]).then(start, start);
})();

