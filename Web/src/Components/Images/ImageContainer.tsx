import Card from "@/Components/Common/Card";
import { UnsplashAttribution } from "@/Components/Images/UnsplashAttribution";

interface imageContainerParams {
  URL: string | null;
}

const ImageContainer = (params: imageContainerParams) => {
  const imageUrl = params.URL;

  return (
    <Card>
      <img src={imageUrl ?? ""} alt="Image" referrerPolicy="no-referrer" />
      <UnsplashAttribution />
    </Card>
  );
};

export default ImageContainer;
