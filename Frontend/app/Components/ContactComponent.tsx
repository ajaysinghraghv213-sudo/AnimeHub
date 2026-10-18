'use client';
;
import { useState, type ChangeEvent } from "react";
import {
  Mail,
  MessageSquare,
  Send,
  MapPin,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Clock,
  Headphones,
  Sparkles,
  Locate,
} from "lucide-react";
import Emailus from "../function/emailus";
import {toast} from 'sonner'
const faqs = [
  {
    question: "How can I report inappropriate content?",
   answer: [
      "1.Locate the content: Navigate to the post, comment, or profile you believe violates our guidelines.\n",

      "\nClick the Report button: Select the three-dot menu (⋮) on the content and choose the Report option.",

      "Select a reason: Choose the category that best describes the issue, such as harassment, hate speech, explicit content, spam, or copyright infringement.",

      "Provide details: Briefly explain why you are reporting the content. Adding context helps our moderation team understand the issue.",

      "Submit your report: Once submitted, your report will be sent to our moderation team for review.",

      "Wait for review: Our team will investigate the report and take appropriate action if the content violates our guidelines."
    ],
  },
  {
    question: "How do I suggest a new feature?",
   answer: [
    "Visit the Contact Page: Navigate to the Contact page from the sidebar or website navigation menu.",

    "Enter your email: Provide your Gmail address or another valid email address so our team can contact you if needed.",

    "Select a category: Choose 'Feature Suggestion' from the subject dropdown menu to help us identify the purpose of your message.",

    "Describe your idea: Write down the feature you would like to see on AnimeHub. Explain how it would work and how it could improve the experience for other users.",

    "Submit your suggestion: Click the 'Send Message' button to submit your idea to our team.",

    "Wait for a response: Our team will review your suggestion and may contact you for additional details. While we cannot guarantee that every suggestion will be implemented, we genuinely appreciate your feedback."
  ],
  },
  {
    question: "Can I collaborate or partner with AnimeHub?",
   answer: [
    "Visit the Contact Page: Navigate to the Contact page from the sidebar or website navigation menu.",

    "Enter your email: Provide a valid email address so our team can get in touch with you regarding your proposal.",

    "Select a category: Choose 'Collaboration' from the subject dropdown menu to ensure your message reaches the appropriate team.",

    "Describe your proposal: Explain the type of collaboration you have in mind, whether it's content creation, promotional activities, community partnerships, or other opportunities. Include relevant details about yourself or your organization.",

    "Submit your request: Click the 'Send Message' button to send your collaboration proposal to our team.",

    "Wait for a response: Our team will review your proposal and contact you if there is an opportunity to work together. We appreciate your interest in collaborating with AnimeHub!"
  ],
},
  {
    question: "How long does it take to get a response?",
    answer:
      "We usually respond within 24–48 hours, depending on the nature of your inquiry.",
  },
];

const contactMethods = [
  {
    title: "Email",
    value: "mailto:ajaysinghraghv213@gmail.com",
    description: "We usually respond within 24 hours.",
    icon: Mail,
    color: "from-purple-500 to-fuchsia-500",
  },
  {
    title: "Join our Discord",
    value: "https://discord.gg/7c2vxxqff",
    description: "Chat with the community and team.",
    icon: MessageSquare,
    color: "from-indigo-500 to-blue-500",
  },
  {
    title: "Follow us on Instagram",
    value: "https://www.instagram.com/animehub12392?rpxt=MTU0NDF6OW93ZnFleA==",
    description: "For updates, announcements and more.",
    icon: ArrowUpRight,
    color: "from-pink-500 to-rose-500",
  },
 
];

