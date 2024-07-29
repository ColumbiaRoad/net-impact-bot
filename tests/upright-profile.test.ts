import axios from "axios";
import { getProfile } from "../src/services/upright/profile";
jest.mock("axios");

describe("GET Upright profile", () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  test("returns profile", async () => {
    const response = {
      status: 200,
      data: "profile",
    };
    mockedAxios.get.mockResolvedValue(response);
    const profile = await getProfile({
      uprightId: "abc",
      responseType: "arraybuffer",
    });
    expect(axios.get).toHaveBeenCalled();

    if (profile) {
      const originalProfile = response.data;
      expect(profile).toBe(originalProfile);
    }
    expect(profile).not.toBeNull;
  });

  test("returns null if axios error", async () => {
    mockedAxios.get.mockRejectedValue(new Error("axios error"));
    const profile = await getProfile({
      uprightId: "",
      responseType: "arraybuffer",
    });
    expect(profile).toBeNull;
  });
});
