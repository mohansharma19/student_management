import {
    Users,
    CalendarCheck,
    ClipboardList,
    BookOpen,
    BarChart3,
    ShieldCheck,
    ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
    {
        icon: Users,
        title: "Student Management",
        description:
            "Manage student profiles, personal details, roll numbers and class information in one place.",
    },
    {
        icon: CalendarCheck,
        title: "Attendance Tracking",
        description:
            "Mark daily attendance, track present and absent students, and maintain attendance records.",
    },
    {
        icon: ClipboardList,
        title: "Marks Management",
        description:
            "Add, update and manage student marks for different subjects and examinations.",
    },
    {
        icon: BookOpen,
        title: "Academic Management",
        description:
            "Organize classes, subjects and academic information through a simple dashboard.",
    },
    {
        icon: BarChart3,
        title: "Performance Reports",
        description:
            "Monitor student performance with marks, grades and academic progress reports.",
    },
    {
        icon: ShieldCheck,
        title: "Role-Based Access",
        description:
            "Separate dashboards and access for students and administrators.",
    },
];

const Features = () => {
    return (
        <div className="min-h-screen bg-[#EEF4FF]">

            {/* Hero Section */}
            <section className="px-6 py-20 text-center">
                <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
                    OUR FEATURES
                </span>

                <h1 className="mt-6 text-4xl font-bold text-slate-900 md:text-5xl">
                    Everything You Need to
                    <span className="text-blue-600"> Manage Students</span>
                </h1>

                <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
                    EduTrack makes student management easier with smart tools
                    for attendance, academic records and performance tracking.
                </p>
            </section>

            {/* Features Cards */}
            <section className="px-6 pb-20 md:px-12">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">

                    {features.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={index}
                                className="rounded-2xl border border-blue-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                            >
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                    <Icon size={30} />
                                </div>

                                <h2 className="mb-3 text-xl font-bold text-slate-900">
                                    {feature.title}
                                </h2>

                                <p className="leading-relaxed text-slate-600">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}

                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-blue-600 px-6 py-16 text-center">
                <h2 className="text-3xl font-bold text-white md:text-4xl">
                    Ready to simplify student management?
                </h2>

                <p className="mx-auto mt-4 max-w-xl text-blue-100">
                    Start using Edutrack and manage academic activities
                    from one platform.
                </p>

                <Link
                    to="/register"
                    className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
                >
                    Get Started <ArrowRight size={18} />
                </Link>
            </section>

        </div>
    );
};

export default Features;