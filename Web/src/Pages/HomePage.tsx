import { Link } from "react-router-dom";
import { useMobile } from "@/hooks/useMobile";
import Card from "@/Components/Card";
import { HiLightningBolt, HiChip, HiMap } from "react-icons/hi";
import { useAuth } from "@/hooks/useAuth";

const HomePage = () => {
  const isMobile = useMobile();
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-soft-bg text-brand-text font-sans">
      {/* Hero Section */}
      <main className={`max-w-7xl mx-auto px-6 ${isMobile ? 'pt-10 pb-20' : 'pt-20 pb-32'} text-center`}>
        <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold text-brand-text bg-soft-accent rounded-full border border-soft-muted/50">
          AI-Powered Travel Intelligence
        </div>
        <h2 className={`${isMobile ? 'text-4xl' : 'text-5xl md:text-7xl'} font-extrabold mb-8 tracking-tight leading-tight text-brand-text`}>
          Your trips, <span className="text-brand-primary">summarized</span>.
          <br />
          Your preferences, <span className="text-brand-primary">understood</span>.
        </h2>
        <p className={`${isMobile ? 'text-base' : 'text-lg md:text-xl'} text-brand-text-muted max-w-2xl mx-auto mb-12 leading-relaxed`}>
          Log your adventures, rate your experiences, and let our AI analyze your travel DNA to curate your next perfect journey.
        </p>
        
        <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4 justify-center items-center`}>
          <Link 
            to={isAuthenticated ? "/travel-log" : "/auth"} 
            className={`${isMobile ? 'w-full py-4' : 'w-auto px-10 py-4'} bg-brand-primary text-white rounded-xl text-lg font-bold hover:bg-brand-text transition-all shadow-xl shadow-soft-deep/30 text-center`}
          >
            {isAuthenticated ? "Go to Travel Log" : "Start Your Travel Log"}
          </Link>
        </div>

        {/* Feature Preview */}
        <div className={`mt-24 grid ${isMobile ? 'grid-cols-1 gap-6' : 'md:grid-cols-3 gap-8'}`}>
          {[
            {
              title: "Seamless Logging",
              desc: "Quickly capture activities, ratings, and thoughts from your latest journey.",
              icon: <HiLightningBolt />
            },
            {
              title: "AI Analysis",
              desc: "Our AI traverses your history to map your likes and dislikes with precision.",
              icon: <HiChip />
            },
            {
              title: "Pinpoint Recs",
              desc: "Get suggestions for your next trip that you're guaranteed to love.",
              icon: <HiMap />
            }
          ].map((feature, idx) => (
            <Card key={idx} hoverable className="border-soft-muted/20">
              <div className="w-14 h-14 bg-soft-accent text-brand-primary rounded-xl flex items-center justify-center mb-6 mx-auto text-2xl border border-soft-muted/20 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-brand-text">{feature.title}</h3>
              <p className="text-brand-text-muted font-medium">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
