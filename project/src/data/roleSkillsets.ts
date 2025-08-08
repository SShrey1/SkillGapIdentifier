import { RoleRequirement } from '../types';

export const roleSkillsets: RoleRequirement[] = [
  {
    id: 'frontend-dev',
    title: 'Frontend Developer',
    description: 'Build user-facing web applications with modern frameworks',
    category: 'Engineering',
    skills: [
      { name: 'React', level: 4, category: 'Framework' },
      { name: 'JavaScript', level: 5, category: 'Language' },
      { name: 'TypeScript', level: 4, category: 'Language' },
      { name: 'HTML', level: 5, category: 'Markup' },
      { name: 'CSS', level: 4, category: 'Styling' },
      { name: 'Tailwind CSS', level: 3, category: 'Styling' },
      { name: 'Git', level: 4, category: 'Tools' },
      { name: 'Webpack', level: 3, category: 'Tools' },
      { name: 'REST APIs', level: 4, category: 'Integration' },
      { name: 'Responsive Design', level: 4, category: 'Design' }
    ]
  },
  {
    id: 'backend-dev',
    title: 'Backend Developer',
    description: 'Design and build server-side applications and APIs',
    category: 'Engineering',
    skills: [
      { name: 'Node.js', level: 4, category: 'Runtime' },
      { name: 'Python', level: 4, category: 'Language' },
      { name: 'Express.js', level: 4, category: 'Framework' },
      { name: 'Database Design', level: 4, category: 'Data' },
      { name: 'SQL', level: 4, category: 'Data' },
      { name: 'MongoDB', level: 3, category: 'Data' },
      { name: 'REST APIs', level: 5, category: 'Integration' },
      { name: 'GraphQL', level: 3, category: 'Integration' },
      { name: 'Docker', level: 3, category: 'DevOps' },
      { name: 'AWS', level: 3, category: 'Cloud' }
    ]
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    description: 'Analyze complex datasets and build predictive models',
    category: 'Data & Analytics',
    skills: [
      { name: 'Python', level: 5, category: 'Language' },
      { name: 'R', level: 4, category: 'Language' },
      { name: 'Machine Learning', level: 4, category: 'ML' },
      { name: 'Statistics', level: 5, category: 'Math' },
      { name: 'Pandas', level: 4, category: 'Library' },
      { name: 'NumPy', level: 4, category: 'Library' },
      { name: 'Scikit-learn', level: 4, category: 'ML' },
      { name: 'TensorFlow', level: 3, category: 'ML' },
      { name: 'Data Visualization', level: 4, category: 'Analysis' },
      { name: 'SQL', level: 4, category: 'Data' }
    ]
  },
  {
    id: 'project-manager',
    title: 'Project Manager',
    description: 'Lead cross-functional teams and deliver successful projects',
    category: 'Management',
    skills: [
      { name: 'Project Planning', level: 5, category: 'Management' },
      { name: 'Agile/Scrum', level: 4, category: 'Methodology' },
      { name: 'Risk Management', level: 4, category: 'Management' },
      { name: 'Stakeholder Management', level: 4, category: 'Communication' },
      { name: 'Budget Management', level: 4, category: 'Finance' },
      { name: 'Team Leadership', level: 4, category: 'Leadership' },
      { name: 'Communication', level: 5, category: 'Soft Skills' },
      { name: 'Problem Solving', level: 4, category: 'Soft Skills' },
      { name: 'JIRA', level: 3, category: 'Tools' },
      { name: 'Microsoft Project', level: 3, category: 'Tools' }
    ]
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    description: 'Automate deployment pipelines and manage cloud infrastructure',
    category: 'Engineering',
    skills: [
      { name: 'Docker', level: 4, category: 'Containerization' },
      { name: 'Kubernetes', level: 4, category: 'Orchestration' },
      { name: 'AWS', level: 4, category: 'Cloud' },
      { name: 'Terraform', level: 4, category: 'IaC' },
      { name: 'CI/CD', level: 5, category: 'Automation' },
      { name: 'Linux', level: 4, category: 'OS' },
      { name: 'Bash/Shell', level: 4, category: 'Scripting' },
      { name: 'Monitoring', level: 4, category: 'Operations' },
      { name: 'Git', level: 4, category: 'Version Control' },
      { name: 'Jenkins', level: 3, category: 'CI/CD' }
    ]
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer',
    description: 'Create intuitive and beautiful user experiences',
    category: 'Design',
    skills: [
      { name: 'Figma', level: 5, category: 'Design Tools' },
      { name: 'Adobe Creative Suite', level: 4, category: 'Design Tools' },
      { name: 'User Research', level: 4, category: 'Research' },
      { name: 'Prototyping', level: 4, category: 'Design' },
      { name: 'Wireframing', level: 4, category: 'Design' },
      { name: 'Design Systems', level: 4, category: 'Design' },
      { name: 'HTML/CSS', level: 3, category: 'Technical' },
      { name: 'Usability Testing', level: 4, category: 'Research' },
      { name: 'Information Architecture', level: 4, category: 'Design' },
      { name: 'Interaction Design', level: 4, category: 'Design' }
    ]
  }
];