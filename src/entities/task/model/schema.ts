import { z } from 'zod';
import { PRIORITIES, TASK_STATUSES } from './types';

export const taskStatusSchema = z.enum(TASK_STATUSES);
export const prioritySchema = z.enum(PRIORITIES);

const dueDateSchema = z.iso.datetime({ message: 'Некорректная дата' });

/** Base fields, without defaults. */
const taskFieldsSchema = z.object({
  title: z.string().trim().min(1, 'Введите название').max(120, 'Не больше 120 символов'),
  description: z.string().trim().max(2000, 'Не больше 2000 символов'),
  status: taskStatusSchema,
  priority: prioritySchema,
});

export const createTaskSchema = taskFieldsSchema.extend({
  description: taskFieldsSchema.shape.description.default(''),
  status: taskStatusSchema.default('new'),
  priority: prioritySchema.default('medium'),
  dueDate: dueDateSchema.optional(),
});

// No defaults here, or a PATCH would reset fields missing from the request.
export const updateTaskSchema = taskFieldsSchema.partial().extend({
  dueDate: dueDateSchema.nullish(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

/** Task card form; the deadline is a `datetime-local` input value. */
export const taskFormSchema = taskFieldsSchema.extend({
  dueDateLocal: z.string(),
});

export type TaskFormShape = z.infer<typeof taskFormSchema>;
