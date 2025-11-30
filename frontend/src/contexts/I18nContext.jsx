import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Navigation
    home: 'Home',
    about: 'About',
    blog: 'Blog',
    contact: 'Contact',
    skin_quiz: 'Skin Quiz',
    analysis: 'Analysis',
    plans: 'Plans',
    admin: 'Admin',
    sign_in: 'Sign In',
    sign_up: 'Sign Up',
    profile: 'Profile',
    quiz_history: 'Quiz History',
    notifications: 'Notifications',
    logout: 'Sign Out',

    // Home
    home_title: 'GlowMatch Personalized skincare with AI',
    home_sub: 'Take a short quiz and upload a photo to receive tailored skincare recommendations, routines, and product matches.',
    take_quiz: 'Take the Quiz',
    upload_photo: 'Upload a Photo',
    ai_driven: 'AI-driven Analysis',
    ai_driven_desc: 'We combine quiz answers with image-derived features to improve recommendations.',
    personalized_routines: 'Personalized Routines',
    routines_desc: 'Get a routine tailored to your skin type, sensitivity and goals.',
    easy_reports: 'Easy Reports',
    reports_desc: 'Download PDF reports of your results and recommended products.',
    from_blog: 'From our blog',
    quick_start: 'Quick Start',
    questions: 'Questions?',
    questions_sub: 'Reach out to our team or explore the blog for tips.',

    // About
    about_title: 'About GlowMatch',
    about_mission: 'Our Mission',
    about_privacy: 'Privacy First',
    about_mission_text: 'Make skincare accessible and less confusing by giving people personalized routines backed by simple AI and clear explanations.',
    about_privacy_text: 'Images and quiz responses are processed to generate recommendations and are not shared publicly. You control your data in your profile.',
    how_it_works: 'How it works',
    team: 'Team',
    blog_title: 'Blog',
    read_more: 'Read more →',

    // Contact
    contact_title: 'Contact Us',
    contact_sub: "Have questions or need help? Send us a message and we'll get back to you.",
    name: 'Name',
    email: 'Email',
    message: 'Message',
    send_message: 'Send Message',
    sending: 'Sending…',
    message_sent: 'Message sent.',
    message_sent_desc: 'We will respond to your email shortly.',
    message_failed: 'Failed to send message.',
    try_again: 'Please try again later.',

    // Auth
    sign_in_to_glowmatch: 'Sign in to GlowMatch',
    join_glowmatch: 'Join GlowMatch',
    welcome_back: 'Welcome back! Please sign in to your account',
    skincare_journey: 'Create your account and start your skincare journey',
    login_title: 'Sign In',
    signup_title: 'Sign Up',
    email_address: 'Email address',
    full_name: 'Full Name',
    password: 'Password',
    confirm_password: 'Confirm Password',
    referral_code_optional: 'Referral code (optional)',
    already_have_account: 'Already have an account?',
    no_account: "Don't have an account?",
    signing_in: 'Signing in...',
    creating_account: 'Creating account...',
    account_created: 'Account created successfully! Please check your email to verify your account.',
    passwords_not_match: 'Passwords do not match',
    password_min_length: 'Password must be at least 6 characters',

    // Profile
    profile_title: 'Profile',
    profile_settings: 'Profile Settings',
    sign_out: 'Sign Out',
    edit_profile: 'Edit Profile',
    save_changes: 'Save Changes',
    saving: 'Saving...',
    cancel: 'Cancel',
    full_name_label: 'Full Name',
    email_address_label: 'Email Address',
    profile_updated: 'Profile updated successfully!',
    referral_program: 'Referral Program',
    your_referral_code: 'Your referral code',
    copy_referral_link: 'Copy referral link',
    generate_code: 'Generate Code',
    generating: 'Generating...',
    referral_stats: 'Referral stats (last 15 days)',
    referral_total: 'Total',
    referral_recent: 'Recent',
    referral_slots: 'Remaining slots',
    referral_description: 'When someone signs up with your referral link you get +2 attempts and they receive +6 attempts (5 base +1 referral). Referrer grants capped at 10 per 15 days.',
    referral_copied: 'Referral link copied to clipboard',
    referral_generated: 'Referral link generated and copied to clipboard',
    referral_failed: 'Failed to generate referral code',
    referral_code: 'Referral Code',
    referral_link: 'Share this link to get bonus attempts',

    // Quiz
    complete_quiz: 'Complete Skin Quiz First',
    quiz_desc: 'To provide accurate analysis results, please complete our quick skin quiz first.',
    close: 'Close',
    attempts_left: 'Attempts left',
    start_quiz: 'Start Quiz',
    share_referral: 'Share your referral link to get more attempts',

    // Results
    results_title: 'Your Results',
    skin_type: 'Skin Type',
    concerns: 'Concerns',
    recommendations: 'Recommendations',
    routine: 'Your Routine',

    // Admin
    admin_dashboard: 'Admin Dashboard',
    users: 'Users',
    messages: 'Messages',
    sessions: 'Sessions',
    analytics: 'Analytics',
    total_users: 'Total Users',
    active_sessions: 'Active Sessions',
    messages_received: 'Messages Received',
    total_quizzes: 'Total Quizzes',

    // General
    loading: 'Loading…',
    no_data: 'No data found.',
    error: 'Error',
    success: 'Success',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    cancel: 'Cancel',
    search: 'Search',
  },
  fr: {
    // Navigation
    home: 'Accueil',
    about: 'À propos',
    blog: 'Blog',
    contact: 'Contact',
    skin_quiz: 'Quiz Peau',
    analysis: 'Analyse',
    plans: 'Plans',
    admin: 'Admin',
    sign_in: 'Connexion',
    sign_up: 'Inscription',
    profile: 'Profil',
    quiz_history: 'Historique Quiz',
    notifications: 'Notifications',
    logout: 'Déconnexion',

    // Home
    home_title: 'GlowMatch Soins de la peau personnalisés avec IA',
    home_sub: 'Passez un court quiz et téléchargez une photo pour recevoir des recommandations de soins personnalisées, des routines et des produits adaptés.',
    take_quiz: 'Faire le quiz',
    upload_photo: 'Télécharger une photo',
    ai_driven: 'Analyse alimentée par l\'IA',
    ai_driven_desc: 'Nous combinons les réponses du quiz avec les caractéristiques dérivées de l\'image pour améliorer les recommandations.',
    personalized_routines: 'Routines personnalisées',
    routines_desc: 'Obtenez une routine adaptée à votre type de peau, votre sensibilité et vos objectifs.',
    easy_reports: 'Rapports faciles',
    reports_desc: 'Téléchargez les rapports PDF de vos résultats et des produits recommandés.',
    from_blog: 'Du blog',
    quick_start: 'Démarrage rapide',
    questions: 'Des questions?',
    questions_sub: 'Contactez notre équipe ou explorez le blog pour des conseils.',

    // About
    about_title: 'À propos de GlowMatch',
    about_mission: 'Notre mission',
    about_privacy: 'Confidentialité d\'abord',
    about_mission_text: "Rendre les soins de la peau accessibles et moins déroutants en offrant des routines personnalisées soutenues par une IA simple et des explications claires.",
    about_privacy_text: "Les images et les réponses au quiz sont traitées pour générer des recommandations et ne sont pas partagées publiquement. Vous contrôlez vos données dans votre profil.",
    how_it_works: 'Comment ça marche',
    team: 'Équipe',
    blog_title: 'Blog',
    read_more: 'Lire la suite →',

    // Contact
    contact_title: 'Contactez-nous',
    contact_sub: "Des questions ? Envoyez-nous un message et nous vous répondrons.",
    name: 'Nom',
    email: 'Email',
    message: 'Message',
    send_message: 'Envoyer le message',
    sending: 'Envoi…',
    message_sent: 'Message envoyé.',
    message_sent_desc: 'Nous répondrons à votre email bientôt.',
    message_failed: 'Échec de l\'envoi du message.',
    try_again: 'Veuillez réessayer plus tard.',

    // Auth
    sign_in_to_glowmatch: 'Connectez-vous à GlowMatch',
    join_glowmatch: 'Rejoignez GlowMatch',
    welcome_back: 'Bienvenue! Veuillez vous connecter à votre compte',
    skincare_journey: 'Créez votre compte et commencez votre parcours de soins de la peau',
    login_title: 'Connexion',
    signup_title: 'Inscription',
    email_address: 'Adresse email',
    full_name: 'Nom complet',
    password: 'Mot de passe',
    confirm_password: 'Confirmer le mot de passe',
    referral_code_optional: 'Code de parrainage (facultatif)',
    already_have_account: 'Avez-vous déjà un compte?',
    no_account: 'Pas encore de compte?',
    signing_in: 'Connexion en cours...',
    creating_account: 'Création du compte...',
    account_created: 'Compte créé avec succès! Veuillez vérifier votre email pour confirmer votre compte.',
    passwords_not_match: 'Les mots de passe ne correspondent pas',
    password_min_length: 'Le mot de passe doit contenir au moins 6 caractères',

    // Profile
    profile_title: 'Profil',
    profile_settings: 'Paramètres du profil',
    sign_out: 'Déconnexion',
    edit_profile: 'Modifier le profil',
    save_changes: 'Enregistrer les modifications',
    saving: 'Enregistrement...',
    cancel: 'Annuler',
    full_name_label: 'Nom complet',
    email_address_label: 'Adresse email',
    profile_updated: 'Profil mis à jour avec succès!',
    referral_program: 'Programme de parrainage',
    your_referral_code: 'Votre code de parrainage',
    copy_referral_link: 'Copier le lien de parrainage',
    generate_code: 'Générer le code',
    generating: 'Génération...',
    referral_stats: 'Statistiques de parrainage (15 derniers jours)',
    referral_total: 'Total',
    referral_recent: 'Récent',
    referral_slots: 'Emplacements restants',
    referral_description: 'Lorsque quelqu\'un s\'inscrit avec votre lien de parrainage, vous obtenez +2 tentatives et ils reçoivent +6 tentatives (5 base +1 parrainage). Les subventions de parrain sont limitées à 10 par 15 jours.',
    referral_copied: 'Lien de parrainage copié dans le presse-papiers',
    referral_generated: 'Lien de parrainage généré et copié dans le presse-papiers',
    referral_failed: 'Échec de la génération du code de parrainage',
    referral_code: 'Code de parrainage',
    referral_link: 'Partagez ce lien pour obtenir des tentatives bonus',

    // Quiz
    complete_quiz: 'Complétez le Quiz Peau d\'abord',
    quiz_desc: 'Pour fournir des résultats d\'analyse précis, veuillez d\'abord répondre à notre quiz rapide.',
    close: 'Fermer',
    attempts_left: 'Tentatives restantes',
    start_quiz: 'Commencer le quiz',
    share_referral: 'Partagez votre lien de parrainage pour obtenir plus de tentatives',

    // Results
    results_title: 'Vos résultats',
    skin_type: 'Type de peau',
    concerns: 'Préoccupations',
    recommendations: 'Recommandations',
    routine: 'Votre routine',

    // Admin
    admin_dashboard: 'Tableau de bord Admin',
    users: 'Utilisateurs',
    messages: 'Messages',
    sessions: 'Sessions',
    analytics: 'Analytique',
    total_users: 'Utilisateurs totaux',
    active_sessions: 'Sessions actives',
    messages_received: 'Messages reçus',
    total_quizzes: 'Quiz totaux',

    // General
    loading: 'Chargement…',
    no_data: 'Aucune donnée trouvée.',
    error: 'Erreur',
    success: 'Succès',
    save: 'Enregistrer',
    delete: 'Supprimer',
    edit: 'Modifier',
    cancel: 'Annuler',
    search: 'Rechercher',
  },
  ar: {
    // Navigation
    home: 'الرئيسية',
    about: 'حول',
    blog: 'المدونة',
    contact: 'اتصل',
    skin_quiz: 'اختبار البشرة',
    analysis: 'التحليل',
    plans: 'الخطط',
    admin: 'إدارة',
    sign_in: 'تسجيل الدخول',
    sign_up: 'إنشاء حساب',
    profile: 'الملف الشخصي',
    quiz_history: 'سجل الاختبارات',
    notifications: 'الإشعارات',
    logout: 'تسجيل الخروج',

    // Home
    home_title: 'غلوم ماتش روتين عناية بالبشرة مخصص بالذكاء الاصطناعي',
    home_sub: 'أجب عن اختبار قصير وارفع صورة لتلقي توصيات منتجات وروتين مخصص لبشرتك.',
    take_quiz: 'ابدأ الاختبار',
    upload_photo: 'رفع صورة',
    ai_driven: 'تحليل بالذكاء الاصطناعي',
    ai_driven_desc: 'نجمع بين إجابات الاختبار والميزات المشتقة من الصورة لتحسين التوصيات.',
    personalized_routines: 'روتينات مخصصة',
    routines_desc: 'احصل على روتين مصمم لنوع بشرتك وحساسيتك وأهدافك.',
    easy_reports: 'تقارير سهلة',
    reports_desc: 'قم بتنزيل تقارير PDF لنتائجك والمنتجات الموصى بها.',
    from_blog: 'من المدونة',
    quick_start: 'ابدأ بسرعة',
    questions: 'لديك أسئلة؟',
    questions_sub: 'تواصل مع فريقنا أو اكتشف النصائح من المدونة.',

    // About
    about_title: 'حول غلوم ماتش',
    about_mission: 'مهمتنا',
    about_privacy: 'الخصوصية أولاً',
    about_mission_text: 'جعل العناية بالبشرة متاحة وأقل إرباكًا من خلال تقديم روتينات مخصصة مدعومة بذكاء اصطناعي بسيط وتفسيرات واضحة.',
    about_privacy_text: 'تُعالَج الصور وإجابات الاختبار لتوليد التوصيات ولا تُشارك علنًا. يمكنك التحكم في بياناتك من خلال صفحتك الشخصية.',
    how_it_works: 'كيف يعمل',
    team: 'الفريق',
    blog_title: 'المدونة',
    read_more: 'اقرأ المزيد ←',

    // Contact
    contact_title: 'اتصل بنا',
    contact_sub: 'هل لديك أسئلة أو تحتاج مساعدة؟ أرسل لنا رسالة وسنرد عليك.',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    message: 'الرسالة',
    send_message: 'إرسال الرسالة',
    sending: 'جاري الإرسال…',
    message_sent: 'تم إرسال الرسالة.',
    message_sent_desc: 'سنرد على بريدك الإلكتروني قريبًا.',
    message_failed: 'فشل إرسال الرسالة.',
    try_again: 'يرجى المحاولة مرة أخرى لاحقًا.',

    // Auth
    sign_in_to_glowmatch: 'تسجيل الدخول إلى GlowMatch',
    join_glowmatch: 'انضم إلى GlowMatch',
    welcome_back: 'أهلا وسهلا! يرجى تسجيل الدخول إلى حسابك',
    skincare_journey: 'أنشئ حسابك وابدأ رحلة العناية بالبشرة الخاصة بك',
    login_title: 'تسجيل الدخول',
    signup_title: 'إنشاء حساب',
    email_address: 'عنوان البريد الإلكتروني',
    full_name: 'الاسم الكامل',
    password: 'كلمة المرور',
    confirm_password: 'تأكيد كلمة المرور',
    referral_code_optional: 'رمز الإحالة (اختياري)',
    already_have_account: 'هل لديك حساب بالفعل؟',
    no_account: 'ليس لديك حساب؟',
    signing_in: 'جاري تسجيل الدخول...',
    creating_account: 'جاري إنشاء الحساب...',
    account_created: 'تم إنشاء الحساب بنجاح! يرجى فحص بريدك الإلكتروني للتحقق من حسابك.',
    passwords_not_match: 'كلمات المرور غير متطابقة',
    password_min_length: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',

    // Profile
    profile_title: 'الملف الشخصي',
    profile_settings: 'إعدادات الملف الشخصي',
    sign_out: 'تسجيل الخروج',
    edit_profile: 'تعديل الملف الشخصي',
    save_changes: 'حفظ التغييرات',
    saving: 'جاري الحفظ...',
    cancel: 'إلغاء',
    full_name_label: 'الاسم الكامل',
    email_address_label: 'عنوان البريد الإلكتروني',
    profile_updated: 'تم تحديث الملف الشخصي بنجاح!',
    referral_program: 'برنامج الإحالة',
    your_referral_code: 'رمز الإحالة الخاص بك',
    copy_referral_link: 'نسخ رابط الإحالة',
    generate_code: 'توليد رمز',
    generating: 'جاري التوليد...',
    referral_stats: 'إحصائيات الإحالة (آخر 15 يومًا)',
    referral_total: 'الإجمالي',
    referral_recent: 'مؤخر',
    referral_slots: 'الفتحات المتبقية',
    referral_description: 'عندما يسجل شخص ما باستخدام رابط الإحالة الخاص بك، تحصل على +2 محاولات ويحصلون على +6 محاولات (5 أساسية +1 إحالة). تقتصر منح الإحالة على 10 لكل 15 يومًا.',
    referral_copied: 'تم نسخ رابط الإحالة إلى الحافظة',
    referral_generated: 'تم إنشاء رابط الإحالة ونسخه إلى الحافظة',
    referral_failed: 'فشل إنشاء رمز الإحالة',
    referral_code: 'رمز الإحالة',
    referral_link: 'شارك هذا الرابط للحصول على محاولات إضافية',

    // Quiz
    complete_quiz: 'أكمل اختبار البشرة أولاً',
    quiz_desc: 'لتقديم نتائج تحليل دقيقة، يرجى إكمال اختبارنا السريع أولاً.',
    close: 'إغلاق',
    attempts_left: 'المحاولات المتبقية',
    start_quiz: 'ابدأ الاختبار',
    share_referral: 'شارك رابط الإحالة الخاص بك للحصول على المزيد من المحاولات',

    // Results
    results_title: 'نتائجك',
    skin_type: 'نوع البشرة',
    concerns: 'المخاوف',
    recommendations: 'التوصيات',
    routine: 'روتينك',

    // Admin
    admin_dashboard: 'لوحة تحكم الإدارة',
    users: 'المستخدمون',
    messages: 'الرسائل',
    sessions: 'الجلسات',
    analytics: 'التحليلات',
    total_users: 'إجمالي المستخدمين',
    active_sessions: 'الجلسات النشطة',
    messages_received: 'الرسائل المستلمة',
    total_quizzes: 'إجمالي الاختبارات',

    // General
    loading: 'جاري التحميل…',
    no_data: 'لم يتم العثور على بيانات.',
    error: 'خطأ',
    success: 'نجاح',
    save: 'حفظ',
    delete: 'حذف',
    edit: 'تعديل',
    cancel: 'إلغاء',
    search: 'بحث',
  }
};

const I18nContext = createContext({});

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
};

export const I18nProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');

  useEffect(() => {
    try {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      localStorage.setItem('lang', lang);
    } catch (e) {}
  }, [lang]);

  const t = (key) => {
    return (translations[lang] && translations[lang][key]) || translations['en'][key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export default I18nProvider;
