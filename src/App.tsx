import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Overview from './components/Overview';
import BeforeAfter from './components/BeforeAfter';
import Architecture from './components/Architecture';
import TechStack from './components/TechStack';
import Results from './components/Results';
import CodeSnippet from './components/CodeSnippet';
import Timeline from './components/Timeline';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white antialiased">
      <Navbar />
      <Hero />
      <Overview />
      <BeforeAfter />
      <Architecture />
      <TechStack />
      <Results />
      <CodeSnippet />
      <Timeline />
      <Footer />
    </div>
  );
}
