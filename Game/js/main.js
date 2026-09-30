(function ()
{
    const start = () => { ArkGame.instance = new ArkGame.Game(document.getElementById('game')); };
    Promise.race([document.fonts.load('10px "Oxanium"'),new Promise(resolve => setTimeout(resolve, 1000))]).then(start, start);
})();

