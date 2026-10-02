ArkGame.Input = class {
    constructor() {
        this.held = new Set();
        this.hit = new Set();
        window.addEventListener('keydown', e => {
            if (e.code.startsWith('Arrow') || e.code === 'Space') e.preventDefault();
            if (!e.repeat) this.hit.add(e.code);
            this.held.add(e.code);
        });
        window.addEventListener('keyup', e => this.held.delete(e.code));
        window.addEventListener('blur', () => this.held.clear());
    }
    down(code) { return this.held.has(code); }
    pressed(code) { return this.hit.has(code); }
    endFrame() { this.hit.clear(); }
};