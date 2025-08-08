import React from 'react';
import { ChevronDown } from 'lucide-react';
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
    <div className="w-full max-w-md mx-auto">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Select Your Target Role
      </label>
      
      <div className="relative">
        <select
          value={selectedRole?.id || ''}
          onChange={(e) => {
            const role = roles.find(r => r.id === e.target.value);
            if (role) onRoleSelect(role);
          }}
          disabled={disabled}
          className={`w-full px-4 py-3 pr-10 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'
          }`}
        >
          <option value="">Choose a role...</option>
          {Object.entries(rolesByCategory).map(([category, categoryRoles]) => (
            <optgroup key={category} label={category}>
              {categoryRoles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.title}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
      
      {selectedRole && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-1">{selectedRole.title}</h4>
          <p className="text-sm text-blue-700">{selectedRole.description}</p>
          <div className="mt-2">
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {selectedRole.category}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}