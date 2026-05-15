import { useMobile } from "@/hooks/useMobile";
import Card from "@/Components/Card";
import {
  HiPencilAlt,
  HiStar,
  HiScale,
  HiDatabase,
  HiGlobe,
  HiDeviceMobile,
} from "react-icons/hi";

const FeaturesPage = () => {
  const isMobile = useMobile();

  const features = [
    {
      title: "Detailed Travel Logs",
      description:
        "Capture the essence of every trip with structured data: country, city, activities, and your personal narrative.",
      icon: <HiPencilAlt />,
    },
    {
      title: "Smart Rating System",
      description:
        "Rate your experiences on a 5-point scale to help our AI quantify your preferences.",
      icon: <HiStar />,
    },
    {
      title: "Likes & Dislikes Analysis",
      description:
        "Explicitly list what you loved and what you hated to give the AI precise sentiment context.",
      icon: <HiScale />,
    },
    {
      title: "AI Narrative Synthesis",
      description:
        "Our AI reads through your free-text entries to understand the 'vibe' and 'feel' that structured data might miss.",
      icon: <HiDatabase />,
    },
    {
      title: "Pinpoint Recommendations",
      description:
        "Receive travel suggestions that align perfectly with your historical preferences and avoid things you've disliked.",
      icon: <HiGlobe />,
    },
    {
      title: "Responsive Design",
      description:
        "Log your travels on the go. Our interface is optimized for both desktop and mobile devices.",
      icon: <HiDeviceMobile />,
    },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans">
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            Powerful Features
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Everything you need to capture your travel DNA and discover your
            next perfect adventure.
          </p>
        </div>

        <div
          className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3"} gap-8`}
        >
          {features.map((f, i) => (
            <Card key={i} hoverable>
              <div className="text-4xl mb-4 text-indigo-600 dark:text-indigo-400">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {f.description}
              </p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default FeaturesPage;
