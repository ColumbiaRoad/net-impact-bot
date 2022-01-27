export interface DealPayload {
  objectId: number;
}

export interface Company {
  name: string;
  vatin: string | null;
  isin: string | null;
}

export interface UprightId {
  type: "VATIN" | "ISIN";
  value: string;
}

export interface UprightResponse {
  data: Buffer;
}
