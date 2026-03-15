

import alwin from "../assets/alwin.jpg";
import dinn from "../assets/dinn.jpg";
import gerald from "../assets/gerald.jpg";
import mark from "../assets/mark.jpg";
import { useState } from "react";

const members = [
  { src: alwin, name: "Alwin" },
  { src: dinn, name: "Dinn" },
  { src: gerald, name: "Gerald" },
  { src: mark, name: "Mark" },
];

const Featuring = () => {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  return (
    <section className="w-full py-12 px-4 md:px-16">
      <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-8">
        Featuring
      </h2>
      <div className="flex flex-wrap justify-center gap-6">
        {members.map(({ src, name }) => (
          <button
            type="button"
            key={name}
            onClick={() => setSelectedMember(name)}
            aria-pressed={selectedMember === name}
            className="group relative flex flex-col items-center gap-2 cursor-pointer"
          >
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden ring-2 transition-all duration-300 shadow-lg active:scale-95 md:group-hover:scale-105 ${
                selectedMember === name
                  ? "ring-violet-500 scale-105"
                  : "ring-violet-500/40 md:group-hover:ring-violet-500"
              }`}
            >
              <img
                src={src}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className={`text-xs font-medium transition-colors duration-200 ${
                selectedMember === name
                  ? "text-violet-500"
                  : "text-foreground/70 md:group-hover:text-violet-500"
              }`}
            >
              {name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default Featuring