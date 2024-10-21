// Function to go back to the Customer Management menu
function goBack() {
  window.location.href = "menu-customer.html";
}

// Regular expression to match the format "CUST" followed by 3 digits
const customerIdPattern = /^CUST\d{3}$/;

// Validate Customer ID function
function validateCustomerId(customerId) {
  return customerIdPattern.test(customerId);
}

document
  .getElementById("create-form")
  .addEventListener("submit", function (event) {
    let valid = true;

    // Customer ID Validation: Ensure it follows the format CUST followed by 3 digits
    const customerId = document
      .getElementById("create_customer_id")
      .value.trim();
    const customerIdError = document.getElementById("create_customer_id_error");
    const customerIdPattern = /^CUST\d{3}$/;

    if (!customerIdPattern.test(customerId)) {
      valid = false;
      customerIdError.textContent =
        "Customer ID must follow the format 'CUST' followed by 3 digits (e.g., CUST001).";
      customerIdError.style.color = "red";
    } else {
      customerIdError.textContent = "";
    }

    // Phone Number Validation: Ensure it contains only numbers and is 10 digits long
    const phoneNumber = document
      .getElementById("create_phone_number")
      .value.trim();
    const phoneError = document.getElementById("create_phone_error");
    const phonePattern = /^\d{10}$/;

    if (!phonePattern.test(phoneNumber)) {
      valid = false;
      phoneError.textContent = "Phone number must be exactly 10 digits.";
      phoneError.style.color = "red";
    } else {
      phoneError.textContent = "";
    }

    // Email Validation: Ensure it follows the correct format
    const email = document.getElementById("create_email").value.trim();
    const emailError = document.getElementById("create_email_error");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      valid = false;
      emailError.textContent = "Please enter a valid email address.";
      emailError.style.color = "red";
    } else {
      emailError.textContent = "";
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

// Update Customer Function
document
  .getElementById("update-form")
  ?.addEventListener("submit", async function (event) {
    event.preventDefault();

    const customerId = document
      .getElementById("update_customer_id")
      .value.trim();
    const customerName = document
      .getElementById("update_customer_name")
      .value.trim();
    const phoneNumber = document
      .getElementById("update_phone_number")
      .value.trim();
    const email = document.getElementById("update_email").value.trim();

    const customerIdError = document.getElementById("update_customer_id_error");
    const phoneError = document.getElementById("update_phone_error");
    const emailError = document.getElementById("update_email_error");
    const errorMessage = document.getElementById("update_error-message");

    // Reset previous error messages
    customerIdError.textContent = "";
    phoneError.textContent = "";
    emailError.textContent = "";
    errorMessage.textContent = "";

    let isValid = true;

    // Validate Customer ID
    if (!validateCustomerId(customerId)) {
      customerIdError.textContent =
        'Customer ID must be in the format "CUST001".';
      isValid = false;
    }

    // Validate Phone Number (optional)
    if (phoneNumber && isNaN(phoneNumber)) {
      phoneError.textContent = "Phone number must be numeric.";
      isValid = false;
    }

    // Validate Email (optional)
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailError.textContent = "Email must be in a valid format.";
      isValid = false;
    }

    if (isValid) {
      // Prepare data for update
      const data = {
        Customer_ID: customerId,
        Customer_name: customerName,
        Phone_number: phoneNumber,
        Email_ID: email,
      };

      // Submit form via AJAX request
      try {
        const response = await fetch(`/update-customer`, {
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
          errorMessage.textContent = "Failed to update customer.";
        }
      } catch (err) {
        errorMessage.textContent = "Error updating customer.";
        console.error(err);
      }
    } else {
      errorMessage.textContent = "Please correct the errors above.";
    }
  });
// Function to retrieve customer by both ID and Name
document
  .getElementById("retrieve-customer-form")
  ?.addEventListener("submit", async function (event) {
    event.preventDefault();

    let customerId = document
      .getElementById("retrieve_customer_id")
      .value.trim();
    let customerName = document
      .getElementById("retrieve_customer_name")
      .value.trim();

    let customerIdError = document.getElementById("retrieve_customer_id_error");
    let customerNameError = document.getElementById(
      "retrieve_customer_name_error"
    );
    let errorMessage = document.getElementById("retrieve_error-message");

    // Reset previous error messages
    customerIdError.textContent = "";
    customerNameError.textContent = "";
    errorMessage.textContent = "";

    let isValid = true;

    // Validate Customer ID
    if (!validateCustomerId(customerId)) {
      customerIdError.textContent =
        'Customer ID must be in the format "CUST001".';
      isValid = false;
    }

    // Validate Customer Name
    if (customerName.length === 0) {
      customerNameError.textContent = "Customer name is required.";
      isValid = false;
    }

    if (isValid) {
      // Submit form via AJAX request
      try {
        const response = await fetch(
          `/retrieve-customer-by-id-and-name/${customerId}/${customerName}`
        );

        if (response.ok) {
          const customer = await response.json();
          // document.getElementById("customer_result").textContent =
          //   JSON.stringify(customer, null, 2);
          const tbody = document.querySelector("#customer_result tbody");
          tbody.innerHTML = ""; // Clear existing data

          const row = document.createElement("tr");
          row.innerHTML = `
    <td>${customer.Customer_ID}</td>
    <td>${customer.Customer_name}</td>
    <td>${customer.Phone_number}</td>
    <td>${customer.Email_ID}</td>
`;
          tbody.appendChild(row);
        } else if (response.status === 404) {
          errorMessage.textContent = "Customer not found.";
        } else {
          errorMessage.textContent = "Failed to retrieve customer.";
        }
      } catch (err) {
        errorMessage.textContent = "Error retrieving customer.";
        console.error(err);
      }
    } else {
      errorMessage.textContent = "Please correct the errors above.";
    }
  });

// Function to delete a customer by both ID and Name
document
  .getElementById("delete-form")
  ?.addEventListener("submit", async function (event) {
    event.preventDefault();

    let customerId = document.getElementById("delete_customer_id").value.trim();
    let customerName = document
      .getElementById("delete_customer_name")
      .value.trim();

    let customerIdError = document.getElementById("delete_customer_id_error");
    let customerNameError = document.getElementById(
      "delete_customer_name_error"
    );
    let errorMessage = document.getElementById("delete_error-message");

    // Reset previous error messages
    customerIdError.textContent = "";
    customerNameError.textContent = "";
    errorMessage.textContent = "";

    let isValid = true;

    // Validate Customer ID
    if (!validateCustomerId(customerId)) {
      customerIdError.textContent =
        'Customer ID must be in the format "CUST001".';
      isValid = false;
    }

    // Validate Customer Name
    if (customerName.length === 0) {
      customerNameError.textContent = "Customer name is required.";
      isValid = false;
    }

    if (isValid) {
      // Submit form via AJAX request
      try {
        const response = await fetch(
          `/delete-customer-by-id-and-name/${customerId}/${customerName}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const result = await response.text();
          errorMessage.textContent = result; // Display success message
        } else if (response.status === 404) {
          errorMessage.textContent = "Customer not found.";
        } else {
          errorMessage.textContent = "Failed to delete customer.";
        }
      } catch (err) {
        errorMessage.textContent = "Error deleting customer.";
        console.error(err);
      }
    } else {
      errorMessage.textContent = "Please correct the errors above.";
    }
  });
