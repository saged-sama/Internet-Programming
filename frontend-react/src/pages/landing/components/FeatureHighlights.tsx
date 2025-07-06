import awardsImg from "@/assets/studentawards.jpg"; // Replace with your actual image
import researchImg from "@/assets/research.jpg"; // Replace with your actual image
import innovationImg from "@/assets/innovation.jpg"; // Replace with your actual image

const features = [
  {
    icon: (
      <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
        <circle
          cx="24"
          cy="24"
          r="22"
          stroke="#EAB308"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M24 10v16"
          stroke="#25345D"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="24" cy="32" r="3" fill="#EAB308" />
      </svg>
    ),
    title: "AWARDS",
    image: awardsImg,
    headline: "Celebrating Excellence in Academics and Beyond",
    description:
      "Our university recognizes outstanding achievements in academics, leadership, and service. Discover the awards that inspire our students and faculty to reach new heights.",
    link: "/awards",
    linkText: "SEE AWARDS →",
  },
  {
    icon: (
      <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
        <rect
          x="6"
          y="6"
          width="36"
          height="36"
          rx="8"
          stroke="#EAB308"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M16 32l8-16 8 16"
          stroke="#25345D"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="24" cy="28" r="2" fill="#EAB308" />
      </svg>
    ),
    title: "RESEARCH",
    image: researchImg,
    headline: "Pioneering Research for a Better Tomorrow",
    description:
      "Explore groundbreaking research projects led by our faculty and students. From technology to social sciences, our ongoing research is shaping the future.",
    link: "/research",
    linkText: "EXPLORE RESEARCH →",
  },
  {
    icon: (
      <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
        <circle
          cx="24"
          cy="24"
          r="22"
          stroke="#EAB308"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M16 32c0-4.418 3.582-8 8-8s8 3.582 8 8"
          stroke="#25345D"
          strokeWidth="3"
        />
        <circle cx="24" cy="20" r="3" fill="#EAB308" />
      </svg>
    ),
    title: "INNOVATION",
    image: innovationImg,
    headline: "Driving Innovation Across Disciplines",
    description:
      "Innovation is at the heart of our university. Discover how our community is creating solutions that make a real-world impact.",
    link: "/projects",
    linkText: "SEE INNOVATIONS →",
  },
];

export default function FeatureHighlights() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-lg transition"
            >
              <div className="mb-4">{feature.icon}</div>
              <div className="text-xs font-semibold tracking-widest text-[#EAB308] mb-2">
                {feature.title}
              </div>
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full h-48 object-cover rounded-lg mb-6 border border-gray-200"
                style={{ maxWidth: 320 }}
              />
              <h3 className="text-xl font-bold text-[#25345D] mb-2">
                {feature.headline}
              </h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <a
                href={feature.link}
                className="text-[#EAB308] font-semibold text-sm hover:underline tracking-wide"
              >
                {feature.linkText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
