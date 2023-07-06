import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { createServer } from "../../../test/server";
import AuthButtons from "../AuthButtons";
import { SWRConfig } from "swr";

async function renderComponent() {
  render(
    <SWRConfig
      value={{
        provider: () => new Map(),
      }}
    >
      <MemoryRouter>
        <AuthButtons />
      </MemoryRouter>
    </SWRConfig>
  );

  await screen.findAllByRole("link");
}

describe("when user is not signed in", () => {
  createServer([
    {
      path: "/api/user",
      res: () => {
        console.log("SIGNED OUT");
        return { user: null };
      },
    },
  ]);

  it("should check if sign in is visible", async () => {
    await renderComponent();

    const signInButton = screen.getByRole("link", {
      name: /sign in/i,
    });
    expect(signInButton).toBeInTheDocument();
    expect(signInButton).toHaveAttribute("href", "/signin");
  });

  it("should check if sign up is visible", async () => {
    await renderComponent();
    const signUpButton = screen.getByRole("link", {
      name: /sign up/i,
    });
    expect(signUpButton).toBeInTheDocument();
    expect(signUpButton).toHaveAttribute("href", "/signup");
  });

  it("should check if sign out is not visible", async () => {
    await renderComponent();

    const signOutButton = screen.queryByRole("link", {
      name: /sign out/i,
    });
    expect(signOutButton).not.toBeInTheDocument();
  });
});

describe("when user is signed in", () => {
  createServer([
    {
      path: "/api/user",
      res: () => {
        console.log("SIGNED IN");
        return { user: { id: 3, email: "asdf@email.com" } };
      },
    },
  ]);

  it("should check if sign up is not visible", async () => {
    await renderComponent();
    const signUpButton = screen.queryByRole("link", {
      name: /sign up/i,
    });
    expect(signUpButton).not.toBeInTheDocument();
  });

  it("should check if sign in is not visible", async () => {
    await renderComponent();
    const signInButton = screen.queryByRole("link", {
      name: /sign in/i,
    });
    expect(signInButton).not.toBeInTheDocument();
  });

  it("should check if sign out is visible", async () => {
    await renderComponent();
    const signOutButton = screen.getByRole("link", {
      name: /sign out/i,
    });

    expect(signOutButton).toBeInTheDocument();
    expect(signOutButton).toHaveAttribute("href", "/signout");
  });
});
