import { useEffect, useRef } from "react";

export default function Newsletter() {
  const iframeRef = useRef(null);

  useEffect(() => {
    // Ensure iframe loads properly
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener("load", () => {
        iframe.style.width = "100%";
      });
    }
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Stay Updated with Browserating
        </h2>
        <p className="text-gray-600 mb-6">
          Subscribe to our newsletter for the latest browser testing insights
          and updates.
        </p>
        <div className="w-full">
          <iframe
            ref={iframeRef}
            src="https://embeds.beehiiv.com/276ea08f-2b4f-433b-82f9-6e3648ac6869?slim=true"
            data-test-id="beehiiv-embed"
            height="52"
            frameBorder="0"
            scrolling="no"
            className="w-full"
            style={{
              margin: 0,
              borderRadius: "0px !important",
              backgroundColor: "transparent",
            }}
          />
        </div>
      </div>
    </div>
  );
}
