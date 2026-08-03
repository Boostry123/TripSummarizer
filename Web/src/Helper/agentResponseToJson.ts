import { agentResponseObject } from "@/Types/agent";

const agentResponseToJson = (Res: string | undefined | null) => {
  let imageUrl = "";
  let imageUser = { name: "", link: "" };
  let parsedObject: agentResponseObject = {
    Country_Image: {
      image_url: "",
      photographer_link: "",
      photographer_name: "",
    },
    Country: "",
    Cities: "",
    Activities: "",
    Timeline: "",
    Summary: "",
  };
  try {
    parsedObject = JSON.parse(Res ?? "{}");
    imageUrl = parsedObject.Country_Image.image_url;
    imageUser["name"] = parsedObject.Country_Image.photographer_name;
    imageUser["link"] = parsedObject.Country_Image.photographer_link;
  } catch (error) {
    console.log("Had a problem converting the Recommendation to a json");
  }

  const { Country_Image, ...remainingData } = parsedObject;

  return { imageUrl, imageUser, remainingData };
};

export default agentResponseToJson;
