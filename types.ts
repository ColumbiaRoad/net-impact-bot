export interface DealPayload {
  objectId: number;
}

export interface Company {
  vatin: string | null;
  isin: string | null;
}

export interface UprightId {
  type: "VATIN" | "ISIN";
  value: string;
}
