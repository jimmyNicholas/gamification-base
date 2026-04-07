# Gamification in the Classroom

An interactive digital learning module exploring game-based learning theory through hands-on gamification experiences. Built with Next.js, React, and Tailwind CSS.

**Instructor:** Jimmy Nicholas

## Overview

This application is an educational experience that teaches the principles of gamification through interactive gameplay. Students explore the Caillois framework of game categories by actually playing games in each quadrant, then reflect on how these principles apply to classroom teaching.

## Features

### Interactive Game Experiences

- **Competition Game (🏆)** - Timed animal-matching challenge with leaderboard tracking
- **Chance Wheel (🎲)** - Spinning wheel with playing card selection and random outcomes
- **Roleplay/Mimicry (🎭)** - Character-based dialogue scenarios with decision points
- **Chaos Activity (💥)** - Answering questions in random and moving positions

### Gamification Framework

**Two-Axis Model:**
- **Horizontal Axis:** Agency ↔ Fate
- **Vertical Axis:** Self-Intact ↔ Self-Dissolved

**Four Quadrants (Caillois Framework):**
- **Q1 - Competition:** Agency + Self-Intact (quizzes, leaderboards, challenges)
- **Q2 - Roleplay:** Agency + Self-Dissolved (scenarios, character-based learning)
- **Q3 - Chance:** Fate + Self-Intact (random rewards, spinning wheels)
- **Q4 - Chaos:** Fate + Self-Dissolved (movement, unpredictable outcomes)

### Learning Activities

- **Recognition System** - "Match the Four" game connecting gameplay outcomes to theory
- **Flip Card Book** - Interactive cards with drag-and-drop activity categorization
- **Axis Diagnostic** - Quiz-based assessment of agency/fate and self concepts
- **Scenario Assessment** - Real-world teaching situations mapped to quadrants
- **Reflection Prompts** - Guided and free-text reflection on learning

### Technical Features

- **Phase Management** - Unlockable progression through course content
- **Keyboard Navigation** - Full keyboard accessibility (arrow keys, ENTER, SPACE)
- **Session Persistence** - User progress saved to sessionStorage
- **xAPI Tracking** - Ready for LMS/LRS integration
- **Responsive Design** - Mobile-first with desktop enhancements
- **Page Transitions** - Smooth fade animations between sections
- **Admin Panel** - Navigation dashboard and tracking overview

## Course Structure

1. **Intro** - Course overview and learning objectives
2. **Demo Outline** - Introduction to the four game activities
3. **Competition Activity** - Timed matching game
4. **Chance** - Spinning wheel with card selection
5. **Mimicry** - Roleplay scenario
6. **Chaos** - Chaos interaction with skill selection
7. **Recognition** - Match outcomes to game categories
8. **Recognition Categories** - Caillois theory explanation
9. **Recognition Reflection** - Guided reflection on gameplay
10. **Post-Recognition** - Flip cards and activity categorization
11. **Analysis/Book** - Agency and Self-axis quizzes
12. **Assessment** - Four real-world teaching scenarios
13. **Reflection** - Final free-text reflection
14. **References** - Credits and package information

## Tech Stack

- **Framework:** Next.js 16.2.1 (App Router)
- **UI Library:** React 19.2.4
- **Styling:** Tailwind CSS 4
- **Component Library:** Base UI 1.3.0
- **Icons:** Lucide React
- **Utilities:** clsx, class-variance-authority, tailwind-merge
- **Animation:** tw-animate-css
- **Language:** TypeScript

## Getting Started

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Project Structure

```
/app                    - Next.js App Router (page.tsx, layout.tsx)
/components             - Reusable components (23 files)
  ├── chance-wheel.tsx           - SVG spinning wheel
  ├── custom-chance-engine.tsx   - Full chance game flow
  ├── quadrant-axes-model-v2.tsx - Core 2×2 grid visualization
  ├── course-nav-panel.tsx       - Navigation with phase management
  └── ...
/sections               - Page content organized by course section
  ├── intro/            - Welcome and overview
  ├── demo/             - Four game activities
  ├── recog/            - Recognition and theory
  ├── analysis/         - Axis diagnostics
  ├── assessment/       - Scenario-based assessment
  └── reflection/       - Final reflection
/hooks                  - Custom React hooks
/lib                    - Utilities and tracking logic
/layouts                - Layout wrappers
/public                 - Static assets (images, SVGs)
```

## Key Components

### Game Components

- **ChanceWheel** - 4-quadrant spinning wheel with keyboard controls
- **CustomChanceEngine** - Multi-phase card selection and question flow
- **CustomTimedMatch** - Timed matching game with timer and leaderboard
- **QuadrantAxesModelV2** - Versatile 2×2 grid for multiple interaction modes

### Navigation & Layout

- **CourseNavPanel** - Side/top navigation with 8 main sections
- **PageTransitionWrapper** - Smooth fade transitions between pages
- **DemoStyleLayout** - Themed layouts for demo sections
- **TwoColumnActivityStageLayout** - Left/right column layouts

### Interactive Components

- **HotspotAxisQuiz** - Interactive axis selection quiz
- **HotspotQuadrantQuiz** - Quadrant-based multiple choice
- **FlipCardGrid** - Animated card flip grid
- **DiscreteAxisSlider** - 5-position axis slider
- **MatchAssignBoard** - Grid-based matching interface

### Accessibility

- **KeyboardHints** - Visual keyboard shortcut indicators
- **KeyboardKey** - Individual key label displays
- Full keyboard navigation support throughout

## Color Scheme

- **Q1 (Competition):** Amber
- **Q2 (Roleplay):** Violet
- **Q3 (Chance):** Emerald
- **Q4 (Chaos):** Pink

Section backgrounds use custom Tailwind color tokens with OKLCH color space.

## Data Persistence

User interactions and progress are tracked through `DemoMatchOutcomes`:

- Competition timing and replay count
- Chance question answers
- Roleplay character choices
- Chaos skill selections
- Recognition match accuracy
- Axis quiz responses
- Assessment scenario decisions
- Reflection text usage

All data persists to sessionStorage for the current session.

## Tracking & Analytics

The application includes xAPI (Experience API) tracking capabilities:

- Session management
- Phase progression tracking
- User interaction logging
- Ready for LRS (Learning Record Store) integration

See [lib/xapi-tracking.ts](lib/xapi-tracking.ts) for implementation details.

## Accessibility

- Full keyboard navigation (arrow keys, WASD, ENTER, SPACE)
- Visual keyboard hints throughout
- Skip-to-content link
- Focus ring indicators
- High contrast text
- Responsive touch targets

## Development Notes

- Uses Next.js App Router with TypeScript
- Custom Tailwind configuration with design tokens
- Component composition with Base UI primitives
- Session-based state management
- SVG-based custom graphics

## License

Private project for educational use.

## Credits

See the References section within the application for full credits and package acknowledgments.
