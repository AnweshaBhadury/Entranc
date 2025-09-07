// src/components/ContactForm/ContactFormSection.jsx
import React, { useEffect, useState } from "react";
import ScrollReveal from "../utils/ScrollReveal";
import { FaInstagram, FaEnvelope, FaFacebook, FaDrawPolygon } from "react-icons/fa";
import client from "../../lib/sanityClient";

const GROQ_QUERY = `*[_type == "contact"][0].ContactFormSection{
  heading,
  subText,
  socialLinks[]{
    platform,
    url
  },
  mapEmbedUrl,
  formFields[]{
    label,
    type,
    placeholder
  },
  buttonText
}`;

const ContactFormSection = () => {
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [docId, setDocId] = useState(null);

  // Fetch form data & document ID
  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        // Fetch document ID
        const idQuery = `*[_type == "contact"][0]._id`;
        const fetchedId = await client.fetch(idQuery);
        if (!mounted) return;
        setDocId(fetchedId);

        // Fetch ContactFormSection data
        const res = await client.fetch(GROQ_QUERY);
        if (!mounted) return;

        // Fallback data
        const fallback = {
          heading: "Let's Get In Touch",
          subText: "We'd love to hear from you!",
          socialLinks: [
            { platform: "Instagram", url: "#" },
            { platform: "Facebook", url: "#" },
            { platform: "Email", url: "#" },
          ],
          mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2685.398625232924!2d11.25522801563303!3d47.69629897919098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479cf53610991307%3A0x253900971841a141!2sBavaria!5e0!3m2!1sen!2sde!4v1678283123456!5m2!1sen!2sde",
          formFields: [
            { label: "Name", type: "text", placeholder: "Your Name" },
            { label: "Email", type: "email", placeholder: "Your Email" },
            { label: "Message", type: "textarea", placeholder: "Your Message" },
          ],
          buttonText: "Submit",
        };

        const finalData = res || fallback;
        setData(finalData);

        // Initialize formData
        const initialFormData = {};
        (finalData.formFields ?? []).forEach(field => {
          initialFormData[field.label.toLowerCase()] = "";
        });
        setFormData(initialFormData);
      } catch (err) {
        console.error("Sanity fetch error:", err);
        if (!mounted) return;
        setError("Failed to load form data");
        // Fallback values
        const fallback = {
          heading: "Let's Get In Touch",
          subText: "We'd love to hear from you!",
          socialLinks: [
            { platform: "Instagram", url: "#" },
            { platform: "Facebook", url: "#" },
            { platform: "Email", url: "#" },
          ],
          mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2685.398625232924!2d11.25522801563303!3d47.69629897919098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479cf53610991307%3A0x253900971841a141!2sBavaria!5e0!3m2!1sen!2sde!4v1678283123456!5m2!1sen!2sde",
          formFields: [
            { label: "Name", type: "text", placeholder: "Your Name" },
            { label: "Email", type: "email", placeholder: "Your Email" },
            { label: "Message", type: "textarea", placeholder: "Your Message" },
          ],
          buttonText: "Submit",
        };
        setData(fallback);

        const initialFormData = {};
        (fallback.formFields ?? []).forEach(field => {
          initialFormData[field.label.toLowerCase()] = "";
        });
        setFormData(initialFormData);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    fetchData();
    return () => { mounted = false; };
  }, []);

  const heading = data?.heading;
  const subText = data?.subText;
  const socialLinks = data?.socialLinks;
  const mapEmbedUrl = data?.mapEmbedUrl;
  const formFields = data?.formFields;
  const buttonText = data?.buttonText;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!docId) return setError("Document not loaded yet.");
    setSubmitLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await client
        .patch(docId)
        .setIfMissing({ ContactFormSection: { submissions: [] } })
        .append("ContactFormSection.submissions", [
          {
            name: formData.name || "",
            email: formData.email || "",
            message: formData.message || "",
            submittedAt: new Date().toISOString(),
          },
        ])
        .commit();

      setSuccess(true);

      // Reset form
      const resetData = {};
      formFields.forEach(field => {
        resetData[field.label.toLowerCase()] = "";
      });
      setFormData(resetData);
    } catch (err) {
      console.error("Form submission error:", err);
      setError("Failed to submit form.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <section className="relative py-20 px-phone md:px-tab lg:px-desktop bg-bg-lightyellow rounded-3xl mt-10 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center text-s2/10 z-0">
        <FaDrawPolygon size={800} />
      </div>

      <div className="relative z-10 container mx-auto grid md:grid-cols-2 gap-x-16 gap-y-12">
        <ScrollReveal>
          <div className="space-y-6">
            <h2 className="text-h2-phone md:text-h2-tab font-bold text-primary leading-tight">{heading}</h2>
            <p className="text-dark-gray text-lg">{subText}</p>

            <div className="flex gap-4 pt-4">
              {socialLinks.map((link, idx) => {
                const Icon =
                  link.platform === "Instagram"
                    ? FaInstagram
                    : link.platform === "Facebook"
                    ? FaFacebook
                    : FaEnvelope;
                return (
                  <a key={idx} href={link.url} className="bg-s2 text-m-s2 p-4 rounded-xl text-2xl hover:scale-110 transition-transform">
                    <Icon />
                  </a>
                );
              })}
            </div>

            {mapEmbedUrl && (
              <div className="rounded-2xl overflow-hidden shadow-lg mt-8">
                <iframe
                  src={mapEmbedUrl}
                  className="w-full h-80 border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location Map"
                />
              </div>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-primary mb-8">Drop A Message</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {formFields.map((field, idx) => (
                <div key={idx}>
                  <label className="block text-base font-semibold text-primary mb-2">{field.label}</label>
                  {field.type === "textarea" ? (
                    <textarea
                      name={field.label.toLowerCase()}
                      rows={5}
                      placeholder={field.placeholder}
                      value={formData[field.label.toLowerCase()] || ""}
                      onChange={handleChange}
                      className="w-full p-4 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:border-s2 focus:bg-white"
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.label.toLowerCase()}
                      placeholder={field.placeholder}
                      value={formData[field.label.toLowerCase()] || ""}
                      onChange={handleChange}
                      className="w-full p-4 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:border-s2 focus:bg-white"
                    />
                  )}
                </div>
              ))}
              <button
                type="submit"
                className="w-full bg-m-s2 text-white font-bold py-4 rounded-xl text-lg hover:bg-yellow-800 transition-colors"
              >
                {submitLoading ? "Submitting..." : buttonText}
              </button>
            </form>
            {success && <p className="mt-4 text-green-500">Message sent!</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ContactFormSection;
