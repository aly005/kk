import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useApp } from "../context/AppContext.js";
import html from "../html.js";

function userLabel(users, id) {
  const user = users.find((item) => item.id === id);
  return user ? `${user.firstName} ${user.lastName}` : id;
}

export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  const {
    users,
    currentUser,
    getProject,
    addDraft,
    setFinalDraft,
    addTask,
    reorderTaskByImportance,
    removeCollaborator,
    addComment,
    editComment,
    removeComment,
    rateProject
  } = useApp();

  const project = getProject(projectId);
  const [draftName, setDraftName] = useState("");
  const [taskForm, setTaskForm] = useState({ title: "", description: "", importance: 3 });
  const [commentText, setCommentText] = useState({});
  const [rating, setRating] = useState(5);
  const [note, setNote] = useState("");

  const instructorView = true;
  const avgRating = useMemo(() => {
    if (!project || project.ratings.length === 0) return "N/A";
    const sum = project.ratings.reduce((acc, item) => acc + item.value, 0);
    return (sum / project.ratings.length).toFixed(1);
  }, [project]);

  if (!project) return html`<p className="card">Project not found.</p>`;

  const creatorOnly = project.creatorId === currentUser.id;

  return html`<section className="stack">
    <article className="card">
      <h2>${project.title}</h2>
      <p><strong>Type:</strong> ${project.type} | <strong>Average Rating:</strong> ${avgRating} / 5</p>
    </article>

    <article className="card">
      <h3>Thesis Drafts (Req 23-24)</h3>
      ${
        project.type === "Bachelor Project"
          ? html`<${React.Fragment}>
              <div className="row">
                <input
                  value=${draftName}
                  onChange=${(e) => setDraftName(e.target.value)}
                  placeholder="Example: Thesis Draft v3.pdf"
                />
                <button
                  onClick=${() => {
                    if (!draftName.trim()) return;
                    addDraft(project.id, draftName);
                    setDraftName("");
                  }}
                >
                  Upload Draft
                </button>
              </div>
              <ul className="list">
                ${project.drafts.map(
                  (draft) => html`<li key=${draft.id} className="list-item">
                    <span>${draft.name}</span>
                    <button onClick=${() => setFinalDraft(project.id, draft.id)}>
                      ${draft.isFinal ? "Final Draft" : "Set as Final"}
                    </button>
                  </li>`
                )}
              </ul>
            <//>`
          : html`<p>Thesis drafts are only enabled for bachelor projects.</p>`
      }
    </article>

    <article className="card">
      <h3>Collaborators (Req 31)</h3>
      <ul className="list">
        ${project.collaborators.map(
          (id) => html`<li key=${id} className="list-item">
            <span>${userLabel(users, id)}</span>
            ${creatorOnly && id !== currentUser.id
              ? html`<button onClick=${() => removeCollaborator(project.id, id)}>Remove</button>`
              : null}
          </li>`
        )}
      </ul>
    </article>

    <article className="card">
      <h3>Task Board (Req 32-34)</h3>
      <div className="row">
        <input
          placeholder="Task title"
          value=${taskForm.title}
          onChange=${(e) => setTaskForm((prev) => ({ ...prev, title: e.target.value }))}
        />
        <input
          placeholder="Short task description"
          value=${taskForm.description}
          onChange=${(e) => setTaskForm((prev) => ({ ...prev, description: e.target.value }))}
        />
        <select
          value=${taskForm.importance}
          onChange=${(e) => setTaskForm((prev) => ({ ...prev, importance: Number(e.target.value) }))}
        >
          <option value="1">1 (Highest)</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5 (Lowest)</option>
        </select>
        <button
          onClick=${() => {
            if (!taskForm.title.trim() || !taskForm.description.trim()) return;
            addTask(project.id, taskForm);
            setTaskForm({ title: "", description: "", importance: 3 });
          }}
        >
          Add Task
        </button>
        ${creatorOnly
          ? html`<button onClick=${() => reorderTaskByImportance(project.id)}>Reorder by Importance</button>`
          : null}
      </div>
      <ul className="list">
        ${project.tasks.map(
          (task) => html`<li key=${task.id} className="list-item task-item">
            <div>
              <strong>${task.title}</strong>
              <p>${task.description}</p>
              <small>Importance: ${task.importance}</small>
            </div>
            <div className="comments-box">
              <h4>Feedback on task (Req 37)</h4>
              <ul className="list">
                ${task.comments.map(
                  (comment) => html`<li key=${comment.id} className="comment-item">
                    <p><strong>${userLabel(users, comment.authorId)}:</strong> ${comment.text}</p>
                    <div className="row">
                      <button
                        onClick=${() => {
                          const edited = window.prompt("Edit comment", comment.text);
                          if (edited && edited.trim()) {
                            editComment(project.id, task.id, comment.id, edited.trim());
                          }
                        }}
                      >
                        Edit
                      </button>
                      <button onClick=${() => removeComment(project.id, task.id, comment.id)}>Delete</button>
                    </div>
                  </li>`
                )}
              </ul>
              ${instructorView
                ? html`<div className="row">
                    <input
                      placeholder="Add feedback comment..."
                      value=${commentText[task.id] || ""}
                      onChange=${(e) =>
                        setCommentText((prev) => ({ ...prev, [task.id]: e.target.value }))}
                    />
                    <button
                      onClick=${() => {
                        const text = (commentText[task.id] || "").trim();
                        if (!text) return;
                        addComment(project.id, task.id, text);
                        setCommentText((prev) => ({ ...prev, [task.id]: "" }));
                      }}
                    >
                      Add
                    </button>
                  </div>`
                : null}
            </div>
          </li>`
        )}
      </ul>
    </article>

    <article className="card">
      <h3>Project Rating (Req 38)</h3>
      <div className="row">
        <select value=${rating} onChange=${(e) => setRating(Number(e.target.value))}>
          ${[1, 2, 3, 4, 5].map((value) => html`<option key=${value} value=${value}>${value} / 5</option>`)}
        </select>
        <input value=${note} onChange=${(e) => setNote(e.target.value)} placeholder="Optional note..." />
        <button onClick=${() => rateProject(project.id, rating, note.trim())}>Save Rating</button>
      </div>
    </article>
  </section>`;
}
