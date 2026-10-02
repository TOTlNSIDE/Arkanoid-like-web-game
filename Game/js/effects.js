
ArkGame.Effects = class {
    constructor(render) {
        this.render = render; this.layer = render.fx;
        this.parts = []; this.dyers = []; this.mag = 0;
    }

    spawn(x, y, color, life) {
        const sprite = new PIXI.Sprite(ArkGame.Assets.Texture.star);
        sprite.anchor.set(.5); sprite.tint = color; sprite.position.set(x, y);
        this.layer.addChild(sprite);
        const particle = { sprite, life, max: life, Vx: 0, Vy: 0, gravity: 0, scale: 1 };
        this.particles.push(particle);
        return particle;
    }

    burst(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            const particle = this.spawn(x, y, color, .4 + Math.random() * .4);
            const angle = Math.random() * Math.PI * 2, velocity = 60 + Math.random() * 180;
            particle.Vx = Math.cos(angle) * velocity; particle.Vy = Math.sin(angle) * velocity - 60; particle.gravity = 500; particle.scale = 1 + Math.random() * 1.5;
        }
    }

    trail(x, y) { this.spawn(x, y, 0x9fe3ff, .25).scale = 1.6; }
    dying(sprite) { this.dyers.push(sprite); }
    shake(scale) { this.magnitude = Math.max(this.magnitude, scale); }

    update(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            if ((particle.life -= dt) <= 0) { particle.sprite.destroy(); this.particles.splice(i, 1); continue; }
            particle.Vy += particle.gravity * dt;
            particle.sprite.x += particle.Vx * dt; particle.sprite.y += particle.Vy * dt;
            const lifeTime = particle.life / particle.max;
            particle.sprite.alpha = lifeTime;
            particle.sprite.scale.set(particle.scale * (.4 + lifeTime * .6));
        }
        for (let i = this.dyers.length - 1; i >= 0; i--) {
            const dying = this.dyers[i];
            if (dying.destroyed) { this.dyers.splice(i, 1); continue; }
            dying.scale.set(dying.scale.x + dt * 3);
            dying.rotation += dt * 2;
            dying.alpha -= dt * 5;
            if (dying.alpha <= 0) { dying.destroy(); this.dyers.splice(i, 1); }
        }
        this.magnitude = this.magnitude < .1 ? 0 : this.magnitude * Math.pow(.001, dt);
        this.render.scene.position.set((Math.random() - .5) * this.magnitude * 2, (Math.random() - .5) * this.magnitude * 2);
    }
};
