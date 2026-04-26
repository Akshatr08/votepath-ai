import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LandingPage } from "@/components/landing/LandingPage";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <LandingPage />
      </main>
      <Footer />
    </div>
  );
}
