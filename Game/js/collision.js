ArkGame.Collision = {
    circleRect(circle, rectangle) {
        const closeX = Math.max(rectangle.x, Math.min(circle.x, rectangle.x + rectangle.width));
        const closeY = Math.max(rectangle.y, Math.min(circle.y, rectangle.y + rectangle.height));
        const distanceX = circle.x - closeX, distanceY = circle.y - closeY, d2 = distanceX * distanceX + distanceY * distanceY;
        if (d2 > circle.radius * circle.radius) return null;
        if (d2 === 0) return { normalX: 0, normalY: circle.Vy > 0 ? -1 : 1, pen: circle.radius };
        const distance = Math.sqrt(d2);
        return { normalX: distanceX / distance, normalY: distanceY / distance, pen: circle.radius - distance };
    }
};