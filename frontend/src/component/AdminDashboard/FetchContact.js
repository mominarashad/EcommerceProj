import Sidebar from './SlidingBar'; 
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ContactPage.css";
import { FaEnvelope, FaUser, FaTag, FaClock, FaReply } from "react-icons/fa";

const ContactPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [responses, setResponses] = useState({});

  useEffect(() => {
    // Fetch data from the backend
    axios
      .get("http://localhost:5000/admin-contact")
      .then((response) => {
        setContacts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch contact messages.");
        setLoading(false);
      });
  }, []);

  const handleResponseChange = (e, id) => {
    setResponses({ ...responses, [id]: e.target.value });
  };

  const handleSendResponse = (contactId) => {
    const responseMessage = responses[contactId];
    if (!responseMessage) return;

    axios
      .post(`http://localhost:5000/admin-contact/respond/${contactId}`, {
        response: responseMessage,
      })
      .then(() => {
        alert("Response sent successfully!");
        setResponses({ ...responses, [contactId]: "" });
      })
      .catch((error) => {
        alert("Failed to send the response. Please try again.");
        console.error(error);
      });
  };

  return (
    <div className="container">
      <Sidebar />
      <div className="contact-page">
        <h1>
          <FaReply /> Contact Messages
        </h1>
        {loading ? (
          <p>Loading messages...</p>
        ) : error ? (
          <p>{error}</p>
        ) : contacts.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th><FaUser /> Name</th>
                <th><FaEnvelope /> Email</th>
                <th><FaTag /> Subject</th>
                <th>Message</th>
                <th><FaClock /> Created At</th>
                <th>Admin Response</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id}>
                  <td>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.subject}</td>
                  <td>{contact.message}</td>
                  <td>{new Date(contact.created_at).toLocaleString()}</td>
                  <td>
                    <textarea
                      placeholder="Write a response..."
                      value={responses[contact.id] || ""}
                      onChange={(e) => handleResponseChange(e, contact.id)}
                    />
                    <button onClick={() => handleSendResponse(contact.id)}>
                      Send Response
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No contact messages found.</p>
        )}
      </div>
    </div>
  );
};

export default ContactPage;
