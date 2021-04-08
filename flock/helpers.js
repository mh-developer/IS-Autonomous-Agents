const project = (a, b) => {
    let normB = b.clone.normalize();
    return normB.multiplyScalar(normB.dot(a));
};

const angleDiff = (a, b) => {
    return Math.abs(lerpAngle(a, b, 0) - lerpAngle(a, b, 1));
};

const angleBetween = (a, b) => {
    return b.clone().subtract(a).angle();
};

const torusDistance = (a, b) => {
    let w = app.screen.width + OFF_SCREEN_BORDER * 2;
    let h = app.screen.height + OFF_SCREEN_BORDER * 2;

    let deltaX = Math.min(Math.abs(a.x - b.x), w - Math.abs(a.x - b.x));
    let deltaY = Math.min(Math.abs(a.y - b.y), h - Math.abs(a.y - b.y));

    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
};

const lerpAngle = (start, end, amount, maxDelta) => {
    start %= Math.PI * 2;
    end %= Math.PI * 2;

    while (end > start + Math.PI) end -= Math.PI * 2;
    while (end < start - Math.PI) end += Math.PI * 2;
    let value;

    if (maxDelta !== undefined && Math.abs(end - start) > maxDelta) {
        if (end > start) {
            value = start + maxDelta;
        } else {
            value = start - maxDelta;
        }
    } else {
        value = start + (end - start) * amount;
    }
    return value % (Math.PI * 2);
};

const limitMagnitude = (v, amount) => {
    if (v.length() > amount) {
        v.normalize().multiplyScalar(amount);
    }
};
