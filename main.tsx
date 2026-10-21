import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'motion/react';
import Home from './app/page';
import '@fontsource-variable/manrope';
import './app/experience.css';
createRoot(document.getElementById('root')!).render(<MotionConfig reducedMotion="user"><Home /></MotionConfig>);
