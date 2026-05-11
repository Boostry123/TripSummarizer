import { Link } from "react-router-dom";
import { useMobile } from "@/hooks/useMobile";
import Card from "@/Components/Card";
import { HiLightningBolt, HiChip, HiMap } from "react-icons/hi";
import { useAuth } from "@/hooks/useAuth";

const HomePage = () => {
  const isMobile = useMobile();
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans">
      {/* Hero Section */}
      <main className={`max-w-7xl mx-auto px-6 ${isMobile ? 'pt-10 pb-20' : 'pt-20 pb-32'} text-center`}>
        <div className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full">
          AI-Powered Travel Intelligence
        </div>
        <h2 className={`${isMobile ? 'text-4xl' : 'text-5xl md:text-7xl'} font-extrabold mb-8 tracking-tight leading-tight`}>
          Your trips, <span className="text-indigo-600">summarized</span>.
          <br />
          Your preferences, <span className="text-indigo-600">understood</span>.
        </h2>
        <p className={`${isMobile ? 'text-base' : 'text-lg md:text-xl'} text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed`}>
          Log your adventures, rate your experiences, and let our AI analyze your travel DNA to curate your next perfect journey.
        </p>
        
        <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4 justify-center items-center`}>
          <Link 
            to={isAuthenticated ? "/travel-log" : "/auth"} 
            className={`${isMobile ? 'w-full py-4' : 'w-auto px-8 py-4'} bg-indigo-600 text-white rounded-xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 text-center`}
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
              color: "blue",
              icon: <HiLightningBolt />
            },
            {
              title: "AI Analysis",
              desc: "Our AI traverses your history to map your likes and dislikes with precision.",
              color: "purple",
              icon: <HiChip />
            },
            {
              title: "Pinpoint Recs",
              desc: "Get suggestions for your next trip that you're guaranteed to love.",
              color: "green",
              icon: <HiMap />
            }
          ].map((feature, idx) => (
            <Card key={idx} hoverable>
              <div className={`w-12 h-12 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 text-${feature.color}-600 dark:text-${feature.color}-400 rounded-lg flex items-center justify-center mb-6 mx-auto text-2xl`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
