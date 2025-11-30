import React from 'react';

const QuizProgress = ({ currentQuestion, totalQuestions, completedQuestions }) => {
  const progressPercentage = (completedQuestions / totalQuestions) * 100;

  return (
    <div className="bg-card rounded-lg border border-border p-4 mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-semibold">{currentQuestion}</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-card-foreground">Question {currentQuestion}</h3>
            <p className="text-xs text-muted-foreground">of {totalQuestions}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm font-medium text-card-foreground">{Math.round(progressPercentage)}% Complete</div>
          <div className="text-xs text-muted-foreground">{completedQuestions} answered</div>
        </div>
      </div>

      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-accent to-secondary h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default QuizProgress;