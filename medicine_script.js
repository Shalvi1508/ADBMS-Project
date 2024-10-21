document
  .getElementById("create-medicine-form")
  .addEventListener("submit", function (event) {
    let valid = true;

    // Medicine ID Validation: Ensure it follows the format MED followed by 3 digits
    const medicineId = document.getElementById("medicine_id").value.trim();
    const medicineIdError = document.getElementById("medicine_id_error");
    const medicineIdPattern = /^MED\d{3}$/;

    if (!medicineIdPattern.test(medicineId)) {
      valid = false;
      medicineIdError.textContent =
        "Medicine ID must follow the format 'MED' followed by 3 digits (e.g., MED001).";
      medicineIdError.style.color = "red";
    } else {
      medicineIdError.textContent = "";
    }

    const price = parseFloat(document.getElementById("medicine_price").value);
    const priceError = document.getElementById("medicine_price_error");

    if (isNaN(price) || price < 1) {
      valid = false;
      priceError.textContent = "Price must be at least ₹1 per unit.";
      priceError.style.color = "red";
    } else {
      priceError.textContent = "";
    }

    // Quantity Validation: Ensure the quantity is at least 1
    const quantity = parseInt(
      document.getElementById("medicine_quantity").value
    );
    const quantityError = document.getElementById("medicine_quantity_error");

    if (isNaN(quantity) || quantity < 1) {
      valid = false;
      quantityError.textContent = "Quantity must be at least 1.";
      quantityError.style.color = "red";
    } else {
      quantityError.textContent = "";
    }

    // Prevent form submission if validation fails
    if (!valid) {
      event.preventDefault();
      document.getElementById("create_error-message").textContent =
        "Please correct the errors before submitting.";
      document.getElementById("create_error-message").style.color = "red";
    } else {
      document.getElementById("create_error-message").textContent = "";
    }
  });

//retrieve

// Function to automatically fill the Medicine ID based on the medicine name from the database
document
  .getElementById("retrieve-medicine-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    console.log("Form submission intercepted"); // Add this to check if the script is running

    const medicineID = document
      .getElementById("retrieve_medicine_id")
      .value.trim();
    const medicineName = document
      .getElementById("retrieve_medicine_name")
      .value.trim();

    try {
      const response = await fetch(
        `/api/retrieve-medicine-by-id-and-name/${medicineID}/${medicineName}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const medicineData = await response.json();

      // Update the table with retrieved data
      const tableBody = document.querySelector("#medicine_result tbody");
      tableBody.innerHTML = `
        <tr>
          <td>${medicineData.Medicine_ID}</td>
          <td>${medicineData.Medicine_name}</td>
          <td>${medicineData.price}</td>
          <td>${medicineData.quantity}</td>
        </tr>
      `;
    } catch (err) {
      document.getElementById("retrieve_error-message").textContent =
        err.message;
    }
  });
//delete:
document
  .getElementById("delete-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission

    const medicineID = document
      .getElementById("delete_medicine_id")
      .value.trim();
    const medicineName = document
      .getElementById("delete_medicine_name")
      .value.trim();

    try {
      const response = await fetch(
        `/delete-medicine/${medicineID}/${medicineName}`,
        {
          method: "DELETE", // Use DELETE method for deletion
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      // Clear the form fields on successful deletion
      document.getElementById("delete_form").reset();
      document.getElementById("delete_error-message").textContent =
        "Medicine deleted successfully!";
    } catch (err) {
      document.getElementById("delete_error-message").textContent = err.message;
    }
  });

// Update Medicine Function
// document
//   .getElementById("update-medicine-form")
//   ?.addEventListener("submit", async function (event) {
//     event.preventDefault();

//     const medicineId = document
//       .getElementById("update_medicine_id")
//       .value.trim();
//     const medicineName = document
//       .getElementById("update_medicine_name")
//       .value.trim();
//     const price = document.getElementById("update_price").value.trim();
//     const quantity = document.getElementById("update_quantity").value.trim();

//     const medicineIdError = document.getElementById("update_medicine_id_error");
//     const errorMessage = document.getElementById("update_error-message");

//     // Reset previous error messages
//     medicineIdError.textContent = "";
//     errorMessage.textContent = "";

//     let isValid = true;

//     // Validate Medicine ID
//     if (!validateMedicineId(medicineId)) {
//       medicineIdError.textContent =
//         'Medicine ID must be in the format "MED001".';
//       isValid = false;
//     }

//     if (isValid) {
//       // Prepare data for update
//       const data = {
//         Medicine_ID: medicineId,
//         Medicine_name: medicineName,
//         price: price,
//         quantity: quantity,
//       };

//       // Submit form via AJAX request
//       try {
//         const response = await fetch(`/update-medicine`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(data),
//         });

//         if (response.ok) {
//           const result = await response.text();
//           errorMessage.textContent = result; // Display success message
//         } else {
//           errorMessage.textContent = "Failed to update medicine.";
//         }
//       } catch (err) {
//         errorMessage.textContent = "Error updating medicine.";
//         console.error(err);
//       }
//     } else {
//       errorMessage.textContent = "Please correct the errors above.";
//     }
//   });

document
  .getElementById("update-medicine-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const medicineId = document
      .getElementById("update_medicine_id")
      .value.trim();
    const medicineName = document
      .getElementById("update_medicine_name")
      .value.trim();
    const price = document.getElementById("update_price").value.trim();
    const quantity = document.getElementById("update_quantity").value.trim();

    const medicineIdError = document.getElementById("update_medicine_id_error");
    const errorMessage = document.getElementById("update_error-message");

    // Reset previous error messages
    medicineIdError.textContent = "";
    errorMessage.textContent = "";

    let isValid = true;

    // Implement validation for Medicine ID here (e.g., check format)
    // ...

    if (isValid) {
      // Prepare data for update
      const data = {
        Medicine_ID: medicineId,
        Medicine_name: medicineName,
        price: price,
        quantity: quantity,
      };

      try {
        const response = await fetch(`/update-medicine`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const result = await response.text();
          errorMessage.textContent = result; // Display success message
        } else {
          errorMessage.textContent = "Failed to update medicine.";
        }
      } catch (err) {
        errorMessage.textContent = "Error updating medicine.";
        console.error(err);
      }
    } else {
      errorMessage.textContent = "Please correct the errors above.";
    }
  });

function goBack() {
  window.history.back();
}
