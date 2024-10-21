const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors"); // Import CORS if needed
const port = 3053;

const app = express();
app.use(cors()); // Enable CORS
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/Medical_Store_Management_System", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once("open", () => {
  console.log("Mongodb connection successful");
});

// Define the Customer schema
const customerSchema = new mongoose.Schema({
  Customer_ID: { type: String, required: true, unique: true },
  Customer_name: { type: String, required: true },
  Phone_number: { type: Number, required: true },
  Email_ID: { type: String, required: true },
});

// Create Customer model
const Customer = mongoose.model("Customer", customerSchema);

const medicineSchema = new mongoose.Schema({
  Medicine_ID: { type: String, required: true, unique: true },
  Medicine_name: { type: String, required: true },
  // dosage: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

// Create Medicine model
const Medicine = mongoose.model("Medicine", medicineSchema);

// Define the Pharmacist schema
const pharmacistSchema = new mongoose.Schema({
  Pharmacist_ID: { type: String, required: true, unique: true },
  Pharmacist_name: { type: String, required: true },
  Phone_number: { type: Number, required: true },
  Address: { type: String, required: true },
});

// Create Pharmacist model
const Pharmacist = mongoose.model("Pharmacist", pharmacistSchema);

// Serve the Customer Menu as the homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "menu.html")); // Ensure you have a menu.html file
});

// Handle form POST request for creating customer
app.post("/post-customer", async (req, res) => {
  try {
    const { Customer_ID, Customer_name, Phone_number, Email_ID } = req.body;

    const customer = new Customer({
      Customer_ID,
      Customer_name,
      Phone_number,
      Email_ID,
    });

    await customer.save();
    console.log("Customer created:", customer);
    res.status(200).send("Customer created successfully");
  } catch (err) {
    console.error("Error creating customer:", err);
    res.status(500).send("Failed to create customer: " + err.message);
  }
});

// Handle POST request for updating customer data
app.post("/update-customer", async (req, res) => {
  try {
    const { Customer_ID, Customer_name, Phone_number, Email_ID } = req.body;

    // Find the customer by Customer_ID and update their details
    const updatedCustomer = await Customer.findOneAndUpdate(
      { Customer_ID },
      { Customer_name, Phone_number, Email_ID },
      { new: true } // Return the updated document
    );

    if (!updatedCustomer) {
      return res.status(404).send("Customer not found.");
    }

    console.log("Customer updated:", updatedCustomer);
    res.status(200).send("Customer updated successfully");
  } catch (err) {
    console.error("Error updating customer:", err);
    res.status(500).send("Failed to update customer: " + err.message);
  }
});

// Handle GET request for retrieving customer by both ID and name
app.get("/retrieve-customer-by-id-and-name/:id/:name", async (req, res) => {
  try {
    const customerID = req.params.id.trim();
    const customerName = req.params.name.trim();

    // Case-insensitive and trim search for both Customer_ID and Customer_name
    const customer = await Customer.findOne({
      Customer_ID: customerID,
      Customer_name: { $regex: new RegExp("^" + customerName + "$", "i") },
    });

    if (!customer) {
      return res
        .status(404)
        .send("Customer not found with the provided ID and name");
    }

    res.status(200).json(customer); // Send the customer details as JSON
  } catch (err) {
    console.error("Error retrieving customer by ID and name:", err);
    res.status(500).send("Failed to retrieve customer: " + err.message);
  }
});

// Handle DELETE request for deleting customer by both ID and name
app.delete("/delete-customer-by-id-and-name/:id/:name", async (req, res) => {
  try {
    const customerID = req.params.id.trim(); // Get Customer ID from URL parameter
    const customerName = req.params.name.trim(); // Get Customer name from URL parameter

    // Find and delete the customer by Customer_ID and Customer_name
    const deletedCustomer = await Customer.findOneAndDelete({
      Customer_ID: customerID,
      Customer_name: { $regex: new RegExp("^" + customerName + "$", "i") }, // Case-insensitive search for name
    });

    if (!deletedCustomer) {
      return res
        .status(404)
        .send("Customer not found with the provided ID and name");
    }

    console.log("Customer deleted:", deletedCustomer);
    res.status(200).send("Customer deleted successfully");
  } catch (err) {
    console.error("Error deleting customer:", err);
    res.status(500).send("Failed to delete customer: " + err.message);
  }
});

