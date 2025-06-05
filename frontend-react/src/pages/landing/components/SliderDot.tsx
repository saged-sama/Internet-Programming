import React from 'react';
import themeClasses from '../../../lib/theme-utils';

interface SliderDotProps {
  active: boolean;
  onClick: () => void;
  ariaLabel: string;
}

/**
 * A single navigation dot for the ImageSlider. Uses theme spacing, color, and radius.
 */
const SliderDot: React.FC<SliderDotProps> = ({ active, onClick, ariaLabel }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`inline-block align-middle rounded-full border transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-ring/40
        ${active ? themeClasses.bgAccentYellow : themeClasses.bgPrimaryLight}
        border border-border
        w-4 h-4 m-0 p-0
      `}
    />
  );
};

export default SliderDot;
