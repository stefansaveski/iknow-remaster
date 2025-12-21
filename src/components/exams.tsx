"use client"
import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { getAccessToken } from '@/lib/auth';

type PassedSubject = {
  id: number;
  subjectId: number;
  code: string;
  subject: string;
  credits: number;
  grade: number;
  gradeText: string;
  date: string; // DD.MM.YYYY
  semester: string;
  professor: string;
};

type PassedSubjectsResponse = {
  passedSubjects: PassedSubject[];
};

type ExamRow = {
  id: number;
  code: string;
  subject: string;
  date: string;
  semester: string;
  credits: number;
  grade: number;
};

const Exams = () => {
  const [sortField, setSortField] = useState<'grade' | 'date' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [exams, setExams] = useState<ExamRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setErrorMessage(null);

      const token = getAccessToken();
      if (!token) {
        setErrorMessage('Not authenticated. Please login again.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('https://iknow-api.onrender.com/api/user/getPassedSubjects', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const text = await response.text().catch(() => '');
          throw new Error(text || `Failed to load passed subjects (${response.status})`);
        }

        const data = (await response.json()) as PassedSubjectsResponse;
        const rows: ExamRow[] = (data?.passedSubjects ?? []).map((s) => ({
          id: s.id,
          code: s.code,
          subject: s.subject,
          date: s.date,
          semester: s.semester,
          credits: s.credits,
          grade: s.grade,
        }));

        if (!cancelled) setExams(rows);
      } catch (err) {
        if (!cancelled) {
          setErrorMessage(err instanceof Error ? err.message : 'Failed to load passed subjects.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const passed = exams.length;
    const creditsCurrent = exams.reduce((sum, s) => sum + (typeof s.credits === 'number' ? s.credits : 0), 0);
    const numericGrades = exams.map((e) => (typeof e.grade === 'number' ? e.grade : null)).filter((g): g is number => g !== null);
    const average =
      numericGrades.length > 0
        ? numericGrades.reduce((sum, g) => sum + g, 0) / numericGrades.length
        : 0;

    const totalCredits = 240;
    const totalExams = 40;
    return {
      average: Number.isFinite(average) ? Number(average.toFixed(2)) : 0,
      credits: { current: creditsCurrent, total: totalCredits },
      passed,
      remaining: Math.max(0, totalExams - passed),
    };
  }, [exams]);

  const getGradeColor = (grade: number) => {
    if (grade >= 9) return "bg-green-100 text-green-800 border-green-200";
    if (grade >= 8) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (grade >= 6) return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const handleSortByGrade = () => {
    if (sortField === 'grade') {
      if (sortOrder === 'desc') {
        setSortOrder('asc');
      } else if (sortOrder === 'asc') {
        setSortField(null);
        setSortOrder(null);
      } else {
        setSortOrder('desc');
      }
    } else {
      setSortField('grade');
      setSortOrder('desc');
    }
  };

  const handleSortByDate = () => {
    if (sortField === 'date') {
      if (sortOrder === 'desc') {
        setSortOrder('asc');
      } else if (sortOrder === 'asc') {
        setSortField(null);
        setSortOrder(null);
      } else {
        setSortOrder('desc');
      }
    } else {
      setSortField('date');
      setSortOrder('desc');
    }
  };

  const getSortedExams = () => {
    if (!sortField || !sortOrder) return exams;
    
    return [...exams].sort((a, b) => {
      if (sortField === 'grade') {
        return sortOrder === 'asc' ? a.grade - b.grade : b.grade - a.grade;
      }
      
      if (sortField === 'date') {
        // Convert date strings to Date objects for proper sorting
        const dateA = new Date(a.date.split('.').reverse().join('-')); // Convert DD.MM.YYYY to YYYY-MM-DD
        const dateB = new Date(b.date.split('.').reverse().join('-'));
        
        return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      }
      
      return 0;
    });
  };

  const getSortIcon = (field: 'grade' | 'date') => {
    if (sortField === field) {
      if (sortOrder === 'asc') return faSortUp;
      if (sortOrder === 'desc') return faSortDown;
    }
    return faSort;
  };

  const creditsPercentage = stats.credits.total > 0 ? (stats.credits.current / stats.credits.total) * 100 : 0;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        Loading...
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      {/* Statistics Section */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Average Grade */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{stats.average}</div>
            <div className="text-sm text-gray-500 mt-1">Просек</div>
          </div>

          {/* Credits */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              {stats.credits.current}
              <span className="text-lg text-gray-400">/{stats.credits.total}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">Кредити</div>
          </div>

          {/* Passed Exams */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{stats.passed}</div>
            <div className="text-sm text-gray-500 mt-1">Положени</div>
          </div>

          {/* Remaining Exams */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{stats.remaining}</div>
            <div className="text-sm text-gray-500 mt-1">Останато</div>
          </div>
        </div>
        
        {/* Progress Bar spanning entire statistics section */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${creditsPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Exams Table */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Испити</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">#</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Предмет</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Семестар</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Кредити</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  <button 
                    onClick={handleSortByDate}
                    className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 transform hover:scale-105"
                  >
                    Датум
                    <FontAwesomeIcon 
                      icon={getSortIcon('date')} 
                      className={`text-xs transition-colors duration-200 ${
                        sortField === 'date' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                      }`}
                    />
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  <button 
                    onClick={handleSortByGrade}
                    className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 transform hover:scale-105"
                  >
                    Оценка
                    <FontAwesomeIcon 
                      icon={getSortIcon('grade')} 
                      className={`text-xs transition-colors duration-200 ${
                        sortField === 'grade' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                      }`}
                    />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {getSortedExams().map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="py-4 px-4 text-sm text-gray-900">{exam.id}</td>
                  <td className="py-4 px-4 text-sm text-gray-900 font-medium">{exam.subject}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{exam.semester}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{exam.credits}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{exam.date}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium border ${getGradeColor(exam.grade)}`}>
                      {exam.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Exams;
