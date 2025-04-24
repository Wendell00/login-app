import { render, screen } from "@testing-library/react";
import Home from "../page";

describe("Page", () => {
  it("renders a div containing the word 'home'", () => {
    render(<Home />);

    const div = screen.getByTestId("main-div");
    expect(div).toHaveTextContent("Home");
  });
});
