import React from 'react';
import { ChevronDown, Briefcase } from 'lucide-react';
import { RoleRequirement } from '../types';

interface RoleSelectorProps {
  roles: RoleRequirement[];
  selectedRole: RoleRequirement | null;
  onRoleSelect: (role: RoleRequirement) => void;
  disabled?: boolean;
}

export function RoleSelector({ roles, selectedRole, onRoleSelect, disabled = false }: RoleSelectorProps) {
  const rolesByCategory = roles.reduce((acc, role) => {
    if (!acc[role.category]) {
      acc[role.category] = [];
    }
    acc[role.category].push(role);
    return acc;
  }, {} as Record<string, RoleRequirement[]>);

  return (
    <div className="w-full">
      <div className="flex items-center space-x-3 mb-6">
        <Briefcase className="w-5 h-5 text-purple-400" />
        <h3 className="text-xl font-bold text-white">Select Your Target Role</h3>
      </div>
      
      <div className="relative">
        <select
          value={selectedRole?.id || ''}
          onChange={(e) => {
            const role = roles.find(r => r.id === e.target.value);
            if (role) onRoleSelect(role);
          }}
          disabled={disabled}
          className={`w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 appearance-none ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/15'
          }`}
        >
          <option value="" className="bg-gray-800 text-white">Choose your target role...</option>
          {Object.entries(rolesByCategory).map(([category, categoryRoles]) => (
            <optgroup key={category} label={category} className="bg-gray-800">
              {categoryRoles.map((role) => (
                <option key={role.id} value={role.id} className="bg-gray-800 text-white py-2">
                  {role.title}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        
        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
      
      {selectedRole && (
        <div className="mt-6 p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl border border-purple-500/20 backdrop-blur-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-xl font-bold text-white mb-2">{selectedRole.title}</h4>
              <p className="text-gray-300 leading-relaxed">{selectedRole.description}</p>
            </div>
            <div className="ml-4">
              <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30">
                {selectedRole.category}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
            {selectedRole.skills.slice(0, 6).map((skill, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
                <span className="text-gray-300">{skill.name}</span>
                <span className="text-xs text-gray-500">L{skill.level}</span>
              </div>
            ))}
            {selectedRole.skills.length > 6 && (
              <div className="text-sm text-gray-400">
                +{selectedRole.skills.length - 6} more skills
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}