import axios from "axios";
import { getDealCompanies } from "../src/services/hubspot/deal";
jest.mock("axios");

describe("GET HubSpot deal", () => {
  const responses = [
    {
      status: 200,
      data: {
        results: [],
      },
    },
    {
      status: 200,
      data: {
        results: [
          {
            id: "123456",
          },
        ],
      },
    },
    {
      status: 200,
      data: {
        results: [
          {
            id: "123",
          },
          {
            id: "456",
          },
          {
            id: "789",
          },
        ],
      },
    },
  ];

  const mockedAxios = axios as jest.Mocked<typeof axios>;

  test("returns company ids", async () => {
    for (let i = 0; i < responses.length; ++i) {
      const response = responses[i];
      mockedAxios.get.mockResolvedValue(response);
      const companyIds = await getDealCompanies(1);
      expect(axios.get).toHaveBeenCalled();

      if (companyIds) {
        const originalCompanyIds = response.data.results;
        expect(companyIds.length).toBe(originalCompanyIds.length);
        for (let j = 0; j < companyIds.length; ++j) {
          const id = companyIds[j];
          const originalId = originalCompanyIds[j].id;
          expect(id).toBe(originalId);
        }
      }
      expect(companyIds).not.toBeNull;
    }
  });

  test("returns null if axios error", async () => {
    mockedAxios.get.mockRejectedValue(new Error("axios error"));
    const companyIds = await getDealCompanies(404);
    expect(companyIds).toBeNull;
  });
});
