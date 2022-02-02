import axios from "axios";
import { getCompany } from "../src/services/hubspot/company";
jest.mock("axios");

describe("GET HubSpot company", () => {
  const responses = {
    notFound: {
      status: 404,
    },
    ok: {
      status: 200,
      data: {
        properties: {
          name: "Company OK",
          vatin: "FI12345678",
          isin: null,
        },
      },
    },
  };

  const mockedAxios = axios as jest.Mocked<typeof axios>;

  test("returns a company if found", async () => {
    const response = responses.ok;
    mockedAxios.get.mockResolvedValue(response);
    const company = await getCompany("ok");
    expect(axios.get).toHaveBeenCalled();
    const originalCompany = response.data.properties;
    expect(company).not.toBeNull;
    if (company) {
      // the redundant if to avoid a ts issue
      expect(company.name).toBe(originalCompany.name);
      expect(company.vatin).toBe(originalCompany.vatin);
      expect(company.isin).toBe(originalCompany.isin);
    }
  });

  test("throws error if 404 status", async () => {
    mockedAxios.get.mockRejectedValue(new Error("axios error"));
    const company = await getCompany("notFound");

    expect(company).toBeNull;
  });
});
