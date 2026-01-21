"use client";

import { useEffect, useMemo, useState } from "react";

type UsersBySubject = {
  Id?: string;
  Name?: string;
  Grade: number;
};

type SubjectsAndUsers = {
  Name?: string;
  Id?: number;
  Users: UsersBySubject[];
};

type GradePayload = {
  StudentId: number;
  SubjectId: number;
  grade: number;
};

type FlatRow = {
  studentIdStr: string;
  studentIdNum: number | null;
  studentName: string;
  subjectId: number;
  subjectName: string;
  grade: number;
};

function toInt(value: string): number | null {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : null;
}

export default function ProfessorStudentsPage() {
  const [subjects, setSubjects] = useState<SubjectsAndUsers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [studentIdQuery, setStudentIdQuery] = useState<string>("");

  const [gradeSelection, setGradeSelection] = useState<Record<string, number>>({});
  const [actionBusyKey, setActionBusyKey] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/prof/students", { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Failed to fetch students (${res.status})`);
      }
      const data = (await res.json()) as SubjectsAndUsers[];
      setSubjects(data);

      const nextSelections: Record<string, number> = {};
      for (const subj of data) {
        if (!subj.Id) continue;
        for (const u of subj.Users) {
          const key = `${subj.Id}:${u.Id ?? ""}`;
          const current = u.Grade;
          nextSelections[key] = current >= 5 && current <= 10 ? current : 5;
        }
      }
      setGradeSelection(nextSelections);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  const flatRows = useMemo<FlatRow[]>(() => {
    const rows: FlatRow[] = [];
    for (const subj of subjects) {
      if (!subj.Id) continue;
      for (const u of subj.Users) {
        rows.push({
          studentIdStr: u.Id ?? "",
          studentIdNum: toInt(u.Id ?? ""),
          studentName: u.Name ?? "",
          subjectId: subj.Id,
          subjectName: subj.Name ?? "",
          grade: u.Grade,
        });
      }
    }
    return rows;
  }, [subjects]);

  const filteredRows = useMemo(() => {
    const q = studentIdQuery.trim();
    return flatRows.filter((r) => {
      if (subjectFilter !== "all" && String(r.subjectId) !== subjectFilter) return false;
      if (q.length > 0 && !r.studentIdStr.includes(q)) return false;
      return true;
    });
  }, [flatRows, subjectFilter, studentIdQuery]);

  async function postGrade(url: string, payload: GradePayload, busyKey: string) {
    setActionBusyKey(busyKey);
    setError(null);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok || !body.ok) {
        throw new Error(body.message || `Request failed (${res.status})`);
      }
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setActionBusyKey(null);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Professor • Students</h1>
          <p className="text-gray-700 mt-1">
            Data comes from <span className="font-mono">/api/prof/students</span> (demo store).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex flex-col">
            <label className="text-sm text-gray-700">Filter by subject</label>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              <option value="all">All subjects</option>
              {subjects
                .filter((s) => typeof s.Id === "number")
                .map((s) => (
                  <option key={String(s.Id)} value={String(s.Id)}>
                    {s.Name ?? `Subject ${s.Id}`}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-700">Find student by index / ID</label>
            <input
              className="border border-gray-300 rounded-lg px-3 py-2"
              placeholder="e.g. 20001"
              value={studentIdQuery}
              onChange={(e) => setStudentIdQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 text-red-800 px-4 py-3">
          {error}
        </div>
      )}

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left text-sm font-semibold text-gray-700 px-4 py-3 border-b">Student</th>
              <th className="text-left text-sm font-semibold text-gray-700 px-4 py-3 border-b">ID</th>
              <th className="text-left text-sm font-semibold text-gray-700 px-4 py-3 border-b">Subject</th>
              <th className="text-left text-sm font-semibold text-gray-700 px-4 py-3 border-b">Grade</th>
              <th className="text-left text-sm font-semibold text-gray-700 px-4 py-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-4 text-gray-700" colSpan={5}>
                  Loading...
                </td>
              </tr>
            ) : filteredRows.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-gray-700" colSpan={5}>
                  No students found.
                </td>
              </tr>
            ) : (
              filteredRows.map((r) => {
                const key = `${r.subjectId}:${r.studentIdStr}`;
                const selected = gradeSelection[key] ?? 5;
                const busy = actionBusyKey === key;

                return (
                  <tr key={key} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b text-gray-900">{r.studentName}</td>
                    <td className="px-4 py-3 border-b text-gray-900">{r.studentIdStr}</td>
                    <td className="px-4 py-3 border-b text-gray-900">{r.subjectName}</td>
                    <td className="px-4 py-3 border-b">
                      <div className="flex items-center gap-3">
                        <select
                          className="border border-gray-300 rounded-lg px-3 py-2"
                          value={selected}
                          onChange={(e) =>
                            setGradeSelection((prev) => ({
                              ...prev,
                              [key]: Number.parseInt(e.target.value, 10),
                            }))
                          }
                        >
                          {[5, 6, 7, 8, 9, 10].map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                        <span className="text-sm text-gray-600">
                          Current: {r.grade > 0 ? r.grade : "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 border-b">
                      <div className="flex flex-wrap gap-2">
                        <button
                          disabled={busy || r.studentIdNum === null}
                          className="px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-medium disabled:opacity-50"
                          onClick={() => {
                            if (r.studentIdNum === null) return;
                            void postGrade(
                              "/api/prof/grade/add",
                              { StudentId: r.studentIdNum, SubjectId: r.subjectId, grade: selected },
                              key,
                            );
                          }}
                        >
                          Add grade
                        </button>

                        <button
                          disabled={busy || r.studentIdNum === null}
                          className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:opacity-50"
                          onClick={() => {
                            if (r.studentIdNum === null) return;
                            void postGrade(
                              "/api/prof/grade/edit",
                              { StudentId: r.studentIdNum, SubjectId: r.subjectId, grade: selected },
                              key,
                            );
                          }}
                        >
                          Edit grade
                        </button>

                        <button
                          disabled={busy || r.studentIdNum === null}
                          className="px-3 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium disabled:opacity-50"
                          onClick={() => {
                            if (r.studentIdNum === null) return;
                            void postGrade(
                              "/api/prof/grade/remove",
                              { StudentId: r.studentIdNum, SubjectId: r.subjectId, grade: 0 },
                              key,
                            );
                          }}
                        >
                          Remove grade
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
