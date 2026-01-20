// ============================================================
// CAREER GROWTH PAGE
// Employee career paths, skill gaps, development tracking
// ============================================================

import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import {
  TrendingUp, Award, Target, BookOpen, ChevronRight, Star,
  CheckCircle, AlertCircle, Clock, Briefcase, MapPin, Building,
  Plus, Sparkles, Zap, ArrowRight, Trophy, Lightbulb
} from 'lucide-react';

export default function Career() {
  const { user } = useAuth();
  const [mySkills, setMySkills] = useState([]);
  const [careerPaths, setCareerPaths] = useState([]);
  const [skillsGap, setSkillsGap] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddSkill, setShowAddSkill] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Get employee ID from user
      const empResult = await api.get('/employees/me');
      const employeeId = empResult.employee?.id;

      if (!employeeId) {
        // User has no employee record - show limited view
        setLoading(false);
        return;
      }

      const [skillsResult, pathsResult, allSkillsResult] = await Promise.all([
        api.get(`/employees/${employeeId}/skills`),
        api.get(`/employees/${employeeId}/career-paths`),
        api.get('/skills'),
      ]);

      setMySkills(skillsResult.skills || []);
      setCareerPaths(pathsResult.careerPaths || []);
      setSkillsGap(pathsResult.skillsGap || []);
      setAllSkills(allSkillsResult.skills || []);
    } catch (error) {
      console.error('Failed to load career data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const verifiedSkills = mySkills.filter(s => s.verified).length;
  const expiringSkills = mySkills.filter(s => {
    if (!s.expires_at) return false;
    const daysUntil = (new Date(s.expires_at) - new Date()) / (1000 * 60 * 60 * 24);
    return daysUntil > 0 && daysUntil < 30;
  });
  const expiredSkills = mySkills.filter(s => s.expires_at && new Date(s.expires_at) < new Date());

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-momentum-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-momentum-500 to-momentum-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-2 text-momentum-200 mb-2">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-medium">Your Career Journey</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Hi, {user?.firstName}!</h1>
        <p className="text-momentum-100">
          Track your skills, discover opportunities, and plan your next career move.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-momentum-100 rounded-xl">
              <Award className="w-6 h-6 text-momentum-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">{mySkills.length}</p>
              <p className="text-sm text-slate-500">Total Skills</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">{verifiedSkills}</p>
              <p className="text-sm text-slate-500">Verified</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">{careerPaths.length}</p>
              <p className="text-sm text-slate-500">Opportunities</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Target className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">{skillsGap.length}</p>
              <p className="text-sm text-slate-500">Skills to Learn</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* My Skills */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">My Skills</h2>
                <p className="text-sm text-slate-500">Your competencies and certifications</p>
              </div>
              <button 
                onClick={() => setShowAddSkill(true)}
                className="btn btn-secondary text-sm"
              >
                <Plus className="w-4 h-4" />
                Request Skill
              </button>
            </div>

            {mySkills.length === 0 ? (
              <div className="p-8 text-center">
                <Award className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="font-medium text-slate-900">No skills recorded yet</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Ask your manager to add your skills and certifications
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {/* Expiring Warning */}
                {(expiringSkills.length > 0 || expiredSkills.length > 0) && (
                  <div className="p-4 bg-amber-50 border-b border-amber-100">
                    {expiredSkills.length > 0 && (
                      <div className="flex items-center gap-2 text-red-600 mb-2">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {expiredSkills.length} skill(s) have expired
                        </span>
                      </div>
                    )}
                    {expiringSkills.length > 0 && (
                      <div className="flex items-center gap-2 text-amber-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          {expiringSkills.length} skill(s) expiring soon
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {mySkills.map(skill => (
                  <SkillRow key={skill.id} skill={skill} />
                ))}
              </div>
            )}
          </div>

          {/* Career Opportunities */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900">Career Opportunities</h2>
              <p className="text-sm text-slate-500">Roles that match your skills</p>
            </div>

            {careerPaths.length === 0 ? (
              <div className="p-8 text-center">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="font-medium text-slate-900">No open positions</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Check back soon for new internal opportunities
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {careerPaths.map(job => (
                  <div key={job.id} className="p-4 hover:bg-slate-50 cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-slate-900 group-hover:text-momentum-600">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                          {job.department_name && (
                            <span className="flex items-center gap-1">
                              <Building className="w-3.5 h-3.5" />
                              {job.department_name}
                            </span>
                          )}
                          {job.location_name && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {job.location_name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className={`text-lg font-bold ${
                            job.match_percentage >= 80 ? 'text-green-600' :
                            job.match_percentage >= 50 ? 'text-amber-600' :
                            'text-slate-400'
                          }`}>
                            {job.match_percentage}%
                          </div>
                          <p className="text-xs text-slate-500">match</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-momentum-500" />
                      </div>
                    </div>

                    {/* Match Bar */}
                    <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          job.match_percentage >= 80 ? 'bg-green-500' :
                          job.match_percentage >= 50 ? 'bg-amber-500' :
                          'bg-slate-300'
                        }`}
                        style={{ width: `${job.match_percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Skills Gap */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h2 className="font-semibold text-slate-900">Skills to Develop</h2>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Learn these to unlock more opportunities
              </p>
            </div>

            {skillsGap.length === 0 ? (
              <div className="p-5 text-center">
                <Trophy className="w-10 h-10 text-green-500 mx-auto mb-3" />
                <p className="text-sm text-slate-600">
                  Great job! You have all the skills needed for available roles.
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {skillsGap.slice(0, 5).map(skill => (
                  <div key={skill.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-slate-900">{skill.name}</p>
                        <p className="text-xs text-slate-500">{skill.category}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
                {skillsGap.length > 5 && (
                  <p className="text-sm text-slate-500 text-center pt-2">
                    +{skillsGap.length - 5} more skills
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Career Tips</h3>
            </div>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 text-blue-500" />
                Keep your skills up to date
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 text-blue-500" />
                Ask your manager to verify certifications
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 text-blue-500" />
                Apply early for positions you're interested in
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 text-blue-500" />
                Develop skills that unlock more roles
              </li>
            </ul>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-4">Achievements</h3>
            <div className="space-y-3">
              {mySkills.length >= 5 && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900">Skill Collector</p>
                    <p className="text-xs text-green-600">5+ skills acquired</p>
                  </div>
                </div>
              )}
              {verifiedSkills >= 3 && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">Verified Pro</p>
                    <p className="text-xs text-blue-600">3+ verified skills</p>
                  </div>
                </div>
              )}
              {mySkills.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">
                  Build your skills to earn achievements!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Skill Request Modal */}
      {showAddSkill && (
        <AddSkillModal 
          skills={allSkills}
          mySkillIds={mySkills.map(s => s.skill_id)}
          onClose={() => setShowAddSkill(false)}
          onRequest={loadData}
        />
      )}
    </div>
  );
}

// ============================================================
// SKILL ROW COMPONENT
// ============================================================

function SkillRow({ skill }) {
  const isExpired = skill.expires_at && new Date(skill.expires_at) < new Date();
  const isExpiring = skill.expires_at && !isExpired && 
    (new Date(skill.expires_at) - new Date()) / (1000 * 60 * 60 * 24) < 30;

  return (
    <div className={`px-6 py-4 flex items-center justify-between ${isExpired ? 'bg-red-50' : ''}`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isExpired ? 'bg-red-100' : 
          skill.verified ? 'bg-green-100' : 'bg-slate-100'
        }`}>
          <Award className={`w-6 h-6 ${
            isExpired ? 'text-red-600' :
            skill.verified ? 'text-green-600' : 'text-slate-500'
          }`} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-slate-900">{skill.name}</p>
            {skill.verified && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                <CheckCircle className="w-3 h-3" />
                Verified
              </span>
            )}
            {isExpired && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                <AlertCircle className="w-3 h-3" />
                Expired
              </span>
            )}
            {isExpiring && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                <Clock className="w-3 h-3" />
                Expiring Soon
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">{skill.category}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Skill Level */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map(level => (
            <Star
              key={level}
              className={`w-4 h-4 ${
                level <= (skill.level || 1) 
                  ? 'text-amber-400 fill-amber-400' 
                  : 'text-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Expiry */}
        {skill.expires_at && (
          <div className="text-sm text-slate-500">
            {isExpired ? 'Expired' : `Expires ${new Date(skill.expires_at).toLocaleDateString()}`}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// ADD SKILL REQUEST MODAL
// ============================================================

function AddSkillModal({ skills, mySkillIds, onClose, onRequest }) {
  const [selectedSkill, setSelectedSkill] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const availableSkills = skills.filter(s => !mySkillIds.includes(s.id));

  const handleSubmit = async (e) => {
    e.preventDefault();
    // In a real app, this would create a skill request for manager approval
    // For now, we'll show a success message
    setSubmitting(true);
    setTimeout(() => {
      alert('Skill request submitted! Your manager will review it.');
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h2 className="text-lg font-semibold mb-2">Request Skill Addition</h2>
        <p className="text-sm text-slate-500 mb-6">
          Request your manager to add a skill to your profile
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Select Skill
            </label>
            <select
              required
              value={selectedSkill}
              onChange={e => setSelectedSkill(e.target.value)}
              className="input"
            >
              <option value="">Choose a skill...</option>
              {availableSkills.map(skill => (
                <option key={skill.id} value={skill.id}>
                  {skill.name} ({skill.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Note (optional)
            </label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
              placeholder="Add any relevant details (e.g., certification date, training completed)"
              className="input"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
