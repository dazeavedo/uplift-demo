// ============================================================
// UPLIFT API FACTORY
// Build custom REST API integrations without code
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  Code, Plus, Play, Save, Trash2, Copy, Check, X, ChevronDown, ChevronRight,
  Settings, Zap, Clock, AlertCircle, CheckCircle, RefreshCw, Eye, EyeOff,
  ArrowRight, ArrowLeftRight, Database, Globe, Key, Lock, Unlock,
  FileJson, List, Calendar, Search, Filter, Download, Upload, Edit2,
  TestTube, History, Webhook, Server, Activity, Link, Unlink, Info,
  PlusCircle, MinusCircle, GripVertical, MoreVertical, ExternalLink
} from 'lucide-react';

// -------------------- TYPES & CONSTANTS --------------------

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const AUTH_TYPES = [
  { id: 'none', label: 'No Authentication', icon: Unlock },
  { id: 'api_key', label: 'API Key', icon: Key },
  { id: 'bearer', label: 'Bearer Token', icon: Lock },
  { id: 'basic', label: 'Basic Auth', icon: Lock },
  { id: 'oauth2', label: 'OAuth 2.0', icon: Lock },
];

const TRIGGER_TYPES = [
  { id: 'manual', label: 'Manual', description: 'Run on demand', icon: Play },
  { id: 'schedule', label: 'Scheduled', description: 'Run on a schedule', icon: Clock },
  { id: 'event', label: 'Event-based', description: 'Triggered by Uplift events', icon: Zap },
  { id: 'webhook', label: 'Incoming Webhook', description: 'Receive data from external systems', icon: Webhook },
];

const UPLIFT_EVENTS = [
  { id: 'employee.created', label: 'Employee Created', category: 'Employees' },
  { id: 'employee.updated', label: 'Employee Updated', category: 'Employees' },
  { id: 'employee.deactivated', label: 'Employee Deactivated', category: 'Employees' },
  { id: 'shift.created', label: 'Shift Created', category: 'Scheduling' },
  { id: 'shift.updated', label: 'Shift Updated', category: 'Scheduling' },
  { id: 'shift.deleted', label: 'Shift Deleted', category: 'Scheduling' },
  { id: 'shift.claimed', label: 'Shift Claimed', category: 'Scheduling' },
  { id: 'timeentry.clockin', label: 'Clock In', category: 'Time Tracking' },
  { id: 'timeentry.clockout', label: 'Clock Out', category: 'Time Tracking' },
  { id: 'timeentry.approved', label: 'Time Entry Approved', category: 'Time Tracking' },
  { id: 'timeoff.requested', label: 'Time Off Requested', category: 'Time Off' },
  { id: 'timeoff.approved', label: 'Time Off Approved', category: 'Time Off' },
  { id: 'timeoff.rejected', label: 'Time Off Rejected', category: 'Time Off' },
  { id: 'skill.verified', label: 'Skill Verified', category: 'Skills' },
  { id: 'job.applied', label: 'Job Application', category: 'Career' },
];

const UPLIFT_FIELDS = {
  employee: [
    { id: 'id', label: 'Employee ID', type: 'string' },
    { id: 'employee_number', label: 'Employee Number', type: 'string' },
    { id: 'first_name', label: 'First Name', type: 'string' },
    { id: 'last_name', label: 'Last Name', type: 'string' },
    { id: 'email', label: 'Email', type: 'string' },
    { id: 'phone', label: 'Phone', type: 'string' },
    { id: 'hire_date', label: 'Hire Date', type: 'date' },
    { id: 'department_id', label: 'Department ID', type: 'string' },
    { id: 'department_name', label: 'Department Name', type: 'string' },
    { id: 'location_id', label: 'Location ID', type: 'string' },
    { id: 'location_name', label: 'Location Name', type: 'string' },
    { id: 'role_id', label: 'Role ID', type: 'string' },
    { id: 'role_name', label: 'Role Name', type: 'string' },
    { id: 'hourly_rate', label: 'Hourly Rate', type: 'number' },
    { id: 'status', label: 'Status', type: 'string' },
  ],
  shift: [
    { id: 'id', label: 'Shift ID', type: 'string' },
    { id: 'employee_id', label: 'Employee ID', type: 'string' },
    { id: 'location_id', label: 'Location ID', type: 'string' },
    { id: 'date', label: 'Date', type: 'date' },
    { id: 'start_time', label: 'Start Time', type: 'time' },
    { id: 'end_time', label: 'End Time', type: 'time' },
    { id: 'break_minutes', label: 'Break (mins)', type: 'number' },
    { id: 'status', label: 'Status', type: 'string' },
  ],
  timeentry: [
    { id: 'id', label: 'Entry ID', type: 'string' },
    { id: 'employee_id', label: 'Employee ID', type: 'string' },
    { id: 'shift_id', label: 'Shift ID', type: 'string' },
    { id: 'clock_in', label: 'Clock In', type: 'datetime' },
    { id: 'clock_out', label: 'Clock Out', type: 'datetime' },
    { id: 'hours_worked', label: 'Hours Worked', type: 'number' },
    { id: 'status', label: 'Status', type: 'string' },
  ],
};

const SCHEDULE_OPTIONS = [
  { id: 'every_5_min', label: 'Every 5 minutes', cron: '*/5 * * * *' },
  { id: 'every_15_min', label: 'Every 15 minutes', cron: '*/15 * * * *' },
  { id: 'every_hour', label: 'Every hour', cron: '0 * * * *' },
  { id: 'every_6_hours', label: 'Every 6 hours', cron: '0 */6 * * *' },
  { id: 'daily_midnight', label: 'Daily at midnight', cron: '0 0 * * *' },
  { id: 'daily_6am', label: 'Daily at 6 AM', cron: '0 6 * * *' },
  { id: 'weekly_monday', label: 'Weekly on Monday', cron: '0 0 * * 1' },
  { id: 'custom', label: 'Custom CRON', cron: '' },
];

// Mock existing custom APIs
const INITIAL_CUSTOM_APIS = [
  {
    id: 'api-1',
    name: 'Sync to Legacy HR System',
    description: 'Push employee updates to the old HR database',
    method: 'POST',
    url: 'https://legacy-hr.company.com/api/v1/employees',
    authType: 'api_key',
    triggerType: 'event',
    triggerEvents: ['employee.created', 'employee.updated'],
    enabled: true,
    lastRun: '2026-01-09T14:30:00Z',
    lastStatus: 'success',
    runCount: 156,
    errorCount: 2,
  },
  {
    id: 'api-2',
    name: 'Daily Timesheet Export',
    description: 'Send approved timesheets to payroll system',
    method: 'POST',
    url: 'https://payroll.company.com/api/timesheets/import',
    authType: 'bearer',
    triggerType: 'schedule',
    schedule: 'daily_6am',
    enabled: true,
    lastRun: '2026-01-09T06:00:00Z',
    lastStatus: 'success',
    runCount: 45,
    errorCount: 0,
  },
  {
    id: 'api-3',
    name: 'Slack Shift Notification',
    description: 'Post to Slack when shifts are published (configure your webhook URL)',
    method: 'POST',
    url: 'https://hooks.slack.com/services/YOUR_WORKSPACE/YOUR_CHANNEL/YOUR_TOKEN',
    authType: 'none',
    triggerType: 'event',
    triggerEvents: ['shift.created'],
    enabled: false,
    lastRun: null,
    lastStatus: 'not_configured',
    runCount: 0,
    errorCount: 0,
  },
];

// -------------------- HELPER COMPONENTS --------------------

const cn = (...classes) => classes.filter(Boolean).join(' ');

const Badge = ({ children, variant = 'default', size = 'sm' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  };
  
  const sizes = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };
  
  return (
    <span className={cn('rounded-full font-medium', variants[variant], sizes[size])}>
      {children}
    </span>
  );
};

