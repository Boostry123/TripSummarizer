import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans">
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight">About TripSummarizer</h2>
          <div className="space-y-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            <p>
              TripSummarizer was born out of a simple problem: we travel a lot, but we often forget the small details that make or break an experience. Was it the specific restaurant in Tokyo that we loved, or the quiet park in Paris that we'd rather avoid next time?
            </p>
            <p>
              Our mission is to help you build a "Travel DNA"—a digital synthesis of your unique preferences, biases, and desires. By logging your experiences in detail, you provide the context needed for truly personalized travel intelligence.
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 pt-4">The AI Advantage</h3>
            <p>
              Unlike generic travel sites that suggest what's popular for everyone, TripSummarizer uses advanced AI to traverse your personal data. It understands that "crowded" might be a dealbreaker for one person but "vibrant" for another. It looks for patterns in your free-text narratives to find hidden gems you didn't even know you were looking for.
            </p>
          </div>
        </div>

        <div className="p-8 bg-indigo-600 rounded-3xl text-white text-center">
          <h3 className="text-2xl font-bold mb-4 text-white">Ready to start your journey?</h3>
          <p className="mb-8 opacity-90">Begin building your travel profile today and never waste a vacation again.</p>
          <Link to="/auth" className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-full font-bold hover:bg-indigo-50 transition-colors">
            Log Your First Trip
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
