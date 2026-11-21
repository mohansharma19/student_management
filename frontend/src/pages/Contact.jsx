import { useState } from "react";
import {
    Mail,
    Phone,
    MapPin,
    Send,
    MessageCircle,
    Clock,
    Headphones,
} from "lucide-react";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Contact Details:", formData);
        alert("Thank you! Your message has been submitted.");

        setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
        });
    };

    return (
        <div className="min-h-screen bg-[#EEF4FF]">

            {/* Hero Section */}
            <section className="px-6 py-16 text-center md:py-20">
                <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
                    CONTACT US
                </span>

                <h1 className="mt-6 text-4xl font-extrabold text-slate-900 md:text-5xl">
                    Let's Start a <span className="text-blue-600">Conversation</span>
                </h1>

                <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
                    Have a question, suggestion or need assistance?
                    Our team is here to help you make the most of edutrack.
                </p>
            </section>

            {/* Contact Section */}
            <section className="px-6 pb-20 md:px-12">
                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-5">

                    {/* Left Contact Information */}
                    <div className="rounded-3xl bg-blue-600 p-8 text-white lg:col-span-2 md:p-10">

                        <h2 className="text-3xl font-bold">
                            Get in Touch
                        </h2>

                        <p className="mt-4 leading-relaxed text-blue-100">
                            We'd love to hear from you. Reach out to us
                            anytime and we'll do our best to respond.
                        </p>

                        <div className="mt-12 space-y-8">

                            <div className="flex items-start gap-4">
                                <div className="rounded-xl bg-white/15 p-3">
                                    <Mail size={23} />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Email Us</h3>
                                    <p className="mt-1 text-sm text-blue-100">
                                        support@edutrack.com
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="rounded-xl bg-white/15 p-3">
                                    <Phone size={23} />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Call Us</h3>
                                    <p className="mt-1 text-sm text-blue-100">
                                        +91 9876543210
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="rounded-xl bg-white/15 p-3">
                                    <MapPin size={23} />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Our Location</h3>
                                    <p className="mt-1 text-sm text-blue-100">
                                        India
                                    </p>
                                </div>
                            </div>

                        </div>

                        <div className="mt-14 rounded-2xl bg-white/10 p-5">
                            <div className="flex items-center gap-3">
                                <Headphones size={25} />
                                <h3 className="font-semibold">Customer Support</h3>
                            </div>

                            <p className="mt-3 text-sm leading-relaxed text-blue-100">
                                Need help with student records or attendance?
                                Send us your query through the contact form.
                            </p>
                        </div>

                    </div>

                    {/* Right Contact Form */}
                    <div className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm lg:col-span-3 md:p-10">

                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-slate-900">
                                Send Us a Message
                            </h2>

                            <p className="mt-3 text-slate-500">
                                Fill in your details and share your message with us.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email address"
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Subject
                                </label>

                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="What is this about?"
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Your Message
                                </label>

                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Write your message here..."
                                    rows={5}
                                    required
                                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <button
                                type="submit"
                                className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 py-4 font-semibold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700"
                            >
                                Send Message
                                <Send size={19} />
                            </button>

                        </form>

                    </div>

                </div>
            </section>

            {/* Bottom Support Section */}
            <section className="border-t border-blue-100 bg-white px-6 py-12">
                <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">

                    <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-blue-100 p-4 text-blue-600">
                            <MessageCircle size={30} />
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-slate-900">
                                We're Here to Help!
                            </h3>
                            <p className="mt-1 text-slate-500">
                                Your feedback helps us improve EduTrack.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500">
                        <Clock size={19} className="text-blue-600" />
                        <span className="text-sm">We appreciate your feedback</span>
                    </div>

                </div>
            </section>

        </div>
    );
};

export default Contact;