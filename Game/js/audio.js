(function () {
    const SOUNDS = {
        platform: [200, .5, 'square', 1], brick: [500, .1, 'square', 1], hard: [300, .1, 'square', .1],
        wall: [100, .5, 'triangle', 1], launch: [500, .1, 'triangle', 1], life: [300, .1, 'sawtooth', .1],
        win: [500, .5, 'square', 2]
    };

    ArkGame.Audio = {
        ctx: null,
        play(name) {
            const sound = SOUNDS[name];
            if (!sound) return;
            try {
                this.ctx = this.ctx || new AudioContext();
                if (this.ctx.state === 'suspended') this.ctx.resume();
                const create = this.ctx, time = create.currentTime, oscillator = create.createOscillator(), createdGain = create.createGain();
                oscillator.type = sound[2];
                oscillator.frequency.setValueAtTime(sound[0], time);
                oscillator.frequency.exponentialRampToValueAtTime(sound[0] * sound[3], time + sound[1]);
                createdGain.gain.setValueAtTime(.06, time);
                createdGain.gain.exponentialRampToValueAtTime(.001, time + sound[1]);
                oscillator.connect(createdGain).connect(create.destination);
                oscillator.start(time);
                oscillator.stop(time + sound[1]);
            } catch (e) { }
        }
    };
})();