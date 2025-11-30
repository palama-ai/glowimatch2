import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { supabase, quizService } from '../../lib/supabase';

const QuizHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuizHistory = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const { data: attempts, error } = await quizService.getQuizHistory(user.id);
        if (error) throw error;
        setQuizAttempts(attempts || []);
      } catch (error) {
        console.error('Error loading quiz history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuizHistory();
  }, [user, navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSkinTypeColor = (skinType) => {
    const colors = {
      oily: 'text-blue-600',
      dry: 'text-orange-600',
      sensitive: 'text-red-600',
      combination: 'text-purple-600',
      normal: 'text-green-600'
    };
    return colors[skinType] || 'text-foreground';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-5 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <Icon name="Loader2" size={32} className="animate-spin text-accent" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-5xl mx-auto px-5 lg:px-8 py-8 pb-12">
        {/* Page Header */}
        <div className="mb-8">
          <Icon name="History" size={40} className="mb-4 text-accent" />
          <h1 className="text-4xl font-bold text-foreground mb-2">Quiz History</h1>
          <p className="text-lg text-muted-foreground">
            Track your skin's progress and see how your results have changed over time.
          </p>
        </div>

        {/* Quiz Attempts List */}
        {quizAttempts.length === 0 ? (
          <div className="text-center py-16 bg-accent/5 border border-accent/10 rounded-xl">
            <Icon name="BookOpen" size={64} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-2xl font-semibold text-foreground mb-2">No Quiz Attempts Yet</h3>
            <p className="text-muted-foreground mb-2 max-w-md mx-auto">
              Start your first skin quiz to begin tracking your skin health journey.
            </p>
            <Button
              onClick={() => navigate('/interactive-skin-quiz')}
              iconName="ArrowRight"
              iconPosition="right"
              className="mt-4"
            >
              Take Your First Quiz
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Total Quizzes</div>
                <div className="text-3xl font-bold text-accent mt-1">{quizAttempts.length}</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Latest Result</div>
                <div className="text-lg font-semibold text-foreground mt-1 capitalize">
                  {quizAttempts[0]?.results?.skin_type || 'Unknown'} Skin
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Last Taken</div>
                <div className="text-sm font-medium text-foreground mt-1">
                  {formatDate(quizAttempts[0]?.attempt_date || quizAttempts[0]?.created_at)}
                </div>
              </div>
            </div>

            {/* Detailed Attempts */}
            {quizAttempts.map((attempt, index) => (
              <div
                key={attempt.id}
                className="bg-card border border-border rounded-lg hover:border-accent/50 transition-colors overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent font-semibold text-sm">
                          #{quizAttempts.length - index}
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">
                          {formatDate(attempt.attempt_date || attempt.created_at)}
                        </span>
                        {attempt.has_image_analysis && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Icon name="Image" size={12} className="mr-1" />
                            With Image
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2">
                          <div className={`text-2xl font-bold capitalize ${
                            getSkinTypeColor(attempt.results?.skin_type)
                          }`}>
                            {attempt.results?.skin_type || 'Unknown'} Skin
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {attempt.results?.concerns?.slice(0, 3).map((concern, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border"
                            >
                              {concern.replace(/_/g, ' ')}
                            </span>
                          ))}
                          {(attempt.results?.concerns?.length || 0) > 3 && (
                            <span className="text-xs text-muted-foreground pt-1">
                              +{(attempt.results?.concerns?.length || 0) - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Metrics */}
                    <div className="flex-shrink-0 md:w-64">
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {[
                          { label: 'Confidence', value: attempt.results?.confidence },
                          { label: 'Moisture', value: attempt.results?.moisture_score },
                          { label: 'Texture', value: attempt.results?.texture_score },
                          { label: 'Health', value: attempt.results?.overall_health }
                        ].map((metric, i) => (
                          <div key={i} className="text-center">
                            <div className="text-lg font-bold text-accent">
                              {metric.value ? `${metric.value}%` : 'N/A'}
                            </div>
                            <div className="text-xs text-muted-foreground">{metric.label}</div>
                          </div>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          localStorage.setItem('glowmatch-quiz-data', JSON.stringify(attempt.quiz_data));
                          localStorage.setItem('glowmatch-analysis', JSON.stringify(attempt.results));
                          navigate('/results-dashboard');
                        }}
                        iconName="Eye"
                        className="w-full"
                      >
                        View Full Results
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Take New Quiz CTA */}
        {quizAttempts.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-accent/10 to-secondary/10 border border-accent/20 rounded-lg p-6 text-center">
            <p className="text-muted-foreground mb-3">
              Ready for a fresh analysis? Your skin changes over time.
            </p>
            <Button
              onClick={() => navigate('/interactive-skin-quiz')}
              iconName="RotateCcw"
              iconPosition="left"
              className="mt-4"
            >
              Take Another Quiz
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuizHistory;