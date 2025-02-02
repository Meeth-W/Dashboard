import React, { useState, useEffect } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isCooldown, setIsCooldown] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the embed object
    const embed = {
      title: "New Contact Form Submission",
      fields: [
        {
          name: "Name",
          value: formData.name,
          inline: true
        },
        {
          name: "Email",
          value: formData.email,
          inline: true
        },
        {
          name: "Message",
          value: formData.message,
          inline: false
        }
      ],
      color: 0x0F172A, // Dark color
      timestamp: new Date().toISOString() // Add timestamp
    };

    // THIS IS TEMPORARY, Will eventually use the backend to send the message and implement the cooldown
    try {
      const response = await fetch("https://discord.com/api/webhooks/1335660584905084940/TK4B8ljJvdDC09k91L8DgBocnhwE3Nfn6s0O5c7815DT6_fC6O4U9_bfyEiMNUV4POoA", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ embeds: [embed] })
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log('Form submitted:', formData);
      // Optionally reset the form
      setFormData({ name: '', email: '', message: '' });
      alert("Message sent successfully!");

      // Start cooldown
      setIsCooldown(true);
      setTimeout(() => {
        setIsCooldown(false);
      }, 60000); // 60 seconds cooldown
    } catch (error) {
      console.error("Error sending message:", error);
      alert("There was an error sending your message. Please try again later.");
    }
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
                value={formData.message}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-2 text-left"
                rows="4"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className={`bg-accentBlue text-white font-medium py-2 px-6 rounded-lg hover:bg -darkBlue w-full ${isCooldown ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isCooldown}
            >
              {isCooldown ? 'Please wait...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;