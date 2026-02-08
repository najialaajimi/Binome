# Binome

Une plateforme Web spécialisée dans la location de logements adaptés aux besoins spécifiques des étudiants et des étrangers en Tunisie.

## 🎯 Objectif

Simplifier la recherche et la gestion de logements en proposant des solutions sécurisées, transparentes et conviviales pour les étudiants et étrangers en Tunisie.

## 🛠️ Technologies

### Stack MERN
- **MongoDB** - Base de données NoSQL
- **Express.js** - Framework backend Node.js
- **React.js** - Bibliothèque frontend
- **Node.js** - Runtime JavaScript

### Dépendances principales
- **Backend**: Express, Mongoose, JWT, bcryptjs, Helmet, express-validator
- **Frontend**: React Router, Axios, React Icons, Leaflet

## 📁 Structure du projet

```
binome/
├── backend/
│   ├── config/         # Configuration (DB, etc.)
│   ├── controllers/    # Logique métier
│   ├── middleware/     # Middleware (auth, validation)
│   ├── models/         # Modèles Mongoose
│   ├── routes/         # Routes API
│   └── server.js       # Point d'entrée
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/ # Composants réutilisables
│       ├── context/    # Context React (Auth)
│       ├── pages/      # Pages de l'application
│       ├── services/   # Services API
│       └── App.js      # Application principale
└── README.md
```

## 🚀 Installation

### Prérequis
- Node.js (v16+)
- MongoDB
- npm ou yarn

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Modifier .env avec vos configurations
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## 🔌 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur
- `PUT /api/auth/profile` - Mise à jour profil

### Annonces
- `GET /api/listings` - Liste des annonces (avec filtres)
- `GET /api/listings/:id` - Détails d'une annonce
- `POST /api/listings` - Créer une annonce (propriétaire)
- `PUT /api/listings/:id` - Modifier une annonce
- `DELETE /api/listings/:id` - Supprimer une annonce

### Réservations
- `POST /api/bookings` - Créer une réservation
- `GET /api/bookings/my-bookings` - Mes réservations (locataire)
- `GET /api/bookings/requests` - Demandes reçues (propriétaire)

### Messages
- `GET /api/messages/conversations` - Mes conversations
- `POST /api/messages` - Envoyer un message

### Administration
- `GET /api/admin/stats` - Statistiques
- `GET /api/admin/users` - Gestion utilisateurs
- `GET /api/admin/listings` - Modération annonces

## 📱 Pages de l'application

### Pages publiques
- **Accueil** - Hero, recherche, témoignages
- **Recherche** - Filtres, carte, liste des résultats
- **Détail logement** - Galerie, description, contact
- **Authentification** - Connexion/Inscription
- **À propos** - Présentation de la plateforme
- **Comment ça marche** - Guide utilisateur
- **Contact** - Formulaire et coordonnées

### Espace Locataire
- Tableau de bord
- Profil utilisateur
- Favoris et recherches
- Messages
- Réservations
- Recherche de binôme

### Espace Propriétaire
- Tableau de bord avec statistiques
- Gestion des annonces
- Création d'annonces
- Gestion des demandes
- Messages
- Avis reçus

### Administration
- Statistiques globales
- Modération des annonces
- Gestion des utilisateurs
- Support client
- Gestion du contenu

## 🔐 Sécurité

- Authentification JWT
- Hachage des mots de passe (bcrypt)
- Validation des entrées
- Protection CORS
- Rate limiting
- Headers de sécurité (Helmet)

## 🌟 Fonctionnalités

- ✅ Recherche avancée avec filtres
- ✅ Géolocalisation des logements
- ✅ Messagerie intégrée
- ✅ Système de favoris
- ✅ Gestion des réservations/visites
- ✅ Avis et notations
- ✅ Tableau de bord personnalisé
- ✅ Interface responsive (mobile/desktop)

## 📄 Licence

MIT License - Voir [LICENSE](LICENSE) pour plus de détails.