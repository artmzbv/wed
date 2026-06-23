import './Main.css';
import Hero from '../Hero/Hero';
import Invitation from '../Invitation/Invitation';
import Program from '../Program/Program';
import Timeline from '../Timeline/Timeline';
import DressCode from '../DressCode/DressCode';
import Wishes from '../Wishes/Wishes';
import GuestForm from '../GuestForm/GuestForm';

const Main = () => {
  return (
    <main className="main">
      <Hero />
      <Invitation />
      <Program />
      <Timeline />
      <DressCode />
      <Wishes />
      <GuestForm />
    </main>
  );
};

export default Main;
