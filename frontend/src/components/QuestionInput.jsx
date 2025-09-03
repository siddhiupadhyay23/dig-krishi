import React, { useState } from 'react';
import './QuestionInput.scss';

const QuestionInput = ({ onBack }) => {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      console.log('Question submitted:', question);
      // Handle question submission logic here
    }
  };

  return (
    <div className="question-input-container">
      <div className="question-input-content">
        <form onSubmit={handleSubmit} className="question-form">
          <div className="input-wrapper">
            <button 
              type="button" 
              className="add-button"
              onClick={() => setQuestion('')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="When should I invest?"
              className="question-input"
            />
            
            <button 
              type="submit" 
              className="submit-button"
              disabled={!question.trim()}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18" />
              </svg>
            </button>
          </div>
        </form>
        
        <button onClick={onBack} className="back-button">
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default QuestionInput;
