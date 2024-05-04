function onimage(event) {
    console.log("image found")
    document.getElementById("imageSelect").style.backgroundColor="#1bcf4b";
    document.getElementsByClassName("background")[0].style.backgroundImage = "url('" + URL.createObjectURL(event.target.files[0]) + "')";
}

let session_id = null

document.getElementById("uploadForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    let formData = new FormData(this); // Create a FormData object from the form

    // Read the selected image file
    let imageFile = document.getElementById("image").files[0];
    //document.body.style.background = url(imageFile);
    if (imageFile) {
        let reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = function() {
            let imageData = reader.result.split(",")[1]; // Extract base64 image data
            const image_type = reader.result.split(",")[0].split(";")[0].split(":")[1];
            console.log(image_type)
            let jsonData = JSON.stringify({"media_type": image_type, "image": imageData }); // Include image data in JSON object

            submitForm(jsonData);
        };
    }
});

function submitForm(formData) {
    fetch("http://10.210.1.53:5001/describe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to upload file.");
        }
        const food = response.json().then(food => {
            document.getElementsByClassName("resultsScreen")[0].style.display="block";
            document.getElementById("foodName").innerText = food.name
            document.getElementById("foodDescription").innerText = food.cultural_description
            document.getElementById("foodIngredients").innerText = food.ingredients
            session_id = foo
            // Update background image with the uploaded image
            //document.body.style.backgroundImage = `url('data:image/jpeg;base64,${food.imageData}')`;
        });
    })
    .catch(error => {
        console.error("Error uploading file:", error);
    });
}