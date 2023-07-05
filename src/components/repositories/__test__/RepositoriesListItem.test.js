import { render, screen } from "@testing-library/react";
import RepositoriesListItem from "../RepositoriesListItem";
import { MemoryRouter } from "react-router-dom";

function renderComponent() {
  const repository = {
    full_name: "facebook/react",
    language: "JavaScript",
    description: "A js library",
    owner: "Facebook",
    name: "React",
    html_url: "https://github.com/facebook/react",
  };
  render(
    <MemoryRouter>
      <RepositoriesListItem repository={repository} />
    </MemoryRouter>
  );
}

it("should show a link to GitHub homepage for a given repository", async () => {
  renderComponent();
  await screen.findByRole("img", { name: /javascript/i });
});
