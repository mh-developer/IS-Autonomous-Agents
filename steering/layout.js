let app = new PIXI.Application({
    width: 974,
    height: 548,
    transparent: false,
    resolution: 2,
    backgroundColor: "blue",
});

let OFF_SCREEN_BORDER = 0;
let settings = {
    // Rules
    separation: 2,
    alignment: 1.5,
    cohesion: 0.5,

    // Physics
    maxForce: 0.05,
    periphery: Math.PI,
    range: 50,
    desiredSpeed: 6,
};

let friction = 0.01;

let vehicleLayer = new PIXI.Container();

app.stage.addChild(vehicleLayer);

const createVehicleGraphics = (radius) => {
    let g = new PIXI.Graphics();
    drawVehicle(g, radius);
    vehicleLayer.addChild(g);
    return g;
};

const drawVehicle = (graphics, r) => {
    graphics.lineStyle(2, 0x0, 1);
    graphics.beginFill(0xf3b993, 1);
    graphics.moveTo(r, 0);
    graphics.lineTo(-r, -r / 2);
    graphics.lineTo(-r, r / 2);
    graphics.lineTo(r, 0);
    graphics.endFill();
};

const wrapAround = (vehicle) => {
    if (vehicle.position.x < -OFF_SCREEN_BORDER) {
        vehicle.position.x += app.screen.width + OFF_SCREEN_BORDER * 2;
    }
    if (vehicle.position.y < -OFF_SCREEN_BORDER) {
        vehicle.position.y += app.screen.height + OFF_SCREEN_BORDER * 2;
    }
    if (vehicle.position.x >= app.screen.width + OFF_SCREEN_BORDER) {
        vehicle.position.x -= OFF_SCREEN_BORDER * 2 + app.screen.width;
    }
    if (vehicle.position.y >= app.screen.height + OFF_SCREEN_BORDER) {
        vehicle.position.y -= OFF_SCREEN_BORDER * 2 + app.screen.height;
    }

    // if (vehicle.position.x < 100) {
    //     let desired = new Victor(settings.desiredSpeed, vehicle.velocity.y);
    //     let steer = vehicle.steer(desired);
    //     vehicle.acceleration.add(vehicle.limitForce(steer));
    // } else if (vehicle.position.y < 100) {
    //     let desired = new Victor(vehicle.velocity.x, settings.desiredSpeed);
    //     let steer = vehicle.steer(desired);
    //     vehicle.acceleration.add(vehicle.limitForce(steer));
    // } else if (vehicle.position.x > app.screen.width - 100) {
    //     let desired = new Victor(-settings.desiredSpeed, vehicle.velocity.y);
    //     let steer = vehicle.steer(desired);
    //     vehicle.acceleration.add(vehicle.limitForce(steer));
    // } else if (vehicle.position.y > app.screen.height - 100) {
    //     let desired = new Victor(vehicle.velocity.x, -settings.desiredSpeed);
    //     let steer = vehicle.steer(desired);
    //     vehicle.acceleration.add(vehicle.limitForce(steer));
    // }
};

const updateVehicles = () => {
    vehicles.forEach((vehicle) => {
        vehicle.decision();

        vehicle.update();
        vehicle.postUpdate();

        wrapAround(vehicle);

        vehicle.render();

        while (torusDistance(target, vehicle.position) < 5) {
            let ang = 0;
            while (2.7 < ang || ang < 0.01) {
                target = new Victor().randomize(
                    new Victor(offset, offset),
                    new Victor(
                        app.screen.width - offset,
                        app.screen.height - offset
                    )
                );
                ang = angleDiff(
                    vehicle.velocity.angle(),
                    angleBetween(vehicle.position, target)
                );
            }

            targetGraphics.x = target.x;
            targetGraphics.y = target.y;
        }
    });
};

const animate = () => {
    updateVehicles();
    app.render();
    requestAnimationFrame(animate);
};

document.getElementById("wrapper").appendChild(app.view);
