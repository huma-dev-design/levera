import { useRef } from 'react';
import { useLang } from './LangContext.jsx';
import { reduce } from './utils.js';
import { Sprite } from './components/Icons.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Tools from './components/Tools.jsx';
import BeforeAfter from './components/BeforeAfter.jsx';
import Handoff from './components/Handoff.jsx';
import Reporting from './components/Reporting.jsx';
import Calculator from './components/Calculator.jsx';
import Steps from './components/Steps.jsx';
import People from './components/People.jsx';
import Pricing from './components/Pricing.jsx';
import Faq from './components/Faq.jsx';
import Book from './components/Book.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const { lang, setLang } = useLang();
  const pageRef = useRef(null);

  // brief text fade when the visitor switches language
  const switchLang = l => {
    if (l === lang) return;
    setLang(l);
    if (reduce) return;
    const page = pageRef.current;
    page.classList.add('swap');
    requestAnimationFrame(() => requestAnimationFrame(() => page.classList.remove('swap')));
  };

  return (
    <>
      <Sprite />
      <div className="page js" ref={pageRef}>
        <Nav onLang={switchLang} />
        <main>
          <Hero />
          <Tools />
          <BeforeAfter />
          <Handoff />
          <Reporting />
          <Calculator />
          <Steps />
          <People />
          <Pricing />
          <Faq />
          <Book />
        </main>
        <Footer />
      </div>
    </>
  );
}
