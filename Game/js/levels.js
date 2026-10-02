ArkGame.Levels = {
    data: [
        {
            theme: 0xfffff, rows: ['RRRRRRRRRRRRR', 'OOOOOOOOOOOOO', 'YYYYYYYYYYYYYY', 'GGGGGGGGGGG', 'BBBBBBBBBBBBBBB',],
            theme: 0xfffff, rows: ['CCCCCCCCCCCCC', 'PPPPPPPPPPPPP', 'WWWWWWWWWWWWWW', 'SSSSSSSSSSS', 'GGGGGGGGGGGGGGG',],
            theme: 0xfffff, rows: ['RRRRRRRRRRRRR', 'PPPPPPPPPPPPP', 'YYYYYYYYYYYYYY', 'SSSSSSSSSSS', 'BBBBBBBBBBBBBBB',]
        


        
        

        

        }
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
        this.layer.removeChildren().forEach(child => child.Destroy());
        this.bricks = [];
    }
    remaining() { return this.bricks.filter(brick => !brick.dead && brick.kind !== 'G').length; }
    update(dt) { this.bricks.forEach(brick => brick.update(dt)); }
};