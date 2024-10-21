document.addEventListener("DOMContentLoaded", function () {
  const medicineDropdown = document.getElementById("medicine_id");

  // Fetch available medicines from server
  fetch("/medicines")
    .then((response) => response.json())
    .then((medicines) => {
      medicines.forEach((medicine) => {
        const option = document.createElement("option");
        option.value = medicine.medicine_id;
        option.textContent = `${medicine.medicine_name} (${medicine.medicine_id})`;
        medicineDropdown.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error fetching medicines:", error);
    });

  // Go back button functionality
  window.goBack = function () {
    window.history.back();
  };

  // Form validation and submission
  document
    .getElementById("create-inventory-form")
    .addEventListener("submit", function (event) {
      const inventoryId = document.getElementById("inventory_id").value.trim();
      const medicineId = document.getElementById("medicine_id").value.trim();
      const quantity = document.getElementById("quantity").value.trim();

      if (!inventoryId || !medicineId || !quantity) {
        event.preventDefault();
        document.getElementById("create_error-message").textContent =
          "All fields are required.";
      }
    });
});
