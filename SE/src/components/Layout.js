import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import html from "../html.js";

const links = [
  { to: "/", label: "My Projects" },
  { to: "/invitations", label: "Invitations" },
  { to: "/notifications", label: "Notifications" }
];

export default function Layout() {
  return html`<div className="app-shell">
    <header className="topbar">
      <h1>GUC Project Portfolio - MS2</h1>
      <p>Requirements 21-38 prototype (React + dummy data)</p>
    </header>
    <nav className="nav">
      ${links.map(
        (link) =>
          html`<${NavLink} key=${link.to} to=${link.to} end=${link.to === "/"}>
            ${link.label}
          <//>`
      )}
    </nav>
    <main className="content"><${Outlet} /></main>
  </div>`;
}
