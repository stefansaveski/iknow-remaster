"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPenToSquare, 
  faChevronDown,
  faCalendarAlt,
  faFileText,
  faMoneyBillWave,
  faUser,
  faInfoCircle,
  faCheckCircle,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import applicationsData from '@/data/applications.json';

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

const TableCell = ({ children, className = "" }: TableCellProps) => (
  <td className={`px-4 py-3 text-sm border-b border-gray-200 ${className}`}>
    {children}
  </td>
);

const CompletedBadge = ({ completed }: { completed: string }) => {
  if (completed === "Да") {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full">
        <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4" />
      </span>
    );
  } else {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 rounded-full">
        <FontAwesomeIcon icon={faTimesCircle} className="w-4 h-4" />
      </span>
    );
  }
};

const FeeBadge = ({ fee }: { fee: string }) => {
  const feeValue = parseFloat(fee.replace(',', '.'));
  
  if (feeValue === 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs font-medium">
        <FontAwesomeIcon icon={faMoneyBillWave} className="w-3 h-3" />
        {fee}
      </span>
    );
  } else {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-xs font-medium">
        <FontAwesomeIcon icon={faMoneyBillWave} className="w-3 h-3" />
        {fee}
      </span>
    );
  }
};

export default function ApplicationsPage() {
  const [selectedSession, setSelectedSession] = useState(applicationsData.currentSession.id);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const currentSessionData = applicationsData.examSessions.find(s => s.id === selectedSession) || applicationsData.currentSession;
  const { applications } = applicationsData;

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="bg-primary text-white rounded-xl p-8 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-white bg-opacity-20 rounded-full p-4">
            <FontAwesomeIcon icon={faPenToSquare} className="text-3xl text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Пријави</h1>
            <p className="text-lg opacity-90">
              Електронски пријави за испити
            </p>
          </div>
        </div>
      </div>

      {/* Session Selection */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-primary" />
            Избери испитна сесија:
          </h2>
          
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary min-w-80"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary">
                  {currentSessionData.name}
                </span>
                <FontAwesomeIcon 
                  icon={faChevronDown} 
                  className={`w-4 h-4 text-gray-400 transition-transform ml-4 ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </div>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute z-10 right-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg">
                {applicationsData.examSessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => {
                      setSelectedSession(session.id);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div className="font-medium text-gray-900">{session.name}</div>
                    <div className="text-xs text-gray-500">{session.year} - {session.semester} - {session.session}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Applications Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-primary text-white px-6 py-4">
          <h2 className="text-xl font-bold">Пријавени испити</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сериски број</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Код</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Предмет</th>
                <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Завршена</th>
                <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Таксени</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Датум</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Наставник</th>
                <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Декада</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium text-gray-900">{application.id}</TableCell>
                  <TableCell>
                    <span className="font-mono text-sm text-primary font-medium hover:underline cursor-pointer">
                      {application.serviceNumber}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-sm font-medium">{application.code}</TableCell>
                  <TableCell className="font-medium text-gray-900 max-w-xs">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faFileText} className="w-4 h-4 text-primary" />
                      {application.subject}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <CompletedBadge completed={application.completed} />
                  </TableCell>
                  <TableCell className="text-center">
                    <FeeBadge fee={application.fee} />
                  </TableCell>
                  <TableCell className="text-gray-600 font-medium">{application.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{application.instructor}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium text-primary">{application.decade}</TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Important Note */}
        <div className="bg-blue-50 border-t border-blue-100 p-6">
          <div className="flex items-start gap-3">
            <FontAwesomeIcon icon={faInfoCircle} className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Важна забелешка</h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                {applicationsData.note}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 text-blue-600 rounded-full p-3">
              <FontAwesomeIcon icon={faFileText} className="text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Пријавени испити</h3>
              <p className="text-2xl font-bold text-blue-600">
                {applications.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 text-green-600 rounded-full p-3">
              <FontAwesomeIcon icon={faCheckCircle} className="text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Завршени</h3>
              <p className="text-2xl font-bold text-green-600">
                {applications.filter(app => app.completed === "Да").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-100 text-yellow-600 rounded-full p-3">
              <FontAwesomeIcon icon={faMoneyBillWave} className="text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Вкупна такса</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {applications.reduce((sum, app) => sum + parseFloat(app.fee.replace(',', '.')), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
