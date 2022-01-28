import axios from "axios";
import { getCompany } from "../src/services/hubspot/company";
jest.mock("axios");

interface ResponseError {
  output: {
    statusCode: number;
  };
}

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

  test("throws error if 404 status", async () => {
    const response = responses.notFound;
    mockedAxios.get.mockResolvedValue(response);
    let errorStatus = NaN;

    try {
      await getCompany("notFound");
    } catch (error) {
      const errorObj = error as ResponseError;
      errorStatus = errorObj.output.statusCode;
    }

    expect(axios.get).toHaveBeenCalled();
    expect(errorStatus).toBe(response.status);
  });
});
