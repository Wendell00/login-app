"use client";

import { TextField } from "@mui/material";
import { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Button from "@/components/button/button";
import { useRouter, useSearchParams } from "next/navigation";
import { createNewPassword } from "@/actions/authentication";
import { ActionResult } from "@/utils/enums";
import { routes } from "@/utils/routes";
import { passwordSchema } from "./schema";

export default function CreatePassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();
  const params = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const parsed = passwordSchema.safeParse(formData);

  const handleSubmit = async () => {
    const result = passwordSchema.safeParse(formData);
    if (!result.success) {
      setErrors({
        password: result.error.formErrors.fieldErrors.password?.[0] || "",
        confirmPassword:
          result.error.formErrors.fieldErrors.confirmPassword?.[0] || "",
      });
      return;
    }

    setErrors({ password: "", confirmPassword: "" });
    const response = await createNewPassword(
      params.get("username") as string,
      formData.password
    );
    if (response === ActionResult.Success) {
      router.push(routes.home.home);
    }
  };

  const requirements = [
    {
      label: "Mínimo de 8 caracteres",
      valid: formData.password.length >= 8,
    },
    {
      label: "Pelo menos uma letra maiúscula",
      valid: /[A-Z]/.test(formData.password),
    },
    {
      label: "Pelo menos uma letra minúscula",
      valid: /[a-z]/.test(formData.password),
    },
    {
      label: "Pelo menos um número",
      valid: /\d/.test(formData.password),
    },
    {
      label: "Pelo menos um caractere especial",
      valid: /[^A-Za-z0-9]/.test(formData.password),
    },
  ];

  return (
    <div className="w-[22.5rem] flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <p className="text-tertiary-100 font-inter font-bold text-md">
          Crie sua nova senha
        </p>
        <ul className="text-sm space-y-1">
          {requirements.map((req) => (
            <li
              key={req.label}
              className={`flex items-center gap-2 transition-all duration-300 ${
                req.valid ? "text-green-600" : "text-gray-400"
              }`}
            >
              {req.valid ? (
                <CheckCircleIcon className="w-4 h-4" />
              ) : (
                <HighlightOffIcon className="w-4 h-4" />
              )}
              {req.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-8">
        <TextField
          id="password"
          label="Nova senha"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
        />
        <TextField
          id="confirmPassword"
          label="Confirmar senha"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
        />
      </div>

      <Button onClick={handleSubmit} disabled={!parsed.success}>
        Criar senha
      </Button>
    </div>
  );
}
