/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from "react";
import {
  BriefcaseIcon,
  CalendarDaysIcon,
  CodeBracketIcon,
  MapPinIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";
import { SiteFooter } from "../components/layout/SiteFooter";
import { SiteHeader } from "../components/layout/SiteHeader";
import {
  employmentHistory,
  type JobCategory,
} from "../data/employment";
import "./EmploymentHistory.css";

type Category = "All" | JobCategory;

const filters: Category[] = ["All", "Engineering", "UX/UI Design"];

const categoryIcons: Record<JobCategory, React.ReactNode> = {
  Engineering: <CodeBracketIcon className="w-4 h-4" />,
  "UX/UI Design": <PaintBrushIcon className="w-4 h-4" />,
};

const categoryBadgeClasses: Record<JobCategory, string> = {
  Engineering: "employment-history-page__category-badge--engineering",
  "UX/UI Design": "employment-history-page__category-badge--design",
};

const timelineDotClasses: Record<JobCategory, string> = {
  Engineering: "employment-history-page__timeline-dot--engineering",
  "UX/UI Design": "employment-history-page__timeline-dot--design",
};

export const EmploymentHistory: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<Category>("All");

  const filteredJobs =
    activeFilter === "All"
      ? employmentHistory
      : employmentHistory.filter((job) => job.category === activeFilter);

  return (
    <div className="employment-history-page">
      <SiteHeader activePage="experience" />

      <main className="employment-history-page__main">
        <div className="employment-history-page__header">
          <div className="employment-history-page__eyebrow">
            <BriefcaseIcon className="employment-history-page__eyebrow-icon" />
            <span className="employment-history-page__eyebrow-text">
              Career History
            </span>
          </div>

          <h1 className="employment-history-page__title">Employment History</h1>

          <p className="employment-history-page__intro">
            three years across software engineering, front-end development, and
            UX/UI design — building products from concept to production for
            clients across fashion, security, transit, and creative industries.
          </p>

          <div className="employment-history-page__stats">
            {[
              { value: "3+", label: "Years Experience" },
              { value: "3", label: "Roles Held" },
              { value: "4", label: "Industries" },
              { value: "2", label: "Disciplines" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="employment-history-page__stat-value">
                  {stat.value}
                </div>
                <div className="employment-history-page__stat-label">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="employment-history-page__filters">
          {filters.map((filter) => {
            const stateClass =
              activeFilter === filter
                ? "employment-history-page__filter-button--active"
                : "employment-history-page__filter-button--inactive";

            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`employment-history-page__filter-button ${stateClass}`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <div className="employment-history-page__timeline">
          <div className="employment-history-page__timeline-line" />

          {filteredJobs.map((job) => (
            <div key={job.id} className="employment-history-page__timeline-item">
              <div
                className={`employment-history-page__timeline-dot ${timelineDotClasses[job.category]}`}
              />

              <article className="employment-history-page__card">
                <div className="employment-history-page__card-header">
                  <div className="employment-history-page__card-title-group">
                    <div className="employment-history-page__card-badges">
                      <span
                        className={`employment-history-page__category-badge ${categoryBadgeClasses[job.category]}`}
                      >
                        {categoryIcons[job.category]}
                        {job.category}
                      </span>
                    </div>

                    <h2 className="employment-history-page__role">{job.role}</h2>
                    <p className="employment-history-page__company">
                      {job.companyDisplay ?? job.company}
                    </p>
                  </div>

                  <div className="employment-history-page__meta">
                    <div className="employment-history-page__meta-item employment-history-page__meta-item--primary">
                      <CalendarDaysIcon className="employment-history-page__meta-icon" />
                      {job.period}
                    </div>
                    <div className="employment-history-page__meta-item employment-history-page__meta-item--secondary">
                      <MapPinIcon className="employment-history-page__meta-icon" />
                      {job.location}
                    </div>
                  </div>
                </div>

                <p className="employment-history-page__summary">{job.summary}</p>

                <div className="employment-history-page__highlight-groups">
                  {job.highlights.map((section) => (
                    <section key={section.label}>
                      <h3 className="employment-history-page__highlight-label">
                        {section.label}
                      </h3>
                      <ul className="employment-history-page__highlight-list">
                        {section.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="employment-history-page__highlight-item"
                          >
                            <span className="employment-history-page__highlight-bullet" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>

                <div className="employment-history-page__tech-list">
                  {job.tech.map((tag) => (
                    <span key={tag} className="employment-history-page__tech-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </div>
          ))}
        </div>

        <div className="employment-history-page__footer">
          <div>
            <p className="employment-history-page__footer-copy">
              Want to see what I'm building next?
            </p>
            <p className="employment-history-page__footer-copy-strong">
              Currently open to full-time software engineering roles.
            </p>
          </div>

          <a
            href="mailto:salome.a.miller@gmail.com"
            className="employment-history-page__footer-link"
          >
            Get in Touch
          </a>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};
