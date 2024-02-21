import Header from './ui/header';
import FooterLayout from './ui/footer';
import LandingContent from './landing/landingContent';

/** This is the landing page */
export default function Home() {
  return (
    <>
      <Header />
      <LandingContent />
      <FooterLayout />
    </>
  );
}
