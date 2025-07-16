import { useState, useEffect } from "react";
import { AwardsGrants } from "../../components/awards/AwardsGrants";
import type { Award } from "../../types/financials";
import financialsData from "../../assets/financials.json";
import { getCurrentUser } from "../../lib/auth";
import awardsImg from "@/assets/studentawards.jpg"; // Replace with your actual image
import researchImg from "@/assets/research.jpg"; // Replace with your actual image
import innovationImg from "@/assets/innovation.jpg";

export function AwardsPage() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState<any | null>(null);
  const [featureHighlights, setFeatureHighlights] = useState<any[]>([]);

  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    // Load mock data with proper type casting
    setAwards(financialsData.awards as Award[]);
    // Load initial Feature Highlights (mock, could be from API or localStorage)
    setFeatureHighlights([
      // Example initial data, replace with real data source if needed
      {
        id: 1,
        title: "AWARDS",
        headline: "Celebrating Excellence in Academics and Beyond",
        description:
          "Our university recognizes outstanding achievements in academics, leadership, and service. Discover the awards that inspire our students and faculty to reach new heights.",
        link: "/awards",
        linkText: "SEE AWARDS →",
        image: awardsImg,
      },
      {
        id: 2,
        title: "RESEARCH",
        headline: "Pioneering Research for a Better Tomorrow",
        description:
          "Explore groundbreaking research projects led by our faculty and students. From technology to social sciences, our ongoing research is shaping the future.",
        link: "/research",
        linkText: "EXPLORE RESEARCH →",
        image:researchImg,
      },
      {
        id: 3,
        title: "INNOVATION",
        headline: "Driving Innovation Across Disciplines",
        description:
          "Innovation is at the heart of our university. Discover how our community is creating solutions that make a real-world impact.",
        link: "/projects",
        linkText: "SEE INNOVATIONS →",
        image: innovationImg,
      },
    ]);
  }, []);

  const handleAwardApproval = async (awardId: string, approved: boolean) => {
    // Update award status in the state
    setAwards(
      awards.map((award) =>
        award.id === awardId
          ? { ...award, status: approved ? "approved" : "rejected" }
          : award
      )
    );
  };

  // Feature Highlights CRUD
  const handleAddFeature = () => {
    setEditingFeature(null);
    setShowFeatureModal(true);
  };
  const handleEditFeature = (feature: any) => {
    setEditingFeature(feature);
    setShowFeatureModal(true);
  };
  const handleDeleteFeature = (id: number) => {
    if (window.confirm("Delete this feature highlight?")) {
      setFeatureHighlights(featureHighlights.filter((f) => f.id !== id));
    }
  };
  const handleSaveFeature = (feature: any) => {
    if (editingFeature) {
      setFeatureHighlights(
        featureHighlights.map((f) =>
          f.id === editingFeature.id ? { ...feature, id: editingFeature.id } : f
        )
      );
    } else {
      setFeatureHighlights([
        ...featureHighlights,
        { ...feature, id: Date.now() },
      ]);
    }
    setShowFeatureModal(false);
    setEditingFeature(null);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-4">
          Awards & Recognition
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Celebrating excellence in academic achievement, research
          contributions, and distinguished service to the computer science
          community
        </p>
      </div>

      <AwardsGrants
        awards={awards}
        isAdmin={isAdmin}
        onApprove={isAdmin ? (id) => handleAwardApproval(id, true) : undefined}
        onReject={isAdmin ? (id) => handleAwardApproval(id, false) : undefined}
      />

      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-primary">
            Feature Highlights
          </h2>
          {isAdmin && (
            <button
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
              onClick={handleAddFeature}
            >
              Add Feature
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featureHighlights.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col"
            >
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full h-40 object-cover rounded-lg mb-4 border border-gray-200"
              />
              <div className="text-xs font-semibold tracking-widest text-[#EAB308] mb-2">
                {feature.title}
              </div>
              <h3 className="text-lg font-bold text-[#25345D] mb-2">
                {feature.headline}
              </h3>
              <p className="text-gray-600 mb-4 flex-1">{feature.description}</p>
              <a
                href={feature.link}
                className="text-[#EAB308] font-semibold text-sm hover:underline tracking-wide mb-2"
              >
                {feature.linkText}
              </a>
              {isAdmin && (
                <div className="flex gap-2 mt-2">
                  <button
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => handleEditFeature(feature)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleDeleteFeature(feature.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Feature Modal */}
      {showFeatureModal && (
        <FeatureModal
          feature={editingFeature}
          onSave={handleSaveFeature}
          onClose={() => {
            setShowFeatureModal(false);
            setEditingFeature(null);
          }}
        />
      )}
    </div>
  );
}

// FeatureModal component (inline for brevity)
function FeatureModal({
  feature,
  onSave,
  onClose,
}: {
  feature: any;
  onSave: (f: any) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    title: feature?.title || "",
    headline: feature?.headline || "",
    description: feature?.description || "",
    link: feature?.link || "",
    linkText: feature?.linkText || "",
    image: feature?.image || "",
  });
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-8">
        <h3 className="text-xl font-bold mb-4">
          {feature ? "Edit Feature" : "Add Feature"}
        </h3>
        <div className="space-y-4">
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Title (e.g. AWARDS)"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Headline"
            value={form.headline}
            onChange={(e) =>
              setForm((f) => ({ ...f, headline: e.target.value }))
            }
          />
          <textarea
            className="w-full border px-3 py-2 rounded"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Link (e.g. /awards)"
            value={form.link}
            onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
          />
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Link Text (e.g. SEE AWARDS →)"
            value={form.linkText}
            onChange={(e) =>
              setForm((f) => ({ ...f, linkText: e.target.value }))
            }
          />
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Image URL or path"
            value={form.image}
            onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
          />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            onClick={() => onSave(form)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
