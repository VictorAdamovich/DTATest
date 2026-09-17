import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { ListFormDialog } from './ListFormDialog';

const meta: Meta<typeof ListFormDialog> = {
  title: 'Features/ListFormDialog',
  component: ListFormDialog,
  args: {
    open: true,
    title: 'Новый список',
    submitLabel: 'Создать',
    onClose: fn(),
    onSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ListFormDialog>;

export const ValidatesAndSubmits: Story = {
  play: async ({ args, canvasElement }) => {
    // MUI dialogs render in a portal outside the canvas.
    const screen = within(canvasElement.ownerDocument.body);

    await userEvent.click(screen.getByRole('button', { name: 'Создать' }));
    await expect(await screen.findByText('Введите название')).toBeInTheDocument();
    await expect(args.onSubmit).not.toHaveBeenCalled();

    await userEvent.type(screen.getByLabelText('Название списка'), 'Ремонт кухни');
    await userEvent.click(screen.getByRole('button', { name: 'Создать' }));
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledWith('Ремонт кухни'));
  },
};
