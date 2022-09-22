import hsClient from "./client";
import { Company } from "../../../types";
import { getDealCompanies } from "./deal";

const getHSCompanyId = async (objectId: number) => {
  const companyIds = await getDealCompanies(objectId);
  const companyId = companyIds?.find((x) => typeof x !== undefined) as string;
  return companyId;
};

const getCompany = async (companyId: string): Promise<Company> => {
  const res = await hsClient.crm.companies.basicApi.getById(companyId, [
    "name",
    "upright_id",
  ]);
  const { name, upright_id } = res.properties;
  const company: Company = {
    name,
    upright_id: upright_id,
  };
  return company;
};

export { getCompany, getHSCompanyId };
