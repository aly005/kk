import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext.js";
import html from "../html.js";

function fullName(user) {
  return `${user.firstName} ${user.lastName}`;
}

export default function InvitationsPage() {
  const { users, projects, invitations, sendInstructorInvitation, respondToInvitation } = useApp();
  const [projectId, setProjectId] = useState(projects[0]?.id || "");
  const [instructorId, setInstructorId] = useState("u2");

  const instructors = users.filter((user) => user.role === "courseInstructor");

  const rows = useMemo(() => {
    return invitations.map((invitation) => {
      const inviter = users.find((user) => user.id === invitation.inviterId);
      const invitee = users.find((user) => user.id === invitation.inviteeId);
      const project = projects.find((item) => item.id === invitation.projectId);
      return {
        ...invitation,
        inviterName: inviter ? fullName(inviter) : invitation.inviterId,
        inviteeName: invitee ? fullName(invitee) : invitation.inviteeId,
        projectTitle: project ? project.title : invitation.projectId
      };
    });
  }, [invitations, projects, users]);

  return html`<section className="stack">
    <article className="card">
      <h2>Instructor Invitations (Req 25-30)</h2>
      <p>Invite by instructor identity and manage invitation status (pending/accepted/rejected).</p>
      <div className="row">
        <select value=${projectId} onChange=${(e) => setProjectId(e.target.value)}>
          ${projects.map(
            (project) => html`<option key=${project.id} value=${project.id}>${project.title}</option>`
          )}
        </select>
        <select value=${instructorId} onChange=${(e) => setInstructorId(e.target.value)}>
          ${instructors.map(
            (instructor) =>
              html`<option key=${instructor.id} value=${instructor.id}>
                ${fullName(instructor)} - ${instructor.email}
              </option>`
          )}
        </select>
        <button onClick=${() => sendInstructorInvitation(projectId, instructorId)}>Send Invitation</button>
      </div>
    </article>

    <article className="card">
      <h3>Invitation List</h3>
      <ul className="list">
        ${rows.map(
          (row) => html`<li key=${row.id} className="list-item">
            <div>
              <strong>${row.projectTitle}</strong>
              <p>From: ${row.inviterName} | To: ${row.inviteeName}</p>
              <small>Status: ${row.status}</small>
            </div>
            <div className="row">
              <button onClick=${() => respondToInvitation(row.id, "accepted")}>Accept</button>
              <button onClick=${() => respondToInvitation(row.id, "rejected")}>Reject</button>
              <button onClick=${() => respondToInvitation(row.id, "pending")}>Reset</button>
            </div>
          </li>`
        )}
      </ul>
    </article>
  </section>`;
}
