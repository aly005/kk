export const currentUser = {
  id: "u1",
  role: "student",
  firstName: "Ahmed",
  lastName: "Nabil",
  email: "ahmed.nabil@guc.edu.eg"
};

export const users = [
  currentUser,
  {
    id: "u2",
    role: "courseInstructor",
    firstName: "Mervat",
    lastName: "Abuelkheir",
    email: "mervat.abuelkheir@guc.edu.eg"
  },
  {
    id: "u3",
    role: "courseInstructor",
    firstName: "Aya",
    lastName: "Salama",
    email: "aya.salama@guc.edu.eg"
  },
  {
    id: "u4",
    role: "student",
    firstName: "Sara",
    lastName: "Samir",
    email: "sara.samir@guc.edu.eg"
  }
];

export const initialProjects = [
  {
    id: "p1",
    title: "Smart Attendance System",
    type: "Bachelor Project",
    course: "Bachelor Project",
    visibility: false,
    selectedForPortfolio: false,
    creatorId: "u1",
    collaborators: ["u1", "u4"],
    invitedInstructorIds: ["u2"],
    drafts: [
      { id: "d1", name: "Thesis Draft v1.pdf", isFinal: false },
      { id: "d2", name: "Thesis Draft v2.pdf", isFinal: true }
    ],
    tasks: [
      {
        id: "t1",
        title: "Finish face recognition module",
        description: "Integrate liveness detection and confidence threshold.",
        importance: 1,
        comments: [
          {
            id: "c1",
            authorId: "u2",
            text: "Good progress. Add confusion matrix screenshot in demo.",
            createdAt: "2026-04-30 12:15"
          }
        ]
      },
      {
        id: "t2",
        title: "Prepare architecture slides",
        description: "Create concise architecture diagrams for review day.",
        importance: 2,
        comments: []
      }
    ],
    ratings: [{ instructorId: "u2", value: 4, note: "Solid idea and execution." }]
  },
  {
    id: "p2",
    title: "SE Milestone Planner",
    type: "Course Project",
    course: "Software Engineering",
    visibility: true,
    selectedForPortfolio: true,
    creatorId: "u1",
    collaborators: ["u1"],
    invitedInstructorIds: [],
    drafts: [],
    tasks: [],
    ratings: []
  }
];

export const initialInvitations = [
  {
    id: "inv1",
    projectId: "p1",
    inviterId: "u1",
    inviteeId: "u2",
    inviteeRole: "courseInstructor",
    status: "accepted"
  },
  {
    id: "inv2",
    projectId: "p1",
    inviterId: "u1",
    inviteeId: "u3",
    inviteeRole: "courseInstructor",
    status: "pending"
  }
];

export const initialNotifications = [
  {
    id: "n1",
    userId: "u1",
    text: "Instructor Aya was invited to Smart Attendance System.",
    read: false
  },
  {
    id: "n2",
    userId: "u1",
    text: "Your invitation to join Smart Attendance System was accepted by Dr. Mervat.",
    read: true
  }
];
