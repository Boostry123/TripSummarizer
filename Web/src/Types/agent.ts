export type countryImageType = {
  image_url: string;
  photographer_link: string;
  photographer_name: string;
};
export interface agentResponseObject {
  Country_Image: countryImageType;
  Country: string;
  Cities: string;
  Activities: string;
  Timeline: string;
  Summary: string;
}
