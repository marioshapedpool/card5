import {
  CreditCard,
  Calendar,
  BarChart3,
  Shield,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import Footer from '../components/Footer';
import { useTranslation } from '../i18n/useTranslation'; // Importamos nuestro hook

export default function Home() {
  const { t } = useTranslation(); // Usamos el hook de traducción

  // Array de características traducidas
  const features = [
    t('feature1', 'hero'),
    t('feature2', 'hero'),
    t('feature3', 'hero'),
    t('feature4', 'hero'),
  ];

  // Array de pasos de "How It Works" traducidos
  const howItWorksSteps = [
    {
      step: '01',
      title: t('step1_title', 'hero'),
      description: t('step1_description', 'hero'),
    },
    {
      step: '02',
      title: t('step2_title', 'hero'),
      description: t('step2_description', 'hero'),
    },
    {
      step: '03',
      title: t('step3_title', 'hero'),
      description: t('step3_description', 'hero'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                {t('hero_heading_part1', 'hero')}{' '}
                <span className="text-indigo-600">
                  {t('hero_heading_part2', 'hero')}
                </span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                {t('hero_description', 'hero')}
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                  <span className="text-slate-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm">
                {t('cta_get_started', 'hero')}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors">
                {t('cta_view_demo', 'hero')}
              </button>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Card Management */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-slate-900">
                  {t('card_management_title', 'hero')}
                </h3>
                <p className="text-sm text-slate-600">
                  {t('card_management_description', 'hero')}
                </p>
              </div>

              {/* Calendar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 hover:shadow-lg transition-shadow mt-8">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-900">
                  {t('smart_calendar_title', 'hero')}
                </h3>
                <p className="text-sm text-slate-600">
                  {t('smart_calendar_description', 'hero')}
                </p>
              </div>

              {/* Analytics */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-900">
                  {t('analytics_title', 'hero')}
                </h3>
                <p className="text-sm text-slate-600">
                  {t('analytics_description', 'hero')}
                </p>
              </div>

              {/* Security */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 hover:shadow-lg transition-shadow mt-8">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-slate-900">
                  {t('secure_private_title', 'hero')}
                </h3>
                <p className="text-sm text-slate-600">
                  {t('secure_private_description', 'hero')}
                </p>
              </div>
            </div>

            {/* Decorative blur elements */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-indigo-200 rounded-full blur-3xl opacity-20 -z-10"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-20 -z-10"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">
                100%
              </div>
              <div className="text-slate-600">
                {t('stats_free_start', 'hero')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">0</div>
              <div className="text-slate-600">
                {t('stats_sensitive_data', 'hero')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">∞</div>
              <div className="text-slate-600">
                {t('stats_cards_manage', 'hero')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            {t('how_it_works_heading', 'hero')}
          </h2>
          <p className="text-lg text-slate-600">
            {t('how_it_works_subheading', 'hero')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {howItWorksSteps.map((item, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4 h-full hover:shadow-lg transition-shadow">
                <div className="text-5xl font-bold text-indigo-100">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
              {index < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="h-6 w-6 text-slate-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Bottom Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t('cta_ready_heading', 'hero')}
          </h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
            {t('cta_ready_description', 'hero')}
          </p>
          <button className="px-8 py-4 bg-white hover:bg-slate-50 text-indigo-600 rounded-lg font-semibold transition-colors shadow-lg">
            {t('cta_ready_button', 'hero')}
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
