import React, { useState } from 'react';
import axios from 'axios';
import './Contact.css';
import { toast } from 'react-toastify';

const Contact = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true); // show waiting message
    toast.info("Sending message...");

    try {
      const response = await axios.post("http://localhost:8080/api/contact", form);
      console.log("Backend response:", response);

      if (response.status === 200) {
        toast.success("Message sent successfully!");
        setForm({ firstName: '', lastName: '', email: '', message: '' });
      } else {
        toast.error("Failed to send message.");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to send message. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="contact-form p-5 shadow-sm bg-white">
              <h2 className="text-center mb-4">Get in Touch</h2>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="firstName"
                      className="form-control custom-input"
                      placeholder="First Name"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="lastName"
                      className="form-control custom-input"
                      placeholder="Last Name"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <input
                      type="email"
                      name="email"
                      className="form-control custom-input"
                      placeholder="Email Address"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>cd foodies
                  <div className="col-12">
                    <textarea
                      name="message"
                      className="form-control custom-input"
                      rows="5"
                      placeholder="Your Message"
                      value={form.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <button
                      className="btn btn-primary w-100 py-3"
                      type="submit"
                      disabled={submitting}
                    >
                      {submitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
