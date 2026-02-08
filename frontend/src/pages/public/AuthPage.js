import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import './AuthPage.css';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'register');
  const [userType, setUserType] = useState(searchParams.get('role') || 'tenant');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === 'owner' ? '/owner/dashboard' : 
                          user.role === 'admin' ? '/admin/dashboard' : 
                          '/tenant/dashboard';
      navigate(redirectPath);
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!isLogin) {
      if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
      if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setSubmitError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          role: userType
        });
      }
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="auth-logo">Binôme</Link>
          <h1>{isLogin ? 'Connexion' : 'Créer un compte'}</h1>
          <p>{isLogin ? 'Connectez-vous pour accéder à votre espace' : 'Rejoignez notre communauté'}</p>
        </div>

        {!isLogin && (
          <div className="user-type-tabs">
            <button
              className={`tab ${userType === 'tenant' ? 'active' : ''}`}
              onClick={() => setUserType('tenant')}
              type="button"
            >
              Je cherche un logement
            </button>
            <button
              className={`tab ${userType === 'owner' ? 'active' : ''}`}
              onClick={() => setUserType('owner')}
              type="button"
            >
              Je propose un logement
            </button>
          </div>
        )}

        {submitError && (
          <div className="error-message">{submitError}</div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Prénom</label>
                <div className="input-wrapper">
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Votre prénom"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={errors.firstName ? 'error' : ''}
                  />
                </div>
                {errors.firstName && <span className="field-error">{errors.firstName}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Nom</label>
                <div className="input-wrapper">
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Votre nom"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={errors.lastName ? 'error' : ''}
                  />
                </div>
                {errors.lastName && <span className="field-error">{errors.lastName}</span>}
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
            </div>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Votre mot de passe"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirmez votre mot de passe"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? 'error' : ''}
                  />
                </div>
                {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Téléphone (optionnel)</label>
                <div className="input-wrapper">
                  <FiPhone className="input-icon" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+216 XX XXX XXX"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </>
          )}

          {isLogin && (
            <div className="form-options">
              <Link to="/forgot-password" className="forgot-link">
                Mot de passe oublié ?
              </Link>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'Créer mon compte')}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Vous n'avez pas de compte ?" : 'Vous avez déjà un compte ?'}
            <button
              type="button"
              className="switch-btn"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "S'inscrire" : 'Se connecter'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
