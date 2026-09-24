"use client";

import { useState } from "react";
import Link from "next/link";
import "./murai.css";
import MuraiHeader from "./MuraiHeader";
import MuraiShopBenefits from "./MuraiShopBenefits";
import MuraiShopFooter from "./MuraiShopFooter";
import { MURAI_FAQ_CATEGORIES } from "@/data/muraiFaq";

function formatAnswer(answer: string) {
  return answer.split("\n").map((line) => line.trim()).filter(Boolean);
}

export default function MuraiFaqPage() {
  const [openId, setOpenId] = useState<string | null>(MURAI_FAQ_CATEGORIES[0]?.items[0]?.id ?? null);

  return (
    <div className="murai-home" data-page="faq">
      <MuraiHeader />
      <main>
        <section className="breadcrumb__section">
          <div className="breadcrumb__bg">
            <img
              className="breadcrumb__bg-image"
              src="/murai/banners/banner-about.jpg"
              alt=""
              width={1600}
              height={334}
              decoding="async"
            />
            <div className="container">
              <div className="breadcrumb__content">
                <h1 className="breadcrumb__content--title">FAQ</h1>
                <ul className="breadcrumb__content--menu">
                  <li className="breadcrumb__content--menu__items">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumb__content--menu__items">
                    <span>FAQ</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="faq-section">
          <div className="faq-container">
            <div className="faq-intro">
              <h2>Frequently Asked Questions</h2>
              <p>
                Find answers about MuRa@23 sarees, orders, shipping, payments, returns, and more. Need
                more help?{" "}
                <Link href="/contact">Contact us</Link>.
              </p>
            </div>

            {MURAI_FAQ_CATEGORIES.map((category) => (
              <div key={category.id} className="faq-category">
                <h3 className="faq-category-title">{category.title}</h3>
                <div className="faq-list">
                  {category.items.map((item) => {
                    const isOpen = openId === item.id;
                    return (
                      <div key={item.id} className={`faq-item${isOpen ? " is-open" : ""}`}>
                        <button
                          type="button"
                          className="faq-question"
                          aria-expanded={isOpen}
                          onClick={() => setOpenId(isOpen ? null : item.id)}
                        >
                          <span>{item.question}</span>
                          <span className="faq-toggle" aria-hidden="true" />
                        </button>
                        {isOpen ? (
                          <div className="faq-answer">
                            {formatAnswer(item.answer).map((line, index) =>
                              line.startsWith("•") ? (
                                <p key={`${item.id}-${index}`} className="faq-answer-line">{line}</p>
                              ) : (
                                <p key={`${item.id}-${index}`}>{line}</p>
                              ),
                            )}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <MuraiShopBenefits />
      </main>
      <MuraiShopFooter />
    </div>
  );
}
