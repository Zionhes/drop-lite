import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod/v4"

export const localFileSchema = z.object({
  id: z.string(),
  file: z.custom<File>((val) => val instanceof File, {
    message: "Debe ser un archivo válido",
  }),
  preview: z.string(),
});

export const fileFormSchema = z.object({
  isDragging: z.boolean(),
  files: z.array(localFileSchema),
});

export type LocalFile = z.infer<typeof localFileSchema>;
export type FileFormValues = {
  isDragging: boolean;
  files: LocalFile[];
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
