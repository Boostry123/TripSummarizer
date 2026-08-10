import { Link, Navigate } from "react-router-dom";
import Card from "@/Components/Common/Card";
import { HiLightningBolt, HiChip, HiMap } from "react-icons/hi";
import { useAuth } from "@/hooks/useAuth";

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  // Redirect authenticated users to the travel log page
  if (isAuthenticated) {
    return <Navigate to="/travel-log" replace />;
  }

  return (
    <div className="bg-primary-0">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-12 text-center">
        <div className="inline-block px-3 py-1 mb-6 text-sm border rounded-full font-medium">
          AI-Powered Travel Intelligence
        </div>
        <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
          Your trips, <span>summarized</span>.
          <br />
          Your preferences, <span>understood</span>.
        </h2>
        <p className="text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          Log your adventures, rate your experiences, and let our AI analyze
          your travel DNA to curate your next perfect journey.
        </p>

        <div className="flex justify-center mb-16">
          <Link to="/auth" className="px-8 py-3 font-bold border rounded-lg">
            Start Your Travel Log
          </Link>
        </div>

        {/* Feature Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Seamless Logging",
              desc: "Quickly capture activities, ratings, and thoughts from your latest journey.",
              icon: <HiLightningBolt />,
            },
            {
              title: "AI Analysis",
              desc: "Our AI traverses your history to map your likes and dislikes with precision.",
              icon: <HiChip />,
            },
            {
              title: "Pinpoint Recs",
              desc: "Get suggestions for your next trip that you're guaranteed to love.",
              icon: <HiMap />,
            },
          ].map((feature, idx) => (
            <Card key={idx}>
              <div className="text-2xl mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-sm">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
