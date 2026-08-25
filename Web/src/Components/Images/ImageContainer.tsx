import React from "react";
import Card from "@/Components/Common/Card";
import { UnsplashAttribution } from "@/Components/Images/UnsplashAttribution";

interface ImageContainerParams {
  URL: string | undefined;
  user: { name: string; link: string } | undefined;
}

const ImageContainer: React.FC<ImageContainerParams> = ({ URL, user }) => {
  return (
    <Card
      padding="none"
      className="flex flex-col justify-center w-full max-w-xl"
    >
      <div className="w-full aspect-video overflow-hidden rounded-3xl">
        <img
          src={URL ?? ""}
          alt="Trip Destination"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
      </div>
      {user?.name ? (
        <div className="mt-2 text-center">
          <UnsplashAttribution user={user} appName="TripSummarizer" />
        </div>
      ) : null}
    </Card>
  );
};

export default ImageContainer;
