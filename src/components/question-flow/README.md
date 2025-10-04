# Question Flow Components

This folder contains the modular components that make up the question flow feature. The original large `QuestionFlow` component has been broken down into smaller, more maintainable components.

## Component Structure

### Core Components

- **`question-flow.tsx`** - Main component that orchestrates all other components
- **`types.ts`** - Shared TypeScript interfaces and types

### UI Components

1. **`timer-bar.tsx`** - Timer display and action buttons (info modal, hint button)
2. **`question-card.tsx`** - Main question display with text, hint, answers, and desktop action buttons
3. **`answers-list.tsx`** - Answer options with radio buttons/checkboxes
4. **`explanation-card.tsx`** - Explanation shown after answer submission
5. **`action-buttons.tsx`** - Desktop action buttons integrated within question card
6. **`mobile-action-buttons.tsx`** - Mobile sticky action buttons at bottom of screen

### State Components

7. **`loading-state.tsx`** - Loading spinner while fetching questions
8. **`empty-state.tsx`** - No questions available state
9. **`cycle-completed.tsx`** - Completion screen with stats and new cycle option

### Helper Components

10. **`question-info-content.tsx`** - Question details shown in info modal/drawer

## Button Architecture

### Desktop Experience

- Action buttons are **integrated within the question card** (below the answers)
- No separate card wrapper - buttons appear directly in the question card with a border-top separator
- Prevents button flickering and provides a cohesive design

### Mobile Experience

- Action buttons are **sticky at the bottom** of the screen
- Always visible and easily accessible
- Includes safe area padding for devices with notches/home indicators

### Implementation Details

- `ActionButtons` component handles desktop rendering with `showDesktopOnly={true}` prop
- `MobileActionButtons` component handles mobile sticky positioning
- Both components use the same button logic but different layouts
- No conditional rendering in main component - each handles its own device detection

## Benefits of This Structure

1. **No Button Flickering** - Buttons are properly contained within their respective components
2. **Modular and Maintainable** - Each component has a single responsibility
3. **Consistent UX** - Desktop buttons in card, mobile buttons sticky at bottom
4. **Reusable Components** - Easy to test and maintain individually
5. **Type Safety** - Shared interfaces ensure consistency across components
6. **Performance** - Components only re-render when their props change

## Usage

```tsx
// Main component coordinates all sub-components
<QuestionCard
  // Includes desktop action buttons
  onSubmitAnswer={handleSubmitAnswer}
  onSkipQuestion={handleSkipQuestion}
  onNextQuestion={handleNextQuestion}
/>

<MobileActionButtons
  // Sticky mobile buttons
  selectedAnswers={selectedAnswers}
  onSubmitAnswer={handleSubmitAnswer}
  // ... other props
/>
```

- **Maintainability**: Each component has a single responsibility
- **Reusability**: Components can be reused in other parts of the app
- **Testing**: Easier to unit test individual components
- **Performance**: Smaller components can be optimized individually
- **Code Organization**: Clear separation of concerns

## Usage

All components are exported from `index.ts` for easy importing:

```tsx
import {
  QuestionFlowState,
  TimerBar,
  QuestionCard,
  // ... other components
} from "./question-flow";
```

## Props and Interfaces

Each component receives only the props it needs, following the principle of minimal prop drilling. The main state is managed in the parent `QuestionFlow` component and passed down as needed.
