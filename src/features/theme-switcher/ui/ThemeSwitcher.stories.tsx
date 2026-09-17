import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ThemeSwitcher } from './ThemeSwitcher';

const meta: Meta<typeof ThemeSwitcher> = {
  title: 'Features/ThemeSwitcher',
  component: ThemeSwitcher,
};

export default meta;
type Story = StoryObj<typeof ThemeSwitcher>;

/** The attribute must match `colorSchemeSelector` in src/app/theme.ts. */
export const SwitchesToDarkTheme: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const root = canvasElement.ownerDocument.documentElement;

    await expect(root).not.toHaveAttribute('data-mui-color-scheme', 'dark');

    await userEvent.click(canvas.getByRole('button', { name: 'Тёмная тема' }));

    await waitFor(() => expect(root).toHaveAttribute('data-mui-color-scheme', 'dark'));
  },
};
