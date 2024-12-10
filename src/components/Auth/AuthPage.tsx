import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Loader, LogIn, UserPlus, AlertCircle, Eye, EyeOff, Info } from 'lucide-react';
import { signIn, signUp } from '../../services/auth.service';
import { UserProfileFormData } from '../../types/user';

const SECRET_CODE = 'PF2025RS';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secretCode, setSecretCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formData, setFormData] = useState<UserProfileFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    displayName: '',
    dateOfBirth: '',
    phoneNumber: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: ''
    },
    experience: 'beginner',
    interests: []
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(formData.email, formData.password);
      navigate('/profile');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Vérification de l'âge
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (age < 18 || (age === 18 && monthDiff < 0)) {
        setError('Vous devez avoir au moins 18 ans pour utiliser cette application.');
        return;
      }
    } else {
      setError('Veuillez indiquer votre date de naissance.');
      return;
    }

    if (secretCode !== SECRET_CODE) {
      setError('Code secret invalide. Veuillez vérifier votre code.');
      return;
    }

    if (formData.password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, formData);
      navigate('/profile');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            {isLogin ? 'Connexion' : 'Inscription'}
          </h2>
          <p className="mt-2 text-purple-200/60">
            {isLogin 
              ? 'Connectez-vous pour accéder à votre espace'
              : 'Créez votre compte pour commencer'
            }
          </p>
        </div>

        {!isLogin && (
          <div className="bg-purple-500/10 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 mt-0.5 text-purple-300" />
              <p className="text-sm text-purple-200/80">
                Cette application est réservée aux personnes majeures (18 ans et plus). 
                Une vérification de l'âge sera effectuée lors de l'inscription.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white/10 rounded-xl p-8 backdrop-blur-lg">
          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-6">
            {!isLogin && (
              <>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-4 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
                      required
                    />
                    <p className="mt-1 text-xs text-purple-200/60">
                      Votre prénom sera utilisé pour personnaliser votre expérience
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-4 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
                      required
                    />
                    <p className="mt-1 text-xs text-purple-200/60">
                      Votre nom de famille restera confidentiel
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nom d'affichage
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={e => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
                  />
                  <p className="mt-1 text-xs text-purple-200/60">
                    Ce nom sera visible par les autres utilisateurs
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={e => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
                    required
                  />
                  <p className="mt-1 text-xs text-purple-200/60">
                    Vous devez avoir au moins 18 ans pour utiliser l'application
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={e => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
                  />
                  <p className="mt-1 text-xs text-purple-200/60">
                    Utilisé uniquement pour la sécurité de votre compte
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Adresse</h3>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Rue
                    </label>
                    <input
                      type="text"
                      value={formData.address.street}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        address: { ...prev.address, street: e.target.value }
                      }))}
                      className="w-full px-4 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Code postal
                      </label>
                      <input
                        type="text"
                        value={formData.address.postalCode}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          address: { ...prev.address, postalCode: e.target.value }
                        }))}
                        className="w-full px-4 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Ville
                      </label>
                      <input
                        type="text"
                        value={formData.address.city}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          address: { ...prev.address, city: e.target.value }
                        }))}
                        className="w-full px-4 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Pays
                    </label>
                    <input
                      type="text"
                      value={formData.address.country}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        address: { ...prev.address, country: e.target.value }
                      }))}
                      className="w-full px-4 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Code secret
                  </label>
                  <input
                    type="text"
                    value={secretCode}
                    onChange={e => setSecretCode(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
                    required
                    placeholder="Entrez le code secret fourni"
                  />
                  <p className="mt-1 text-xs text-purple-200/60">
                    Code requis pour accéder à l'application
                  </p>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
                required
              />
              <p className="mt-1 text-xs text-purple-200/60">
                Utilisé pour la connexion et les communications importantes
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/5 border border-purple-300/20 rounded-lg pr-10"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300/60 hover:text-purple-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-purple-200/60">
                Minimum 8 caractères
              </p>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-purple-300/20 rounded-lg pr-10"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300/60 hover:text-purple-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-purple-200/60">
                  Doit correspondre au mot de passe saisi ci-dessus
                </p>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-500/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-300" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : isLogin ? (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Se connecter</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>S'inscrire</span>
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-purple-200/60 hover:text-purple-200 transition-colors"
            >
              {isLogin ? (
                "Pas encore de compte ? S'inscrire"
              ) : (
                "Déjà un compte ? Se connecter"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;