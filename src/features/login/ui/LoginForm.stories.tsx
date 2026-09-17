import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HttpResponse, http } from 'msw';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { LoginForm } from './LoginForm';

const meta: Meta<typeof LoginForm> = {
  title: 'Features/LoginForm',
  component: LoginForm,
  args: { onSuccess: fn() },
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

export const SubmitsCredentials: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Email'), 'admin@example.com');
    await userEvent.type(canvas.getByLabelText('Пароль'), 'Admin123!');
    await userEvent.click(canvas.getByRole('button', { name: 'Войти' }));
    await waitFor(() => expect(args.onSuccess).toHaveBeenCalled());
  },
};

export const ShowsValidationErrors: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Email'), 'admin');
    await userEvent.type(canvas.getByLabelText('Пароль'), '123');
    await userEvent.click(canvas.getByRole('button', { name: 'Войти' }));

    await expect(await canvas.findByText('Введите корректный email')).toBeInTheDocument();
    await expect(await canvas.findByText('Минимум 8 символов')).toBeInTheDocument();
    await expect(args.onSuccess).not.toHaveBeenCalled();
  },
};

export const ShowsServerError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post('/api/auth/login', () =>
          HttpResponse.json({ error: 'Неверный email или пароль' }, { status: 401 }),
        ),
      ],
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Email'), 'admin@example.com');
    await userEvent.type(canvas.getByLabelText('Пароль'), 'WrongPass1');
    await userEvent.click(canvas.getByRole('button', { name: 'Войти' }));

    await expect(await canvas.findByText('Неверный email или пароль')).toBeInTheDocument();
    await expect(args.onSuccess).not.toHaveBeenCalled();
  },
};
