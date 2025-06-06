"use client";
import { TextField } from "@mui/material";
import { useState } from "react";
import { z } from "zod";
import Button from "@/components/button/button";
import { signIn } from "@/actions/authentication";
import { ActionResult } from "@/utils/enums";
import { useRouter } from "next/navigation";
import { routes } from "@/utils/routes";
import { useTranslation } from "react-i18next";

const authSchema = z.object({
  username: z.string().min(1, "O nome de usuário é obrigatório."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

export default function Auth() {
  const { t } = useTranslation(["global"]);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({ username: "", password: "" });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSignIn = async () => {
    return await signIn(formData.username, formData.password);
  };

  const handleSubmit = (): void => {
    const result = authSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        username: fieldErrors.username?.[0] || "",
        password: fieldErrors.password?.[0] || "",
      });
    } else {
      setErrors({ username: "", password: "" });
      handleSignIn().then((response) => {
        if (response === ActionResult.Success) {
          router.replace(routes.home.home);
        } else if (response === ActionResult.NewPasswordRequired) {
          router.push(routes.auth.createNewPassword(formData.username));
        }
      });
    }
  };

  return (
    <div className="w-[22.5rem] flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <p className="text-tertiary-100 font-inter font-bold text-md">
          {t("welcomeMessage")}
        </p>
        <p className="text-tertiary-200 font-inter font-normal text-xsm">
          {t("toEnterType")} <span className="font-bold">{t("userName")}</span>{" "}
          {t("and")} <span className="font-bold">{t("password")}</span>
        </p>
      </div>
      <div className="flex flex-col gap-8">
        <TextField
          required
          id="username"
          label="Nome de usuário"
          value={formData.username}
          onChange={handleChange}
          error={!!errors.username}
          helperText={errors.username}
          color="primary"
        />
        <TextField
          id="password"
          label="Senha"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          color="primary"
        />
        <div className="flex flex-col gap-2 items-center">
          <p className="text-tertiary-200 font-inter font-normal text-caption-sm">
            {t("notRememberYourPassword")}
          </p>
          <p className="text-primary font-inter font-normal text-caption-sm cursor-pointer">
            {t("touchHereForReceiveHelp")}
          </p>
        </div>
      </div>
      <Button onClick={handleSubmit} data-testid="continue-btn">
        {t("continue")}
      </Button>
    </div>
  );
}
