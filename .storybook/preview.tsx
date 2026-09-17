import type { Preview } from '@storybook/nextjs-vite';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mswLoader } from 'msw-storybook-addon/csf3';
import { theme } from '../src/app/theme';
import { handlers } from '../src/testing/handlers';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    msw: { handlers },
    controls: { expanded: true },
  },
  loaders: [mswLoader()],
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false, staleTime: 0 }, mutations: { retry: false } },
      });
      return (
        <ThemeProvider theme={theme} defaultMode="light">
          <CssBaseline enableColorScheme />
          <QueryClientProvider client={queryClient}>
            <Story />
          </QueryClientProvider>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
