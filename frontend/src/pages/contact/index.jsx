import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import { useI18n } from '../../contexts/I18nContext';
import Icon from '../../components/AppIcon';
import { GRADIENTS } from '../../utils/imageConstants';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:4000/api';

const Contact = () => {
  const [status, setStatus] = useState(null);
  const { t } = useI18n();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    const form = new FormData(e.target);
    const payload = { name: form.get('name'), email: form.get('email'), message: form.get('message') };
    try {
      const r = await fetch(`${API_BASE}/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!r.ok) throw new Error('submit failed');
      setStatus('sent');
    } catch (err) {
      console.error('Contact submit failed', err);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-20 px-5 lg:px-8">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-block px-4 py-2 bg-accent/20 border border-accent/40 rounded-full mb-4">
            <span className="text-accent text-sm font-semibold">Get in Touch</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">{t('contact_title')}</h1>
          <p className="text-xl text-muted-foreground">{t('contact_sub')}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto mb-16">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 hover:border-accent transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Icon name="Mail" size={24} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold text-foreground">support@glowmatch.com</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:border-accent transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Icon name="MessageSquare" size={24} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Live Chat</p>
                  <p className="font-semibold text-foreground">Available 24/7</p>
                </div>
              </div>
            </div>

            <div className="bg-accent/5 border border-accent/20 rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Icon name="Clock" size={20} className="text-accent" />
                Response Time
              </h3>
              <p className="text-sm text-muted-foreground">We typically respond within 24 hours</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl p-8 lg:p-12">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">{t('name')}</label>
                  <input 
                    name="name" 
                    type="text" 
                    required 
                    placeholder="Your full name"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">{t('email')}</label>
                  <input 
                    name="email" 
                    type="email" 
                    required 
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">{t('message')}</label>
                  <textarea 
                    name="message" 
                    required 
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none h-40"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={status === 'sending'}
                  className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-pink-500/40 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Icon name={status === 'sending' ? 'Loader2' : 'Send'} size={20} className={status === 'sending' ? 'animate-spin' : ''} />
                  {status === 'sending' ? t('sending') : t('send_message')}
                </button>
              </form>

              {/* Status Messages */}
              {status === 'sent' && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="Check" size={24} className="text-green-600 dark:text-green-400" />
                    <div>
                      <strong className="text-green-600 dark:text-green-400 block">{t('message_sent')}</strong>
                      <p className="text-sm text-green-600/70 dark:text-green-400/70">{t('message_sent_desc')}</p>
                    </div>
                  </div>
                </div>
              )}
              {status === 'error' && (
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="AlertCircle" size={24} className="text-red-600 dark:text-red-400" />
                    <div>
                      <strong className="text-red-600 dark:text-red-400 block">{t('message_failed')}</strong>
                      <p className="text-sm text-red-600/70 dark:text-red-400/70">{t('try_again')}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto bg-accent/5 border border-accent/20 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <details className="group border-b border-border pb-6">
              <summary className="flex items-center justify-between cursor-pointer">
                <span className="font-semibold text-foreground text-lg">How long does a skin analysis take?</span>
                <Icon name="ChevronDown" size={20} className="text-muted-foreground group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-muted-foreground mt-4 leading-relaxed">Our skin quiz takes about 2-3 minutes to complete. If you upload a photo for image analysis, results are generated within seconds using our AI technology.</p>
            </details>
            <details className="group border-b border-border pb-6">
              <summary className="flex items-center justify-between cursor-pointer">
                <span className="font-semibold text-foreground text-lg">Is my data safe and private?</span>
                <Icon name="ChevronDown" size={20} className="text-muted-foreground group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-muted-foreground mt-4 leading-relaxed">Yes! Your data is encrypted end-to-end and we comply with GDPR, CCPA, and other privacy regulations. We never share your data with third parties without consent.</p>
            </details>
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer">
                <span className="font-semibold text-foreground text-lg">What devices do you support?</span>
                <Icon name="ChevronDown" size={20} className="text-muted-foreground group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-muted-foreground mt-4 leading-relaxed">GlowMatch works on all devices - desktop, tablet, and mobile. Our responsive design ensures a great experience across all screen sizes.</p>
            </details>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contact;
