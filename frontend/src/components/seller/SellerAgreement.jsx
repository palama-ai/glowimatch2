import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../components/AppIcon';

// Contract translations
const CONTRACT_TEXTS = {
    en: {
        title: 'AI Skin Analysis Platform Usage Agreement',
        between: 'Between:',
        party1: 'First Party: Platform Administration',
        party2: 'Second Party: The Seller',
        articles: [
            {
                title: 'Article 1: Subject of the Contract',
                content: 'This contract aims to regulate the display and marketing of skincare products by the Seller through the Platform, in exchange for a monthly subscription.'
            },
            {
                title: 'Article 2: Seller Status',
                content: `The Seller acknowledges that they are:
• A professional or legal trader
• Fully responsible for the products offered
• Guaranteeing the legality of products and their compliance with health standards`
            },
            {
                title: 'Article 3: Seller Obligations',
                content: `The Seller commits to:
• Providing accurate and correct information about products
• Not offering any product containing dangerous or prohibited substances
• Not making therapeutic or medical claims
• Respecting consumer protection laws
• Respecting non-misleading advertising conditions`
            },
            {
                title: 'Article 4: Liability',
                content: `The Seller is solely responsible for any:
• Damage
• Allergic reaction
• Side effect
• Consumer dispute

And releases the Platform from any prosecution or compensation.`
            },
            {
                title: 'Article 5: Indemnity Clause',
                content: `The Seller undertakes to compensate the Platform for:
• Any lawsuit
• Any fine
• Any material or moral damage

Resulting from their products or content.`
            },
            {
                title: 'Article 6: Platform Rights',
                content: `The Platform has the right to:
• Delete any product without prior notice
• Suspend or terminate the Seller's account
• Immediately terminate the contract in case of serious violation

Without any compensation.`
            },
            {
                title: 'Article 7: Subscription and Payment',
                content: `• Subscription is monthly
• Non-refundable
• Non-payment leads to account suspension`
            },
            {
                title: 'Article 8: Intellectual Property',
                content: `• Use of Platform name or logo is prohibited without written permission
• The Platform retains all intellectual and technical rights`
            },
            {
                title: 'Article 9: Applicable Law',
                content: 'This contract is subject to the laws in force in the Kingdom of Morocco, and any dispute will be submitted to the competent courts.'
            },
            {
                title: 'Article 10: Acceptance',
                content: `The Seller's registration and activation of their account constitutes:
An explicit and final acceptance of all terms of this contract.`
            }
        ],
        signatureLabel: 'Please sign below to confirm your agreement:',
        clearSignature: 'Clear Signature',
        agreeText: 'I agree to the Terms of Service',
        continueBtn: 'Continue to Dashboard',
        scrollHint: 'Please scroll down to read the entire agreement',
        signatureRequired: 'Signature is required',
        agreementRequired: 'You must agree to the Terms of Service'
    },
    ar: {
        title: 'اتفاقية استعمال منصة تحليل البشرة بالذكاء الاصطناعي',
        between: 'بين:',
        party1: 'الطرف الأول: إدارة المنصة',
        party2: 'الطرف الثاني: البائع (Seller)',
        articles: [
            {
                title: 'المادة 1: موضوع العقد',
                content: 'يهدف هذا العقد إلى تنظيم عرض وتسويق منتجات العناية بالبشرة من طرف البائع عبر المنصة، مقابل اشتراك شهري.'
            },
            {
                title: 'المادة 2: صفة البائع',
                content: `يقر البائع أنه:
• مهني أو تاجر قانوني
• يتحمل كامل المسؤولية عن المنتجات المعروضة
• يضمن قانونية المنتجات ومطابقتها للمعايير الصحية`
            },
            {
                title: 'المادة 3: التزامات البائع',
                content: `يلتزم البائع بما يلي:
• تقديم معلومات صحيحة ودقيقة عن المنتجات
• عدم عرض أي منتج يحتوي على مواد خطيرة أو محظورة
• عدم تقديم ادعاءات علاجية أو طبية
• احترام قوانين حماية المستهلك
• احترام شروط الإشهار غير المضلل`
            },
            {
                title: 'المادة 4: المسؤولية',
                content: `البائع مسؤول وحده عن أي:
• ضرر
• حساسية
• أثر جانبي
• نزاع مع المستهلك

ويعفي المنصة من أي متابعة أو تعويض.`
            },
            {
                title: 'المادة 5: شرط التعويض',
                content: `يتعهد البائع بتعويض المنصة عن:
• أي دعوى قضائية
• أي غرامة
• أي ضرر مادي أو معنوي

ناتج عن منتجاته أو محتواه.`
            },
            {
                title: 'المادة 6: صلاحيات المنصة',
                content: `للمنصة الحق في:
• حذف أي منتج دون إشعار مسبق
• تعليق أو إنهاء حساب البائع
• إنهاء العقد فورًا في حالة مخالفة جسيمة

دون أي تعويض.`
            },
            {
                title: 'المادة 7: الاشتراك والدفع',
                content: `• الاشتراك شهري
• غير قابل للاسترجاع
• عدم الأداء يؤدي إلى تعليق الحساب`
            },
            {
                title: 'المادة 8: الملكية الفكرية',
                content: `• يمنع استعمال اسم أو شعار المنصة دون إذن كتابي
• تحتفظ المنصة بكافة حقوقها الفكرية والتقنية`
            },
            {
                title: 'المادة 9: القانون الواجب التطبيق',
                content: 'يخضع هذا العقد للقوانين المعمول بها في المملكة المغربية، وأي نزاع يعرض على المحاكم المختصة.'
            },
            {
                title: 'المادة 10: القبول',
                content: `يعتبر تسجيل البائع وتفعيله لحسابه:
قبولًا صريحًا ونهائيًا لكافة بنود هذا العقد.`
            }
        ],
        signatureLabel: 'يرجى التوقيع أدناه لتأكيد موافقتك:',
        clearSignature: 'مسح التوقيع',
        agreeText: 'أوافق على شروط الخدمة',
        continueBtn: 'المتابعة إلى لوحة التحكم',
        scrollHint: 'يرجى التمرير لأسفل لقراءة الاتفاقية كاملة',
        signatureRequired: 'التوقيع مطلوب',
        agreementRequired: 'يجب الموافقة على شروط الخدمة'
    },
    fr: {
        title: 'Accord d\'utilisation de la plateforme d\'analyse de peau par IA',
        between: 'Entre:',
        party1: 'Première Partie: Administration de la Plateforme',
        party2: 'Deuxième Partie: Le Vendeur',
        articles: [
            {
                title: 'Article 1: Objet du Contrat',
                content: 'Ce contrat vise à réglementer l\'affichage et la commercialisation des produits de soins de la peau par le Vendeur via la Plateforme, en échange d\'un abonnement mensuel.'
            },
            {
                title: 'Article 2: Statut du Vendeur',
                content: `Le Vendeur reconnaît être:
• Un professionnel ou commerçant légal
• Entièrement responsable des produits proposés
• Garant de la légalité des produits et de leur conformité aux normes sanitaires`
            },
            {
                title: 'Article 3: Obligations du Vendeur',
                content: `Le Vendeur s'engage à:
• Fournir des informations exactes et correctes sur les produits
• Ne pas proposer de produit contenant des substances dangereuses ou interdites
• Ne pas faire de déclarations thérapeutiques ou médicales
• Respecter les lois de protection des consommateurs
• Respecter les conditions de publicité non trompeuse`
            },
            {
                title: 'Article 4: Responsabilité',
                content: `Le Vendeur est seul responsable de tout:
• Dommage
• Réaction allergique
• Effet secondaire
• Litige avec le consommateur

Et dégage la Plateforme de toute poursuite ou indemnisation.`
            },
            {
                title: 'Article 5: Clause d\'Indemnisation',
                content: `Le Vendeur s'engage à indemniser la Plateforme pour:
• Toute action en justice
• Toute amende
• Tout dommage matériel ou moral

Résultant de ses produits ou de son contenu.`
            },
            {
                title: 'Article 6: Droits de la Plateforme',
                content: `La Plateforme a le droit de:
• Supprimer tout produit sans préavis
• Suspendre ou résilier le compte du Vendeur
• Résilier immédiatement le contrat en cas de violation grave

Sans aucune compensation.`
            },
            {
                title: 'Article 7: Abonnement et Paiement',
                content: `• L'abonnement est mensuel
• Non remboursable
• Le non-paiement entraîne la suspension du compte`
            },
            {
                title: 'Article 8: Propriété Intellectuelle',
                content: `• L'utilisation du nom ou du logo de la Plateforme est interdite sans autorisation écrite
• La Plateforme conserve tous les droits intellectuels et techniques`
            },
            {
                title: 'Article 9: Droit Applicable',
                content: 'Ce contrat est soumis aux lois en vigueur au Royaume du Maroc, et tout litige sera soumis aux tribunaux compétents.'
            },
            {
                title: 'Article 10: Acceptation',
                content: `L'inscription et l'activation du compte du Vendeur constituent:
Une acceptation explicite et définitive de toutes les clauses de ce contrat.`
            }
        ],
        signatureLabel: 'Veuillez signer ci-dessous pour confirmer votre accord:',
        clearSignature: 'Effacer la Signature',
        agreeText: 'J\'accepte les Conditions de Service',
        continueBtn: 'Continuer vers le Tableau de Bord',
        scrollHint: 'Veuillez faire défiler vers le bas pour lire l\'intégralité de l\'accord',
        signatureRequired: 'La signature est requise',
        agreementRequired: 'Vous devez accepter les Conditions de Service'
    }
};

