import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.js";
import html from "../html.js";

export default function MyProjectsPage() {
  const { projects, togglePortfolioSelection, setProjectVisibility } = useApp();
  const [filterType, setFilterType] = useState("All");
  const [query, setQuery] = useState("");

  const visibleProjects = useMemo(() => {
    return projects.filter((project) => {
      const typeMatch = filterType === "All" || project.type === filterType;
      const titleMatch = project.title.toLowerCase().includes(query.toLowerCase().trim());
      return typeMatch && titleMatch;
    });
  }, [projects, filterType, query]);

  return html`<section>
    <div className="card controls">
      <h2>My Projects</h2>
      <p>Req 21-24: list projects, portfolio visibility, thesis drafts, final draft.</p>
      <div className="row">
        <input
          type="text"
          placeholder="Search by project title..."
          value=${query}
          onChange=${(e) => setQuery(e.target.value)}
        />
        <select value=${filterType} onChange=${(e) => setFilterType(e.target.value)}>
          <option>All</option>
          <option>Course Project</option>
          <option>Bachelor Project</option>
        </select>
      </div>
    </div>

    <div className="grid">
      ${visibleProjects.map(
        (project) => html`<article key=${project.id} className="card">
          <h3>${project.title}</h3>
          <p><strong>Type:</strong> ${project.type}</p>
          <p><strong>Course:</strong> ${project.course}</p>
          <p><strong>Portfolio:</strong> ${project.selectedForPortfolio ? "Visible" : "Hidden"}</p>
          <div className="row">
            <button onClick=${() => togglePortfolioSelection(project.id)}>
              ${project.selectedForPortfolio ? "Hide from Portfolio" : "Show on Portfolio"}
            </button>
            <button onClick=${() => setProjectVisibility(project.id, !project.visibility)}>
              ${project.visibility ? "Make Private" : "Make Public"}
            </button>
            <${Link} className="button-link" to=${`/projects/${project.id}`}>Open Project<//>
          </div>
        </article>`
      )}
    </div>
  </section>`;
}
