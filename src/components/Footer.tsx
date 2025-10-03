import { Link } from 'react-router-dom';
import { CreditCard, Github, Twitter, Mail, Heart } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation'; // Importamos nuestro hook

export default function Footer() {
  const { t } = useTranslation(); // Usamos el hook de traducción

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-white">Card5</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t('tagline', 'footer')}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/someuser"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5 text-slate-400" />
              </a>
              <a
                href="https://x.com/someuser"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Twitter/X"
              >
                <Twitter className="h-5 w-5 text-slate-400" />
              </a>
              <a
                href="mailto:contact@card5.com"
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">
              {t('product_heading', 'footer')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/dashboard"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {t('dashboard_link', 'footer')}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {t('about_link', 'footer')}
                </Link>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {t('features_link', 'footer')}
                </a>
              </li>
              <li>
                <a
                  href="/terms#pricing"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {t('pricing_link', 'footer')}
                </a>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">
              {t('account_heading', 'footer')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/login"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {t('login_link', 'footer')}
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {t('signup_link', 'footer')}
                </Link>
              </li>
              <li>
                <a
                  href="#support"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {t('support_link', 'footer')}
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {t('faq_link', 'footer')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">
              {t('legal_heading', 'footer')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/terms#privacy"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {t('privacy_policy_link', 'footer')}
                </Link>
              </li>
              <li>
                <Link
                  to="/terms#terms"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {t('terms_conditions_link', 'footer')}
                </Link>
              </li>
              <li>
                <Link
                  to="/terms#faq"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {t('security_link', 'footer')}
                </Link>
              </li>
            </ul>
            <div className="mt-6 p-3 bg-slate-800 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('current_status_prefix', 'footer')}{' '}
                <span className="text-emerald-400 font-medium">
                  {t('current_status_free', 'footer')}
                </span>{' '}
                {t('current_status_suffix', 'footer')}{' '}
              </p>
              <span className="text-xs text-slate-400 leading-relaxed">
                Make this project keep running{' '}
                <a
                  className="text-emerald-400 font-medium"
                  href="Ko-fi.com/essmario"
                >
                  here
                </a>
              </span>
            </div>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} {t('copyright_text', 'footer')}
            </p>
            <p className="text-sm text-slate-400 flex items-center gap-1">
              {t('made_with_love', 'footer')}{' '}
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />{' '}
              {t('and_tailwind', 'footer')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
