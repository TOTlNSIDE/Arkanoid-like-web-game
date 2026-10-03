ArkGame.Levels = {
    tutorial: { theme: 0x101830, rows: ['.............', '..RRRRRRRRR..', '..YYYYYYYYY..', '..GGGGGGGGG..']},
    data: [{ theme: 0x0b1440, rows: ['SSSSSSSSSSSSS', 'RRRRRRRRRRRRR', 'OOOOOOOOOOOOO', 'YYYYYYYYYYYYY', 'GGGGGGGGGGGGG', 'BBBBBBBBBBBBB']},
            {theme: 0x230b40, rows: ['X...........X', 'SSSSSSSSSSSSS', '.BBBBBBBBBBB.', '..CCCCCCCCC..', '...GGGGGGG...', '....YYYYY....', '.....RRR.....']},
            {theme: 0x0b3a2a, rows: ['X.X.X.X.X.X.X', 'PPPPPPPPPPPPP', '.S.S.S.S.S.S.', 'WCWCWCWCWCWCW', 'GGGGGGGGGGGGG', 'X...........X']}
    ]
};

ArkGame.LoadLevel = class {
    constructor(layer) { this.layer = layer; this.bricks = []; }
    load(def) {
        this.clear();
        def.rows.forEach((row, r) => [...row].forEach((current, c) => {
            if (current !== '.') this.bricks.push(new ArkGame.Brick(current, c, r, this.layer));
        }));
    }
    clear() {
        this.layer.removeChildren().forEach(child => child.destroy());
        this.bricks = [];
    }
    remaining() { return this.bricks.filter(brick => !brick.dead && brick.kind !== 'X').length; }
    update(dt) { this.bricks.forEach(brick => brick.update(dt)); }
};