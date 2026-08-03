import Card from "@/Components/Common/Card";
import { UnsplashAttribution } from "@/Components/Images/UnsplashAttribution";

interface imageContainerParams {
  URL: string | undefined;
  user: { name: string; link: string } | undefined;
}

const ImageContainer = (params: imageContainerParams) => {
  const imageUrl = params.URL;

  return (
    <Card>
      <img src={imageUrl ?? ""} alt="Image" referrerPolicy="no-referrer" />
      {params.user ? (
        <UnsplashAttribution user={params.user} appName={"TripSummarizer"} />
      ) : (
        ""
      )}
    </Card>
  );
};

export default ImageContainer;
