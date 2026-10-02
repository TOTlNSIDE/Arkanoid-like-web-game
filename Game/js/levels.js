ArkGame.Levels = {
    tutorial: {
        theme: 0x101830, rows: [
        // '.............', '..RRRRRRRRR..', '..YYYYYYYYY..', '..GGGGGGGGG..']
           '......S......', '.............', '.............', '.............']
    },

    data: [
        {
            theme: 0x0b1440, rows: ['......G......', '.............', '.............', '.............', '.............', '.............']
        }
        // {
        //     theme: 0x230b40, rows: ['D...........D', 'SSSSSSSSSSSSS', '.BBBBBBBBBBB.', '..CCCCCCCCC..', '...GGGGGGG...', '....YYYYY....', '.....RRR.....']
        // },
        // {
        //     theme: 0x0b3a2a, rows: ['D.D.D.D.D.D.D', 'PPPPPPPPPPPPP', '.S.S.S.S.S.S.', 'WCWCWCWCWCWCW', 'GGGGGGGGGGGGG', 'D...........D']
        // }
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