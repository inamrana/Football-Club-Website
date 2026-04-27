import Hero from '../components/Hero';
import Timetable from '../components/Timetable';
import StudentsList from '../components/StudentsList';
import Announcements from '../components/Announcements';
import Highlights from '../components/Highlights';
import JoinForm from '../components/JoinForm';
import ContactSection from '../components/ContactSection';

const HomePage = () => {
    return (
        <main className="container">
            <Hero />
            <Timetable />
            <StudentsList />
            <Announcements />
            <Highlights />
            <JoinForm />
            <ContactSection />
        </main>
    );
};

export default HomePage;