export default function Contact() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await Emailus(formData);
        console.log("Email sent successfully:", response);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        toast.success("Email sent successfully!");
        setError(null);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Failed to send email. Please try again.";
      console.error("Error sending email:", caught);
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#090e1c] text-slate-200">

      {/* Main Content */}
      <main className="min-w-0">

        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-white/5 bg-[#0d1425]/95 px-5 backdrop-blur-xl md:px-8">

          <div className="flex w-full max-w-md items-center gap-3 rounded-xl border border-white/10 bg-[#151e32] px-4 py-3">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search anime, posts, creators..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="ml-4 flex items-center gap-4">
            <button className="rounded-xl border border-white/10 p-3 hover:bg-white/5">
              <Mail size={19} />
            </button>

            <img
              src="https://i.pravatar.cc/100?img=12"
              alt="Profile"
              className="h-10 w-10 rounded-full border-2 border-purple-500 object-cover"
            />
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative isolate min-h-[300px] overflow-hidden border-b border-white/5">

          {/* Dummy anime image */}
          <img
            src="https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1600"
            alt="Night sky"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />

          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#10102e] via-[#17143d]/90 to-[#17143d]/40" />

          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#090e1c]/70 to-transparent" />

          <div className="mx-auto flex min-h-[300px] max-w-7xl items-center px-6 py-12 md:px-10">

            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-purple-400">
                <Sparkles size={15} />
                Get in touch
              </div>

              <h1 className="text-5xl font-black tracking-tight text-white md:text-6xl">
                Contact <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Us</span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 md:text-lg">
                Have a question, suggestion, or just want to say hi?
                We'd love to hear from you. Whether it's about the platform,
                content, partnerships, or something else — feel free to reach out!
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form + Contact Details */}
        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-5 py-8 md:px-8 lg:grid-cols-[1.55fr_1fr]">

          {/* Contact Form */}
          <div className="rounded-2xl border border-white/[0.07] bg-[#111a2c] p-6 shadow-xl md:p-8">

            <h2 className="text-2xl font-bold text-white">
              Send us a message
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Your Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-white/10 bg-[#19243a] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Your Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-white/10 bg-[#19243a] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Subject
                </label>

                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#19243a] px-4 py-3 text-sm text-slate-300 outline-none focus:border-purple-500"
                >
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Content Report">Content Report</option>
                  <option value="Feature Suggestion">Feature Suggestion</option>
                  <option value="Collaboration">Collaboration</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Message
                </label>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Write your message here..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-[#19243a] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-4 font-semibold text-white shadow-lg shadow-purple-900/20 transition hover:scale-[1.01] hover:brightness-110 active:scale-[0.99]"
              >
                <Send size={17} />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Methods */}
          <div className="rounded-2xl border border-white/[0.07] bg-[#111a2c] p-6 md:p-8">

            <h2 className="text-2xl font-bold text-white">
              Other ways to reach us
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              You can also contact us through the following channels.
            </p>

            <div className="mt-6 space-y-4">
              {contactMethods.map((method) => {
                const Icon = method.icon;

                return (
                  <a
                   href={method.value}
                   target="_blank"
                   rel="noopener noreferrer"
                    key={method.title}
                    className="group flex items-center gap-4 rounded-xl border border-white/5 bg-[#19243a] p-4 transition hover:border-purple-500/30 hover:bg-[#202c45]"
                  >
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${method.color} shadow-lg`}>
                      <Icon size={23} className="text-white" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-white">
                        {method.title}
                      </h3>

                      <p className="mt-1 truncate text-sm text-purple-400">
                        {method.value.length > 20 ? method.value.slice(0, 20) + "..." : method.value}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        {method.description}
                      </p>
                    </div>

                    <ArrowUpRight
                      size={18}
                      className="shrink-0 text-slate-500 transition group-hover:text-purple-400"
                    />
                  </a>
                );
              })}
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-purple-500/10 bg-purple-500/5 p-4">
              <Clock size={19} className="mt-0.5 shrink-0 text-purple-400" />
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Response time
                </h4>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Our team usually replies within 24–48 hours on business days.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-5 pb-12 md:px-8 lg:grid-cols-[1.2fr_1fr]">

          <div className="rounded-2xl border border-white/[0.07] bg-[#111a2c] p-6 md:p-8">

            <h2 className="text-2xl font-bold text-white">
              Frequently Asked Questions
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Quick answers to common questions. Still need help? Feel free to contact us.
            </p>

            <div className="mt-6 space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl border border-white/5 bg-[#19243a]"
                >
                  <button
                    onClick={() =>
                      setOpenFaq(openFaq === index ? null : index)
                    }
                    className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left text-sm font-medium text-slate-200 transition hover:text-purple-400"
                  >
                    <span>{faq.question}</span>

                    <ChevronDown
                      size={18}
                      className={`shrink-0 transition-transform ${
                        openFaq === index ? "rotate-180 text-purple-400" : ""
                      }`}
                    />
                  </button>

                  {openFaq === index && (
                    <div className="border-t border-white/5 px-4 py-4 text-sm leading-6 text-slate-400">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Anime Image Card */}
          <div className="group relative min-h-[350px] overflow-hidden rounded-2xl border border-white/10">

            <img
              src="/photos/contact.png"
              alt="Sunset landscape"
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#090e1c] via-[#090e1c]/40 to-transparent" />

            <div className="absolute bottom-0 left-0 p-7 md:p-9">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-purple-300">
                <Headphones size={17} />
                We're here for you
              </div>

              <h2 className="max-w-sm text-3xl font-black leading-tight text-white">
                We're here for the{" "}
                <span className="text-purple-400">
                  anime community
                </span>
              </h2>

              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
                Your feedback helps us make AnimeHub a better place for everyone.
                Every message matters.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-[#0d1425]">

          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4 md:px-8">

            <div className="lg:col-span-1">
              <h2 className="text-2xl font-black text-white">
                Anime<span className="text-purple-400">Hub</span>
              </h2>

              <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
                A community for anime fans to share, discuss, and create amazing content together.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-white">Quick Links</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><a href="/" className="hover:text-purple-400">Home</a></li>
                <li><a href="/explore" className="hover:text-purple-400">Explore</a></li>
                
                
              </ul>
            </div>

           

            <div>
              <h3 className="mb-4 font-semibold text-white">Follow Us</h3>
              <div className="flex gap-3">
                {[ MessageSquare, Mail].map((Icon, index) => (
                  <a
                    key={index}
                    href="https://discord.gg/7c2vxxqff"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#19243a] transition hover:border-purple-500 hover:text-purple-400"
                  >
                    <Icon size={19} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 px-6 py-5 text-center text-xs text-slate-500">
            © 2026 AnimeHub. Made for anime fans, by anime fans.
          </div>
        </footer>
      </main>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-slate-400"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}
