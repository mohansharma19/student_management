import { Link } from "react-router-dom";
import {
    GraduationCap,
    Users,
    CalendarCheck,
    BarChart3,
    BookOpen,
    ArrowRight,
    CheckCircle
} from "lucide-react";

const Home = () => {
    const features = [
        {
            icon: Users,
            title: "Student Management",
            description: "Easily manage student details, records and profiles."
        },
        {
            icon: CalendarCheck,
            title: "Attendance Tracking",
            description: "Track daily attendance and monitor student presence."
        },
        {
            icon: BarChart3,
            title: "Performance Reports",
            description: "View marks, grades and academic performance."
        },
        {
            icon: BookOpen,
            title: "Academic Management",
            description: "Manage subjects, classes and academic activities."
        }
    ];

    return (
        <div className="min-h-screen bg-white">

            {/* Navbar */}
            <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b">
                <Link to="/" className="flex items-center gap-2">
                    <GraduationCap size={38} className="text-blue-600" />
                    <h1 className="text-2xl font-bold text-slate-900">
                        Edu<span className="text-blue-600">Track</span>
                    </h1>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
                    <a href="#home" className="hover:text-blue-600">Home</a>
                    <a href="#features" className="hover:text-blue-600">Features</a>
                    <a href="#about" className="hover:text-blue-600">About</a>
                    <a href="#contact" className="hover:text-blue-600">Contact</a>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        to="/login"
                        className="text-blue-600 font-semibold hover:text-blue-800"
                    >
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition"
                    >
                        Register
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section
                id="home"
                className="bg-blue-50 px-6 md:px-12 py-20 md:py-28"
            >
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

                    <div>
                        <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                            Welcome to EduTrack
                        </span>

                        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
                            Smart Way to
                            <span className="text-blue-600"> Manage Students</span>
                        </h1>

                        <p className="text-slate-600 text-lg mt-6 leading-relaxed">
                            A simple and powerful platform to manage student records,
                            attendance, marks and academic performance — all in one place.
                        </p>

                        <div className="flex flex-wrap gap-4 mt-8">
                            <Link
                                to="/register"
                                className="flex items-center gap-2 bg-blue-600 text-white px-7 py-3.5 rounded-lg font-semibold hover:bg-blue-700 transition"
                            >
                                Get Started
                                <ArrowRight size={20} />
                            </Link>

                            <a
                                href="#features"
                                className="border border-blue-600 text-blue-600 px-7 py-3.5 rounded-lg font-semibold hover:bg-blue-100 transition"
                            >
                                Explore Features
                            </a>
                        </div>

                        <div className="flex flex-wrap gap-5 mt-8 text-sm text-slate-600">
                            <span className="flex items-center gap-2">
                                <CheckCircle size={18} className="text-green-600" />
                                Easy to use
                            </span>
                            <span className="flex items-center gap-2">
                                <CheckCircle size={18} className="text-green-600" />
                                All-in-one platform
                            </span>
                        </div>
                    </div>

                    {/* Hero Illustration */}
                    <div className="flex justify-center">
                        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 w-full max-w-md">
                            <div className="bg-blue-100 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto">
                                <GraduationCap size={60} className="text-blue-600" />
                            </div>

                            <h2 className="text-2xl font-bold text-center text-slate-800 mt-7">
                                Your Education,
                                <span className="text-blue-600"> Organized</span>
                            </h2>

                            <p className="text-center text-slate-500 mt-3">
                                Everything you need to manage academic activities in one place.
                            </p>

                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <div className="bg-blue-50 rounded-xl p-4 text-center">
                                    <Users className="mx-auto text-blue-600" size={28} />
                                    <p className="font-semibold text-slate-700 mt-2">
                                        Students
                                    </p>
                                </div>

                                <div className="bg-green-50 rounded-xl p-4 text-center">
                                    <CalendarCheck className="mx-auto text-green-600" size={28} />
                                    <p className="font-semibold text-slate-700 mt-2">
                                        Attendance
                                    </p>
                                </div>

                                <div className="bg-purple-50 rounded-xl p-4 text-center">
                                    <BarChart3 className="mx-auto text-purple-600" size={28} />
                                    <p className="font-semibold text-slate-700 mt-2">
                                        Results
                                    </p>
                                </div>

                                <div className="bg-orange-50 rounded-xl p-4 text-center">
                                    <BookOpen className="mx-auto text-orange-600" size={28} />
                                    <p className="font-semibold text-slate-700 mt-2">
                                        Subjects
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="px-6 md:px-12 py-20">
                <div className="max-w-7xl mx-auto">

                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <p className="text-blue-600 font-semibold mb-3">
                            OUR FEATURES
                        </p>

                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                            Everything You Need in One Place
                        </h2>

                        <p className="text-slate-500 mt-4">
                            Manage your academic activities with simple and powerful tools.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature) => {
                            const Icon = feature.icon;

                            return (
                                <div
                                    key={feature.title}
                                    className="p-6 border rounded-2xl hover:shadow-lg hover:-translate-y-1 transition"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                                        <Icon size={28} className="text-blue-600" />
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-800 mt-5">
                                        {feature.title}
                                    </h3>

                                    <p className="text-slate-500 mt-3 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </section>

            {/* About Section */}
            <section id="about" className="bg-slate-50 px-6 md:px-12 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                        About EduTrack
                    </h2>

                    <p className="text-slate-600 text-lg mt-6 leading-relaxed">
                        EduTrack is designed to make student management easier.
                        It brings student information, attendance records and academic
                        performance together in a single platform.
                    </p>
                </div>
            </section>

            {/* Contact / CTA Section */}
            <section id="contact" className="px-6 md:px-12 py-20">
                <div className="max-w-5xl mx-auto bg-blue-600 rounded-3xl p-10 md:p-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Ready to Get Started?
                    </h2>

                    <p className="text-blue-100 mt-4">
                        Join EduTrack and make student management simple.
                    </p>

                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 bg-white text-blue-600 px-7 py-3.5 rounded-lg font-semibold mt-8 hover:bg-blue-50 transition"
                    >
                        Create Account
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white px-6 md:px-12 py-8">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-bold">
                        Edu<span className="text-blue-400">Track</span>
                    </h2>

                    <p className="text-slate-400 text-sm">
                        © 2026 Edutrack. All rights reserved.
                    </p>
                </div>
            </footer>

        </div>
    );
};

export default Home;