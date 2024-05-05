function onimage(event) {
    console.log("image found");
    document.getElementsByClassName("background")[0].style.backgroundImage = "url('" + URL.createObjectURL(event.target.files[0]) + "')";
}

let session_id = null

document.getElementById("uploadForm").addEventListener("submit", function(event) {
    const submitButton = event.target.querySelector("input[type=submit]");
    document.querySelector(".foodABC").innerHTML = "FoodABC"
    submitButton.disabled = true; // Disable the submit button
    submitButton.style.backgroundColor = "#999"; // Change button color to gray
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

document.getElementById("resultForm").addEventListener("submit", function(event) {
    const submitButton = event.target.querySelector("input[type=submit]");
    submitButton.disabled = true; // Disable the submit button
    submitButton.style.backgroundColor = "#999"; // Change button color to gray
    submitChanges(JSON.stringify({session_id: session_id, change: document.getElementById("changes").value}))
    event.preventDefault(); // Prevent the form from submitting normally
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
            session_id = food.session_id

            // Enable the submit button
            const submitButton = document.getElementById("describeImage");
            submitButton.disabled = false;
            submitButton.style.backgroundColor = "#007bff"; // Restore original button color

            // Update background image with the uploaded image
            document.querySelector(".resultsScreen").style.display = "block";
        });
    })
    .catch(error => {
        console.error("Error uploading file:", error);
    });
}

function submitChanges(formData) {
    fetch("http://10.210.1.53:5001/reimagine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to upload file.");
        }
        return response.json(); // Parse the response as JSON
    })
    .then(recipe => {
        // Update food description
        const foodIngredients = document.querySelector(".foodIngredients");
        // Clear existing list items
        foodIngredients.innerHTML = "";
        // Add new list items from recipe instructions
        recipe.ingredients.forEach(ingredient => {
            const li = document.createElement("li");
            li.textContent = ingredient;
            foodIngredients.appendChild(li);
        });

        // Update recipe list
        const foodRecipe = document.querySelector(".foodRecipe");
        // Clear existing list items
        foodRecipe.innerHTML = "";
        // Add new list items from recipe instructions
        recipe.instructions.forEach(instruction => {
            const li = document.createElement("li");
            li.textContent = instruction;
            foodRecipe.appendChild(li);
        });

        // Enable the submit button
        const submitButton = document.getElementById("generateRecipe");
        submitButton.disabled = false;
        submitButton.style.backgroundColor = "#007bff"; // Restore original button color

        document.querySelector(".foodABC").innerHTML = "FoodXYZ"

        document.querySelector(".recipes").style.display = "block";
    })
    .catch(error => {
        console.error("Error uploading file:", error);
    });
}

function share() {
    let mywindow = window.open('', 'PRINT', 'height=650,width=900,top=100,left=150');
    
    mywindow.document.write('<html><head><title>Recipe</title>');
    mywindow.document.write('</head><body >');
    mywindow.document.write(document.querySelector(".recipes").innerHTML);
    mywindow.document.write('</body></html>');
    
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/
    
    mywindow.print();
    mywindow.close();
    
    return true;
}
