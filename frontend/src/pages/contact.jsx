import React, { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="bg-slate-900">
      <div className="w-full h-96 bg-slate-800 flex items-center justify-center">
        <div className="text-center">
        <h1 className="text-4xl font-bold text-white">Contact Me!</h1>
        <p className="mt-4 text-lg text-gray-300">
          Have a question or want to collaborate on a project? Send me a message below!
        </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white text-right">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                color="gray"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-2 text-left"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white text-right">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                color="gray"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-2 text-left"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-white text-right">Message</label>
              <textarea
                id="message"
                name="message"
                color="gray"
                value={formData.message}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-2 text-left"
                rows="4"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-accentBlue text-white font-medium py-2 px-6 rounded-lg hover:bg-darkBlue w-full"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
