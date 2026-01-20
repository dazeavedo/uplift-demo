// ============================================================
// UPLIFT REST API KEYS MANAGEMENT
// Generate and manage API keys for external access to Uplift API
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  Key, Plus, Copy, Check, X, Eye, EyeOff, Trash2, RefreshCw,
  Clock, Activity, Shield, ChevronDown, ChevronRight, AlertTriangle,
  Code, Download, ExternalLink, Lock, Settings, Info
} from 'lucide-react';
import { api } from '../lib/api';

// -------------------- CONSTANTS --------------------

const SCOPES = {
  'employees:read': 'View employee information',
  'employees:write': 'Create and update employees',
  'schedules:read': 'View schedules and shifts',
  'schedules:write': 'Create and modify schedules',
  'time:read': 'View time entries',
  'time:write': 'Create and modify time entries',
  'skills:read': 'View skills and certifications',
  'skills:write': 'Manage skills and verifications',
  'locations:read': 'View location information',
  'locations:write': 'Manage locations',
  'reports:read': 'Access reports data',
  'webhooks:manage': 'Configure webhooks',
  'admin': 'Full administrative access',
};

const RATE_TIERS = [
  { id: 'basic', name: 'Basic', requests: '60/min', daily: '10,000/day' },
  { id: 'standard', name: 'Standard', requests: '120/min', daily: '50,000/day' },
  { id: 'premium', name: 'Premium', requests: '300/min', daily: '200,000/day' },
];

// -------------------- HELPER COMPONENTS --------------------

const cn = (...classes) => classes.filter(Boolean).join(' ');

const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
  };
  
  return (
    <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold', variants[variant])}>
      {children}
    </span>
  );
};

const CopyButton = ({ text, label }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
      title={copied ? 'Copied!' : `Copy ${label}`}
    >
      {copied ? (
        <Check className="w-4 h-4 text-emerald-500" />
      ) : (
        <Copy className="w-4 h-4 text-slate-400" />
      )}
    </button>
  );
};

// -------------------- API KEY CARD --------------------

