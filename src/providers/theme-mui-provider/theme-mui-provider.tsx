"use client";

import { ThemeProvider } from "@mui/material";
import { theme } from "@/utils/themes";
import { Props } from "./types";

export function ThemeMuiProvider({ children }: Props) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
