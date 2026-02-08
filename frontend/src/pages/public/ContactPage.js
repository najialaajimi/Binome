import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend, FiMessageSquare, FiUsers } from 'react-icons/fi';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, send to API
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="container">
          <h1>Contactez-nous</h1>
          <p>Une question ? Nous sommes là pour vous aider</p>
        </div>
      </section>

      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Nos coordonnées</h2>
              <div className="info-items">
                <div className="info-item">
                  <div className="info-icon">
                    <FiMapPin />
                  </div>
                  <div className="info-text">
                    <h3>Adresse</h3>
                    <p>Avenue de la République<br />1000 Tunis, Tunisie</p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon">
                    <FiMail />
                  </div>
                  <div className="info-text">
                    <h3>Email</h3>
                    <p><a href="mailto:contact@binome.tn">contact@binome.tn</a></p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon">
                    <FiPhone />
                  </div>
                  <div className="info-text">
                    <h3>Téléphone</h3>
                    <p><a href="tel:+21671000000">+216 71 000 000</a></p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon">
                    <FiMessageSquare />
                  </div>
                  <div className="info-text">
                    <h3>Chat en direct</h3>
                    <p>Disponible du lundi au vendredi<br />9h - 18h</p>
                  </div>
                </div>
              </div>

              <div className="partners-section">
                <h3><FiUsers /> Partenariats</h3>
                <p>
                  Vous représentez une université, une résidence étudiante ou une organisation ? 
                  Contactez-nous pour discuter d'un partenariat.
                </p>
                <a href="mailto:partenaires@binome.tn" className="partner-link">
                  partenaires@binome.tn
                </a>
              </div>
            </div>

            <div className="contact-form-section">
              {submitted ? (
                <div className="success-message">
                  <h2>Message envoyé !</h2>
                  <p>Nous vous répondrons dans les plus brefs délais.</p>
                  <button 
                    className="btn btn-outline"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: '', message: '' });
                    }}
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <>
                  <h2>Envoyez-nous un message</h2>
                  <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-group">
                      <label htmlFor="name">Nom complet</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Votre nom"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="votre@email.com"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="subject">Sujet</label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Sélectionnez un sujet</option>
                        <option value="general">Question générale</option>
                        <option value="support">Support technique</option>
                        <option value="billing">Facturation</option>
                        <option value="partnership">Partenariat</option>
                        <option value="report">Signalement</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="message">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        placeholder="Votre message..."
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">
                      <FiSend /> Envoyer le message
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
