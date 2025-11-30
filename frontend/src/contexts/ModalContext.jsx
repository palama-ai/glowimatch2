import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
};

export const ModalProvider = ({ children }) => {
  const [showAnalysisPrompt, setShowAnalysisPrompt] = useState(false);

  const openAnalysisPrompt = () => setShowAnalysisPrompt(true);
  const closeAnalysisPrompt = () => setShowAnalysisPrompt(false);

  return (
    <ModalContext.Provider value={{ showAnalysisPrompt, openAnalysisPrompt, closeAnalysisPrompt }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContext;
