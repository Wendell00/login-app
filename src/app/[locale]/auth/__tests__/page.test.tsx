import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Auth from "../page";
import { signIn } from "@/actions/authentication";
import { ActionResult } from "@/utils/enums";
import { useRouter } from "next/navigation";

jest.mock("../../../../actions/authentication");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("../../../../utils/routes", () => ({
  routes: {
    auth: {
      createNewPassword: (username: string) => `/create-password/${username}`,
    },
    home: { home: "/home" },
  },
}));

const mockedSignIn = signIn as jest.MockedFunction<typeof signIn>;
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe("Auth component", () => {
  let pushMock: jest.Mock;
  let replaceMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    replaceMock = jest.fn();
    mockedUseRouter.mockReturnValue({
      push: pushMock,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: replaceMock,
      prefetch: jest.fn(),
    });
    mockedSignIn.mockReset();
  });

  it("should render input fields and the button", () => {
    render(<Auth />);
    expect(screen.getByLabelText(/Nome de usuário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /continue/i })
    ).toBeInTheDocument();
  });

  it("should display validation errors when submitting an empty form", async () => {
    render(<Auth />);
    fireEvent.click(screen.getByRole("button", { name: /continue/i })); // <- removido parêntese extra aqui

    expect(
      await screen.findByText(/O nome de usuário é obrigatório\./i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/A senha deve ter pelo menos 6 caracteres\./i)
    ).toBeInTheDocument();
  });

  it("should call signIn and navigate to create new password when ActionResult.NewPasswordRequired", async () => {
    const username = "testuser";
    const password = "password123";
    mockedSignIn.mockResolvedValue(ActionResult.NewPasswordRequired);

    render(<Auth />);
    fireEvent.change(screen.getByLabelText(/Nome de usuário/i), {
      target: { value: username },
    });
    fireEvent.change(screen.getByLabelText(/Senha/i), {
      target: { value: password },
    });
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(mockedSignIn).toHaveBeenCalledWith(username, password);
      expect(pushMock).toHaveBeenCalledWith(`/create-password/${username}`);
    });
  });

  it("should not navigate if signIn returns another ActionResult", async () => {
    const username = "user";
    const password = "password";

    mockedSignIn.mockResolvedValue(ActionResult.Success);

    render(<Auth />);
    fireEvent.change(screen.getByLabelText(/Nome de usuário/i), {
      target: { value: username },
    });
    fireEvent.change(screen.getByLabelText(/Senha/i), {
      target: { value: password },
    });
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(mockedSignIn).toHaveBeenCalledWith(username, password);
      expect(replaceMock).toHaveBeenCalled();
    });
  });
});
