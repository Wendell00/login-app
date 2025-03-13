"use client";
import { ReactElement } from "react";

import { HeroUIProvider } from "@heroui/react";

import { Props } from "./types";

export function HeroProvider({ children }: Props): ReactElement {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}
