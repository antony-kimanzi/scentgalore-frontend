import React from "react";
import "../styles/Contact.scss";

export default function Contact() {
  return (
    <div className="contact">
      <h1>contact us</h1>
      <p>
        At Perfume Palace, we believe every scent tells a story. Whether you
        need help choosing a signature fragrance, tracking an order, or
        exploring wholesale options, our team of perfume enthusiasts is ready to
        assist.
      </p>
      <div className="reach-us">
        <h2>How to Reach Us</h2>
        <ul>
          <li>Phone: +254 798 967 068</li>
          <li>WhatsApp: +254 798 967 068</li>
        </ul>
      </div>
      <div className="message-us">
        <h2>Send Us a Message</h2>
        <p>
          Our dedicated team isn't just here to answer question - we're
          passionate about helping you find your perfect scent.
        </p>
        <h5>Contact Hours</h5>

        <span>Monday to Friday: 9:00 AM - 6:00 PM</span>
        <span>Saturday: 10:00 AM - 4:00 PM</span>
        <span>Sunday: Closed</span>

        <span className="note">Don't hesitate to get in touch. We're here to help you have the best experience possible.</span>

        <form>
            <label htmlFor="name">Name *</label>
            <input type="text" id="name" name="name" required />
            <label htmlFor="email">Email *</label>
            <input type="email" id="email" name="email" required />
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={4} required></textarea>
            <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
}
