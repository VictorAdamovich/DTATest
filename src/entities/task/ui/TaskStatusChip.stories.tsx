import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { TaskStatusChip } from './TaskStatusChip';

const meta: Meta<typeof TaskStatusChip> = {
  title: 'Entities/TaskStatusChip',
  component: TaskStatusChip,
};

export default meta;
type Story = StoryObj<typeof TaskStatusChip>;

export const InProgress: Story = {
  args: { status: 'in_progress' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('В работе')).toBeInTheDocument();
  },
};

export const Done: Story = { args: { status: 'done' } };
export const New: Story = { args: { status: 'new' } };
