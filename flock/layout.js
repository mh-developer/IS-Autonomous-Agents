let app = new PIXI.Application({
    width: 1200,
    height: 960,
    transparent: false,
    resolution: 2,
    backgroundColor: 0xbaab88,
});

let OFF_SCREEN_BORDER = 5;

let weights = {
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

let vehicles = [];

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
    //     let desired = new Victor(weights.desiredSpeed, vehicle.velocity.y);
    //     let steer = vehicle.steer(desired);
    //     vehicle.acceleration.add(steer);
    // } else if (vehicle.position.y < 100) {
    //     let desired = new Victor(vehicle.velocity.x, weights.desiredSpeed);
    //     let steer = vehicle.steer(desired);
    //     vehicle.acceleration.add(steer);
    // } else if (vehicle.position.x > app.screen.width - 100) {
    //     let desired = new Victor(-weights.desiredSpeed, vehicle.velocity.y);
    //     let steer = vehicle.steer(desired);
    //     vehicle.acceleration.add(steer);
    // } else if (vehicle.position.y > app.screen.height - 100) {
    //     let desired = new Victor(vehicle.velocity.x, -weights.desiredSpeed);
    //     let steer = vehicle.steer(desired);
    //     vehicle.acceleration.add(steer);
    // }
};

const getEnvironment = () => {
    return {
        vehicles: vehicles,
    };
};

const updateVehicles = () => {
    let environment = getEnvironment();

    vehicles.forEach((vehicle) => {
        vehicle.decision(environment);

        vehicle.update();
        vehicle.postUpdate();

        wrapAround(vehicle);

        vehicle.render();
    });
};

const animate = () => {
    updateVehicles();
    app.render();
    requestAnimationFrame(animate);
};

document.getElementById("wrapper").appendChild(app.view);
