import { useEffect, useRef, useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showBenefits, setShowBenefits] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(7); // Dynamic count
  const formRef = useRef(null);

  // Simulate growing subscriber count
  useEffect(() => {
    const interval = setInterval(() => {
      setSubscriberCount((prev) => prev + Math.floor(Math.random() * 3));
    }, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitStatus({
        success: true,
        message:
          "🎉 Welcome aboard! Check your email for a special welcome bonus.",
      });
      setEmail("");
      setSubscriberCount((prev) => prev + 1);
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: "Oops! Something went wrong. Mind trying again?",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden">
      {/* Main Newsletter Section */}
      <div className="max-w-5xl mx-auto px-4 py-12 mt-16">
        <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 400">
              <defs>
                <pattern
                  id="newsletter-pattern"
                  x="0"
                  y="0"
                  width="50"
                  height="50"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="25" cy="25" r="2" fill="white" opacity="0.5" />
                  <path
                    d="M0 25h50M25 0v50"
                    stroke="white"
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                </pattern>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="url(#newsletter-pattern)"
              />
            </svg>
          </div>

          <div className="relative z-10 px-8 py-12 lg:px-12 lg:py-16">
            <div className="text-center mb-10">
              {/* Social Proof */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm font-medium mb-6">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white">
                    +
                  </div>
                </div>
                <span>
                  Join {subscriberCount.toLocaleString()}+ developers already
                  subscribed
                </span>
              </div>

              {/* Main Headline */}
              <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Don&apos;t Miss the Next
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Update
                </span>
              </h2>

              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                Be the first to know when a new browser challenges the status
                quo.
              </p>
            </div>

            {/* Form */}
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="max-w-lg mx-auto"
              aria-label="Newsletter subscription form"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <label htmlFor="email-input" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-6 py-4 rounded-xl border-2 border-white/30 bg-white/20 backdrop-blur-sm
                    text-white placeholder-white/70 text-lg
                    focus:outline-none focus:border-white/60 focus:bg-white/30
                    transition-all duration-300"
                    required
                    aria-required="true"
                  />
                </div>
                <button
                  type="submit"
                  className={`px-8 py-4 bg-white text-purple-600 font-bold text-lg rounded-xl shadow-lg
                  hover:bg-gray-50 hover:shadow-xl hover:scale-105
                  focus:outline-none focus:ring-4 focus:ring-white/50
                  transition-all duration-300 transform
                  disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
                  ${isSubmitting ? "animate-pulse" : ""}`}
                  disabled={
                    isSubmitting ||
                    !email ||
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                  }
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Joining...
                    </span>
                  ) : (
                    "Sign up"
                  )}
                </button>
              </div>

              {submitStatus && (
                <div
                  className={`mt-6 p-4 rounded-xl text-center font-medium ${
                    submitStatus.success
                      ? "bg-green-500/20 text-green-100 border border-green-400/30"
                      : "bg-red-500/20 text-red-100 border border-red-400/30"
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  {submitStatus.message}
                </div>
              )}

              <div className="mt-6 text-center">
                <p className="text-white/70 text-sm mb-2">
                  🔒 No spam, ever. Unsubscribe with one click.
                </p>
                <p className="text-white/60 text-xs">
                  Free forever • Monthly emails
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
