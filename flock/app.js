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

    steer(desired) {
        return desired.subtract(this.velocity);
    }

    update() {
        this.velocity.add(this.acceleration);

        this.velocity.multiplyScalar(1 - friction);

        this.position.add(this.velocity);

        this.acceleration.zero();
    }

    postUpdate() {
        if (this.velocity.length() < 1e-3) {
            this.velocity.zero();
        } else {
            this.angle = this.velocity.angle();
        }
    }

    flock(vehicles, delta) {
        let hood = this.getNeighbourhood(vehicles);
        let sep = this.separation(hood);
        let ali = this.alignment(hood);
        let coh = this.cohesion(hood);

        sep.multiplyScalar(weights.separation);
        ali.multiplyScalar(weights.alignment);
        coh.multiplyScalar(weights.cohesion);

        this.acceleration.add(sep).add(ali).add(coh);
        if (!this.acceleration.isZero()) {
            this.acceleration.normalize().multiplyScalar(weights.maxForce);
        }
    }

    getNeighbourhood(vehicles) {
        let range = weights.range;
        let periphery = weights.periphery;
        let hood = [];
        let self = this;
        vehicles.forEach((vehicle) => {
            if (vehicle === self) return;

            let distance = torusDistance(self.position, vehicle.position);
            let angle = angleBetween(self.position, vehicle.position);
            if (
                distance < range &&
                angleDiff(angle, self.velocity.angle()) <= periphery
            ) {
                hood.push({
                    vehicle: vehicle,
                    distance: distance,
                    angle: angle,
                });
            }
        });

        return hood;
    }

    separation(hood) {
        let desiredSeparation = this.radius * 2 + 5;

        let average = new Victor(0, 0);
        let count = 0;

        for (let i = 0, l = hood.length; i < l; ++i) {
            let neighbour = hood[i];
            let other = neighbour.vehicle;
            let d = neighbour.distance;
            if (d < desiredSeparation && d > 0) {
                let diff = this.position
                    .clone()
                    .subtract(other.position)
                    .normalize()
                    .divideScalar(d);
                average.add(diff);

                count++;
            }
        }
        if (count > 0) {
            return this.steer(
                average.normalize().multiplyScalar(weights.desiredSpeed)
            );
        }
        return average;
    }

    alignment(hood) {
        let average = new Victor(0, 0);
        let count = 0;
        for (let i = 0, l = hood.length; i < l; ++i) {
            let neighbour = hood[i];
            let other = neighbour.vehicle;
            average.add(other.velocity);
            count++;
        }
        if (count > 0 && !average.isZero()) {
            return this.steer(
                average.normalize().multiplyScalar(weights.desiredSpeed)
            );
        }
        return average;
    }

    cohesion(hood) {
        let average = new Victor(0, 0);
        let count = 0;

        for (let i = 0, l = hood.length; i < l; ++i) {
            let neighbour = hood[i];
            let other = neighbour.vehicle;
            average.add(other.position);
            count++;
        }
        if (count > 0) {
            let destination = average
                .divideScalar(count)
                .subtract(this.position);
            let dist = destination.length();
            if (dist > 0) {
                destination.normalize();
            }
            destination.multiplyScalar(weights.desiredSpeed);
            return this.steer(destination);
        }
        return average;
    }

    decision(environment) {
        this.flock(environment.vehicles);
    }

    render() {
        let sprite = this.graphics;
        sprite.x = this.position.x;
        sprite.y = this.position.y;

        sprite.rotation = lerpAngle(sprite.rotation, this.angle, 0.1);
    }
}

for (let i = 0; i < 100; ++i) {
    vehicles.push(
        new Vehicle(
            Math.random() * app.screen.width,
            Math.random() * app.screen.height
        )
    );
}
