ArkGame.Physics = {
    reflect(ball, hit) {
        const velocity = ball.Vx * hit.normalX + ball.Vy * hit.normalY;
        if (velocity < 0) { ball.Vx -= 2 * velocity * hit.normalX; ball.Vy -= 2 * velocity * hit.normalY; }
        this.normalize(ball);
    },

    normalize(ball) {
        const length = Math.hypot(ball.Vx, ball.Vy) || 1;
        ball.Vx *= ball.speed / length; ball.Vy *= ball.speed / length;
        const minimum = .22 * ball.speed;
        if (Math.abs(ball.Vy) < minimum) {
            ball.Vy = (ball.Vy < 0 ? -1 : 1) * minimum;
            ball.Vx = (ball.Vx < 0 ? -1 : 1) * Math.sqrt(ball.speed * ball.speed - minimum * minimum);
        }
    },

    platformBounce(ball, platform) {
        const hitPosition = Math.max(-1, Math.min(1, (ball.x - platform.x) / (platform.width / 2))), angle = hitPosition * Math.PI / 3;
        ball.Vx = Math.sin(angle) * ball.speed;
        ball.Vy = -Math.cos(angle) * ball.speed;
    }
};