'use client';

import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useColorScheme } from '@mui/material/styles';

const OPTIONS = [
  { value: 'light', label: 'Светлая тема', icon: <LightModeIcon fontSize="small" /> },
  { value: 'system', label: 'Системная тема', icon: <BrightnessAutoIcon fontSize="small" /> },
  { value: 'dark', label: 'Тёмная тема', icon: <DarkModeIcon fontSize="small" /> },
] as const;

type Mode = (typeof OPTIONS)[number]['value'];

export function ThemeSwitcher() {
  const { mode, setMode } = useColorScheme();

  return (
    <ToggleButtonGroup
      size="small"
      exclusive
      value={mode ?? 'system'}
      onChange={(_event, value: Mode | null) => value && setMode(value)}
      aria-label="Тема оформления"
    >
      {OPTIONS.map((option) => (
        <ToggleButton
          key={option.value}
          value={option.value}
          aria-label={option.label}
          title={option.label}
        >
          {option.icon}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