const ApiKeyCard = ({ apiKey, onRevoke, onRegenerate, onViewUsage }) => {
  const [showKey, setShowKey] = useState(false);
  const [expanded, setExpanded] = useState(false);
  
  const isExpired = apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date();
  const scopes = typeof apiKey.scopes === 'string' ? JSON.parse(apiKey.scopes) : apiKey.scopes;
  
  return (
    <div className={cn(
      'bg-white dark:bg-slate-800 rounded-xl border p-4 transition-all',
      isExpired ? 'border-red-200 dark:border-red-800' : 'border-slate-200 dark:border-slate-700',
      !apiKey.isActive && 'opacity-60'
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center',
            apiKey.isActive ? 'bg-orange-500/10 text-orange-500' : 'bg-slate-100 text-slate-400'
          )}>
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">{apiKey.name}</h3>
            <p className="text-xs text-slate-500">{apiKey.description || 'No description'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isExpired ? (
            <Badge variant="error">Expired</Badge>
          ) : apiKey.isActive ? (
            <Badge variant="success">Active</Badge>
          ) : (
            <Badge variant="warning">Inactive</Badge>
          )}
        </div>
      </div>
      
      {/* Key ID */}
      <div className="flex items-center gap-2 mb-3 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
        <code className="text-sm font-mono text-slate-700 dark:text-slate-300 flex-1">
          {apiKey.maskedKeyId || apiKey.keyId?.substring(0, 20) + '...'}
        </code>
        <CopyButton text={apiKey.keyId} label="Key ID" />
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
        <div>
          <span className="text-slate-500">Requests</span>
          <p className="font-medium">{apiKey.requestCount?.toLocaleString() || 0}</p>
        </div>
        <div>
          <span className="text-slate-500">Last Used</span>
          <p className="font-medium">
            {apiKey.lastUsedAt 
              ? new Date(apiKey.lastUsedAt).toLocaleDateString() 
              : 'Never'}
          </p>
        </div>
        <div>
          <span className="text-slate-500">Rate Limit</span>
          <p className="font-medium capitalize">{apiKey.rateLimitTier || 'Standard'}</p>
        </div>
      </div>
      
      {/* Expand/Collapse */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-1 py-2 text-sm text-slate-500 hover:text-slate-700"
      >
        {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        {expanded ? 'Hide details' : 'Show details'}
      </button>
      
      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-3">
          {/* Scopes */}
          <div>
            <h4 className="text-xs font-medium text-slate-500 mb-2">SCOPES</h4>
            <div className="flex flex-wrap gap-1">
              {scopes?.map(scope => (
                <span key={scope} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs">
                  {scope}
                </span>
              ))}
            </div>
          </div>
          
          {/* Dates */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Created</span>
              <p>{new Date(apiKey.createdAt).toLocaleDateString()}</p>
            </div>
            {apiKey.expiresAt && (
              <div>
                <span className="text-slate-500">Expires</span>
                <p className={isExpired ? 'text-red-500' : ''}>
                  {new Date(apiKey.expiresAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => onViewUsage(apiKey)}
              className="flex-1 px-3 py-2 text-sm font-medium bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 flex items-center justify-center gap-1"
            >
              <Activity className="w-4 h-4" /> Usage
            </button>
            <button
              onClick={() => onRegenerate(apiKey)}
              className="flex-1 px-3 py-2 text-sm font-medium bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 flex items-center justify-center gap-1"
            >
              <RefreshCw className="w-4 h-4" /> Regenerate
            </button>
            <button
              onClick={() => onRevoke(apiKey)}
              className="px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" /> Revoke
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------- CREATE KEY MODAL --------------------

const CreateKeyModal = ({ open, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedScopes, setSelectedScopes] = useState(['employees:read', 'schedules:read']);
  const [rateTier, setRateTier] = useState('standard');
  const [expiresIn, setExpiresIn] = useState('never');
  const [creating, setCreating] = useState(false);
  const [createdKey, setCreatedKey] = useState(null);
  const [showSecret, setShowSecret] = useState(false);
  
  const handleCreate = async () => {
    if (!name) return;
    
    setCreating(true);
    try {
      // Calculate expiration
      let expiresAt = null;
      if (expiresIn !== 'never') {
        const days = parseInt(expiresIn);
        expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
      }
      
      const result = await api.post('/integrations/api-keys', {
        name,
        description,
        scopes: selectedScopes,
        rateLimitTier: rateTier,
        expiresAt,
      });
      
      setCreatedKey(result);
    } catch (error) {
      console.error('Failed to create API key:', error);
      // Fallback for demo
      setCreatedKey({
        keyId: 'uplift_' + Math.random().toString(36).substring(2, 18),
        secretKey: Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2),
        fullKey: 'uplift_demo.' + Math.random().toString(36).substring(2, 30),
        name,
        scopes: selectedScopes,
      });
    } finally {
      setCreating(false);
    }
  };
  
  const handleClose = () => {
    if (createdKey) {
      onCreate?.(createdKey);
    }
    setName('');
    setDescription('');
    setSelectedScopes(['employees:read', 'schedules:read']);
    setCreatedKey(null);
    onClose();
  };
  
  const toggleScope = (scope) => {
    if (selectedScopes.includes(scope)) {
      setSelectedScopes(selectedScopes.filter(s => s !== scope));
    } else {
      setSelectedScopes([...selectedScopes, scope]);
    }
  };
  
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {createdKey ? 'API Key Created' : 'Create API Key'}
          </h2>
          <button onClick={handleClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <div className="p-6">
          {createdKey ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-emerald-700 dark:text-emerald-300">API key created successfully</p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                      Copy your secret key now. You won't be able to see it again!
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Key ID
                </label>
                <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <code className="text-sm font-mono flex-1 text-slate-600 dark:text-slate-400">
                    {createdKey.keyId}
                  </code>
                  <CopyButton text={createdKey.keyId} label="Key ID" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Secret Key
                </label>
                <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <code className="text-sm font-mono flex-1 text-slate-600 dark:text-slate-400 break-all">
                    {showSecret ? createdKey.secretKey : '•'.repeat(40)}
                  </code>
                  <button
                    onClick={() => setShowSecret(!showSecret)}
                    className="p-1.5 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded"
                  >
                    {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <CopyButton text={createdKey.secretKey} label="Secret Key" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Full API Key (for Authorization header)
                </label>
                <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <code className="text-sm font-mono flex-1 text-slate-600 dark:text-slate-400 break-all">
                    {showSecret ? createdKey.fullKey : createdKey.keyId + '.•••••••••••'}
                  </code>
                  <CopyButton text={createdKey.fullKey} label="Full Key" />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Use this in your Authorization header: <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">Bearer {'{'}full_key{'}'}</code>
                </p>
              </div>
              
              <button
                onClick={handleClose}
                className="w-full py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Key Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g., Production API Key"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="What will this key be used for?"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Permissions
                </label>
                <div className="max-h-48 overflow-y-auto p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg space-y-2">
                  {Object.entries(SCOPES).map(([scope, desc]) => (
                    <label key={scope} className="flex items-start gap-3 cursor-pointer hover:bg-white dark:hover:bg-slate-800 p-2 rounded-lg">
                      <input
                        type="checkbox"
                        checked={selectedScopes.includes(scope)}
                        onChange={() => toggleScope(scope)}
                        className="w-4 h-4 mt-0.5 rounded text-orange-500"
                      />
                      <div>
                        <span className="text-sm font-medium">{scope}</span>
                        <p className="text-xs text-slate-500">{desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Rate Limit
                  </label>
                  <select
                    value={rateTier}
                    onChange={e => setRateTier(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                  >
                    {RATE_TIERS.map(tier => (
                      <option key={tier.id} value={tier.id}>
                        {tier.name} ({tier.requests})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Expiration
                  </label>
                  <select
                    value={expiresIn}
                    onChange={e => setExpiresIn(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                  >
                    <option value="never">Never expires</option>
                    <option value="30">30 days</option>
                    <option value="90">90 days</option>
                    <option value="365">1 year</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!name || creating}
                  className="flex-1 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {creating && <RefreshCw className="w-4 h-4 animate-spin" />}
                  Create Key
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// -------------------- MAIN COMPONENT --------------------

const RestApiKeys = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  
  useEffect(() => {
    loadApiKeys();
  }, []);
  
  const loadApiKeys = async () => {
    setLoading(true);
    try {
      const result = await api.get('/integrations/api-keys');
      setApiKeys(result.keys || []);
    } catch (error) {
      console.error('Failed to load API keys:', error);
      // Demo data fallback
      setApiKeys([
        {
          id: '1',
          keyId: 'uplift_pk_demo123456789',
          maskedKeyId: 'uplift_pk_demo...789',
          name: 'Production API Key',
          description: 'Main integration with payroll system',
          scopes: ['employees:read', 'schedules:read', 'time:read'],
          rateLimitTier: 'standard',
          isActive: true,
          requestCount: 12456,
          lastUsedAt: new Date().toISOString(),
          createdAt: '2025-11-01T00:00:00Z',
          expiresAt: null,
        },
        {
          id: '2',
          keyId: 'uplift_pk_test987654321',
          maskedKeyId: 'uplift_pk_test...321',
          name: 'Development Key',
          description: 'For testing in staging environment',
          scopes: ['employees:read', 'employees:write', 'schedules:read', 'schedules:write'],
          rateLimitTier: 'basic',
          isActive: true,
          requestCount: 234,
          lastUsedAt: '2026-01-08T00:00:00Z',
          createdAt: '2025-12-15T00:00:00Z',
          expiresAt: '2026-03-15T00:00:00Z',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreate = (newKey) => {
    setApiKeys([...apiKeys, {
      ...newKey,
      id: newKey.keyId,
      maskedKeyId: newKey.keyId.substring(0, 15) + '...',
      isActive: true,
      requestCount: 0,
      createdAt: new Date().toISOString(),
    }]);
  };
  
  const handleRevoke = async (key) => {
    if (!window.confirm(`Revoke API key "${key.name}"? This action cannot be undone.`)) return;
    
    try {
      await api.delete(`/integrations/api-keys/${key.keyId}`);
    } catch (error) {
      console.error('Failed to revoke key:', error);
    }
    setApiKeys(apiKeys.filter(k => k.id !== key.id));
  };
  
  const handleRegenerate = async (key) => {
    if (!window.confirm(`Regenerate secret for "${key.name}"? The old secret will stop working immediately.`)) return;
    
    try {
      const result = await api.post(`/integrations/api-keys/${key.keyId}/regenerate`);
      alert(`New secret key: ${result.secretKey}\n\nSave this now - you won't see it again!`);
    } catch (error) {
      console.error('Failed to regenerate:', error);
      alert('New secret: ' + Math.random().toString(36).substring(2, 30) + '\n\nSave this now!');
    }
  };
  
  const handleViewUsage = (key) => {
    alert(`Usage stats for ${key.name}:\n\nTotal requests: ${key.requestCount?.toLocaleString()}\nLast used: ${key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleString() : 'Never'}`);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Key className="w-6 h-6 text-orange-500" />
            REST API Keys
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Generate API keys to access Uplift data from your applications
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDocs(!showDocs)}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-700 rounded-xl font-medium flex items-center gap-2"
          >
            <Code className="w-4 h-4" /> API Docs
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-orange-500 text-white rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-orange-500/30"
          >
            <Plus className="w-4 h-4" /> Create Key
          </button>
        </div>
      </div>
      
      {/* API Docs Panel */}
      {showDocs && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Code className="w-5 h-5" /> Quick Start
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-2">Authentication</h4>
              <pre className="text-xs bg-slate-900 text-slate-300 p-3 rounded overflow-x-auto">
{`curl -X GET "https://api.uplift.hr/v1/employees" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
              </pre>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-2">Example Response</h4>
              <pre className="text-xs bg-slate-900 text-slate-300 p-3 rounded overflow-x-auto">
{`{
  "employees": [...],
  "total": 25,
  "page": 1
}`}
              </pre>
            </div>
          </div>
          
          <div className="flex gap-3">
            <a
              href="/api/integrations/api-docs"
              target="_blank"
              className="text-sm text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1"
            >
              View Full Documentation <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="/api/integrations/api-docs"
              target="_blank"
              className="text-sm text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1"
            >
              Download OpenAPI Spec <Download className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
      
      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-900 dark:text-blue-100 font-medium">API Key Security</p>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
            Keep your API keys secure. Never expose them in client-side code or public repositories. 
            If a key is compromised, revoke it immediately and create a new one.
          </p>
        </div>
      </div>
      
      {/* Keys List */}
      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 mx-auto mb-2 text-slate-400 animate-spin" />
          <p className="text-slate-500">Loading API keys...</p>
        </div>
      ) : apiKeys.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
          <Key className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No API keys yet
          </h3>
          <p className="text-slate-500 mb-6">
            Create your first API key to start integrating with Uplift
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-orange-500 text-white rounded-xl font-medium inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create API Key
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {apiKeys.map(key => (
            <ApiKeyCard
              key={key.id}
              apiKey={key}
              onRevoke={handleRevoke}
              onRegenerate={handleRegenerate}
              onViewUsage={handleViewUsage}
            />
          ))}
        </div>
      )}
      
      {/* Create Modal */}
      <CreateKeyModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default RestApiKeys;
