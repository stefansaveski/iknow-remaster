"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faCheck, 
  faTimes, 
  faFileAlt, 
  faMoneyBillWave,
  faSignature,
  faCheckCircle,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import semestersData from '@/data/semesters.json';

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

const TableCell = ({ children, className = "" }: TableCellProps) => (
  <td className={`px-4 py-3 text-sm border-b border-gray-100 ${className}`}>
    {children}
  </td>
);

const StatusBadge = ({ status }: { status: string }) => {
  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
  
  if (status === "валиден") {
    return (
      <span className={`${baseClasses} bg-green-100 text-green-800 flex items-center gap-1`}>
        <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3" />
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

const YesNoBadge = ({ value }: { value: string }) => {
  if (value === "Да") {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full">
        <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
      </span>
    );
  } else if (value === "Не") {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 rounded-full">
        <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
      </span>
    );
  }
  return <span className="text-gray-400">—</span>;
};

const SignatureBadge = ({ signatures }: { signatures: string }) => {
  const [completed, total] = signatures.split('/').map(Number);
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  
  let colorClass = "text-red-600 bg-red-100";
  if (percentage === 100) {
    colorClass = "text-green-600 bg-green-100";
  } else if (percentage >= 50) {
    colorClass = "text-yellow-600 bg-yellow-100";
  }
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${colorClass}`}>
      <FontAwesomeIcon icon={faSignature} className="w-3 h-3" />
      {signatures}
    </span>
  );
};

export default function SemestersPage() {
  const { semesters } = semestersData;

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="bg-primary text-white rounded-xl p-8 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-white bg-opacity-20 rounded-full p-4">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-3xl text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Семестри</h1>
            <p className="text-lg opacity-90">
              Преглед на сите запишани семестри и нивниот статус
            </p>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-primary text-white px-6 py-4">
          <h2 className="text-xl font-bold">Листа на семестри</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Семестар</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Насока</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Квота</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Забелешка</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Студ.Ком.</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сума</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Платено</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">УКИМ</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Креирано на</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Датум промена</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ц.Кр</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Тип</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Док.</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Док1.</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Вериф.</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Таксени</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Потписи</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Зав.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {semesters.map((semester) => (
                <tr key={semester.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium text-gray-900">{semester.id}</TableCell>
                  <TableCell className="font-medium text-primary">{semester.semester}</TableCell>
                  <TableCell>{semester.direction}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={semester.quota}>
                      {semester.quota}
                    </div>
                  </TableCell>
                  <TableCell>
                    {semester.note ? (
                      <span className="text-yellow-600 font-medium" title={semester.note}>
                        {semester.note.length > 10 ? `${semester.note.substring(0, 10)}...` : semester.note}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {semester.studentCom ? (
                      <span className="text-blue-600 font-medium" title={semester.studentCom}>
                        {semester.studentCom.length > 10 ? `${semester.studentCom.substring(0, 10)}...` : semester.studentCom}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {semester.sum ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <FontAwesomeIcon icon={faMoneyBillWave} className="w-3 h-3" />
                        {semester.sum}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {semester.paid ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <FontAwesomeIcon icon={faMoneyBillWave} className="w-3 h-3" />
                        {semester.paid}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {semester.ukim ? (
                      <span className="text-blue-600">{semester.ukim}</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-600">{semester.createdOn}</TableCell>
                  <TableCell className="text-gray-600">{semester.dateChanged}</TableCell>
                  <TableCell className="font-medium text-primary">{semester.credits}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {semester.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <YesNoBadge value={semester.doc} />
                  </TableCell>
                  <TableCell className="text-center">
                    <YesNoBadge value={semester.doc1} />
                  </TableCell>
                  <TableCell className="text-center">
                    <YesNoBadge value={semester.verified} />
                  </TableCell>
                  <TableCell className="font-medium text-green-600">{semester.taxes}</TableCell>
                  <TableCell>
                    <SignatureBadge signatures={semester.signatures} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={semester.status} />
                  </TableCell>
                  <TableCell>
                    {semester.completed !== "Не" ? (
                      <span className="text-green-600 font-medium flex items-center gap-1">
                        <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3" />
                        {semester.completed}
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium flex items-center gap-1">
                        <FontAwesomeIcon icon={faTimesCircle} className="w-3 h-3" />
                        {semester.completed}
                      </span>
                    )}
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 text-green-600 rounded-full p-3">
              <FontAwesomeIcon icon={faCheckCircle} className="text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Завршени семестри</h3>
              <p className="text-2xl font-bold text-green-600">
                {semesters.filter(s => s.completed !== "Не").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 text-blue-600 rounded-full p-3">
              <FontAwesomeIcon icon={faFileAlt} className="text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Верифицирани</h3>
              <p className="text-2xl font-bold text-blue-600">
                {semesters.filter(s => s.verified === "Да").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-primary text-white rounded-full p-3">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Вкупно семестри</h3>
              <p className="text-2xl font-bold text-primary">
                {semesters.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
