import React, { createContext, useContext, useMemo, useState } from "react";
import {
  currentUser,
  initialInvitations,
  initialNotifications,
  initialProjects,
  users
} from "../data.js";

const AppContext = createContext(null);

const byId = (arr, id) => arr.find((item) => item.id === id);

export function AppProvider({ children }) {
  const [projects, setProjects] = useState(initialProjects);
  const [invitations, setInvitations] = useState(initialInvitations);
  const [notifications, setNotifications] = useState(initialNotifications);

  const value = useMemo(
    () => ({
      users,
      currentUser,
      projects,
      invitations,
      notifications,
      getProject: (id) => byId(projects, id),
      togglePortfolioSelection: (projectId) => {
        setProjects((prev) =>
          prev.map((project) =>
            project.id === projectId
              ? { ...project, selectedForPortfolio: !project.selectedForPortfolio }
              : project
          )
        );
      },
      setProjectVisibility: (projectId, visible) => {
        setProjects((prev) =>
          prev.map((project) => (project.id === projectId ? { ...project, visibility: visible } : project))
        );
      },
      addDraft: (projectId, draftName) => {
        const newDraft = {
          id: `d${Date.now()}`,
          name: draftName.trim(),
          isFinal: false
        };
        setProjects((prev) =>
          prev.map((project) =>
            project.id === projectId ? { ...project, drafts: [...project.drafts, newDraft] } : project
          )
        );
      },
      setFinalDraft: (projectId, draftId) => {
        setProjects((prev) =>
          prev.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  drafts: project.drafts.map((draft) => ({ ...draft, isFinal: draft.id === draftId }))
                }
              : project
          )
        );
      },
      sendInstructorInvitation: (projectId, instructorId) => {
        const invitation = {
          id: `inv${Date.now()}`,
          projectId,
          inviterId: currentUser.id,
          inviteeId: instructorId,
          inviteeRole: "courseInstructor",
          status: "pending"
        };
        setInvitations((prev) => [...prev, invitation]);
        const instructor = byId(users, instructorId);
        const project = byId(projects, projectId);
        setNotifications((prev) => [
          {
            id: `n${Date.now()}`,
            userId: currentUser.id,
            text: `${instructor.firstName} ${instructor.lastName} was invited to ${project.title}.`,
            read: false
          },
          ...prev
        ]);
      },
      respondToInvitation: (invitationId, status) => {
        setInvitations((prev) =>
          prev.map((invitation) => (invitation.id === invitationId ? { ...invitation, status } : invitation))
        );
      },
      removeCollaborator: (projectId, collaboratorId) => {
        setProjects((prev) =>
          prev.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  collaborators: project.collaborators.filter((id) => id !== collaboratorId)
                }
              : project
          )
        );
      },
      addTask: (projectId, payload) => {
        const newTask = {
          id: `t${Date.now()}`,
          title: payload.title,
          description: payload.description,
          importance: payload.importance,
          comments: []
        };
        setProjects((prev) =>
          prev.map((project) =>
            project.id === projectId ? { ...project, tasks: [...project.tasks, newTask] } : project
          )
        );
      },
      reorderTaskByImportance: (projectId) => {
        setProjects((prev) =>
          prev.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  tasks: [...project.tasks].sort((a, b) => a.importance - b.importance)
                }
              : project
          )
        );
      },
      addComment: (projectId, taskId, text, instructorId = "u2") => {
        setProjects((prev) =>
          prev.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  tasks: project.tasks.map((task) =>
                    task.id === taskId
                      ? {
                          ...task,
                          comments: [
                            ...task.comments,
                            {
                              id: `c${Date.now()}`,
                              authorId: instructorId,
                              text,
                              createdAt: new Date().toLocaleString()
                            }
                          ]
                        }
                      : task
                  )
                }
              : project
          )
        );
      },
      editComment: (projectId, taskId, commentId, text) => {
        setProjects((prev) =>
          prev.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  tasks: project.tasks.map((task) =>
                    task.id === taskId
                      ? {
                          ...task,
                          comments: task.comments.map((comment) =>
                            comment.id === commentId ? { ...comment, text } : comment
                          )
                        }
                      : task
                  )
                }
              : project
          )
        );
      },
      removeComment: (projectId, taskId, commentId) => {
        setProjects((prev) =>
          prev.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  tasks: project.tasks.map((task) =>
                    task.id === taskId
                      ? {
                          ...task,
                          comments: task.comments.filter((comment) => comment.id !== commentId)
                        }
                      : task
                  )
                }
              : project
          )
        );
      },
      rateProject: (projectId, value, note, instructorId = "u2") => {
        setProjects((prev) =>
          prev.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  ratings: [
                    ...project.ratings.filter((rating) => rating.instructorId !== instructorId),
                    { instructorId, value, note }
                  ]
                }
              : project
          )
        );
      },
      markNotification: (notificationId, read) => {
        setNotifications((prev) =>
          prev.map((notification) => (notification.id === notificationId ? { ...notification, read } : notification))
        );
      }
    }),
    [projects, invitations, notifications]
  );

  return React.createElement(AppContext.Provider, { value }, children);
}

export const useApp = () => useContext(AppContext);
