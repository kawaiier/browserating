import { useRef, useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate form submission
    try {
      // Replace with actual API call when ready
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitStatus({ success: true, message: "Thank you for subscribing!" });
      setEmail("");
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="max-w-4xl mx-auto px-4 py-8 mt-12 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg dark:shadow-gray-900/50"
      aria-labelledby="newsletter-heading"
    >
      <div className="text-center mb-8">
        <h2
          id="newsletter-heading"
          className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
        >
          Stay Updated with Browser Performance
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Get notified when we publish new browser performance comparisons
        </p>
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="max-w-md mx-auto"
        aria-label="Newsletter subscription form"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <label htmlFor="email-input" className="sr-only">
              Email address
            </label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
              placeholder-gray-500 dark:placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400
              transition-colors duration-200"
              required
              aria-required="true"
              aria-invalid={email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
              aria-describedby={submitStatus ? "form-status" : undefined}
            />
          </div>
          <button
            type="submit"
            className={`px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 
            text-white font-medium rounded-lg shadow-md 
            hover:from-purple-700 hover:to-blue-700 
            focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400
            transition-all duration-200 transform hover:scale-105
            disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none`}
            disabled={isSubmitting || !email}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </button>
        </div>

        {submitStatus && (
          <div
            id="form-status"
            className={`mt-4 p-2 rounded text-center ${
              submitStatus.success
                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
            }`}
            role="status"
            aria-live="polite"
          >
            {submitStatus.message}
          </div>
        )}

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </form>
    </section>
  );
}
