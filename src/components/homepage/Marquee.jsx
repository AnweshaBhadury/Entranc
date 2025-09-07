// src/components/Marquee/Marquee.jsx
import React, { useEffect, useState } from "react";
import { HiOutlineUserGroup } from "react-icons/hi";
import bulbIcon from "../../assets/bulb.svg";
import client from "../../lib/sanityClient";

// GROQ query to fetch Marquee Section from Sanity
const GROQ_QUERY = `*[_type == "home"][0].Marquee{
  items[]{
    text,
    iconType
  }
}`;

const Marquee = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback items if Sanity data is empty
  const fallbackItems = [
    { text: "Power to the People.", iconType: "userGroup" },
    { text: "Energy by the People.", iconType: "bulb" },
    { text: "Power to the People.", iconType: "userGroup" },
    { text: "Energy by the People.", iconType: "bulb" },
  ];

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const data = await client.fetch(GROQ_QUERY);
        if (!mounted) return;

        if (data?.items?.length > 0) {
          setItems([...data.items, ...data.items]); // duplicate for seamless loop
        } else {
          setItems(fallbackItems);
        }
      } catch (err) {
        console.error("Sanity fetch error:", err);
        if (!mounted) return;
        setError(err);
        setItems(fallbackItems);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="py-20 bg-gray-100 overflow-hidden whitespace-nowrap -mt-16 relative z-0">
      <div className="animate-marquee-fast flex items-center">
        {loading && <p className="text-m-primary mx-12">Loading...</p>}
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {item.iconType === "userGroup" && (
              <HiOutlineUserGroup className="text-h-marquee-phone md:text-h-marquee-tab lg:text-h-marquee text-m-primary mx-12" />
            )}
            {item.iconType === "bulb" && (
              <img
                src={bulbIcon}
                alt="Lightbulb icon"
                className="h-16 md:h-24 lg:h-32 w-auto mx-12"
              />
            )}
            <h2 className="text-h-marquee-phone md:text-h-marquee-tab lg:text-h-marquee font-bold text-m-primary mx-12">
              {item.text}
            </h2>
          </React.Fragment>
        ))}
      </div>

      {error && (
        <div className="mt-4 text-red-500 text-sm text-center">
          Could not load marquee items.
        </div>
      )}
    </div>
  );
};

export default Marquee;
