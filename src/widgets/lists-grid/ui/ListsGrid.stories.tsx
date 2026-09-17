import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { mockListsWithStats } from '@/testing/mocks';
import { ListsGrid } from './ListsGrid';

const meta: Meta<typeof ListsGrid> = {
  title: 'Widgets/ListsGrid',
  component: ListsGrid,
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
  args: {
    lists: mockListsWithStats,
    query: '',
    loading: false,
    onCreate: fn(),
    onRename: fn(),
    onDelete: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ListsGrid>;

export const Default: Story = {
  args: { onQueryChange: fn() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Запуск лендинга')).toBeInTheDocument();
    await expect(canvas.getByText('Просрочено: 1')).toBeInTheDocument();
  },
};

export const FiltersByQuery: Story = {
  render: (args) => {
    const [query, setQuery] = useState('');
    const lists = mockListsWithStats.filter((list) =>
      list.title.toLowerCase().includes(query.toLowerCase()),
    );
    return <ListsGrid {...args} lists={lists} query={query} onQueryChange={setQuery} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Поиск списков'), 'ремонт');
    await waitFor(() => expect(canvas.queryByText('Запуск лендинга')).not.toBeInTheDocument());
    await expect(canvas.getByText('Ремонт кухни')).toBeInTheDocument();
  },
};

export const Empty: Story = { args: { lists: [], onQueryChange: fn() } };
export const Loading: Story = { args: { loading: true, onQueryChange: fn() } };
