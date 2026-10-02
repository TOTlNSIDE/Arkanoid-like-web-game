(function () {
    const SOUNDS = {
        platform: [300, .07, 'square', 1.5], brick: [520, .07, 'square', 1.5], hard: [220, .1, 'square', 1.3],
        wall: [180, .05, 'triangle', 1.3], launch: [400, .1, 'triangle', 1.8], life: [220, .4, 'sawtooth', .3],
        win: [520, .5, 'square', 2.5]
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