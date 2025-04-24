import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreatePassword from "../page";
import { createNewPassword } from "@/actions/authentication";
import { ActionResult } from "@/utils/enums";
import { useRouter, useSearchParams } from "next/navigation";

jest.mock("../../../../../actions/authentication");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));
jest.mock("../../../../../utils/routes", () => ({
  routes: { home: { home: "/home" } },
}));

const mockedCreate = createNewPassword as jest.MockedFunction<
  typeof createNewPassword
>;
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockedUseSearchParams = useSearchParams as jest.MockedFunction<
  typeof useSearchParams
>;

describe("CreatePassword component", () => {
  let pushMock: jest.Mock;
  let getParamMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    getParamMock = jest.fn().mockReturnValue("testuser");
    pushMock = jest.fn();
    mockedUseRouter.mockReturnValue({
      push: pushMock,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    });
    mockedUseSearchParams.mockReturnValue({
      get: getParamMock,
      append: jest.fn(),
      delete: jest.fn(),
      set: jest.fn(),
      sort: jest.fn(),
      entries: jest.fn(),
      keys: jest.fn(),
      values: jest.fn(),
      forEach: jest.fn(),
      toString: jest.fn(),
      size: 0,
      getAll: jest.fn(),
      has: jest.fn(),
      [Symbol.iterator]: jest.fn(),
    });
    mockedCreate.mockReset();
  });

  it("should render title, inputs and disabled submit button initially", () => {
    render(<CreatePassword />);
    expect(screen.getByText(/Crie sua nova senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nova senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirmar senha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Criar senha/i })).toBeDisabled();
  });

  it("should update requirement validity classes based on password input", () => {
    render(<CreatePassword />);
    const passwordInput = screen.getByLabelText(/Nova senha/i);

    fireEvent.change(passwordInput, { target: { value: "A" } });
    const uppercaseReq = screen.getByText(/Pelo menos uma letra maiúscula/i);
    expect(uppercaseReq).toHaveClass("text-green-600");
    const lengthReq = screen.getByText(/Mínimo de 8 caracteres/i);
    expect(lengthReq).toHaveClass("text-gray-400");
  });

  it("should enable submit button when all requirements met and passwords match", () => {
    render(<CreatePassword />);
    const validPassword = "Abcdef1!";
    fireEvent.change(screen.getByLabelText(/Nova senha/i), {
      target: { value: validPassword },
    });
    fireEvent.change(screen.getByLabelText(/Confirmar senha/i), {
      target: { value: validPassword },
    });
    expect(screen.getByRole("button", { name: /Criar senha/i })).toBeEnabled();
  });

  it("should call createNewPassword and navigate on successful password creation", async () => {
    mockedCreate.mockResolvedValue(ActionResult.Success);
    render(<CreatePassword />);
    const validPassword = "Abcdef1!";
    fireEvent.change(screen.getByLabelText(/Nova senha/i), {
      target: { value: validPassword },
    });
    fireEvent.change(screen.getByLabelText(/Confirmar senha/i), {
      target: { value: validPassword },
    });
    fireEvent.click(screen.getByRole("button", { name: /Criar senha/i }));

    await waitFor(() => {
      expect(mockedCreate).toHaveBeenCalledWith("testuser", validPassword);
      expect(pushMock).toHaveBeenCalledWith("/home");
    });
  });

  it("should not navigate if createNewPassword returns non-success", async () => {
    mockedCreate.mockResolvedValue(ActionResult.NewPasswordRequired);
    render(<CreatePassword />);
    const validPassword = "Abcdef1!";
    fireEvent.change(screen.getByLabelText(/Nova senha/i), {
      target: { value: validPassword },
    });
    fireEvent.change(screen.getByLabelText(/Confirmar senha/i), {
      target: { value: validPassword },
    });
    fireEvent.click(screen.getByRole("button", { name: /Criar senha/i }));

    await waitFor(() => {
      expect(mockedCreate).toHaveBeenCalledWith("testuser", validPassword);
      expect(pushMock).not.toHaveBeenCalled();
    });
  });
});
