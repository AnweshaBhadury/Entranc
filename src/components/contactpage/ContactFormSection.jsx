// src/components/Contact/ContactFormSection.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaEnvelope, FaFacebook } from "react-icons/fa";
import client from "../../lib/sanityClient";
import { submitContact } from "../../lib/sanityWriteClient";
import useLanguage from "../../hook/useLanguage";

const GROQ_QUERY = `*[_type == "contact"][0].ContactFormSection{
  heading,
  subText,
  socialLinks[]{ platform, url },
  mapEmbedUrl,
  buttonText
}`;

const fadeSlide = {
  hidden: { opacity: 0, x: 50 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// Localized fallbacks for English + German
const localizedFallbacks = {
  en: {
    heading: "Let's Get In Touch",
    subText: "We'd love to hear from you!",
    socialLinks: [
      { platform: "Instagram", url: "#" },
      { platform: "Facebook", url: "#" },
      { platform: "Email", url: "#" },
    ],
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2685.398625232924!2d11.25522801563303!3d47.69629897919098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479cf53610991307%3A0x253900971841a141!2sBavaria!5e0!3m2!1sen!2sde!4v1678283123456!5m2!1sen!2sde",
    // canonical form fields (we always use these now)
    formFields: [
      { label: "Name", type: "text", placeholder: "Your Name" },
      { label: "Email", type: "email", placeholder: "Your Email" },
      { label: "Message", type: "textarea", placeholder: "Your Message" },
    ],
    buttonText: "Submit",
    submittingText: "Submitting...",
    successMessage: "Message sent!",
    fillAllFields: "Please fill out all fields.",
    submitFailed: "Failed to submit form. Please try again later.",
  },
  du: {
    heading: "Lassen Sie uns in Kontakt treten",
    subText: "Wir freuen uns, von Ihnen zu hören!",
    socialLinks: [
      { platform: "Instagram", url: "#" },
      { platform: "Facebook", url: "#" },
      { platform: "Email", url: "#" },
    ],
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2685.398625232924!2d11.25522801563303!3d47.69629897919098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479cf53610991307%3A0x253900971841a141!2sBavaria!5e0!3m2!1sen!2sde!4v1678283123456!5m2!1sen!2sde",
    formFields: [
      { label: "Name", type: "text", placeholder: "Ihr Name" },
      { label: "Email", type: "email", placeholder: "Ihre E-Mail" },
      { label: "Nachricht", type: "textarea", placeholder: "Ihre Nachricht" },
    ],
    buttonText: "Absenden",
    submittingText: "Wird gesendet...",
    successMessage: "Nachricht gesendet!",
    fillAllFields: "Bitte füllen Sie alle Felder aus.",
    submitFailed: "Senden fehlgeschlagen. Bitte später erneut versuchen.",
  },
};

/**
 * Localize helper for Sanity locale objects.
 * - If value is string => return it
 * - If object with language keys => return field[lang] || field.en || first string value
 */
const localize = (field, language) => {
  if (field === null || field === undefined) return "";
  if (typeof field === "string") return field;
  if (typeof field === "object") {
    if (language && Object.prototype.hasOwnProperty.call(field, language)) {
      const val = field[language];
      if (typeof val === "string" && val.trim() !== "") return val;
    }
    if (Object.prototype.hasOwnProperty.call(field, "en") && typeof field.en === "string") {
      return field.en;
    }
    for (const k of Object.keys(field)) {
      if (typeof field[k] === "string" && field[k].trim() !== "") return field[k];
    }
  }
  return "";
};

const ContactFormSection = () => {
  const [language] = useLanguage();
  const tFallback = (key) => {
    const cur = localizedFallbacks[language] ?? localizedFallbacks.en;
    return cur[key];
  };

  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [docId, setDocId] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const idQuery = `*[_type == "contact"][0]._id`;
        const fetchedId = await client.fetch(idQuery);
        if (!mounted) return;
        setDocId(fetchedId);

        const res = await client.fetch(GROQ_QUERY);
        if (!mounted) return;

        // prefer Sanity -> localized fallback (note: we intentionally do not ask Sanity for formFields)
        const fallback = localizedFallbacks[language] ?? localizedFallbacks.en;
        const finalData = {
          heading: localize(res?.heading, language) || fallback.heading,
          subText: localize(res?.subText, language) || fallback.subText,
          socialLinks:
            Array.isArray(res?.socialLinks) && res.socialLinks.length ? res.socialLinks : fallback.socialLinks,
          mapEmbedUrl: res?.mapEmbedUrl ?? fallback.mapEmbedUrl,
          // we always use local canonical formFields from fallback (omitted from GROQ)
          formFields: fallback.formFields,
          buttonText: localize(res?.buttonText, language) || fallback.buttonText,
        };

        setData(finalData);

        // initialize form data keys (lowercased label)
        const initial = {};
        (finalData.formFields ?? []).forEach((field) => {
          initial[field.label.toLowerCase()] = "";
        });
        setFormData(initial);
      } catch (err) {
        console.error("Contact form fetch failed:", err);
        if (!mounted) return;
        setError("Failed to load form data");
        const fallback = localizedFallbacks[language] ?? localizedFallbacks.en;
        const finalData = {
          heading: fallback.heading,
          subText: fallback.subText,
          socialLinks: fallback.socialLinks,
          mapEmbedUrl: fallback.mapEmbedUrl,
          formFields: fallback.formFields,
          buttonText: fallback.buttonText,
        };
        setData(finalData);
        const initial = {};
        (finalData.formFields ?? []).forEach((field) => {
          initial[field.label.toLowerCase()] = "";
        });
        setFormData(initial);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }
    fetchData();
    return () => {
      mounted = false;
    };
  }, [language]);

  const heading = data?.heading ?? tFallback("heading");
  const subText = data?.subText ?? tFallback("subText");
  const socialLinks = Array.isArray(data?.socialLinks) ? data.socialLinks : tFallback("socialLinks");
  const mapEmbedUrl = data?.mapEmbedUrl ?? tFallback("mapEmbedUrl");
  const formFields = Array.isArray(data?.formFields) ? data.formFields : tFallback("formFields");
  const buttonText = data?.buttonText ?? tFallback("buttonText");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const sanitizeUrl = (url) => {
    try {
      if (!url) return "#";
      const u = new URL(url, window.location.origin);
      return u.href;
    } catch {
      return "#";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);
    setSuccess(false);

    // basic client-side validation: require all fields non-empty
    const requiredKeys = (formFields ?? []).map((f) => f.label.toLowerCase());
    const values = requiredKeys.reduce((acc, key) => ({ ...acc, [key]: (formData[key] || "").trim() }), {});
    const empty = requiredKeys.find((k) => !values[k]);
    if (empty) {
      setError(tFallback("fillAllFields"));
      setSubmitLoading(false);
      return;
    }

    const name = values.name ?? values["your name"] ?? values[requiredKeys[0]] ?? "";
    const email = values.email ?? values["your email"] ?? "";
    const message =
      values.message ?? values["your message"] ?? values[requiredKeys[requiredKeys.length - 1]] ?? "";

    try {
      // submitContact(name, email, message) is expected to create a contact document in Sanity
      await submitContact(name, email, message);
      setSuccess(true);
      // reset form
      const resetData = {};
      requiredKeys.forEach((k) => {
        resetData[k] = "";
      });
      setFormData(resetData);
    } catch (err) {
      console.error("Submit error:", err);
      setError(tFallback("submitFailed"));
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <section
      className="relative py-20 px-phone md:px-tab lg:px-desktop bg-bg-lightyellow rounded-3xl mt-10 overflow-hidden"
      id="scroll-contact"
      aria-labelledby="contact-form-heading"
    >
      <div className="absolute inset-0 flex items-center justify-center text-s2/10 z-0 pointer-events-none">
        {/* decorative */}
        <svg width="0" height="0" aria-hidden="true" focusable="false" />
      </div>

      <div className="relative z-10 container mx-auto grid md:grid-cols-2 gap-x-16 gap-y-12">
        <div className="space-y-6">
          <motion.h2
            id="contact-form-heading"
            variants={fadeSlide}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="text-h2-phone md:text-h2-tab font-bold text-primary leading-tight"
          >
            {heading}
          </motion.h2>

          <motion.p
            variants={fadeSlide}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="text-dark-gray text-lg"
          >
            {subText}
          </motion.p>

          <motion.div
            variants={fadeSlide}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="flex gap-4 pt-4"
          >
            {socialLinks.map((link, idx) => {
              const platform = (link.platform || "").toLowerCase();
              const Icon =
                platform.includes("instagram") ? FaInstagram : platform.includes("facebook") ? FaFacebook : FaEnvelope;
              const href = sanitizeUrl(link.url);
              return (
                <a
                  key={link.platform ?? idx}
                  href={href}
                  className="bg-s2 text-m-s2 p-4 rounded-xl text-2xl hover:scale-110 transition-transform"
                  target={href === "#" ? undefined : "_blank"}
                  rel={href === "#" ? undefined : "noopener noreferrer"}
                  aria-label={link.platform ?? `social-${idx}`}
                >
                  <Icon />
                </a>
              );
            })}
          </motion.div>

          {mapEmbedUrl && mapEmbedUrl !== "#" && (
            <motion.div
              variants={fadeSlide}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="rounded-2xl overflow-hidden shadow-lg mt-8"
            >
              <iframe
                src={sanitizeUrl(mapEmbedUrl)}
                className="w-full h-80 border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
              />
            </motion.div>
          )}
        </div>

        <motion.div
          variants={fadeSlide}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="bg-white p-8 rounded-2xl shadow-lg"
        >
          <h3 className="text-xl font-bold text-primary mb-8">{heading}</h3>

          <form className="space-y-6" onSubmit={handleSubmit} aria-live="polite">
            {formFields.map((field, idx) => {
              const name = field.label.toLowerCase();
              const value = formData[name] ?? "";
              return (
                <div key={name ?? idx}>
                  <label htmlFor={`field-${idx}`} className="block text-base font-semibold text-primary mb-2">
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      id={`field-${idx}`}
                      name={name}
                      rows={5}
                      placeholder={field.placeholder}
                      value={value}
                      onChange={handleChange}
                      className="w-full p-4 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:border-s2 focus:bg-white"
                    />
                  ) : (
                    <input
                      id={`field-${idx}`}
                      type={field.type || "text"}
                      name={name}
                      placeholder={field.placeholder}
                      value={value}
                      onChange={handleChange}
                      className="w-full p-4 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:border-s2 focus:bg-white"
                    />
                  )}
                </div>
              );
            })}

            <button
              type="submit"
              className="w-full bg-m-s2 text-white font-bold py-4 rounded-xl text-lg hover:bg-yellow-800 transition-colors"
              disabled={submitLoading}
              aria-busy={submitLoading}
            >
              {submitLoading ? tFallback("submittingText") : buttonText}
            </button>
          </form>

          <div className="mt-4" role="status" aria-live="polite">
            {success && <p className="text-green-500">{tFallback("successMessage")}</p>}
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactFormSection;
