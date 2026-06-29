// types/tracks.ts

export interface Circuit {
  id: number;
  name: string;
  track_type: string; // "Road Course" | "Kart Circuit" | "Drag Strip" etc.
}

export interface Facility {
  id: number;
  sfid: string;
  name: string;
  common_name__c: string;
  abbreviated_name__c: string;
  slug__c: string;
  billingcity: string;
  billingstate: string;
  billingcountry: string;
  billingstreet: string;
  billinglatitude: number;
  billinglongitude: number;
  billingpostalcode: string | null;
  description: string;
  image_url__c: string | null;
  logo_url__c: string | null;
  logo_authorized__c: boolean;
  logo_background_color__c: string | null;
  rating_average__c: number | null;
  rating_total__c: string;
  recordtypeid: string;
  recordtypename: string;
  website: string | null;
  phone: string | null;
  image_credit__c: string | null;
  distance_meters: number;
  distance_miles: string;
  /** Nested circuits at this facility */
  tracks: Circuit[];
}
