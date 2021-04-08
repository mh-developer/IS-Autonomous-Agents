let targetLayer = new PIXI.Container();

let targetGraphics = new PIXI.Graphics();
targetGraphics.lineStyle(2, 0x4f5453);
targetGraphics.drawCircle(0, 0, 5);
targetGraphics.moveTo(0, -10);
targetGraphics.lineTo(0, +10);
targetGraphics.moveTo(-10, 0);
targetGraphics.lineTo(+10, 0);
targetLayer.addChild(targetGraphics);

app.stage.removeChildren();

app.stage.addChild(targetLayer);
app.stage.addChild(vehicleLayer);

const DESIRED_SPEED = 6;

const getFriction = () => {
    return 0.1;
};

const getMaxForce = () => {
    return 0.2;
};

class Vehicle {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.radius = 10;
        this.graphics = createVehicleGraphics(this.radius);
        this.position = new Victor(x, y);
        this.velocity = new Victor(0, 0);
        this.acceleration = new Victor(0, 0);
        this.angle = Math.random() * Math.PI * 2;
    }

    update() {
        this.velocity.add(this.acceleration);

        this.velocity.multiplyScalar(1 - getFriction());

        this.position.add(this.velocity);

        this.acceleration.zero();
    }

    steer(desired) {
        return desired.subtract(this.velocity);
    }

    render() {
        let sprite = this.graphics;
        sprite.x = this.position.x;
        sprite.y = this.position.y;

        sprite.rotation = lerpAngle(sprite.rotation, this.angle, 0.1);
    }

    postUpdate() {
        if (this.velocity.length() < 1e-3) {
            this.velocity.zero();
        } else {
            this.angle = this.velocity.angle();
        }
    }

    decision() {
        let desired = getTarget().clone().subtract(this.position);

        if (!desired.isZero()) {
            desired.normalize().multiplyScalar(DESIRED_SPEED);
        }

        let steeringForce = this.steer(desired);

        this.acceleration = this.limitForce(steeringForce);
    }

    limitForce(vector) {
        let maxForce = getMaxForce();
        if (vector.length() > maxForce) {
            vector.normalize().multiplyScalar(maxForce);
        }
        return vector;
    }
}

class NaturalVehicle {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.radius = 10;
        this.graphics = createVehicleGraphics(this.radius);
        this.position = new Victor(x, y);
        this.velocity = new Victor(0, 0);
        this.acceleration = new Victor(0, 0);
        this.angle = Math.random() * Math.PI * 2;
    }

    decision() {
        let desired = getTarget().clone().subtract(this.position);

        if (!desired.isZero()) {
            desired.normalize().multiplyScalar(DESIRED_SPEED);
        }

        let steeringForce = this.steer(desired);

        this.acceleration = this.limitForce(steeringForce);
    }

    limitForce(vector) {
        let maxForce = getMaxForce();
        if (vector.length() > maxForce) {
            vector.normalize().multiplyScalar(maxForce);
        }
        return vector;
    }

    update() {
        let maxForce = 0.05;
        if (this.acceleration.length() > maxForce) {
            this.acceleration.normalize().multiplyScalar(maxForce);
        }

        this.velocity.add(this.acceleration);

        this.position.add(this.velocity);

        this.acceleration.zero();

        this.velocity.multiplyScalar(1 - 0.01);
    }

    steer(desired) {
        return desired.subtract(this.velocity);
    }

    postUpdate() {
        if (this.velocity.length() < 1e-3) {
            this.velocity.zero();
        } else {
            this.angle = this.velocity.angle();
        }
    }

    render() {
        let sprite = this.graphics;
        sprite.x = this.position.x;
        sprite.y = this.position.y;
        sprite.rotation = this.angle;
    }
}

let vehicles = [];
vehicles.push(
    new Vehicle(
        Math.random() * app.screen.width,
        Math.random() * app.screen.height
    )
);
vehicles.push(
    new NaturalVehicle(
        Math.random() * app.screen.width,
        Math.random() * app.screen.height
    )
);

let offset = 200;
let target = new Victor().randomize(
    new Victor(offset, offset),
    new Victor(app.screen.width - offset, app.screen.height - offset)
);
targetGraphics.x = target.x;
targetGraphics.y = target.y;

const getTarget = () => {
    return target;
};

const normalize = (v) => {
    return v.isZero() ? v : v.normalize();
};
