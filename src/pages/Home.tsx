import Hero from '../components/sections/Hero';
import FindSection from '../components/home/FindSection';
import AtAGlanceSection from '../components/home/AtAGlanceSection';
import WeatherMapSection from '../components/home/WeatherMapSection';
import HomeNewsSection from '../components/home/HomeNewsSection';
import DirectoryBanner from '../components/home/DirectoryBanner';
import SEO from '../components/SEO';

const Home: React.FC = () => {
  return (
    <>
      <SEO
        title="Home"
        description="Official website of your local government. Access government services, information, and resources."
        keywords="government, local government, services, public services, civic services"
      />
      <main className="flex-grow">
        <Hero />
        <FindSection />
        <AtAGlanceSection />
        <WeatherMapSection />
        <HomeNewsSection />
        <DirectoryBanner />
      </main>
    </>
  );
};

export default Home;
