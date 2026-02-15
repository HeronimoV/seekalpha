"use client";

import { useState, useEffect } from "react";

interface Proposal {
  id: string;
  title: string;
  description: string;
  category: string;
  resolutionDate: string;
  reason: string;
  createdAt: string;
}

const CATEGORIES = ["Crypto", "Tech", "DeFi", "Sports", "Politics", "Memes", "Culture"];
const STORAGE_KEY = "seekalpha-proposals";

function loadProposals(): Proposal[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveProposals(proposals: Proposal[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals));
}

export default function ProposePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Crypto");
  const [resolutionDate, setResolutionDate] = useState("");
  const [reason, setReason] = useState("");
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setProposals(loadProposals());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !resolutionDate) return;

    const proposal: Proposal = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      category,
      resolutionDate,
      reason: reason.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = [proposal, ...proposals];
    saveProposals(updated);
    setProposals(updated);
    setTitle("");
    setDescription("");
    setReason("");
    setResolutionDate("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <a href="/" className="text-sm text-gray-500 hover:text-white transition">← Back to Markets</a>
      </div>

      <h1 className="text-2xl font-bold mb-2">Propose a Market</h1>
      <p className="text-gray-400 text-sm mb-8">
        Have an idea for a prediction market? Submit it here! Community proposals help shape what markets get created next.
      </p>

      {/* Teaser */}
      <div className="bg-gradient-to-r from-seek-purple/10 to-seek-teal/10 border border-seek-border rounded-xl p-4 mb-8 text-center">
        <span className="text-sm text-gray-300">🗳️ Coming soon: vote on proposals!</span>
      </div>

      {submitted && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6 text-center text-green-400 text-sm">
          ✅ Proposal submitted! Thanks for contributing.
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-seek-card border border-seek-border rounded-xl p-5 space-y-4 mb-10">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='e.g. "Will SOL hit $500 by Q3 2026?"'
            className="w-full bg-seek-dark border border-seek-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-seek-purple"
            maxLength={128}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="How should this market be resolved? What criteria?"
            className="w-full bg-seek-dark border border-seek-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-seek-purple min-h-[80px]"
            maxLength={512}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-seek-dark border border-seek-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-seek-purple"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Resolution Date *</label>
            <input
              type="date"
              value={resolutionDate}
              onChange={(e) => setResolutionDate(e.target.value)}
              className="w-full bg-seek-dark border border-seek-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-seek-purple"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Why this market? (optional)</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why would people want to bet on this?"
            className="w-full bg-seek-dark border border-seek-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-seek-purple"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-seek-purple to-seek-teal text-white font-medium text-sm hover:opacity-90 transition active:scale-[0.98]"
        >
          🚀 Submit Proposal
        </button>
      </form>

      {/* Recent Proposals */}
      {proposals.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Proposals ({proposals.length})</h2>
          <div className="space-y-3">
            {proposals.map((p) => (
              <div key={p.id} className="bg-seek-card border border-seek-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-seek-teal/20 text-seek-teal">{p.category}</span>
                  <span className="text-xs text-gray-500">Resolves {p.resolutionDate}</span>
                </div>
                <h3 className="font-semibold text-sm mb-1">{p.title}</h3>
                <p className="text-xs text-gray-400 line-clamp-2">{p.description}</p>
                {p.reason && <p className="text-xs text-gray-500 mt-1 italic">"{p.reason}"</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
