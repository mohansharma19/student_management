import { Link } from "react-router-dom";
import {
    GraduationCap,
    Users,
    Target,
    Eye,
    Heart,
    BookOpen,
    ArrowRight,
    CheckCircle
} from "lucide-react";

const About = () => {
    const features = [
        "Student Information Management",
        "Attendance Tracking",
        "Marks and Performance Reports",
        "Easy Academic Management"
    ];

    const values = [
        {
            icon: Target,
            title: "Our Mission",
            description:
                "Our mission is to simplify student management and make academic activities easier through technology."
        },
        {
            icon: Eye,
            title: "Our Vision",
            description:
                "Our vision is to create a smart and organized educational environment for students and administrators."
        },
        {
            icon: Heart,
            title: "Our Values",
            description:
                "We believe in simplicity, transparency, accessibility and continuous improvement."
        }
    ];

    return (
        <div className="min-h-screen bg-white">

            {/* Hero Section */}
            <section className="bg-blue-50 px-6 md:px-12 py-20">
                <div className="max-w-6xl mx-auto text-center">

                    <div className="flex justify-center mb-5">
                        <div className="bg-blue-100 p-4 rounded-2xl">
                            <GraduationCap size={50} className="text-blue-600" />
                        </div>
                    </div>

                    <p className="text-blue-600 font-semibold mb-3">
                        ABOUT EDUTRACK
                    </p>

                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                        Making Student Management
                        <span className="text-blue-600"> Simple</span>
                    </h1>

                    <p className="text-slate-600 text-lg max-w-3xl mx-auto mt-6 leading-relaxed">
                        EduTrack is a student management platform designed to
                        organize student information, attendance, marks and academic
                        performance in one place.
                    </p>

                </div>
            </section>

            {/* About Content */}
            <section className="px-6 md:px-12 py-20">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

                    <div>
                        <p className="text-blue-600 font-semibold mb-3">
                            WHO WE ARE
                        </p>

                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                            One Platform for Better Academic Management
                        </h2>

                        <p className="text-slate-600 mt-6 leading-relaxed">
                            Managing student records, attendance and examination
                            results can be difficult when information is scattered.
                            StudentHub brings these activities together in a simple
                            and organized platform.
                        </p>

                        <p className="text-slate-600 mt-4 leading-relaxed">
                            Our goal is to help administrators manage student data
                            efficiently while allowing students to view their
                            academic information easily.
                        </p>

                        <div className="mt-7 space-y-3">
                            {features.map((feature) => (
                                <div key={feature} className="flex items-center gap-3">
                                    <CheckCircle size={20} className="text-green-600" />
                                    <span className="text-slate-700">{feature}</span>
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* Illustration */}
                    <div className="bg-blue-50 rounded-3xl p-10 flex justify-center items-center">
                        <div className="bg-white rounded-2xl shadow-lg p-10 text-center w-full max-w-sm">
                            <Users size={90} className="text-blue-600 mx-auto" />

                            <h3 className="text-2xl font-bold text-slate-800 mt-6">
                                EduTrack
                            </h3>

                            <p className="text-slate-500 mt-3">
                                Learn, Manage and Grow Together.
                            </p>

                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <div className="bg-blue-50 rounded-xl p-4">
                                    <GraduationCap className="mx-auto text-blue-600" />
                                    <p className="text-sm font-medium mt-2 text-slate-700">
                                        Education
                                    </p>
                                </div>

                                <div className="bg-green-50 rounded-xl p-4">
                                    <BookOpen className="mx-auto text-green-600" />
                                    <p className="text-sm font-medium mt-2 text-slate-700">
                                        Learning
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Mission Vision Values */}
            <section className="bg-slate-50 px-6 md:px-12 py-20">
                <div className="max-w-6xl mx-auto">

                    <div className="text-center mb-12">
                        <p className="text-blue-600 font-semibold mb-3">
                            WHAT DRIVES US
                        </p>

                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                            Our Mission, Vision and Values
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-7">
                        {values.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.title}
                                    className="bg-white p-8 rounded-2xl border hover:shadow-lg transition"
                                >
                                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <Icon size={28} className="text-blue-600" />
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-800 mt-6">
                                        {item.title}
                                    </h3>

                                    <p className="text-slate-500 mt-3 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </section>

            {/* CTA */}
            <section className="px-6 md:px-12 py-20">
                <div className="max-w-5xl mx-auto bg-blue-600 rounded-3xl p-10 md:p-14 text-center">

                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Let's Make Education Management Better
                    </h2>

                    <p className="text-blue-100 mt-4">
                        Explore EduTrack and experience simple academic management.
                    </p>

                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 bg-white text-blue-600 px-7 py-3.5 rounded-lg font-semibold mt-8 hover:bg-blue-50 transition"
                    >
                        Get Started
                        <ArrowRight size={20} />
                    </Link>

                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white px-6 md:px-12 py-8">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">

                    <h2 className="text-xl font-bold">
                        Edu<span className="text-blue-400">Track</span>
                    </h2>

                    <p className="text-slate-400 text-sm">
                        © 2026 EduTrack. All rights reserved.
                    </p>

                </div>
            </footer>

        </div>
    );
};

export default About;