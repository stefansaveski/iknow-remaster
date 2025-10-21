"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFilePdf, 
  faChevronDown,
  faDownload,
  faCheckCircle,
  faMoneyBillWave,
  faFileText,
  faCalendarAlt,
  faCommentDots,
  faChevronLeft,
  faChevronRight,
  faAngleDoubleLeft,
  faAngleDoubleRight
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import documentsData from '@/data/documents.json';

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
  if (status === "approved") {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full">
        <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5" />
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 rounded-full">
      <FontAwesomeIcon icon={faFileText} className="w-4 h-4" />
    </span>
  );
};

const PriceBadge = ({ price }: { price: number }) => {
  if (price === 0) {
    return <span className="font-medium text-green-600">0,00</span>;
  }
  return <span className="font-medium text-blue-600">{price.toFixed(2)}</span>;
};

export default function DocumentsPage() {
  const [selectedDocumentType, setSelectedDocumentType] = useState("select_document");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(15);

  const selectedDocument = documentsData.documentTypes.find(d => d.id === selectedDocumentType);
  const { documents, pagination, paymentInfo } = documentsData;

  const totalPages = Math.ceil(documents.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentDocuments = documents.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="bg-primary text-white rounded-xl p-8 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-white bg-opacity-20 rounded-full p-4">
            <FontAwesomeIcon icon={faFilePdf} className="text-3xl text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Документи</h1>
            <p className="text-lg opacity-90">
              Барање и преглед на документи
            </p>
          </div>
        </div>
      </div>

      {/* Document Request Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <FontAwesomeIcon icon={faFileText} className="text-primary" />
          Ново барање за документ
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Document Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Изберете документ:
            </label>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-900 truncate">
                    {selectedDocument?.name || "Изберете документ"}
                  </span>
                  <FontAwesomeIcon 
                    icon={faChevronDown} 
                    className={`w-4 h-4 text-gray-400 transition-transform ml-2 flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                  {documentsData.documentTypes.map((docType) => (
                    <button
                      key={docType.id}
                      onClick={() => {
                        setSelectedDocumentType(docType.id);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{docType.name}</div>
                      {docType.price > 0 && (
                        <div className="text-xs text-blue-600 mt-1">Цена: {docType.price} мкд</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Comment Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Коментар:
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
              placeholder="Додајте коментар..."
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            className="bg-primary hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
            disabled={selectedDocumentType === "select_document"}
          >
            <FontAwesomeIcon icon={faFileText} className="w-4 h-4" />
            Внеси
          </button>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-primary text-white px-6 py-4">
          <h2 className="text-xl font-bold">Мои документи</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Архива</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Датум</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Барање</th>
                <th className="px-4 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Цена</th>
                <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Платено</th>
                <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Документ</th>
                <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Плати онлајн</th>
                <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Коментар</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentDocuments.map((document) => (
                <tr key={document.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium text-gray-900">{document.id}</TableCell>
                  <TableCell className="font-mono text-sm text-primary font-medium">{document.archive}</TableCell>
                  <TableCell className="text-gray-600">{document.date}</TableCell>
                  <TableCell className="font-medium text-gray-900 max-w-xs">
                    {document.request}
                  </TableCell>
                  <TableCell className="text-right">
                    <PriceBadge price={document.price} />
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm font-medium text-green-600">
                      {document.paid}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <button className="text-primary hover:text-blue-700 font-medium text-sm underline">
                      {document.document}
                    </button>
                  </TableCell>
                  <TableCell className="text-center">
                    {document.payOnline ? (
                      <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-600" />
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={document.status} />
                  </TableCell>
                  <TableCell>
                    {document.comment || (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="flex items-center gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <span>Прикажи редови:</span>
              <select
                value={recordsPerPage}
                onChange={(e) => setRecordsPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div>
              Страна <input
                type="number"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="w-12 border border-gray-300 rounded px-2 py-1 text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary"
              /> од {totalPages}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-500 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faAngleDoubleLeft} className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-500 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 bg-primary text-white rounded text-sm font-medium">
              Прва
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-500 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-500 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faAngleDoubleRight} className="w-4 h-4" />
            </button>
            <span className="ml-4 text-sm text-gray-700">
              Последна
            </span>
          </div>

          <div className="text-sm text-gray-700">
            Вкупно: {documents.length}
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-blue-50 border-t border-blue-100 p-4">
          <div className="flex items-start gap-3">
            <FontAwesomeIcon icon={faMoneyBillWave} className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800 leading-relaxed">
              {paymentInfo}
            </p>
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
              <h3 className="text-lg font-bold text-gray-900">Вкупно документи</h3>
              <p className="text-2xl font-bold text-blue-600">
                {documents.length}
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
              <h3 className="text-lg font-bold text-gray-900">Одобрени</h3>
              <p className="text-2xl font-bold text-green-600">
                {documents.filter(doc => doc.status === "approved").length}
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
              <h3 className="text-lg font-bold text-gray-900">Вкупна цена</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {documents.reduce((sum, doc) => sum + doc.price, 0).toFixed(2)} мкд
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
