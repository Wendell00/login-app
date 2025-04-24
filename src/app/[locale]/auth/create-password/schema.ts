import { z } from "zod";

export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Mínimo de 8 caracteres")
      .refine((val) => /[A-Z]/.test(val), "Pelo menos uma letra maiúscula")
      .refine((val) => /[a-z]/.test(val), "Pelo menos uma letra minúscula")
      .refine((val) => /\d/.test(val), "Pelo menos um número")
      .refine(
        (val) => /[^A-Za-z0-9]/.test(val),
        "Pelo menos um caractere especial"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });
