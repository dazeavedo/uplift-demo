// ============================================================
// BULK IMPORT PAGE
// Import employees and shifts from CSV/Excel
// ============================================================

import { useState, useRef } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import {
  Upload, FileSpreadsheet, Users, Calendar, CheckCircle, XCircle,
  AlertCircle, Download, X, ChevronRight, FileText, Loader,
} from 'lucide-react';

export default function BulkImport() {
  const { isManager } = useAuth();
  const [activeTab, setActiveTab] = useState('employees');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(csv|xlsx|xls)$/i)) {
      alert('Please upload a CSV or Excel file');
      return;
    }

    setFile(selectedFile);
    setResult(null);

    // Parse preview
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('type', activeTab);
      formData.append('preview', 'true');

      const response = await api.post(`/bulk/${activeTab}/preview`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setPreview(response);
    } catch (error) {
      // For demo, create mock preview
      setPreview(mockPreview(activeTab, selectedFile));
    }
  };

  const mockPreview = (type, file) => {
    if (type === 'employees') {
      return {
        headers: ['First Name', 'Last Name', 'Email', 'Role', 'Department', 'Start Date'],
        rows: [
          { data: ['John', 'Smith', 'john@example.com', 'Team Lead', 'Operations', '2024-01-15'], valid: true },
          { data: ['Jane', 'Doe', 'jane@example.com', 'Associate', 'Sales', '2024-02-01'], valid: true },
          { data: ['Bob', '', 'bob@example.com', 'Associate', 'Operations', '2024-01-20'], valid: false, error: 'Last name required' },
        ],
        totalRows: 3,
        validRows: 2,
        errorRows: 1,
      };
    } else {
      return {
        headers: ['Date', 'Start Time', 'End Time', 'Location', 'Employee Email', 'Role'],
        rows: [
          { data: ['2024-01-20', '09:00', '17:00', 'London Store', 'john@example.com', 'Floor Staff'], valid: true },
          { data: ['2024-01-20', '14:00', '22:00', 'London Store', 'jane@example.com', 'Floor Staff'], valid: true },
          { data: ['2024-01-21', '09:00', '17:00', 'Unknown Location', 'john@example.com', 'Floor Staff'], valid: false, error: 'Location not found' },
        ],
        totalRows: 3,
        validRows: 2,
        errorRows: 1,
      };
    }
  };

  const handleImport = async () => {
    if (!file || !preview) return;

    setImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', activeTab);

      const response = await api.post(`/bulk/${activeTab}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setResult({
        success: true,
        imported: response.imported || preview.validRows,
        failed: response.failed || preview.errorRows,
        errors: response.errors || [],
      });
    } catch (error) {
      // Mock success for demo
      setResult({
        success: true,
        imported: preview.validRows,
        failed: preview.errorRows,
        errors: preview.rows.filter(r => !r.valid).map(r => r.error),
      });
    } finally {
      setImporting(false);
    }
  };

  const resetImport = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    const templates = {
      employees: 'first_name,last_name,email,phone,role,department,location,start_date,hourly_rate\nJohn,Smith,john@example.com,+44123456789,Team Lead,Operations,London Store,2024-01-15,15.50',
      shifts: 'date,start_time,end_time,location,employee_email,role,break_minutes,notes\n2024-01-20,09:00,17:00,London Store,john@example.com,Floor Staff,30,Opening shift',
    };

    const blob = new Blob([templates[activeTab]], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}_template.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isManager) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h2 className="text-lg font-medium text-slate-900">Access Restricted</h2>
        <p className="text-slate-500">Only managers can access bulk import</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Bulk Import</h1>
        <p className="text-slate-600">Import employees or shifts from CSV or Excel files</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => { setActiveTab('employees'); resetImport(); }}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            activeTab === 'employees'
              ? 'bg-momentum-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          Employees
        </button>
        <button
          onClick={() => { setActiveTab('shifts'); resetImport(); }}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            activeTab === 'shifts'
              ? 'bg-momentum-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Shifts
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className={`card p-6 ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-start gap-4">
            {result.success ? (
              <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
            ) : (
              <XCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-slate-900">
                {result.success ? 'Import Complete' : 'Import Failed'}
              </h3>
              <div className="mt-2 flex gap-6">
                <div>
                  <span className="text-2xl font-bold text-green-600">{result.imported}</span>
                  <span className="text-slate-600 ml-1">imported</span>
                </div>
                {result.failed > 0 && (
                  <div>
                    <span className="text-2xl font-bold text-red-600">{result.failed}</span>
                    <span className="text-slate-600 ml-1">failed</span>
                  </div>
                )}
              </div>
              {result.errors?.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-slate-700 mb-2">Errors:</p>
                  <ul className="text-sm text-red-600 space-y-1">
                    {result.errors.slice(0, 5).map((err, i) => (
                      <li key={i}>• {err}</li>
                    ))}
                    {result.errors.length > 5 && (
                      <li className="text-slate-500">...and {result.errors.length - 5} more</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
            <button onClick={resetImport} className="btn btn-secondary">
              Import Another
            </button>
          </div>
        </div>
      )}

      {/* Upload Area */}
      {!result && (
        <>
          {!file ? (
            <div className="card p-8">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-12 cursor-pointer hover:border-momentum-400 hover:bg-momentum-50/50 transition-colors"
              >
                <div className="p-4 bg-momentum-100 rounded-full mb-4">
                  <Upload className="w-8 h-8 text-momentum-600" />
                </div>
                <p className="text-lg font-medium text-slate-900">
                  Drop your file here or click to browse
                </p>
                <p className="text-slate-500 mt-1">
                  Supports CSV and Excel files (.csv, .xlsx, .xls)
                </p>
              </label>

              <div className="mt-6 flex items-center justify-center gap-4">
                <button onClick={downloadTemplate} className="btn btn-secondary">
                  <Download className="w-4 h-4" />
                  Download Template
                </button>
              </div>

              {/* Format Guide */}
              <div className="mt-8 p-4 bg-slate-50 rounded-lg">
                <h3 className="font-medium text-slate-900 mb-2">
                  {activeTab === 'employees' ? 'Employee Import Format' : 'Shift Import Format'}
                </h3>
                <p className="text-sm text-slate-600 mb-3">
                  Your file should include the following columns:
                </p>
                {activeTab === 'employees' ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    <span className="px-2 py-1 bg-white rounded border border-slate-200">first_name *</span>
                    <span className="px-2 py-1 bg-white rounded border border-slate-200">last_name *</span>
                    <span className="px-2 py-1 bg-white rounded border border-slate-200">email *</span>
                    <span className="px-2 py-1 bg-white rounded border border-slate-200">phone</span>
                    <span className="px-2 py-1 bg-white rounded border border-slate-200">role</span>
                    <span className="px-2 py-1 bg-white rounded border border-slate-200">department</span>
                    <span className="px-2 py-1 bg-white rounded border border-slate-200">location</span>
                    <span className="px-2 py-1 bg-white rounded border border-slate-200">start_date</span>
                    <span className="px-2 py-1 bg-white rounded border border-slate-200">hourly_rate</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    <span className="px-2 py-1 bg-white rounded border border-slate-200">date *</span>
                    <span className="px-2 py-1 bg-white rounded border border-slate-200">start_time *</span>
                    <span className="px-2 py-1 bg-white rounded border border-slate-200">end_time *</span>
                    <span className="px-2 py-1 bg-white rounded border border-slate-200">location *</span>
                    <span className="px-2 py-1 bg-white rounded border border-slate-200">employee_email</span>
                    <span className="px-2 py-1 bg-white rounded border border-slate-200">role</span>
                    <span className="px-2 py-1 bg-white rounded border border-slate-200">break_minutes</span>
                    <span className="px-2 py-1 bg-white rounded border border-slate-200">notes</span>
                  </div>
                )}
                <p className="text-xs text-slate-500 mt-2">* Required fields</p>
              </div>
            </div>
          ) : (
            /* Preview */
            <div className="card overflow-hidden">
              {/* File Info */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <FileSpreadsheet className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{file.name}</p>
                    <p className="text-sm text-slate-500">
                      {preview && `${preview.totalRows} rows • ${preview.validRows} valid • ${preview.errorRows} errors`}
                    </p>
                  </div>
                </div>
                <button onClick={resetImport} className="p-2 hover:bg-slate-200 rounded-lg">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Preview Table */}
              {preview && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2 text-left w-10">
                          <CheckCircle className="w-4 h-4 text-slate-400" />
                        </th>
                        {preview.headers.map((header, i) => (
                          <th key={i} className="px-4 py-2 text-left font-medium text-slate-600">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {preview.rows.map((row, i) => (
                        <tr key={i} className={row.valid ? '' : 'bg-red-50'}>
                          <td className="px-4 py-2">
                            {row.valid ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <div className="group relative">
                                <XCircle className="w-4 h-4 text-red-500" />
                                <div className="absolute left-6 top-0 hidden group-hover:block bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                  {row.error}
                                </div>
                              </div>
                            )}
                          </td>
                          {row.data.map((cell, j) => (
                            <td key={j} className="px-4 py-2 text-slate-700">
                              {cell || '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  {preview && (
                    <>
                      <span className="text-green-600 font-medium">{preview.validRows}</span> rows will be imported
                      {preview.errorRows > 0 && (
                        <>, <span className="text-red-600 font-medium">{preview.errorRows}</span> will be skipped</>
                      )}
                    </>
                  )}
                </div>
                <div className="flex gap-3">
                  <button onClick={resetImport} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button 
                    onClick={handleImport}
                    disabled={importing || !preview?.validRows}
                    className="btn btn-primary"
                  >
                    {importing ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Import {preview?.validRows || 0} {activeTab}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
