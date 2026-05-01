import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.js";
import InvitationsPage from "./pages/InvitationsPage.js";
import MyProjectsPage from "./pages/MyProjectsPage.js";
import NotificationsPage from "./pages/NotificationsPage.js";
import ProjectDetailsPage from "./pages/ProjectDetailsPage.js";

export default function App() {
  const e = React.createElement;
  return e(
    Routes,
    null,
    e(
      Route,
      { path: "/", element: e(Layout) },
      e(Route, { index: true, element: e(MyProjectsPage) }),
      e(Route, { path: "projects/:projectId", element: e(ProjectDetailsPage) }),
      e(Route, { path: "invitations", element: e(InvitationsPage) }),
      e(Route, { path: "notifications", element: e(NotificationsPage) }),
      e(Route, { path: "*", element: e(Navigate, { to: "/", replace: true }) })
    )
  );
}
