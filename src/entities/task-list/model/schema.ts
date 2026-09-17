import { z } from 'zod';

export const listTitleSchema = z.object({
  title: z.string().trim().min(1, 'Введите название').max(80, 'Не больше 80 символов'),
});

export type ListTitleInput = z.infer<typeof listTitleSchema>;
