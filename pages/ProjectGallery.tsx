import React from "react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { employmentHistory } from "../data/employment";
import { SiteFooter } from "../components/layout/SiteFooter";
import { SiteHeader } from "../components/layout/SiteHeader";
import "./ProjectGallery.css";

const featuredProjectIds = [1, 2, 4];

const projectLabels: Record<number, string> = {
  1: "Fashion · Web Development",
  2: "Photography · Full-Stack Platform",
  4: "Security · UX/UI & Development",
};

const projectLinks: Partial<Record<number, string>> = {
  4: "https://millstainc.com/",
};

const featuredProjects = featuredProjectIds.map((id) => {
  const project = employmentHistory.find((job) => job.id === id);

  if (!project) {
    throw new Error(`Featured project ${id} is missing from employment history`);
  }

  return project;
});

export const ProjectGallery: React.FC = () => {
  return (
    <div className="project-gallery-page">
      <SiteHeader activePage="projects" />

      <main className="project-gallery-page__main">
        <header className="project-gallery-page__header">
          <p className="project-gallery-page__eyebrow">Selected Work</p>
          <h1 className="project-gallery-page__title">Projects built from idea to launch.</h1>
          <p className="project-gallery-page__intro">
            A selection of client platforms where I combined product thinking,
            UX/UI design, and full-stack development to solve real business
            problems.
          </p>
        </header>

        <div className="project-gallery-page__grid">
          {featuredProjects.map((project, index) => (
            <article className="project-card" key={project.id}>
              <div className="project-card__visual" aria-hidden="true">
                <span className="project-card__number">0{index + 1}</span>
                <span className="project-card__monogram">
                  {project.company.slice(0, 2).toUpperCase()}
                </span>
              </div>

              <div className="project-card__content">
                <p className="project-card__label">{projectLabels[project.id]}</p>
                <h2 className="project-card__title">{project.company}</h2>
                <p className="project-card__summary">{project.summary}</p>

                <div className="project-card__outcomes">
                  {project.highlights[0].bullets.slice(0, 2).map((bullet) => (
                    <p key={bullet}>{bullet}</p>
                  ))}
                </div>

                <div className="project-card__footer">
                  <div className="project-card__tech">
                    {project.tech.slice(0, 6).map((technology) => (
                      <span key={technology}>{technology}</span>
                    ))}
                  </div>
                  {projectLinks[project.id] && (
                    <a
                      href={projectLinks[project.id]}
                      target="_blank"
                      rel="noreferrer"
                      className="project-card__link"
                    >
                      Visit live site
                      <ArrowTopRightOnSquareIcon />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="project-gallery-page__cta">
          <div>
            <p>Have a project in mind?</p>
            <h2>Let’s build something useful and memorable.</h2>
          </div>
          <a href="mailto:salome.a.miller@gmail.com">Start a conversation</a>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};