const Button = ({ children, variant = 'default', size = 'md', className, ...props }) => {
  const variants = {
    default: 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200',
    primary: 'bg-orange-500 hover:bg-orange-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400',
    outline: 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5',
  };
  
  return (
    <button
      className={cn(
        'rounded-lg font-medium transition-colors inline-flex items-center justify-center gap-2',
        variants[variant],
        sizes[size],
        props.disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ label, error, className, ...props }) => (
  <div className={className}>
    {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>}
    <input
      className={cn(
        'w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white',
        'focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-shadow',
        error ? 'border-red-300 dark:border-red-600' : 'border-slate-200 dark:border-slate-700'
      )}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const Select = ({ label, options, className, ...props }) => (
  <div className={className}>
    {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>}
    <select
      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
      {...props}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const Toggle = ({ enabled, onChange, label }) => (
  <button
    type="button"
    onClick={() => onChange(!enabled)}
    className="flex items-center gap-3"
  >
    <div className={cn(
      'relative w-11 h-6 rounded-full transition-colors',
      enabled ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'
    )}>
      <div className={cn(
        'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm',
        enabled ? 'translate-x-6' : 'translate-x-1'
      )} />
    </div>
    {label && <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>}
  </button>
);

const formatDate = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

// -------------------- API LIST VIEW --------------------

const ApiListItem = ({ api, onEdit, onToggle, onDelete, onTest }) => {
  const [showMenu, setShowMenu] = useState(false);
  
  const getTriggerLabel = () => {
    switch (api.triggerType) {
      case 'event':
        return `${api.triggerEvents?.length || 0} events`;
      case 'schedule':
        return SCHEDULE_OPTIONS.find(s => s.id === api.schedule)?.label || 'Scheduled';
      case 'webhook':
        return 'Incoming webhook';
      default:
        return 'Manual';
    }
  };
  
  return (
    <div className={cn(
      'bg-white dark:bg-slate-800 rounded-xl border p-4 transition-all',
      api.enabled 
        ? 'border-slate-200 dark:border-slate-700' 
        : 'border-slate-200 dark:border-slate-700 opacity-60'
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-semibold text-slate-900 dark:text-white truncate">{api.name}</h3>
            <Badge variant={api.method === 'GET' ? 'info' : api.method === 'POST' ? 'success' : 'warning'}>
              {api.method}
            </Badge>
            {!api.enabled && <Badge variant="default">Disabled</Badge>}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate mb-2">{api.description}</p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              {api.triggerType === 'event' && <Zap className="w-3 h-3" />}
              {api.triggerType === 'schedule' && <Clock className="w-3 h-3" />}
              {api.triggerType === 'manual' && <Play className="w-3 h-3" />}
              {api.triggerType === 'webhook' && <Webhook className="w-3 h-3" />}
              {getTriggerLabel()}
            </span>
            <span>•</span>
            <span>{api.runCount} runs</span>
            {api.errorCount > 0 && (
              <>
                <span>•</span>
                <span className="text-red-500">{api.errorCount} errors</span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {api.lastStatus && (
            <div className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center',
              api.lastStatus === 'success' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'
            )}>
              {api.lastStatus === 'success' 
                ? <CheckCircle className="w-4 h-4 text-emerald-500" />
                : <AlertCircle className="w-4 h-4 text-red-500" />
              }
            </div>
          )}
          
          <Toggle enabled={api.enabled} onChange={() => onToggle(api.id)} />
          
          <div className="relative">
            <Button variant="ghost" size="sm" onClick={() => setShowMenu(!showMenu)}>
              <MoreVertical className="w-4 h-4" />
            </Button>
            
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-20">
                  <button
                    onClick={() => { onEdit(api); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => { onTest(api); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <TestTube className="w-4 h-4" /> Test
                  </button>
                  <button
                    onClick={() => { setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <History className="w-4 h-4" /> View Logs
                  </button>
                  <hr className="my-1 border-slate-200 dark:border-slate-700" />
                  <button
                    onClick={() => { onDelete(api.id); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500">
        <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded truncate max-w-[60%]">
          {api.url}
        </code>
        <span>Last run: {formatDate(api.lastRun)}</span>
      </div>
    </div>
  );
};

// -------------------- API EDITOR --------------------

const ApiEditor = ({ api, onSave, onCancel, onTest }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    method: 'POST',
    url: '',
    authType: 'none',
    authConfig: {},
    headers: [{ key: '', value: '' }],
    triggerType: 'manual',
    triggerEvents: [],
    schedule: 'daily_6am',
    customCron: '',
    fieldMappings: [],
    transformations: [],
    requestBody: '{\n  \n}',
    enabled: true,
    ...api,
  });
  
  const [activeTab, setActiveTab] = useState('request');
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const updateAuthConfig = (field, value) => {
    setFormData(prev => ({
      ...prev,
      authConfig: { ...prev.authConfig, [field]: value }
    }));
  };
  
  const addHeader = () => {
    setFormData(prev => ({
      ...prev,
      headers: [...prev.headers, { key: '', value: '' }]
    }));
  };
  
  const updateHeader = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      headers: prev.headers.map((h, i) => i === index ? { ...h, [field]: value } : h)
    }));
  };
  
  const removeHeader = (index) => {
    setFormData(prev => ({
      ...prev,
      headers: prev.headers.filter((_, i) => i !== index)
    }));
  };
  
  const toggleEvent = (eventId) => {
    setFormData(prev => ({
      ...prev,
      triggerEvents: prev.triggerEvents.includes(eventId)
        ? prev.triggerEvents.filter(e => e !== eventId)
        : [...prev.triggerEvents, eventId]
    }));
  };
  
  const addFieldMapping = () => {
    setFormData(prev => ({
      ...prev,
      fieldMappings: [...prev.fieldMappings, { upliftField: '', externalField: '', transform: 'none' }]
    }));
  };
  
  const updateFieldMapping = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      fieldMappings: prev.fieldMappings.map((m, i) => i === index ? { ...m, [field]: value } : m)
    }));
  };
  
  const removeFieldMapping = (index) => {
    setFormData(prev => ({
      ...prev,
      fieldMappings: prev.fieldMappings.filter((_, i) => i !== index)
    }));
  };
  
  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    
    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setTestResult({
      success: Math.random() > 0.3,
      statusCode: Math.random() > 0.3 ? 200 : 401,
      duration: Math.floor(Math.random() * 500) + 100,
      response: Math.random() > 0.3 
        ? { success: true, id: 'emp_123', message: 'Employee synced successfully' }
        : { error: 'Unauthorized', message: 'Invalid API key' },
    });
    
    setTesting(false);
  };
  
  const handleSave = () => {
    onSave({
      ...formData,
      headers: formData.headers.filter(h => h.key),
    });
  };
  
  const tabs = [
    { id: 'request', label: 'Request', icon: Globe },
    { id: 'auth', label: 'Authentication', icon: Lock },
    { id: 'trigger', label: 'Trigger', icon: Zap },
    { id: 'mapping', label: 'Field Mapping', icon: ArrowLeftRight },
    { id: 'test', label: 'Test', icon: TestTube },
  ];
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {api ? 'Edit API Integration' : 'Create API Integration'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">Configure your custom REST API connection</p>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        {/* Name & Description */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-4">
          <Input
            label="Integration Name"
            placeholder="e.g., Sync to Payroll System"
            value={formData.name}
            onChange={e => updateField('name', e.target.value)}
          />
          <Input
            label="Description"
            placeholder="What does this integration do?"
            value={formData.description}
            onChange={e => updateField('description', e.target.value)}
          />
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 px-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Request Tab */}
          {activeTab === 'request' && (
            <div className="space-y-6">
              {/* Method & URL */}
              <div className="flex gap-3">
                <Select
                  label="Method"
                  value={formData.method}
                  onChange={e => updateField('method', e.target.value)}
                  options={HTTP_METHODS.map(m => ({ value: m, label: m }))}
                  className="w-32"
                />
                <Input
                  label="URL"
                  placeholder="https://api.example.com/endpoint"
                  value={formData.url}
                  onChange={e => updateField('url', e.target.value)}
                  className="flex-1"
                />
              </div>
              
              {/* Headers */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Headers</label>
                  <Button variant="ghost" size="sm" onClick={addHeader}>
                    <Plus className="w-4 h-4" /> Add Header
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.headers.map((header, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Header name"
                        value={header.key}
                        onChange={e => updateHeader(index, 'key', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Value"
                        value={header.value}
                        onChange={e => updateHeader(index, 'value', e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="ghost" size="sm" onClick={() => removeHeader(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Request Body */}
              {['POST', 'PUT', 'PATCH'].includes(formData.method) && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Request Body (JSON)
                  </label>
                  <div className="relative">
                    <textarea
                      value={formData.requestBody}
                      onChange={e => updateField('requestBody', e.target.value)}
                      className="w-full h-48 px-4 py-3 font-mono text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder='{"field": "{{employee.first_name}}"}'
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="info" size="xs">Use {`{{field}}`} for variables</Badge>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Available variables: {`{{employee.id}}`}, {`{{employee.first_name}}`}, {`{{employee.email}}`}, etc.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Auth Tab */}
          {activeTab === 'auth' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Authentication Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {AUTH_TYPES.map(auth => (
                    <button
                      key={auth.id}
                      onClick={() => updateField('authType', auth.id)}
                      className={cn(
                        'p-4 rounded-xl border-2 text-left transition-all',
                        formData.authType === auth.id
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      )}
                    >
                      <auth.icon className={cn(
                        'w-5 h-5 mb-2',
                        formData.authType === auth.id ? 'text-orange-500' : 'text-slate-400'
                      )} />
                      <p className="font-medium text-sm">{auth.label}</p>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Auth Config */}
              {formData.authType === 'api_key' && (
                <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <Select
                    label="API Key Location"
                    value={formData.authConfig.location || 'header'}
                    onChange={e => updateAuthConfig('location', e.target.value)}
                    options={[
                      { value: 'header', label: 'Header' },
                      { value: 'query', label: 'Query Parameter' },
                    ]}
                  />
                  <Input
                    label="Key Name"
                    placeholder="e.g., X-API-Key"
                    value={formData.authConfig.keyName || ''}
                    onChange={e => updateAuthConfig('keyName', e.target.value)}
                  />
                  <div className="relative">
                    <Input
                      label="API Key"
                      type={showSecrets ? 'text' : 'password'}
                      placeholder="Enter your API key"
                      value={formData.authConfig.apiKey || ''}
                      onChange={e => updateAuthConfig('apiKey', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecrets(!showSecrets)}
                      className="absolute right-3 top-8 text-slate-400 hover:text-slate-600"
                    >
                      {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
              
              {formData.authType === 'bearer' && (
                <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div className="relative">
                    <Input
                      label="Bearer Token"
                      type={showSecrets ? 'text' : 'password'}
                      placeholder="Enter your token"
                      value={formData.authConfig.token || ''}
                      onChange={e => updateAuthConfig('token', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecrets(!showSecrets)}
                      className="absolute right-3 top-8 text-slate-400 hover:text-slate-600"
                    >
                      {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
              
              {formData.authType === 'basic' && (
                <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <Input
                    label="Username"
                    value={formData.authConfig.username || ''}
                    onChange={e => updateAuthConfig('username', e.target.value)}
                  />
                  <div className="relative">
                    <Input
                      label="Password"
                      type={showSecrets ? 'text' : 'password'}
                      value={formData.authConfig.password || ''}
                      onChange={e => updateAuthConfig('password', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecrets(!showSecrets)}
                      className="absolute right-3 top-8 text-slate-400 hover:text-slate-600"
                    >
                      {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
              
              {formData.authType === 'oauth2' && (
                <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <Input
                    label="Token URL"
                    placeholder="https://auth.example.com/oauth/token"
                    value={formData.authConfig.tokenUrl || ''}
                    onChange={e => updateAuthConfig('tokenUrl', e.target.value)}
                  />
                  <Input
                    label="Client ID"
                    value={formData.authConfig.clientId || ''}
                    onChange={e => updateAuthConfig('clientId', e.target.value)}
                  />
                  <div className="relative">
                    <Input
                      label="Client Secret"
                      type={showSecrets ? 'text' : 'password'}
                      value={formData.authConfig.clientSecret || ''}
                      onChange={e => updateAuthConfig('clientSecret', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecrets(!showSecrets)}
                      className="absolute right-3 top-8 text-slate-400 hover:text-slate-600"
                    >
                      {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <Input
                    label="Scopes (comma-separated)"
                    placeholder="read,write"
                    value={formData.authConfig.scopes || ''}
                    onChange={e => updateAuthConfig('scopes', e.target.value)}
                  />
                </div>
              )}
            </div>
          )}
          
          {/* Trigger Tab */}
          {activeTab === 'trigger' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  When should this integration run?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {TRIGGER_TYPES.map(trigger => (
                    <button
                      key={trigger.id}
                      onClick={() => updateField('triggerType', trigger.id)}
                      className={cn(
                        'p-4 rounded-xl border-2 text-left transition-all',
                        formData.triggerType === trigger.id
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      )}
                    >
                      <trigger.icon className={cn(
                        'w-5 h-5 mb-2',
                        formData.triggerType === trigger.id ? 'text-orange-500' : 'text-slate-400'
                      )} />
                      <p className="font-medium text-sm">{trigger.label}</p>
                      <p className="text-xs text-slate-500 mt-1">{trigger.description}</p>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Event Selection */}
              {formData.triggerType === 'event' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Select Events
                  </label>
                  <div className="space-y-4">
                    {Object.entries(
                      UPLIFT_EVENTS.reduce((acc, event) => {
                        if (!acc[event.category]) acc[event.category] = [];
                        acc[event.category].push(event);
                        return acc;
                      }, {})
                    ).map(([category, events]) => (
                      <div key={category}>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">{category}</p>
                        <div className="flex flex-wrap gap-2">
                          {events.map(event => (
                            <button
                              key={event.id}
                              onClick={() => toggleEvent(event.id)}
                              className={cn(
                                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                                formData.triggerEvents.includes(event.id)
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                              )}
                            >
                              {event.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Schedule Selection */}
              {formData.triggerType === 'schedule' && (
                <div className="space-y-4">
                  <Select
                    label="Schedule"
                    value={formData.schedule}
                    onChange={e => updateField('schedule', e.target.value)}
                    options={SCHEDULE_OPTIONS.map(s => ({ value: s.id, label: s.label }))}
                  />
                  {formData.schedule === 'custom' && (
                    <Input
                      label="CRON Expression"
                      placeholder="0 6 * * *"
                      value={formData.customCron}
                      onChange={e => updateField('customCron', e.target.value)}
                    />
                  )}
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <Info className="w-4 h-4 inline mr-1" />
                      Schedule uses UTC timezone. Current CRON: <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">
                        {SCHEDULE_OPTIONS.find(s => s.id === formData.schedule)?.cron || formData.customCron}
                      </code>
                    </p>
                  </div>
                </div>
              )}
              
              {/* Webhook Info */}
              {formData.triggerType === 'webhook' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Your Webhook URL</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-white dark:bg-slate-900 px-3 py-2 rounded-lg text-sm border border-slate-200 dark:border-slate-700">
                        https://api.uplift.hr/webhooks/custom/{formData.id || 'new'}
                      </code>
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Send POST requests to this URL. We'll process incoming data and map it to Uplift.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Mapping Tab */}
          {activeTab === 'mapping' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white">Field Mappings</h3>
                  <p className="text-sm text-slate-500">Map Uplift fields to your external API fields</p>
                </div>
                <Button variant="outline" size="sm" onClick={addFieldMapping}>
                  <Plus className="w-4 h-4" /> Add Mapping
                </Button>
              </div>
              
              {formData.fieldMappings.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <ArrowLeftRight className="w-8 h-8 mx-auto mb-3 text-slate-300" />
                  <p className="text-slate-500">No field mappings yet</p>
                  <p className="text-sm text-slate-400 mt-1">Add mappings to transform data between systems</p>
                  <Button variant="primary" size="sm" className="mt-4" onClick={addFieldMapping}>
                    <Plus className="w-4 h-4" /> Add First Mapping
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.fieldMappings.map((mapping, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <GripVertical className="w-4 h-4 text-slate-300 cursor-move" />
                      
                      <Select
                        value={mapping.upliftField}
                        onChange={e => updateFieldMapping(index, 'upliftField', e.target.value)}
                        options={[
                          { value: '', label: 'Select Uplift field...' },
                          ...UPLIFT_FIELDS.employee.map(f => ({ value: `employee.${f.id}`, label: f.label })),
                        ]}
                        className="flex-1"
                      />
                      
                      <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      
                      <Input
                        placeholder="External field name"
                        value={mapping.externalField}
                        onChange={e => updateFieldMapping(index, 'externalField', e.target.value)}
                        className="flex-1"
                      />
                      
                      <Select
                        value={mapping.transform}
                        onChange={e => updateFieldMapping(index, 'transform', e.target.value)}
                        options={[
                          { value: 'none', label: 'No transform' },
                          { value: 'uppercase', label: 'UPPERCASE' },
                          { value: 'lowercase', label: 'lowercase' },
                          { value: 'date_iso', label: 'Date → ISO' },
                          { value: 'date_uk', label: 'Date → UK format' },
                          { value: 'bool_yn', label: 'Bool → Y/N' },
                        ]}
                        className="w-40"
                      />
                      
                      <Button variant="ghost" size="sm" onClick={() => removeFieldMapping(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  <Info className="w-4 h-4 inline mr-1" />
                  Field mappings are used to build the request body automatically. You can also use {`{{field}}`} syntax in the Request tab for custom JSON structures.
                </p>
              </div>
            </div>
          )}
          
          {/* Test Tab */}
          {activeTab === 'test' && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Test Configuration</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Send a test request to verify your configuration. We'll use sample data.
                </p>
                
                <div className="flex items-center gap-3">
                  <Badge variant="info">{formData.method}</Badge>
                  <code className="text-sm text-slate-600 dark:text-slate-400 truncate flex-1">
                    {formData.url || 'https://...'}
                  </code>
                </div>
              </div>
              
              <Button 
                variant="primary" 
                onClick={handleTest} 
                disabled={testing || !formData.url}
                className="w-full"
              >
                {testing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Send Test Request
                  </>
                )}
              </Button>
              
              {testResult && (
                <div className={cn(
                  'rounded-xl border-2 overflow-hidden',
                  testResult.success 
                    ? 'border-emerald-200 dark:border-emerald-800' 
                    : 'border-red-200 dark:border-red-800'
                )}>
                  <div className={cn(
                    'px-4 py-3 flex items-center justify-between',
                    testResult.success 
                      ? 'bg-emerald-50 dark:bg-emerald-900/30' 
                      : 'bg-red-50 dark:bg-red-900/30'
                  )}>
                    <div className="flex items-center gap-3">
                      {testResult.success 
                        ? <CheckCircle className="w-5 h-5 text-emerald-500" />
                        : <AlertCircle className="w-5 h-5 text-red-500" />
                      }
                      <span className={cn(
                        'font-medium',
                        testResult.success ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'
                      )}>
                        {testResult.success ? 'Success' : 'Failed'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-500">Status: <strong>{testResult.statusCode}</strong></span>
                      <span className="text-slate-500">Time: <strong>{testResult.duration}ms</strong></span>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-900">
                    <p className="text-xs text-slate-400 mb-2">Response</p>
                    <pre className="text-sm text-emerald-400 font-mono overflow-x-auto">
                      {JSON.stringify(testResult.response, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700">
          <Toggle
            enabled={formData.enabled}
            onChange={v => updateField('enabled', v)}
            label="Enable integration"
          />
          <div className="flex gap-3">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} disabled={!formData.name || !formData.url}>
              <Save className="w-4 h-4" />
              {api ? 'Save Changes' : 'Create Integration'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------- MAIN COMPONENT --------------------

const ApiFactory = () => {
  const [customApis, setCustomApis] = useState(INITIAL_CUSTOM_APIS);
  const [searchQuery, setSearchQuery] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingApi, setEditingApi] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'logs'
  
  const filteredApis = customApis.filter(api =>
    api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    api.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCreate = () => {
    setEditingApi(null);
    setEditorOpen(true);
  };
  
  const handleEdit = (api) => {
    setEditingApi(api);
    setEditorOpen(true);
  };
  
  const handleSave = (apiData) => {
    if (editingApi) {
      setCustomApis(prev => prev.map(api => 
        api.id === editingApi.id ? { ...api, ...apiData } : api
      ));
    } else {
      setCustomApis(prev => [...prev, {
        ...apiData,
        id: `api-${Date.now()}`,
        lastRun: null,
        lastStatus: null,
        runCount: 0,
        errorCount: 0,
      }]);
    }
    setEditorOpen(false);
    setEditingApi(null);
  };
  
  const handleToggle = (apiId) => {
    setCustomApis(prev => prev.map(api =>
      api.id === apiId ? { ...api, enabled: !api.enabled } : api
    ));
  };
  
  const handleDelete = (apiId) => {
    if (confirm('Are you sure you want to delete this integration?')) {
      setCustomApis(prev => prev.filter(api => api.id !== apiId));
    }
  };
  
  const handleTest = (api) => {
    setEditingApi(api);
    setEditorOpen(true);
    // Will open to test tab
  };
  
  const stats = {
    total: customApis.length,
    active: customApis.filter(a => a.enabled).length,
    runsToday: customApis.reduce((sum, a) => sum + (a.runCount > 0 ? Math.floor(Math.random() * 10) : 0), 0),
    errors: customApis.reduce((sum, a) => sum + a.errorCount, 0),
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Code className="w-6 h-6 text-orange-500" />
            API Factory
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Build custom REST API integrations without writing code
          </p>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          <Plus className="w-4 h-4" />
          New Integration
        </Button>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500">Total Integrations</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500">Active</p>
          <p className="text-2xl font-bold text-emerald-500">{stats.active}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500">Runs Today</p>
          <p className="text-2xl font-bold text-blue-500">{stats.runsToday}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500">Total Errors</p>
          <p className="text-2xl font-bold text-red-500">{stats.errors}</p>
        </div>
      </div>
      
      {/* Search & Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search integrations..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800"
          />
        </div>
        <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors',
              viewMode === 'list'
                ? 'bg-orange-500 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 hover:bg-slate-50'
            )}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('logs')}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors',
              viewMode === 'logs'
                ? 'bg-orange-500 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 hover:bg-slate-50'
            )}
          >
            <History className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* List View */}
      {viewMode === 'list' && (
        <>
          {filteredApis.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <Code className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                {searchQuery ? 'No integrations found' : 'No custom integrations yet'}
              </h3>
              <p className="text-slate-500 mb-6">
                {searchQuery 
                  ? 'Try a different search term'
                  : 'Create your first custom API integration to connect any REST API'
                }
              </p>
              {!searchQuery && (
                <Button variant="primary" onClick={handleCreate}>
                  <Plus className="w-4 h-4" />
                  Create Integration
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApis.map(api => (
                <ApiListItem
                  key={api.id}
                  api={api}
                  onEdit={handleEdit}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onTest={handleTest}
                />
              ))}
            </div>
          )}
        </>
      )}
      
      {/* Logs View */}
      {viewMode === 'logs' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h3 className="font-semibold">Execution Logs</h3>
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4" /> Export
            </Button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {[...Array(10)].map((_, i) => {
              const success = Math.random() > 0.2;
              const api = customApis[Math.floor(Math.random() * customApis.length)];
              return (
                <div key={i} className="px-4 py-3 flex items-center gap-4 text-sm">
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    success ? 'bg-emerald-500' : 'bg-red-500'
                  )} />
                  <span className="font-medium text-slate-900 dark:text-white w-48 truncate">
                    {api?.name || 'Unknown'}
                  </span>
                  <Badge variant={success ? 'success' : 'error'} size="xs">
                    {success ? '200 OK' : '401 Error'}
                  </Badge>
                  <span className="text-slate-500">{Math.floor(Math.random() * 500) + 50}ms</span>
                  <span className="text-slate-400 ml-auto">
                    {new Date(Date.now() - i * 3600000 * Math.random()).toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-900 dark:text-blue-100 font-medium">
            Need help building an integration?
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
            Check our <a href="#" className="underline">API documentation</a> for examples, or contact support for complex use cases.
          </p>
        </div>
      </div>
      
      {/* Editor Modal */}
      {editorOpen && (
        <ApiEditor
          api={editingApi}
          onSave={handleSave}
          onCancel={() => { setEditorOpen(false); setEditingApi(null); }}
          onTest={handleTest}
        />
      )}
    </div>
  );
};

export default ApiFactory;
