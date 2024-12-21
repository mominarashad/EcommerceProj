import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./SlidingBar"; // Import the Sidebar
import "./Settings.css";

const Settings = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    contact: "",
    cnic: "",
    officeEmail: "",
    city: "",
    state: "",
    country: "",
  });

  useEffect(() => {
    const email = "admin@gmail.com"; // Replace with the logged-in user's email
    axios
      .get(`http://localhost:5000/settings/${email}`)
      .then((response) => {
        const data = response.data;
        setFormData({
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          gender: data.gender,
          dateOfBirth: data.date_of_birth,
          address: data.address,
          contact: data.contact,
          cnic: data.cnic,
          officeEmail: data.office_email,
          city: data.city,
          state: data.state,
          country: data.country,
        });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        alert("Failed to fetch user data.");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.post("http://localhost:5000/save-settings", formData);
      alert(response.data || "Changes saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  return (
    <div className="settings-container">
      <div className="container">
        <Sidebar /> {/* Include Sidebar */}
        <div className="settings-content">
          <h2 className="settings-heading">Account Settings</h2>
          <form className="settings-form">
            <div className="form-row">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter First Name"
              />
            </div>

            <div className="form-row">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter Last Name"
              />
            </div>

            <div className="form-row">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="form-row">
              <label>Gender</label>
              <div className="gender-options">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === "Male"}
                    onChange={handleChange}
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === "Female"}
                    onChange={handleChange}
                  />
                  Female
                </label>
              </div>
            </div>

            <div className="form-row">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter Address"
              />
            </div>

            <div className="form-row">
              <label>Contact</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Enter Contact Number"
              />
            </div>

            <div className="form-row">
              <label>CNIC</label>
              <input
                type="text"
                name="cnic"
                value={formData.cnic}
                onChange={handleChange}
                placeholder="Enter CNIC"
              />
            </div>

            <div className="form-row">
              <label>Office Email</label>
              <input
                type="email"
                name="officeEmail"
                value={formData.officeEmail}
                onChange={handleChange}
                placeholder="Enter Office Email"
              />
            </div>

            <div className="form-row">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter City"
              />
            </div>

            <div className="form-row">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter State"
              />
            </div>

            <div className="form-row">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Enter Country"
              />
            </div>
          </form>

          <div className="form-actions">
            <button type="button" className="save-button" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
