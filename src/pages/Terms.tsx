import { useState } from 'react';
import {
  ChevronDown,
  Shield,
  Lock,
  HelpCircle,
  Mail,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

export default function Terms() {
  const { t, language } = useTranslation();

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: t('faq1_question', 'terms'),
      answer: t('faq1_answer', 'terms'),
    },
    {
      question: t('faq2_question', 'terms'),
      answer: t('faq2_answer', 'terms'),
    },
    {
      question: t('faq3_question', 'terms'),
      answer: t('faq3_answer', 'terms'),
    },
    {
      question: t('faq4_question', 'terms'),
      answer: t('faq4_answer', 'terms'),
    },
    {
      question: t('faq5_question', 'terms'),
      answer: t('faq5_answer', 'terms'),
    },
    {
      question: t('faq6_question', 'terms'),
      answer: t('faq6_answer', 'terms'),
    },
  ];

  // Función para obtener la fecha de última actualización en el idioma correcto
  const getFormattedDate = (lang: string) => {
    return new Date().toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 md:flex-row">
      <div className="flex-1 overflow-y-auto p-8 pb-24 md:pb-8 relative">
        <div className="bg-white border-b border-slate-200 mb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              {t('header_title', 'terms')}
            </h1>
            <p className="text-lg text-slate-600">
              {t('header_subtitle', 'terms')}
            </p>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* FAQ Section */}
          <section id="faq" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <HelpCircle className="h-6 w-6 text-indigo-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                {t('faq_heading', 'terms')}
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-slate-200 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-medium text-slate-900">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-slate-400 transition-transform ${
                        openFaq === index ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-4 text-slate-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Support Section */}
          <section id="support" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Mail className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                {t('support_heading', 'terms')}
              </h2>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-8 space-y-6">
              <p className="text-slate-600 leading-relaxed">
                {t('support_intro', 'terms')}
              </p>

              <div className="space-y-4"></div>
            </div>
          </section>

          <section id="security" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-amber-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                {t('security_heading', 'terms')}
              </h2>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-8 space-y-6">
              <p className="text-slate-600 leading-relaxed">
                {t('security_intro', 'terms')}
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-slate-900 mb-1">
                      {t('non_sensitive_data_title', 'terms')}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {t('non_sensitive_data_description', 'terms')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-slate-900 mb-1">
                      {t('encryption_title', 'terms')}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {t('encryption_description', 'terms')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-slate-900 mb-1">
                      {t('no_advertising_title', 'terms')}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {t('no_advertising_description', 'terms')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-slate-900 mb-1">
                      {t('total_control_title', 'terms')}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {t('total_control_description', 'terms')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="privacy" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                {t('privacy_policy_heading', 'terms')}
              </h2>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-8 space-y-6">
              <p className="text-sm text-slate-500">
                {t('last_updated_prefix', 'terms')} {getFormattedDate(language)}
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {t('privacy_1_title', 'terms')}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {t('privacy_1_description', 'terms')}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {t('privacy_2_title', 'terms')}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {t('privacy_2_description', 'terms')}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {t('privacy_3_title', 'terms')}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {t('privacy_3_description', 'terms')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Terms & Conditions Section */}
          <section id="terms" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                {t('terms_conditions_heading', 'terms')}
              </h2>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-8 space-y-6">
              <p className="text-sm text-slate-500">
                {t('last_updated_prefix', 'terms')} {getFormattedDate(language)}
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {t('terms_1_title', 'terms')}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {t('terms_1_description', 'terms')}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {t('terms_2_title', 'terms')}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {t('terms_2_description', 'terms')}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {t('terms_3_title', 'terms')}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {t('terms_3_description', 'terms')}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {t('terms_4_title', 'terms')}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {t('terms_4_description', 'terms')}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {t('terms_5_title', 'terms')}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {t('terms_5_description', 'terms')}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
