export type UsersBySubject = {
  Id?: string;
  Name?: string;
  Grade: number;
};

export type SubjectsAndUsers = {
  Name?: string;
  Id?: number;
  Users: UsersBySubject[];
};

export type AddGrade = {
  StudentId: number;
  SubjectId: number;
  grade: number;
};

type Store = {
  subjects: SubjectsAndUsers[];
};

function createInitialStore(): Store {
  return {
    subjects: [
      {
        Id: 101,
        Name: "Web Programming",
        Users: [
          { Id: "20001", Name: "Ana Petrovska", Grade: 0 },
          { Id: "20002", Name: "Marko Trajkov", Grade: 8 },
          { Id: "20003", Name: "Elena Stojanova", Grade: 0 },
        ],
      },
      {
        Id: 102,
        Name: "Databases",
        Users: [
          { Id: "20001", Name: "Ana Petrovska", Grade: 0 },
          { Id: "20004", Name: "Nikola Iliev", Grade: 9 },
          { Id: "20005", Name: "Sara Dimitrova", Grade: 7 },
        ],
      },
      {
        Id: 103,
        Name: "Algorithms",
        Users: [
          { Id: "20002", Name: "Marko Trajkov", Grade: 0 },
          { Id: "20006", Name: "Ivana Kostova", Grade: 10 },
        ],
      },
    ],
  };
}

function getGlobalStore(): Store {
  const globalKey = "__iknow_prof_demo_store__";
  const globalObj = globalThis as unknown as Record<string, unknown>;

  if (!globalObj[globalKey]) {
    globalObj[globalKey] = createInitialStore();
  }

  return globalObj[globalKey] as Store;
}

export function getSubjects(): SubjectsAndUsers[] {
  return getGlobalStore().subjects;
}

function parseStudentId(id: string | undefined): number | null {
  if (!id) return null;
  const parsed = Number.parseInt(id, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export function setGrade(
  payload: AddGrade,
  mode: "add" | "edit" | "remove",
): { subject: SubjectsAndUsers; user: UsersBySubject } {
  const store = getGlobalStore();
  const subject = store.subjects.find((s) => s.Id === payload.SubjectId);
  if (!subject) {
    throw new Error("Subject not found");
  }

  const user = subject.Users.find((u) => parseStudentId(u.Id) === payload.StudentId);
  if (!user) {
    throw new Error("Student not found in subject");
  }

  if (mode === "remove") {
    user.Grade = 0;
    return { subject, user };
  }

  if (payload.grade < 5 || payload.grade > 10) {
    throw new Error("Grade must be between 5 and 10");
  }

  if (mode === "add" && user.Grade > 0) {
    throw new Error("Grade already exists; use edit");
  }

  user.Grade = payload.grade;
  return { subject, user };
}
