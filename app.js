function predictPrice() {
    const sqft = document.getElementById("sqft").value;
    const bhk = document.getElementById("bhk").value;
    const bath = document.getElementById("bath").value;
    const location = document.getElementById("location").value;

    if (!sqft || !bhk || !bath || !location) {
        document.getElementById("output").innerHTML = "Please fill all fields.";
        return;
    }

    fetch("/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ sqft, bhk, bath, location }),
    })
    .then(res => res.json())
    .then(data => {
        if (data.estimated_price) {
    let price = parseFloat(data.estimated_price);
    price = Math.max(0, price);  // Prevent negative values
    document.getElementById("output").innerHTML =
        "💰 Estimated Price: ₹ " + price.toFixed(2) + " Lakhs";
}
 else {
            document.getElementById("output").innerHTML = "Error: " + data.error;
        }
    })
    .catch(err => {
        document.getElementById("output").innerHTML = "Something went wrong. Try again later.";
    });
}

window.onload = function() {
    fetch("/static/columns.json")
        .then(res => res.json())
        .then(data => {
            const select = document.getElementById("location");
            const locations = data.data_columns.slice(3); // skip sqft, bath, bhk
            locations.forEach(loc => {
                const opt = document.createElement("option");
                opt.value = loc;
                opt.text = loc;
                select.add(opt);
            });
        });
};
