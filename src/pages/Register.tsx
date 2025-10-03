import { useState } from 'react';
import supabase from '../utils/supabase';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n/useTranslation';
import clsx from 'clsx';
import { Mail, Lock, Loader2, UserPlus, Chrome } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (password !== passwordConfirm) {
      setErrorMsg(t('register.passwordsDoNotMatch', 'auth'));
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // emailRedirectTo: `${window.location.origin}/confirm`,
      },
    });
    console.log(data);
    setLoading(false);
    if (error) {
      console.error(error);
      setErrorMsg(error.message);
      return;
    }
    alert(t('register.accountCreatedConfirmation', 'auth'));
    navigate('/login');
  };

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    if (error) {
      console.error(error);
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="mb-8 text-center text-3xl font-semibold tracking-tight text-slate-900">
          {t('register.title', 'auth')}
        </h2>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              {t('register.emailLabel', 'auth')}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-11 pr-4 text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder={t('register.passwordPlaceholder', 'auth')}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              {t('register.passwordLabel', 'auth')}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-11 pr-4 text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="passwordConfirm"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              {t('register.confirmPasswordLabel', 'auth')}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                id="passwordConfirm"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-11 pr-4 text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="••••••••"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3">
              <p className="text-sm text-red-800">{errorMsg}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={clsx(
              'group relative flex w-full justify-center rounded-lg border border-transparent py-2.5 px-4 text-sm font-medium text-white shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
              loading
                ? 'cursor-not-allowed bg-indigo-400'
                : 'bg-indigo-600 hover:bg-indigo-700'
            )}
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <UserPlus className="mr-2 h-5 w-5 group-hover:text-white" />
            )}
            {loading
              ? t('register.creatingAccount', 'auth')
              : t('register.registerButton', 'auth')}
          </button>
        </form>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-slate-500">
              {t('register.orSeparator', 'auth')}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleGoogle}
            disabled={loading}
            className={clsx(
              'group relative flex w-full justify-center rounded-lg border border-slate-300 bg-white py-2.5 px-4 text-sm font-medium text-slate-700 shadow-sm transition-colors duration-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
              loading && 'cursor-not-allowed opacity-70'
            )}
          >
            <Chrome className="mr-2 h-5 w-5 text-slate-700" />
            {t('register.registerWithGoogle', 'auth')}
          </button>
        </div>
      </div>
    </div>
  );
}
