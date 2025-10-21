"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBook, 
  faChevronDown,
  faInfoCircle,
  faMoneyBillWave,
  faCreditCard,
  faFileInvoice,
  faGraduationCap
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import subjectsData from '@/data/subjects.json';

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

const TableCell = ({ children, className = "" }: TableCellProps) => (
  <td className={`px-4 py-3 text-sm border-b border-gray-200 ${className}`}>
    {children}
  </td>
);

const StatusBadge = ({ status }: { status: string }) => {
  const baseClasses = "px-3 py-1 rounded-md text-xs font-medium";
  
  if (status === "Зад.") {
    return (
      <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
        {status}
      </span>
    );
  } else if (status === "Изб.") {
    return (
      <span className={`${baseClasses} bg-green-100 text-green-800`}>
        {status}
      </span>
    );
  }
  
  return (
    <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
      {status}
    </span>
  );
};

export default function SubjectsPage() {
  const [selectedSemester, setSelectedSemester] = useState(subjectsData.currentSemester.id);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const currentSemesterData = subjectsData.semesters.find(s => s.id === selectedSemester) || subjectsData.currentSemester;
  const currentSubjects = (subjectsData.subjectsBySemester as any)[selectedSemester] || [];
  const { currentSemester } = subjectsData;

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="bg-primary text-white rounded-xl p-8 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-white bg-opacity-20 rounded-full p-4">
            <FontAwesomeIcon icon={faBook} className="text-3xl text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Предмети</h1>
            <p className="text-lg opacity-90">
              Преглед на запишани предмети по семестри
            </p>
          </div>
        </div>
      </div>

      {/* Status and Selection Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Left Column - Status and Dropdown */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Status Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-sm text-gray-600 mb-2">
              Статус: <span className="text-primary font-semibold">Запишан од студент</span>
            </div>
            <div className="text-sm text-gray-600">
              Број на тикет: <span className="font-semibold">{currentSemester.ticketNumber}</span>
            </div>
          </div>

          {/* Semester Selection */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-sm text-gray-600 mb-2">
              Долг од документи: <span className="font-semibold">{currentSemester.debt}</span>
            </div>
            
            <div className="relative mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Избери семестар:
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary">
                      {currentSemesterData.name}
                    </span>
                    <FontAwesomeIcon 
                      icon={faChevronDown} 
                      className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                    {subjectsData.semesters.map((semester) => (
                      <button
                        key={semester.id}
                        onClick={() => {
                          setSelectedSemester(semester.id);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        <div className="font-medium text-gray-900">{semester.name}</div>
                        <div className="text-xs text-gray-500">Статус: {semester.status}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 text-sm">
              <div className="text-primary font-medium">
                Сериски број: {currentSemesterData.serviceNumber}
              </div>
            </div>
          </div>

          {/* Enrolled Subjects */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FontAwesomeIcon icon={faBook} className="w-4 h-4 text-primary" />
              Запишани предмети
            </h3>
            <div className="text-3xl font-bold text-primary">
              {currentSubjects.length}
            </div>
          </div>
        </div>

        {/* Right Column - Financial Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-primary text-white px-6 py-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FontAwesomeIcon icon={faFileInvoice} />
                Финансиски информации
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Financial Column */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Сума:</span>
                    <span className="font-semibold text-primary">{currentSemester.financialInfo.sum}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Платено:</span>
                    <span className="font-semibold text-green-600">{currentSemester.financialInfo.paid}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Должи:</span>
                    <span className="font-semibold text-red-600">{currentSemester.financialInfo.due}</span>
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-800 mb-1">Материјални трошоци:</div>
                    <div className="text-sm text-blue-700">{currentSemester.financialInfo.materialCosts}</div>
                  </div>
                </div>

                {/* Right Financial Column */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Кредити:</span>
                    <span className="font-semibold text-primary">{currentSemester.financialInfo.credits}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">МКСА:</span>
                    <span className="font-semibold">{currentSemester.financialInfo.MKSA}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Електронско запишување:</span>
                    <span className="font-semibold">{currentSemester.financialInfo.electronicRegistration}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Е-УКИМ:</span>
                    <span className="font-semibold">{currentSemester.financialInfo.eUKIM}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Банкарска провизија:</span>
                    <span className="font-semibold">{currentSemester.financialInfo.bankProvision}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-t-2 border-primary bg-primary bg-opacity-5 rounded-lg px-4">
                    <span className="font-bold text-white">Тотал:</span>
                    <span className="font-bold text-xl text-white">{currentSemester.financialInfo.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subjects Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-primary text-white px-6 py-4">
          <h2 className="text-xl font-bold">Листа на предмети</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Код</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Часови</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Кој пат</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Предмет</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Семестар</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Потпис</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Група</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Професор</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentSubjects.map((subject: any) => (
                <tr key={subject.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium text-gray-900">{subject.id}</TableCell>
                  <TableCell className="font-mono text-sm text-primary font-medium">{subject.code}</TableCell>
                  <TableCell className="font-medium">{subject.hours}</TableCell>
                  <TableCell className="text-center font-medium">{subject.kojPat}</TableCell>
                  <TableCell className="font-medium text-gray-900 max-w-xs">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faBook} className="w-4 h-4 text-primary" />
                      {subject.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium text-primary">{subject.semester}</TableCell>
                  <TableCell>
                    <StatusBadge status={subject.status} />
                  </TableCell>
                  <TableCell className="text-center">
                    {subject.signature || (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {subject.group || (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {subject.professor || (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
