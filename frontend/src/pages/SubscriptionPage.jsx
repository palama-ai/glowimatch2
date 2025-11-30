import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, subscriptionService } from '../lib/supabase';
import Header from '../components/ui/Header';
import Button from '../components/ui/Button';
import Icon from '../components/AppIcon';

const SubscriptionPage = () => {
  const { userProfile, subscription, user, isAdmin } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price');

      if (!error) setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [modalPlan, setModalPlan] = useState(null);
  const paymentMethods = ['stripe', 'paypal', 'payoneer'];

  const handleSelectPlan = async (plan) => {
    // Admin plan: only admins can see/activate it and it should activate immediately
    if (plan?.name === 'Admin Plan') {
      if (!isAdmin?.()) {
        alert('This plan is only available for admin accounts.');
        return;
      }
      setProcessingPlan(plan?.id);
      try {
        const userId = user?.id || userProfile?.id;
        if (!userId) throw new Error('Please sign in to activate the plan');
        const { data, error } = await subscriptionService.subscribeToPlan(userId, plan);
        if (error) throw error;
        window.location.reload();
      } catch (err) {
        console.error('Admin plan activation error:', err);
        // Surface detailed error to the user when available
        alert(err?.message || 'Failed to activate admin plan. Please try again or contact support.');
      } finally {
        setProcessingPlan(null);
      }
      return;
    }

    // Free plan: activate immediately without payment
    if (plan?.price === 0) {
      setProcessingPlan(plan?.id);
      try {
        const userId = user?.id || userProfile?.id;
        if (!userId) {
          alert('Please sign in to subscribe to a plan.');
          setProcessingPlan(null);
          return;
        }
        const { data, error } = await subscriptionService.subscribeToPlan(userId, plan);
        if (error) throw error;
        window.location.reload();
      } catch (err) {
        console.error('Free plan subscription error:', err);
        // show more helpful error to user when we have it
        alert(err?.message || 'Failed to subscribe. Please try again or contact support.');
      } finally {
        setProcessingPlan(null);
      }
      return;
    }

    // For paid plans open a nice modal with options
    setModalPlan(plan);
    setShowPaymentModal(true);
  };

  const getPlanIcon = (planType) => {
    const icons = {
      free: 'Gift',
      standard: 'Star',
      pro: 'Crown',
      plus: 'Zap'
    };
    return icons?.[planType] || 'Package';
  };

  const getPlanColor = (planType) => {
    const colors = {
      free: 'text-green-600 bg-green-50 border-green-200',
      standard: 'text-blue-600 bg-blue-50 border-blue-200',
      pro: 'text-purple-600 bg-purple-50 border-purple-200',
      plus: 'text-orange-600 bg-orange-50 border-orange-200'
    };
    return colors?.[planType] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <Icon name="Loader2" size={48} className="animate-spin text-accent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-6xl mx-auto px-5 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Choose Your Skincare Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get personalized skin analysis with our comprehensive quiz system. 
            Choose the plan that fits your skincare journey.
          </p>
        </div>

        {/* Current Subscription */}
        {subscription && (
          <div className="mb-8 p-6 bg-accent/10 border border-accent/20 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Current Plan</h3>
                <p className="text-accent font-medium capitalize">
                  {subscription?.subscription_plans?.name} - 
                  {subscription?.quiz_attempts_used}/{subscription?.quiz_attempts_limit} attempts used
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Expires</p>
                <p className="text-foreground font-medium">
                  {new Date(subscription?.current_period_end)?.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans?.map((plan) => {
            const isCurrentPlan = subscription?.subscription_plans?.id === plan?.id;
            const features = Array.isArray(plan?.features) ? plan?.features : JSON.parse(plan?.features || '[]');
            
            return (
              <div
                key={plan?.id}
                className={`relative bg-card rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg ${
                  isCurrentPlan 
                    ? 'border-accent bg-accent/5' :'border-border hover:border-accent/50'
                }`}
              >
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-accent text-white px-4 py-1 rounded-full text-sm font-medium">
                      Current Plan
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${getPlanColor(plan?.plan_type)}`}>
                    <Icon name={getPlanIcon(plan?.plan_type)} size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-card-foreground mb-2">
                    {plan?.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-card-foreground">
                      ${plan?.price}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {plan?.description}
                  </p>
                </div>
                <div className="mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">
                        ∞
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Unlimited Quiz Attempts
                      </div>
                    </div>
                  </div>
                  
                  <ul className="space-y-3">
                    {features?.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Icon name="Check" size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-card-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  className="w-full"
                  variant={isCurrentPlan ? 'outline' : 'default'}
                  disabled={isCurrentPlan || processingPlan === plan?.id}
                  onClick={() => handleSelectPlan(plan)}
                  iconName={
                    processingPlan === plan?.id
                      ? 'Loader2'
                      : isCurrentPlan
                      ? 'Check'
                      : plan?.price === 0
                      ? 'ArrowRight'
                      : 'CreditCard'
                  }
                  iconClassName={processingPlan === plan?.id ? 'animate-spin' : ''}
                >
                  {processingPlan === plan?.id
                    ? 'Processing...'
                    : isCurrentPlan
                    ? 'Current Plan'
                    : plan?.price === 0
                    ? 'Get Started'
                    : 'Subscribe Now'}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Payment Modal */}
        {showPaymentModal && modalPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowPaymentModal(false); setModalPlan(null); }} />
            <div className="relative bg-card rounded-xl p-6 w-full max-w-md z-10 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Choose payment method</h3>
              <p className="text-sm text-muted-foreground mb-4">{modalPlan.name} — ${modalPlan.price}/month</p>
              <div className="space-y-3 mb-4">
                {paymentMethods.map((m) => (
                  <button
                    key={m}
                    className="w-full text-left p-3 border rounded-lg hover:shadow-sm flex items-center space-x-3"
                    onClick={async () => {
                      setProcessingPlan(modalPlan.id);
                      try {
                        // Validate user authentication
                        const userId = user?.id || userProfile?.id;
                        if (!userId) {
                          throw new Error('Authentication required: Please sign in to subscribe to a plan.');
                        }

                        // Validate plan data
                        if (!modalPlan?.id || !modalPlan?.quiz_attempts) {
                          throw new Error('Invalid plan data: Please try selecting the plan again.');
                        }

                        // Attempt to create subscription
                        const { data, error } = await subscriptionService.subscribeToPlan(userId, modalPlan);
                        if (error) {
                          throw new Error(error.message || 'Subscription creation failed. Please try again.');
                        }

                        if (!data) {
                          throw new Error('No subscription data received. Please contact support.');
                        }

                        // Success - close modal and reload page
                        setShowPaymentModal(false);
                        setModalPlan(null);
                        window.location.reload();
                      } catch (err) {
                        console.error('Subscription error:', err);
                        // Show specific error message to user
                        alert(err.message || 'Failed to subscribe. Please try again or contact support.');
                        setProcessingPlan(null);
                        setShowPaymentModal(false);
                        setModalPlan(null);
                      }
                    }}
                  >
                    <div className="flex-1">
                      <div className="font-medium capitalize">{m}</div>
                      <div className="text-sm text-muted-foreground">Pay with {m}</div>
                    </div>
                    <div className="text-accent font-medium">Select</div>
                  </button>
                ))}
              </div>
              <div className="text-right">
                <Button variant="ghost" onClick={() => { setShowPaymentModal(false); setModalPlan(null); }}>Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Methods */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Accepted Payment Methods
          </h3>
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Icon name="CreditCard" size={24} />
              <span>Stripe</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Icon name="Wallet" size={24} />
              <span>PayPal</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Icon name="Building" size={24} />
              <span>Payoneer</span>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground text-center mb-8">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h4 className="font-semibold text-card-foreground mb-2">
                How many times can I take the quiz?
              </h4>
              <p className="text-muted-foreground">
                Each plan comes with a specific number of quiz attempts per month. 
                Free plan includes 5 attempts, while paid plans offer 25-80 attempts depending on your subscription.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
              <h4 className="font-semibold text-card-foreground mb-2">
                Can I cancel my subscription anytime?
              </h4>
              <p className="text-muted-foreground">
                Yes, you can cancel your subscription at any time. Your plan will remain active until the end of your current billing period.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
              <h4 className="font-semibold text-card-foreground mb-2">
                What payment methods do you accept?
              </h4>
              <p className="text-muted-foreground">
                We accept all major credit cards through Stripe, PayPal, and Payoneer for your convenience.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionPage;