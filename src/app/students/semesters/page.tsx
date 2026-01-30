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
import { useEffect, useState } from 'react';
import { getAccessToken } from '@/lib/auth';
import { useTranslation } from 'react-i18next';

type Semester = {
  id: number | string;
  semester: string;
  direction: string;
  quota: string;
  note: string;
  studentCom: string;
  sum: string;
  paid: string;
  ukim: string;
  createdOn: string;
  dateChanged: string;
  credits: string;
  type: string;
  doc: string;
  doc1: string;
  verified: string;
  taxes: string;
  signatures: string;
  status: string;
  completed: string;
};

type SemestersResponse = {
  semesters: Semester[];
};

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
  const { t } = useTranslation();
  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
  if (status === t('valid')) {
    return (
      <span className={`${baseClasses} bg-green-100 text-green-800 flex items-center gap-1`}>
        <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3" />
        {t('valid')}
      </span>
    );
  }
  return (
    <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
      {t(status) || status}
    </span>
  );
};

const YesNoBadge = ({ value }: { value: string }) => {
  const { t } = useTranslation();
  if (value === t('yes')) {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full">
        <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
      </span>
    );
  } else if (value === t('no')) {
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
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useTranslation();

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
        const response = await fetch('https://iknow-api.onrender.com/api/user/getSemesters', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const text = await response.text().catch(() => '');
          throw new Error(text || `Failed to load semesters (${response.status})`);
        }

        const data = (await response.json()) as SemestersResponse;
        if (!cancelled) setSemesters(Array.isArray(data?.semesters) ? data.semesters : []);
      } catch (err) {
        if (!cancelled) {
          setErrorMessage(err instanceof Error ? err.message : 'Failed to load semesters.');
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

  if (isLoading) {
    return (
      <div className="min-h-screen pb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {t('loading')}
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen pb-8">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="bg-primary text-white rounded-xl p-8 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-white bg-opacity-20 rounded-full p-4">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-3xl text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('semesters')}</h1>
            <p className="text-lg opacity-90">
              {t('semesters_overview')}
            </p>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-primary text-white px-6 py-4">
          <h2 className="text-xl font-bold">{t('semesters_list')}</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('semester')}</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('direction')}</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('quota')}</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('note')}</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('student_com')}</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('sum')}</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('paid')}</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('ukim')}</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('created_on')}</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('date_changed')}</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('credits')}</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('type')}</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('doc')}</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('doc1')}</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('verified')}</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('taxes')}</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('signatures')}</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status')}</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('completed')}</th>
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
              <h3 className="text-lg font-bold text-gray-900">{t('completed_semesters')}</h3>
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
              <h3 className="text-lg font-bold text-gray-900">{t('verified_semesters')}</h3>
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
              <h3 className="text-lg font-bold text-gray-900">{t('total_semesters')}</h3>
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
