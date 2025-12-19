import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { quizService } from '../../lib/supabase';

const QuizHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

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
    return colors[skinType?.toLowerCase()] || 'text-foreground';
  };

  // Extract metrics from results - handle different data structures
  const getMetrics = (results) => {
    if (!results) return { confidence: null, moisture: null, texture: null, health: null };

    // Try different possible field names
    const confidence = results.confidence || results.confidenceScore || results.overall_confidence;
    const moisture = results.moisture_score || results.moistureScore || results.moisture || results.hydration;
    const texture = results.texture_score || results.textureScore || results.texture;
    const health = results.overall_health || results.overallHealth || results.skinHealth || results.health_score;

    return { confidence, moisture, texture, health };
  };

  // Get skin type from results
  const getSkinType = (results) => {
    if (!results) return 'Unknown';
    return results.skin_type || results.skinType || results.type || 'Unknown';
  };

  // Get concerns from results
  const getConcerns = (results) => {
    if (!results) return [];
    return results.concerns || results.skinConcerns || [];
  };

  // Delete single quiz attempt
  const handleDeleteAttempt = async (attemptId) => {
    if (!confirm('Are you sure you want to delete this quiz result?')) return;

    setDeleting(attemptId);
    try {
      const { success, error } = await quizService.deleteQuizAttempt(attemptId);
      if (success) {
        setQuizAttempts(prev => prev.filter(a => a.id !== attemptId));
      } else {
        alert('Failed to delete quiz result');
      }
    } catch (error) {
      console.error('Error deleting attempt:', error);
      alert('Failed to delete quiz result');
    } finally {
      setDeleting(null);
    }
  };

  // Delete all quiz history
  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete ALL quiz history? This cannot be undone.')) return;

    setDeleting('all');
    try {
      const { success, error } = await quizService.deleteAllQuizHistory(user.id);
      if (success) {
        setQuizAttempts([]);
      } else {
        alert('Failed to delete quiz history');
      }
    } catch (error) {
      console.error('Error deleting all history:', error);
      alert('Failed to delete quiz history');
    } finally {
      setDeleting(null);
    }
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
        <div className="flex items-start justify-between mb-8">
          <div>
            <Icon name="History" size={40} className="mb-4 text-accent" />
            <h1 className="text-4xl font-bold text-foreground mb-2">Quiz History</h1>
            <p className="text-lg text-muted-foreground">
              Track your skin's progress and see how your results have changed over time.
            </p>
          </div>
          {quizAttempts.length > 0 && (
            <button
              onClick={handleDeleteAll}
              disabled={deleting === 'all'}
              className="flex items-center gap-2 px-4 py-2 text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/10 transition-colors disabled:opacity-50"
            >
              <Icon name="Trash2" size={16} />
              {deleting === 'all' ? 'Deleting...' : 'Delete All'}
            </button>
          )}
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
                  {getSkinType(quizAttempts[0]?.results)} Skin
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
            {quizAttempts.map((attempt, index) => {
              const metrics = getMetrics(attempt.results);
              const skinType = getSkinType(attempt.results);
              const concerns = getConcerns(attempt.results);

              return (
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
                            <div className={`text-2xl font-bold capitalize ${getSkinTypeColor(skinType)}`}>
                              {skinType} Skin
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {concerns.slice(0, 3).map((concern, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border"
                              >
                                {String(concern).replace(/_/g, ' ')}
                              </span>
                            ))}
                            {concerns.length > 3 && (
                              <span className="text-xs text-muted-foreground pt-1">
                                +{concerns.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Metrics */}
                      <div className="flex-shrink-0 md:w-64">
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {[
                            { label: 'Confidence', value: metrics.confidence },
                            { label: 'Moisture', value: metrics.moisture },
                            { label: 'Texture', value: metrics.texture },
                            { label: 'Health', value: metrics.health }
                          ].map((metric, i) => (
                            <div key={i} className="text-center">
                              <div className="text-lg font-bold text-accent">
                                {metric.value ? `${Math.round(metric.value)}%` : '—'}
                              </div>
                              <div className="text-xs text-muted-foreground">{metric.label}</div>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              localStorage.setItem('glowmatch-quiz-data', JSON.stringify(attempt.quiz_data));
                              localStorage.setItem('glowmatch-analysis', JSON.stringify(attempt.results));
                              navigate('/results-dashboard');
                            }}
                            iconName="Eye"
                            className="flex-1"
                          >
                            View Results
                          </Button>
                          <button
                            onClick={() => handleDeleteAttempt(attempt.id)}
                            disabled={deleting === attempt.id}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {deleting === attempt.id ? (
                              <Icon name="Loader2" size={16} className="animate-spin" />
                            ) : (
                              <Icon name="Trash2" size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
