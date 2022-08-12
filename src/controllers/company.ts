import { getCompany } from "../services/hubspot/company";
import { postErrorMessage } from "../services/slack/slack";
import Hapi from '@hapi/hapi'
import { UprightProfile } from "../../types";


interface CompanyPayload {
    "objectType": string,
    "objectId": string
}

const handlePostCompany = async (request: Hapi.Request, _h: Hapi.ResponseToolkit) => {

    
    const payload = request.payload as CompanyPayload

    if( payload.objectType !== "COMPANY" ) {
        postErrorMessage("Invalid type, not company");
        throw new Error('Invalid type, not company');
    }

    try {
    const companyId = payload.objectId;
    const company = await getCompany(companyId);
    if ( !company?.upright_id && company) {
        const  searchResult: UprightProfile[] = await request.server.methods.uprightInternalGet(
            "search",
            `types=[%22company%22]&query=${encodeURIComponent(company?.name)}`
            ) || [];

            console.log(searchResult);
    }
    } catch (error) {
    console.error(error);
    return null;
    }
};

export default handlePostCompany;
