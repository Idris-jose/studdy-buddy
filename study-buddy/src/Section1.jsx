import { NavLink } from 'react-router-dom';
import studyImage from './assets/pexels-ivan-samkov-4458554.jpg';

export default function Section1() {
return (
    <section className=" mt-10 px-4 py-12 flex flex-col items-center justify-center min-h-screen text-center">
        <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 leading-tight">
            Create Your Ideal Study Timetable
        </h2>
        <p className="text-lg sm:text-xl mb-8 text-gray-700 max-w-2xl">
            Plan smarter, achieve more with personalized study schedules tailored to your courses and goals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <NavLink
                to="/demo"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 transition-colors"
                aria-label="Request a demo of Study Buddy"
            >
                Request a Demo
            </NavLink>
            <NavLink
                to="/signup"
                className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 focus:ring-2 focus:ring-blue-300 transition-colors"
                aria-label="Join Study Buddy now"
            >
                Join Us Now
            </NavLink>
        </div>
        <img
  src={studyImage}
  alt="Student studying with Study Buddy"
  className="max-w-full h-auto rounded-lg shadow-lg sm:max-w-[48rem] md:max-w-[56rem] lg:max-w-[64rem]"
/>
    </section>
);
}