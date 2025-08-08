import { UserProfile, AnalysisResult } from '../types';
import { roleSkillsets } from '../data/roleSkillsets';
import { generateTrainingPlan, calculateSkillGaps } from './skillAnalysis';

export const mockUserProfiles: UserProfile[] = [
  {
    currentRole: 'Junior Frontend Developer',
    experience: 2,
    skills: [
      { name: 'JavaScript', level: 3, category: 'Language' },
      { name: 'HTML', level: 4, category: 'Markup' },
      { name: 'CSS', level: 3, category: 'Styling' },
      { name: 'React', level: 2, category: 'Framework' },
      { name: 'Git', level: 3, category: 'Tools' },
      { name: 'Responsive Design', level: 3, category: 'Design' }
    ]
  },
  {
    currentRole: 'Marketing Coordinator',
    experience: 3,
    skills: [
      { name: 'Project Planning', level: 3, category: 'Management' },
      { name: 'Communication', level: 4, category: 'Soft Skills' },
      { name: 'Problem Solving', level: 3, category: 'Soft Skills' },
      { name: 'Team Leadership', level: 2, category: 'Leadership' },
      { name: 'Stakeholder Management', level: 2, category: 'Communication' }
    ]
  }
];

export function generateMockAnalysis(targetRoleId: string): AnalysisResult {
  const userProfile = mockUserProfiles[0]; // Use first mock profile
  const targetRole = roleSkillsets.find(role => role.id === targetRoleId);
  
  if (!targetRole) {
    throw new Error('Target role not found');
  }
  
  const skillGaps = calculateSkillGaps(userProfile, targetRole);
  const trainingPlan = generateTrainingPlan(skillGaps, targetRole);
  
  return {
    userProfile,
    targetRole,
    trainingPlan
  };
}

export const mockResumeTexts = [
  `John Smith
Senior Software Engineer
Email: john.smith@email.com
Phone: (555) 123-4567

EXPERIENCE
Senior Frontend Developer | TechCorp (2021-2024)
- Led development of React-based web applications serving 100K+ users
- Implemented responsive designs using CSS3 and modern frameworks
- Collaborated with cross-functional teams using Agile methodologies
- Mentored junior developers and conducted code reviews

Frontend Developer | StartupXYZ (2019-2021)
- Built interactive user interfaces using JavaScript, HTML5, and CSS3
- Integrated REST APIs and optimized application performance
- Used Git for version control and collaborative development

SKILLS
- JavaScript (ES6+), TypeScript, React, Vue.js
- HTML5, CSS3, SASS, Tailwind CSS
- Node.js, Express.js, MongoDB
- Git, Webpack, Jest, Docker
- Agile/Scrum, Problem Solving, Team Leadership

EDUCATION
Bachelor of Science in Computer Science
University of Technology (2015-2019)`,

  `Sarah Johnson
Product Manager
Email: sarah.johnson@email.com
Phone: (555) 987-6543

EXPERIENCE
Product Manager | InnovateCorp (2022-2024)
- Managed product roadmap and cross-functional team coordination
- Conducted user research and stakeholder management
- Led Agile/Scrum ceremonies and sprint planning sessions
- Analyzed product metrics and implemented data-driven decisions

Project Coordinator | BusinessSolutions (2020-2022)
- Coordinated multiple projects simultaneously with strict deadlines
- Managed budgets up to $500K and resource allocation
- Facilitated communication between technical and business teams
- Created project documentation and risk management plans

SKILLS
- Project Planning, Stakeholder Management, Budget Management
- Agile/Scrum, JIRA, Microsoft Project, Confluence
- Data Analysis, Problem Solving, Team Leadership
- Communication, Risk Management, User Research

EDUCATION
Master of Business Administration
Business School (2018-2020)

Bachelor of Arts in Business Management
State University (2014-2018)`
];

export function generateMentorMessage(readinessScore: number, targetRole: string): string {
  if (readinessScore >= 80) {
    return `Congratulations! With a ${readinessScore}% readiness score for the ${targetRole} position, you're already well-prepared for this role. You have most of the core skills required, which puts you in an excellent position. 

My recommendation is to focus on the few remaining skill gaps to achieve mastery level. Consider taking advanced courses in your weaker areas to stand out from other candidates. You're so close to being fully ready that with just a few weeks of focused learning, you could be applying with complete confidence.

Your strong foundation means you can likely start applying for positions now while continuing to strengthen those final skills. Remember, real-world experience often trumps perfect skill alignment, so don't hesitate to put yourself out there!`;
  } else if (readinessScore >= 60) {
    return `You're on a great path! With a ${readinessScore}% readiness score for the ${targetRole} role, you have a solid foundation to build upon. You've already developed several key skills that employers are looking for, which shows you understand the field well.

The skill gaps we've identified are absolutely manageable with a focused learning plan. I recommend prioritizing the high-priority skills first, as these will give you the biggest impact. The medium-priority skills can be developed in parallel or as you gain more experience in the role.

With dedicated effort over the next few months, you could significantly improve your readiness score. Many successful professionals have started from exactly where you are now. The key is consistent progress and practical application of what you learn. Consider building projects that demonstrate these skills as you develop them.`;
  } else {
    return `I see significant potential in your profile! While your ${readinessScore}% readiness score for the ${targetRole} position indicates substantial skill gaps, this is actually a common starting point for many career transitions. The good news is that we've identified exactly what you need to focus on.

Your current skills show you have the foundational thinking and work ethic needed for this field. Now it's about strategic skill building. I strongly recommend starting with the high-priority skills, as these form the core competencies for the role.

This journey will take dedication, but it's absolutely achievable. Many professionals have made similar transitions successfully. Consider this a structured roadmap rather than an overwhelming list. Break it down into manageable chunks, celebrate small wins, and remember that every expert was once a beginner. With the right learning plan and consistent effort, you can bridge these gaps effectively.`;
  }
}