import React from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiMessageCircle, FiCalendar, FiKey, FiHome, FiUploadCloud, FiUserCheck, FiDollarSign } from 'react-icons/fi';
import './HowItWorksPage.css';

const HowItWorksPage = () => {
  const tenantSteps = [
    {
      icon: <FiSearch />,
      title: 'Recherchez',
      description: 'Utilisez nos filtres avancés pour trouver le logement idéal selon vos critères.'
    },
    {
      icon: <FiMessageCircle />,
      title: 'Contactez',
      description: 'Échangez directement avec les propriétaires via notre messagerie sécurisée.'
    },
    {
      icon: <FiCalendar />,
      title: 'Visitez',
      description: 'Planifiez une visite pour découvrir le logement et rencontrer le propriétaire.'
    },
    {
      icon: <FiKey />,
      title: 'Emménagez',
      description: 'Signez le contrat et récupérez les clés de votre nouveau chez-vous !'
    }
  ];

  const ownerSteps = [
    {
      icon: <FiHome />,
      title: 'Créez votre annonce',
      description: 'Décrivez votre logement, ajoutez des photos et définissez vos conditions.'
    },
    {
      icon: <FiUploadCloud />,
      title: 'Publiez',
      description: 'Votre annonce est vérifiée puis mise en ligne pour atteindre des milliers de locataires.'
    },
    {
      icon: <FiUserCheck />,
      title: 'Sélectionnez',
      description: 'Recevez des candidatures et choisissez le locataire idéal.'
    },
    {
      icon: <FiDollarSign />,
      title: 'Louez',
      description: 'Finalisez la location en toute sécurité avec notre accompagnement.'
    }
  ];

  return (
    <div className="how-it-works-page">
      <section className="hiw-hero">
        <div className="container">
          <h1>Comment ça marche ?</h1>
          <p>Découvrez comment Binôme simplifie la location de logements</p>
        </div>
      </section>

      <section className="hiw-section">
        <div className="container">
          <h2>Pour les locataires</h2>
          <p className="section-subtitle">Trouvez votre logement en quelques étapes simples</p>
          <div className="steps-grid">
            {tenantSteps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{index + 1}</div>
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
          <div className="section-cta">
            <Link to="/search" className="btn btn-primary btn-lg">
              Commencer ma recherche
            </Link>
          </div>
        </div>
      </section>

      <section className="hiw-section alt">
        <div className="container">
          <h2>Pour les propriétaires</h2>
          <p className="section-subtitle">Louez votre bien en toute simplicité</p>
          <div className="steps-grid">
            {ownerSteps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{index + 1}</div>
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
          <div className="section-cta">
            <Link to="/auth?mode=register&role=owner" className="btn btn-primary btn-lg">
              Publier mon annonce
            </Link>
          </div>
        </div>
      </section>

      <section className="hiw-faq">
        <div className="container">
          <h2>Questions fréquentes</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h3>Est-ce gratuit de s'inscrire ?</h3>
              <p>Oui, l'inscription est entièrement gratuite pour les locataires et les propriétaires.</p>
            </div>
            <div className="faq-item">
              <h3>Comment les annonces sont-elles vérifiées ?</h3>
              <p>Notre équipe vérifie chaque annonce avant publication pour garantir leur authenticité.</p>
            </div>
            <div className="faq-item">
              <h3>Les paiements sont-ils sécurisés ?</h3>
              <p>Nous utilisons des solutions de paiement sécurisées et cryptées pour protéger vos transactions.</p>
            </div>
            <div className="faq-item">
              <h3>Puis-je trouver un colocataire ?</h3>
              <p>Oui ! Notre fonction "Recherche de Binôme" vous permet de trouver le colocataire idéal.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;
