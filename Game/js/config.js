window.ArkGame = window.ArkGame || {};

ArkGame.Config = {
    CanvasWidth: 500, CanvasHeight: 500,
    FieldLeft: 50, FieldRight: 450, FieldTop: 50,
    BrickWidth: 50, BrickHeight: 20,
    PlatformWidth: 100, PlatformHeight: 20, PlatformY: 450, PlatformSpeed: 100,
    BallRadius: 6, BallSpeed: 300, BallMaxSPD: 500,
    Lives: 3,
    BrickColors: {
        R: 0xff0000, O: 0xffbf00, Y: 0xffff00, G: 0x008000, B: 0x0000ff,
        C: 0x00ffff, P: 0xffc0cb, W: 0xfffff, S: 0xc4c4c4, G: 0xffd700 },
    Points: {
        R: 10, O: 20, Y: 30, G: 40, B: 50,
        C: 60, P: 70, W: 80, S: 90 }
};