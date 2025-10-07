import { Link } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import {
  LayoutDashboard,
  Crown,
  LogOut,
  Menu,
  X,
  Languages,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

type NavbarProps = {
  user: User | null;
  loading: boolean;
  signOut: () => void;
  isPremium: boolean;
};

export default function Navbar({
  user,
  loading,
  signOut,
  isPremium,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, language, changeLanguage } = useTranslation();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const toggleAppLanguage = () => {
    changeLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-700 transition-colors duration-200">
                <span className="text-white font-bold text-sm">C5</span>
              </div>
              <span className="text-xl font-semibold text-slate-900">
                Card5
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-4">
              {!loading && !user && (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200 font-medium text-sm"
                  >
                    {t('login', 'navbar')}
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm shadow-sm"
                  >
                    {t('create_account', 'navbar')}
                  </Link>
                </>
              )}

              {/* User Menu (Logged in) */}
              {!loading && user && (
                <>
                  {/* Dashboard Link */}
                  <Link
                    to="/dashboard"
                    className="flex items-center px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors duration-200 font-medium text-sm"
                  >
                    <LayoutDashboard size={18} className="mr-2" />
                    {t('dashboard', 'navbar')}
                  </Link>

                  {/* User Info & Logout */}
                  <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="text-right hidden lg:block">
                      <div className="text-xs text-slate-500">
                        {t('welcome', 'navbar')}
                      </div>
                      <div className="text-sm font-medium text-slate-900">
                        {user.email?.split('@')[0]}
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                      <span className="text-slate-700 text-sm font-medium">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <button
                      onClick={signOut}
                      className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-50 rounded-lg transition-colors duration-200"
                      title={t('close_session', 'navbar')}
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                </>
              )}

              {/* Language Toggle */}
              <button
                onClick={toggleAppLanguage}
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors duration-200"
                title={t('change_language', 'navbar')}
              >
                <Languages size={18} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleAppLanguage}
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors duration-200"
                title={t('change_language', 'navbar')}
              >
                <Languages size={18} />
              </button>
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200">
            <div className="px-4 py-4 space-y-2">
              {/* Not logged in - Mobile */}
              {!loading && !user && (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    className="block px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors duration-200 font-medium text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('login', 'navbar')}
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-3 bg-indigo-600 text-white rounded-lg transition-colors duration-200 font-medium text-center text-sm shadow-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('create_account', 'navbar')}
                  </Link>
                </div>
              )}

              {/* Logged in - Mobile */}
              {!loading && user && (
                <div className="space-y-3">
                  {/* User Info Card */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                      <span className="text-slate-700 font-medium">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {user.email?.split('@')[0]}
                      </div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                  </div>

                  {/* Premium Badge/Button */}
                  {!isPremium ? (
                    <button className="w-full px-4 py-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 rounded-lg font-medium transition-colors text-sm">
                      <Crown size={16} className="inline mr-2" />
                      {t('get_premium', 'navbar')}
                    </button>
                  ) : (
                    <div className="flex items-center justify-center px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <Crown size={16} className="text-emerald-600 mr-2" />
                      <span className="text-emerald-700 font-medium text-sm">
                        {t('premium_member', 'navbar')}
                      </span>
                    </div>
                  )}

                  {/* Dashboard Link */}
                  <Link
                    to="/dashboard"
                    className="flex items-center px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors duration-200 font-medium text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard size={18} className="mr-3" />
                    {t('dashboard', 'navbar')}
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={signOut}
                    className="flex items-center w-full px-4 py-3 text-slate-600 hover:text-red-600 hover:bg-slate-50 rounded-lg transition-colors duration-200 font-medium text-sm"
                  >
                    <LogOut size={18} className="mr-3" />
                    {t('logout', 'navbar')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
