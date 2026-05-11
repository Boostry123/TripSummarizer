import TripEntryForm from "@/Components/TripEntryForm";
import { useMobile } from "@/hooks/useMobile";

const TravelLogPage = () => {
  const isMobile = useMobile();

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans">
      <main className={`max-w-7xl mx-auto px-6 py-10 pb-20`}>
        <div className={`text-center ${isMobile ? 'mb-8' : 'mb-12'}`}>
          <h2 className={`${isMobile ? 'text-3xl' : 'text-4xl'} font-extrabold mb-4 tracking-tight`}>Log Your Adventure</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm md:text-base">
            Share the details of your trip. Our AI uses this information to understand your travel soul.
          </p>
        </div>

        <TripEntryForm />
      </main>
    </div>
  );
};

export default TravelLogPage;
