"use client";

import MuiButton, { ButtonProps } from "@mui/material/Button";
import { SxProps, Theme } from "@mui/material/styles";

type MuiButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  variant?: ButtonProps["variant"];
  sx?: SxProps<Theme>;
  fullWidth?: boolean;
};

export default function Button({
  children,
  onClick,
  disabled = false,
  type = "button",
  variant = "contained",
  sx,
  fullWidth = true,
}: MuiButtonProps) {
  return (
    <MuiButton
      type={type}
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
      sx={{
        fontWeight: "bold",
        fontSize: "0.85rem",
        textTransform: "none",
        borderRadius: 2,
        ...(variant === "contained" && {
          color: "white",
          backgroundColor: "primary.main",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "primary.dark",
            boxShadow: "none",
          },
        }),
        ...(variant === "outlined" && {
          color: "primary.main",
          borderColor: "primary.main",
          "&:hover": {
            backgroundColor: "primary.light",
            borderColor: "primary.dark",
          },
        }),
        ...(variant === "text" && {
          color: "primary.main",
          "&:hover": {
            backgroundColor: "primary.light",
          },
        }),
        ...sx,
      }}
    >
      {children}
    </MuiButton>
  );
}
