import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { fetchSummary } from "../lib/ai-client";

export function SummarizeForm() {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSummary("");

    try {
      const sum = await fetchSummary({ text: input });
      setSummary(sum);
    } catch (err) {
      console.error(err);
      setSummary("Error generating summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
          Medical Text Summarizer
        </h1>
        <p className="text-gray-600 text-lg">
          Transform complex medical notes into clear, concise summaries
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="medical-text"
                className="block text-sm font-semibold text-gray-700 mb-3"
              >
                Medical Notes
              </label>
              <div className="relative">
                <TextareaAutosize
                  id="medical-text"
                  minRows={8}
                  className="w-full border-2 border-gray-200 rounded-xl p-4 text-black text-sm leading-relaxed 
                           focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 
                           transition-all duration-200 resize-none
                           placeholder:text-gray-400 shadow-sm"
                  placeholder="Paste your medical notes here... Include patient symptoms, diagnosis, treatment plans, or any clinical documentation that needs summarization."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {input.length} characters
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold 
                       py-4 px-6 rounded-xl shadow-lg hover:shadow-xl 
                       hover:from-blue-700 hover:to-indigo-700 
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg
                       transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100
                       focus:ring-4 focus:ring-blue-500/25"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="animate-spin w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Analyzing & Summarizing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span>Generate Summary</span>
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Generated Summary
            </label>
            <div
              className={`min-h-[300px] border-2 rounded-xl p-6 transition-all duration-200 ${
                summary
                  ? "border-green-200 bg-linear-to-br from-green-50 to-emerald-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              {summary ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <h2 className="font-semibold text-green-800">
                      Summary Complete
                    </h2>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {summary}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-green-200">
                    <span className="text-xs text-green-600">
                      Generated {new Date().toLocaleTimeString()}
                    </span>
                    <button
                      onClick={() => navigator.clipboard.writeText(summary)}
                      className="text-xs text-green-600 hover:text-green-800 flex items-center space-x-1 hover:bg-green-100 px-2 py-1 rounded"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">
                      Your summary will appear here
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Enter medical notes and click "Generate Summary" to begin
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Fast Processing</h3>
          <p className="text-sm text-gray-600">
            Get instant summaries of complex medical documentation
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Accurate Results</h3>
          <p className="text-sm text-gray-600">
            AI-powered analysis maintains medical accuracy
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Secure & Private</h3>
          <p className="text-sm text-gray-600">
            Your medical data is processed securely
          </p>
        </div>
      </div>
    </div>
  );
}
