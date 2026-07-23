import React from "react";

// The shape of the user object returned by the Unsplash API
interface UnsplashUser {
  name: string;
  links: {
    html: string;
  };
}

interface AttributionProps {
  user: UnsplashUser;
  appName: string; // e.g., "my_travel_agent_app"
}

export const UnsplashAttribution: React.FC<AttributionProps> = ({
  user,
  appName,
}) => {
  // Unsplash requires these exact UTM parameters on every link
  const utmParams = `?utm_source=${encodeURIComponent(appName)}&utm_medium=referral`;

  const profileUrl = `${user.links.html}${utmParams}`;
  const unsplashUrl = `https://unsplash.com/${utmParams}`;

  return (
    <span style={{ fontSize: "12px", color: "#666" }}>
      Photo by{" "}
      <a
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#333", textDecoration: "underline" }}
      >
        {user.name}
      </a>{" "}
      on{" "}
      <a
        href={unsplashUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#333", textDecoration: "underline" }}
      >
        Unsplash
      </a>
    </span>
  );
};
