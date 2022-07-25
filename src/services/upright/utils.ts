import { Company, UprightId } from "../../../types";

const getUprightId = (company: Company): UprightId | null => {
  if (company.vatin) {
    return { type: "VATIN", value: company.vatin };
  } else if (company.isin) {
    return { type: "ISIN", value: company.isin };
  } else {
    return null;
  }
};

export { getUprightId };