// // Handle form POST request for creating pharmacist
app.post("/post-pharmacist", async (req, res) => {
  console.log("Request body:", req.body); // Log the request body
  try {
    const { Pharmacist_ID, Pharmacist_name, Phone_number, Address } = req.body;

    const pharmacist = new Pharmacist({
      Pharmacist_ID,
      Pharmacist_name,
      Phone_number,
      Address,
    });

    await pharmacist.save();
    console.log("Pharmacist created:", pharmacist);
    res.status(200).send("Pharmacist created successfully");
  } catch (err) {
    console.error("Error creating pharmacist:", err);
    res.status(500).send("Failed to create pharmacist: " + err.message); // Send back the error message
  }
});

//retrieving pharmacist
app.get("/retrieve-pharmacist-by-id-and-name/:id/:name", async (req, res) => {
  try {
    const pharmacistID = req.params.id.trim();
    const pharmacistName = req.params.name.trim();

    const pharmacist = await Pharmacist.findOne({
      Pharmacist_ID: pharmacistID,
      Pharmacist_name: { $regex: new RegExp("^" + pharmacistName + "$", "i") },
    });

    if (!pharmacist) {
      return res
        .status(404)
        .send("Pharmacist not found with the provided ID and name");
    }

    res.status(200).json(pharmacist);
  } catch (err) {
    console.error("Error retrieving pharmacist by ID and name:", err);
    res.status(500).send("Failed to retrieve pharmacist: " + err.message);
  }
});

//retrieving medicine
// Handle retrieving medicine by ID and name
app.get("/api/retrieve-medicine-by-id-and-name/:id/:name", async (req, res) => {
  console.log(`Received request: ID=${req.params.id}, Name=${req.params.name}`);
  try {
    const medicineID = req.params.id.trim();
    const medicineName = req.params.name.trim();
    const medicine = await Medicine.findOne({
      Medicine_ID: medicineID,
      Medicine_name: { $regex: new RegExp("^" + medicineName + "$", "i") },
    });

    if (!medicine) {
      return res
        .status(404)
        .send("Medicine not found with the provided ID and name");
    }

    res.status(200).json(medicine);
  } catch (err) {
    console.error("Error retrieving medicine by ID and name:", err);
    res.status(500).send("Failed to retrieve medicine: " + err.message);
  }
});
//delete the  medicine
app.delete("/delete-medicine/:id/:name", async (req, res) => {
  try {
    const medicineID = req.params.id.trim();
    const medicineName = req.params.name.trim();

    const deletedMedicine = await Medicine.findOneAndDelete({
      Medicine_ID: medicineID,
      Medicine_name: { $regex: new RegExp("^" + medicineName + "$", "i") }, //case;-insensitive
    });

    if (deletedMedicine.deletedCount === 0) {
      return res
        .status(404)
        .send("Medicine not found with the provided ID and name");
    }

    res.status(200).send("Medicine deleted successfully");
  } catch (err) {
    console.error("Error deleting medicine:", err);
    res.status(500).send("Failed to delete medicine: " + err.message);
  }
});

// Endpoint for updating medicine data
app.post("/update-medicine", async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { Medicine_ID, Medicine_name, price, quantity } = req.body;

    // Find the medicine by Medicine_ID and update its details
    const updatedMedicine = await Medicine.findOneAndUpdate(
      { Medicine_ID },
      { Medicine_name, price, quantity },
      { new: true } // Return the updated document
    );

    if (!updatedMedicine) {
      return res.status(404).send("Medicine not found.");
    }

    console.log("Medicine updated:", updatedMedicine);
    res.status(200).send("Medicine updated successfully");
  } catch (err) {
    console.error("Error updating medicine:", err);
    res.status(500).send("Failed to update medicine: " + err.message);
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
