import React from "react";
import { useApp } from "../context/AppContext.js";
import html from "../html.js";

export default function NotificationsPage() {
  const { notifications, markNotification } = useApp();

  return html`<section className="card">
    <h2>Notifications (Req 35-36)</h2>
    <p>View all notifications and mark each one as read/unread.</p>
    <ul className="list">
      ${notifications.map(
        (notification) => html`<li key=${notification.id} className="list-item">
          <span className=${notification.read ? "muted" : ""}>${notification.text}</span>
          <div className="row">
            <button onClick=${() => markNotification(notification.id, true)}>Mark Read</button>
            <button onClick=${() => markNotification(notification.id, false)}>Mark Unread</button>
          </div>
        </li>`
      )}
    </ul>
  </section>`;
}
