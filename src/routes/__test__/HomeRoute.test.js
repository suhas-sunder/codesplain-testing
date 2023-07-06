import { render, screen } from "@testing-library/react";
import HomeRoute from "../HomeRoute";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "../../test/server";

createServer([
  {
    path: "/api/repositories",
    method: "get",
    res: (req) => {
      const language = req.url.searchParams.get("q").split("language:")[1];
      return {
        items: [
          { id: 1, full_name: `${language}_one` },
          { id: 2, full_name: `${language}_two` },
        ],
      };
    },
  },
]);

const MockHomeRouter = () => {
  return (
    <MemoryRouter>
      <HomeRoute />
    </MemoryRouter>
  );
};


it("should render two links for each language", async () => {
  render(<MockHomeRouter />);

  // Loop over each language
  const languages = [
    "javascript",
    "typescript",
    "rust",
    "go",
    "python",
    "java",
  ];

  for (let language of languages) {
    // For each language we should see two links
    const links = await screen.findAllByRole("link", {
      name: new RegExp(`${language}_`),
    });

    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent(`${language}_one`);
    expect(links[1]).toHaveTextContent(`${language}_two`);
    expect(links[0]).toHaveAttribute("href", `/repositories/${language}_one`);
    expect(links[1]).toHaveAttribute("href", `/repositories/${language}_two`);
  }
});
