import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { mockTasks } from '@/testing/mocks';
import { TaskDialog } from './TaskDialog';

const meta: Meta<typeof TaskDialog> = {
  title: 'Widgets/TaskDialog',
  component: TaskDialog,
  args: { open: true, task: mockTasks[0]!, onClose: fn(), onSubmit: fn() },
};

export default meta;
type Story = StoryObj<typeof TaskDialog>;

export const EditsAndSaves: Story = {
  play: async ({ args, canvasElement }) => {
    const screen = within(canvasElement.ownerDocument.body);

    const title = screen.getByLabelText('Название');
    await expect(title).toHaveValue('Свёрстать главный экран');

    await userEvent.clear(title);
    await userEvent.type(title, 'Свёрстать главный экран v2');
    await userEvent.click(screen.getByRole('button', { name: 'Сохранить' }));

    await waitFor(() =>
      expect(args.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Свёрстать главный экран v2',
          status: 'in_progress',
          priority: 'high',
        }),
      ),
    );
  },
};

export const RejectsEmptyTitle: Story = {
  play: async ({ args, canvasElement }) => {
    const screen = within(canvasElement.ownerDocument.body);
    await userEvent.clear(screen.getByLabelText('Название'));
    await userEvent.click(screen.getByRole('button', { name: 'Сохранить' }));
    await expect(await screen.findByText('Введите название')).toBeInTheDocument();
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

export const CreatesNewTask: Story = { args: { task: null } };
