"use client";

import React, { useState } from "react";

export interface AccordionItem {
  question: string;
  answer: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpenIndex?: number;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenIndex = 0,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full divide-y divide-[rgba(255,255,255,0.08)] border-t border-b border-[rgba(255,255,255,0.08)] rounded-2xl overflow-hidden">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={`transition-colors duration-200 ${
              isOpen ? "bg-[#141414]" : "bg-transparent hover:bg-[rgba(255,255,255,0.02)]"
            }`}
          >
            <button
              type="button"
              onClick={() => toggleItem(index)}
              className="w-full py-5 px-6 flex items-center justify-between gap-4 text-left font-semibold text-base md:text-[16px] text-[#FAFAFA] focus:outline-none cursor-pointer"
            >
              <span>{item.question}</span>
              <span
                className={`flex shrink-0 w-8 h-8 items-center justify-center rounded-full transition-transform duration-300 ${
                  isOpen ? "rotate-180 bg-[rgba(254,150,56,0.12)] text-[#FE9638]" : "text-[#9A9A9A]"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>
            {isOpen && (
              <div className="px-6 pb-6 text-[15px] text-[#B5B5B5] leading-[1.6] animate-fade-in-up">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
