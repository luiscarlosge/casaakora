import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import About from './components/About';
import FloorByFloor from './components/FloorByFloor';
import VirtualTour from './components/VirtualTour';
import Amenities from './components/Amenities';
import Location from './components/Location';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Modal360 from './components/Modal360';

export default function App() {
  const [fotoActiva, setFotoActiva] = useState(null);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero onVerTour={() => {
        document.getElementById('tour')?.scrollIntoView({ behavior: 'smooth' });
      }} />
      <Stats />
      <About />
      <FloorByFloor onAbrirFoto={setFotoActiva} />
      <VirtualTour onAbrirFoto={setFotoActiva} />
      <Amenities />
      <Location />
      <Contact />
      <Footer />
      {fotoActiva && (
        <Modal360
          foto={fotoActiva}
          onCerrar={() => setFotoActiva(null)}
        />
      )}
    </div>
  );
}
