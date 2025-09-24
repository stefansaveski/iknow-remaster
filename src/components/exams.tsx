"use client"
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

const Exams = () => {
  const [sortField, setSortField] = useState<'grade' | 'date' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  // Real exam data
  const stats = {
    average: 8.95,
    credits: { current: 108, total: 240 },
    passed: 19,
    remaining: 22
  };

  const exams = [
    {
      id: 1,
      code: "F23L1W005",
      subject: "Бизнис и менаџмент",
      session: "2024 (Зимска) Прва испитна сесија",
      date: "21.02.2024",
      semester: 1,
      credits: 6.00,
      type: "З",
      grade: 7
    },
    {
      id: 2,
      code: "F23L1W007",
      subject: "Вовед во компјутерските науки",
      session: "2024 (Зимска) Прва испитна сесија",
      date: "06.02.2024",
      semester: 1,
      credits: 6.00,
      type: "З",
      grade: 10
    },
    {
      id: 3,
      code: "F23L2W003",
      subject: "Избрани теми од математика",
      session: "2024 (Зимска) Прва испитна сесија",
      date: "12.02.2024",
      semester: 1,
      credits: 6.00,
      type: "З",
      grade: 9
    },
    {
      id: 4,
      code: "F23L1W018",
      subject: "Професионални вештини",
      session: "2024 (Зимска) Прва испитна сесија",
      date: "01.02.2024",
      semester: 1,
      credits: 4.00,
      type: "З",
      grade: 9
    },
    {
      id: 5,
      code: "F23L1W004",
      subject: "Спорт и здравје",
      session: "2024 (Летна) Втора испитна сесија",
      date: "15.07.2024",
      semester: 1,
      credits: 2.00,
      type: "З",
      grade: "Реализиран"
    },
    {
      id: 6,
      code: "F23L1W020",
      subject: "Структурно програмирање",
      session: "2024 (Зимска) Прва испитна сесија",
      date: "12.02.2024",
      semester: 1,
      credits: 6.00,
      type: "З",
      grade: 10
    },
    {
      id: 7,
      code: "F23L1S003",
      subject: "Архитектура и организација на компјутери",
      session: "2024 (Летна) Втора испитна сесија",
      date: "03.07.2024",
      semester: 2,
      credits: 6.00,
      type: "З",
      grade: 9
    },
    {
      id: 8,
      code: "F23L1S023",
      subject: "Бизнис статистика",
      session: "2024 (Летна) Втора испитна сесија",
      date: "02.07.2024",
      semester: 2,
      credits: 6.00,
      type: "З",
      grade: 8
    },
    {
      id: 9,
      code: "F23L1S120",
      subject: "Креативни вештини за решавање проблеми",
      session: "2024 (Летна) Втора испитна сесија",
      date: "25.06.2024",
      semester: 2,
      credits: 6.00,
      type: "И",
      grade: 10
    },
    {
      id: 10,
      code: "F23L1S016",
      subject: "Објектно-ориентирано програмирање",
      session: "2024 (Летна) Втора испитна сесија",
      date: "13.07.2024",
      semester: 2,
      credits: 6.00,
      type: "З",
      grade: 10
    },
    {
      id: 11,
      code: "F23L1S146",
      subject: "Основи на Веб дизајн",
      session: "2024 (Летна) Втора испитна сесија",
      date: "24.06.2024",
      semester: 2,
      credits: 6.00,
      type: "З",
      grade: 10
    },
    {
      id: 12,
      code: "F23L2W100",
      subject: "Економија за ИКТ инженери",
      session: "2025 (Зимска) Прва испитна сесија",
      date: "03.02.2025",
      semester: 3,
      credits: 6.00,
      type: "З",
      grade: 8
    },
    {
      id: 13,
      code: "F23L2W109",
      subject: "Интернет програмирање на клиентска страна",
      session: "2025 (Зимска) Прва испитна сесија",
      date: "30.01.2025",
      semester: 3,
      credits: 6.00,
      type: "И",
      grade: 10
    },
    {
      id: 14,
      code: "F23L2W014",
      subject: "Компјутерски мрежи и безбедност",
      session: "2025 (Зимска) Прва испитна сесија",
      date: "10.02.2025",
      semester: 3,
      credits: 6.00,
      type: "З",
      grade: 7
    },
    {
      id: 15,
      code: "F23L2W201",
      subject: "Примена на алгоритми и податочни структури",
      session: "2025 (Зимска) Прва испитна сесија",
      date: "13.02.2025",
      semester: 3,
      credits: 6.00,
      type: "З",
      grade: 10
    },
    {
      id: 16,
      code: "F23L2W167",
      subject: "Шаблони за дизајн на кориснички интерфејси",
      session: "2025 (Зимска) Прва испитна сесија",
      date: "06.02.2025",
      semester: 3,
      credits: 6.00,
      type: "И",
      grade: 10
    },
    {
      id: 17,
      code: "F23L2S026",
      subject: "Маркетинг",
      session: "2025 (Летна) Втора испитна сесија",
      date: "12.06.2025",
      semester: 4,
      credits: 6.00,
      type: "З",
      grade: 8
    },
    {
      id: 18,
      code: "F23L2S017",
      subject: "Оперативни системи",
      session: "2025 (Летна) Втора испитна сесија",
      date: "19.06.2025",
      semester: 4,
      credits: 6.00,
      type: "З",
      grade: 7
    },
    {
      id: 19,
      code: "F23L2S029",
      subject: "Софтверско инженерство",
      session: "2025 (Летна) Втора испитна сесија",
      date: "23.06.2025",
      semester: 4,
      credits: 6.00,
      type: "З",
      grade: 8
    }
  ];

  const getGradeColor = (grade: number | string) => {
    if (grade === "Реализиран") return "bg-blue-100 text-blue-800 border-blue-200";
    if (typeof grade === "number") {
      if (grade >= 9) return "bg-green-100 text-green-800 border-green-200";
      if (grade >= 8) return "bg-yellow-100 text-yellow-800 border-yellow-200";
      if (grade >= 6) return "bg-orange-100 text-orange-800 border-orange-200";
      return "bg-red-100 text-red-800 border-red-200";
    }
    return "bg-gray-100 text-gray-800 border-gray-200";
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
        // Handle "Реализиран" grade separately
        if (a.grade === "Реализиран" && b.grade === "Реализиран") return 0;
        if (a.grade === "Реализиран") return sortOrder === 'asc' ? -1 : 1;
        if (b.grade === "Реализиран") return sortOrder === 'asc' ? 1 : -1;
        
        // Handle numeric grades
        const gradeA = typeof a.grade === 'number' ? a.grade : 0;
        const gradeB = typeof b.grade === 'number' ? b.grade : 0;
        
        return sortOrder === 'asc' ? gradeA - gradeB : gradeB - gradeA;
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

  const creditsPercentage = (stats.credits.current / stats.credits.total) * 100;

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