const SellerAgreement = ({ onAccept }) => {
    const [language, setLanguage] = useState('en');
    const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
    const [hasAgreed, setHasAgreed] = useState(false);
    const [signatureData, setSignatureData] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const contractRef = useRef(null);
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    const t = CONTRACT_TEXTS[language];
    const isRTL = language === 'ar';

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = canvas.offsetWidth * 2;
        canvas.height = canvas.offsetHeight * 2;
        canvas.style.width = `${canvas.offsetWidth}px`;
        canvas.style.height = `${canvas.offsetHeight}px`;

        const context = canvas.getContext('2d');
        context.scale(2, 2);
        context.lineCap = 'round';
        context.strokeStyle = '#1e293b';
        context.lineWidth = 2;
        contextRef.current = context;
    }, []);

    // Handle scroll detection
    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollTop + clientHeight >= scrollHeight - 50) {
            setHasScrolledToBottom(true);
        }
    };

    // Drawing functions
    const startDrawing = (e) => {
        if (!hasScrolledToBottom) return;
        const { offsetX, offsetY } = getCoordinates(e);
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = getCoordinates(e);
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    };

    const stopDrawing = () => {
        if (isDrawing) {
            contextRef.current.closePath();
            setIsDrawing(false);
            // Save signature data
            setSignatureData(canvasRef.current.toDataURL());
        }
    };

    const getCoordinates = (e) => {
        if (e.touches) {
            const rect = canvasRef.current.getBoundingClientRect();
            return {
                offsetX: e.touches[0].clientX - rect.left,
                offsetY: e.touches[0].clientY - rect.top
            };
        }
        return { offsetX: e.nativeEvent.offsetX, offsetY: e.nativeEvent.offsetY };
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        const context = contextRef.current;
        context.clearRect(0, 0, canvas.width, canvas.height);
        setSignatureData(null);
    };

    const handleSubmit = async () => {
        setError('');

        if (!signatureData) {
            setError(t.signatureRequired);
            return;
        }

        if (!hasAgreed) {
            setError(t.agreementRequired);
            return;
        }

        setSubmitting(true);
        try {
            await onAccept(signatureData);
        } catch (err) {
            setError(err.message || 'Failed to save agreement');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-3xl max-h-[95vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                                <Icon name="FileText" size={24} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Seller Agreement
                                </h1>
                                <p className="text-sm text-slate-500">Please read and sign to continue</p>
                            </div>
                        </div>

                        {/* Language Switcher */}
                        <div className="flex gap-2">
                            {['en', 'ar', 'fr'].map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setLanguage(lang)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${language === lang
                                            ? 'bg-pink-500 text-white'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    {lang === 'en' ? 'EN' : lang === 'ar' ? 'عربي' : 'FR'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {!hasScrolledToBottom && (
                        <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-700 dark:text-amber-400">
                            <Icon name="AlertTriangle" size={18} />
                            <span className="text-sm font-medium">{t.scrollHint}</span>
                        </div>
                    )}
                </div>

                {/* Contract Content */}
                <div
                    ref={contractRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-6"
                    dir={isRTL ? 'rtl' : 'ltr'}
                >
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <h2 className={`text-2xl font-bold text-slate-900 dark:text-white mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t.title}
                        </h2>

                        <div className={`mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl ${isRTL ? 'text-right' : 'text-left'}`}>
                            <p className="font-semibold text-slate-700 dark:text-slate-300">{t.between}</p>
                            <p className="text-slate-600 dark:text-slate-400">{t.party1}</p>
                            <p className="text-slate-600 dark:text-slate-400">{t.party2}</p>
                        </div>

                        {t.articles.map((article, index) => (
                            <div key={index} className={`mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                                <h3 className="text-lg font-bold text-pink-600 dark:text-pink-400 mb-2">
                                    {article.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                                    {article.content}
                                </p>
                            </div>
                        ))}

                        {/* Signature Section */}
                        <div className={`mt-8 pt-8 border-t-2 border-dashed border-slate-300 dark:border-slate-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                                {t.signatureLabel}
                            </h3>

                            <div className="relative">
                                <canvas
                                    ref={canvasRef}
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                    onTouchStart={startDrawing}
                                    onTouchMove={draw}
                                    onTouchEnd={stopDrawing}
                                    className={`w-full h-40 border-2 rounded-xl bg-white cursor-crosshair ${hasScrolledToBottom
                                            ? 'border-slate-300 dark:border-slate-600'
                                            : 'border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed'
                                        }`}
                                    style={{ touchAction: 'none' }}
                                />

                                {signatureData && (
                                    <button
                                        onClick={clearSignature}
                                        className="absolute top-2 right-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                    >
                                        {t.clearSignature}
                                    </button>
                                )}

                                {!hasScrolledToBottom && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80 dark:bg-slate-800/80 rounded-xl">
                                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                            {t.scrollHint}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Agreement Checkbox */}
                            <div className={`mt-6 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <input
                                    type="checkbox"
                                    id="agree-terms"
                                    checked={hasAgreed}
                                    onChange={(e) => setHasAgreed(e.target.checked)}
                                    disabled={!hasScrolledToBottom}
                                    className="w-5 h-5 accent-pink-500 rounded"
                                />
                                <label
                                    htmlFor="agree-terms"
                                    className={`text-sm font-medium text-slate-700 dark:text-slate-300 ${!hasScrolledToBottom ? 'opacity-50' : ''}`}
                                >
                                    {t.agreeText}
                                </label>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                                    <Icon name="AlertCircle" size={18} />
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={!hasScrolledToBottom || !signatureData || !hasAgreed || submitting}
                                className="mt-6 w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Icon name="Check" size={20} />
                                        {t.continueBtn}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerAgreement;
