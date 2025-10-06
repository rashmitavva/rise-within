# Rise Within React Application

## Project Structure
```
rise-within-react/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── assessment/
│   │   │   ├── StartAssessment.jsx
│   │   │   ├── FeelingSelection.jsx
│   │   │   ├── AssessmentQuestions.jsx
│   │   │   └── AssessmentResults.jsx
│   │   ├── resources/
│   │   │   ├── CrisisResources.jsx
│   │   │   ├── TherapistFinder.jsx
│   │   │   └── SelfHelpResources.jsx
│   │   ├── journal/
│   │   │   ├── MoodTracker.jsx
│   │   │   ├── JournalEntry.jsx
│   │   │   └── JournalHistory.jsx
│   │   └── meditation/
│   │       ├── BreathingExercise.jsx
│   │       ├── MeditationTimer.jsx
│   │       └── GuidedMeditations.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Resources.jsx
│   │   ├── Journal.jsx
│   │   ├── Meditation.jsx
│   │   └── About.jsx
│   ├── hooks/
│   │   ├── useAssessment.js
│   │   ├── useJournal.js
│   │   └── useMeditation.js
│   ├── context/
│   │   └── AssessmentContext.jsx
│   ├── utils/
│   │   ├── scoring.js
│   │   └── storage.js
│   ├── assets/
│   │   └── images/
│   ├── styles/
│   │   ├── variables.css
│   │   └── components/
│   ├── App.jsx
│   └── main.jsx
├── public/
├── package.json
└── vite.config.js
```

## Dependencies
```json
{
  "dependencies": {
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "@mui/material": "^5.13.0",
    "react": "^18.2.0",
    "react-router-dom": "^6.11.0",
    "react-chartjs-2": "^5.0.0",
    "chart.js": "^4.3.0",
    "framer-motion": "^10.12.0"
  }
}
```

## Key Features

1. Modern React Patterns
   - Functional Components
   - React Hooks
   - Context API for state management
   - Custom hooks for reusable logic

2. Routing
   - React Router v6
   - Protected routes
   - Nested routes for assessment flow

3. UI Components
   - Material-UI components
   - Responsive design
   - Animations with Framer Motion

4. State Management
   - React Context for assessment state
   - Local Storage integration
   - Form state management

5. Data Visualization
   - Chart.js for mood tracking
   - Interactive visualizations

## Example Component: AssessmentFlow

```jsx
// src/components/assessment/AssessmentFlow.jsx
import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AssessmentContext } from '../../context/AssessmentContext';
import FeelingSelection from './FeelingSelection';
import AssessmentQuestions from './AssessmentQuestions';
import AssessmentResults from './AssessmentResults';

export const AssessmentFlow = () => {
  const [step, setStep] = useState(1);
  const { assessmentData, updateAssessment } = useContext(AssessmentContext);

  const handleFeelingSelect = (feeling) => {
    updateAssessment({ feeling });
    setStep(2);
  };

  const handleQuestionsSubmit = (answers) => {
    updateAssessment({ ...answers });
    setStep(3);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {step === 1 && (
          <FeelingSelection onSelect={handleFeelingSelect} />
        )}
        {step === 2 && (
          <AssessmentQuestions 
            onSubmit={handleQuestionsSubmit}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <AssessmentResults 
            results={assessmentData}
            onRestart={() => setStep(1)}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};
```

## Setup Instructions

1. Install Node.js
2. Clone the repository
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## Key Improvements over HTML Version

1. Component Reusability
   - Modular components
   - Shared UI elements
   - Consistent styling

2. Better State Management
   - Centralized assessment state
   - Persistent storage
   - Form validation

3. Enhanced User Experience
   - Smooth transitions
   - Loading states
   - Error handling
   - Offline support

4. Performance
   - Code splitting
   - Lazy loading
   - Optimized assets

5. Development Experience
   - Hot module replacement
   - Developer tools
   - Type checking
   - Better debugging

Once you have Node.js installed, I can help you set up the actual React project and implement these components.