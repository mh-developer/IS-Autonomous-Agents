let controls = $("#controls");

let sliders = [
    {
        key: "separation",
        max: 15,
    },
    {
        key: "alignment",
        max: 15,
    },
    {
        key: "cohesion",
        max: 10,
    },
    {
        key: "desiredSpeed",
        label: "speed",
        min: 0.1,
        max: 5,
    },
    {
        key: "range",
        label: "view distance",
        min: 25,
        max: 250,
    },
];

sliders.forEach((opt) => {
    let label = opt.label || opt.key;
    let min = opt.min || 0;
    let id = opt.key + "-slider";
    let html = `<div style="display:flex;">
        <input value="${
            weights[opt.key]
        }" id="${id}" type="range" min="${min}" max="${opt.max}" step="0.1">
        ${label}
        </div>`;
    controls.append(html);
    $("#" + id).bind("input", function () {
        weights[opt.key] = +this.value;
    });
});

let html = `<div style="display:flex;">
    <input id="vehicles-slider" type="range" min="2" max="198" step="1" value="100">
    Number of vehicles
    </div>`;
controls.append(html);

$("#vehicles-slider").bind("input", function () {
    let desired = this.value;
    let got = vehicles.length;

    if (got > desired) {
        let unwanted = vehicles.splice(desired);
        unwanted.forEach((b) => {
            vehicleLayer.removeChild(b.graphics);
        });
    } else if (got < desired) {
        for (let i = 0; i < desired - got; ++i) {
            vehicles.push(
                new Vehicle(
                    Math.random() * app.screen.width,
                    Math.random() * app.screen.height
                )
            );
        }
    }
});
