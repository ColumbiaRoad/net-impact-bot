import { UprightProfile } from "../../../types";
import Hapi from "@hapi/hapi";
import { postErrorMessage } from "../slack/slack";
import { sendError } from "../../controllers/deal";

async function filterCompanies(server: Hapi.Server, company: string) {
  const results = await search(server, company);
  if (!results) {
    postErrorMessage(`no search results found on Upright for ${company}`);
    throw new Error(`no search results found on Upright for ${company}`);
  }
  const matches: UprightProfile[] = [];
  const directMatch: UprightProfile | undefined = results.find(
    (item) => item.name.toUpperCase() === company.toUpperCase()
  );
  if (directMatch) {
    matches.push(directMatch);
  } else {
    const keywords = company.trim().split(/\s+/);
    const filtered: UprightProfile[] = results.filter((item) =>
      item.name.toUpperCase().includes(keywords[0].toUpperCase())
    );
    filtered.map((result) => matches.push(result));
  }
  if (matches.length < 1) {
    await sendError(
      `Sorry, a match for ${company} was not found on Upright`,
      true
    );
  }
  return matches;
}

const search = async (
  server: Hapi.Server,
  company: string
): Promise<UprightProfile[] | null> => {
  const response: UprightProfile[] = await server.methods.uprightInternalGet(
    "search",
    `types=[%22company%22]&query=${encodeURIComponent(company)}`
  );

  return response;
};
export { filterCompanies };
