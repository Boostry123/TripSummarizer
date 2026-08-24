import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12 z-1">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          About TripSummarizer
        </h2>
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            TripSummarizer was born out of a simple problem: we travel a lot,
            but we often forget the small details that make or break an
            experience. Was it the specific restaurant in Tokyo that we loved,
            or the quiet park in Paris that we'd rather avoid next time?
          </p>
          <p>
            Our mission is to help you build a "Travel DNA"—a digital synthesis
            of your unique preferences, biases, and desires. By logging your
            experiences in detail, you provide the context needed for truly
            personalized travel intelligence.
          </p>
          <h3 className="text-2xl font-bold pt-4 mb-2">The AI Advantage</h3>
          <p>
            Unlike generic travel sites that suggest what's popular for
            everyone, TripSummarizer uses advanced AI to traverse your personal
            data. It understands that "crowded" might be a dealbreaker for one
            person but "vibrant" for another. It looks for patterns in your
            free-text narratives to find hidden gems you didn't even know you
            were looking for.
          </p>
        </div>
      </div>

      <div className="p-8 border rounded-xl text-center space-y-4 z-1">
        <h3 className="text-2xl font-bold">Ready to start your journey?</h3>
        <p>
          Begin building your travel profile today and never waste a vacation
          again.
        </p>
        <div className="pt-2">
          <Link
            to="/auth"
            className="inline-block px-6 py-2 border rounded-lg font-bold"
          >
            Log Your First Trip
          </Link>
        </div>
      </div>
      <div className="z-0">
        <img src="world_vector.svg" width="1280" height="1098" className="" />
      </div>
    </div>
  );
};

export default AboutPage;
