import type { DegreeProgram } from '../../../types/degree';

export const degreePrograms: DegreeProgram[] = [
  {
    id: 'bsc-cse',
    title: 'BSc in Computer Science and Engineering',
    level: 'undergraduate',
    description: 'A comprehensive program designed to provide students with a strong foundation in computer science and engineering principles and practices.',
    creditsRequired: 160,
    duration: '4 years',
    concentrations: ['Software Engineering', 'Computer Networks', 'Artificial Intelligence'],
    admissionRequirements: [
      'High school diploma or equivalent',
      'Minimum GPA of 4.0 (out of 5.0)',
      'Admission test',
      'Personal interview'
    ],
    careerOpportunities: [
      'Software Engineer',
      'System Analyst',
      'Web Developer',
      'Database Administrator',
      'Network Engineer'
    ],
    curriculum: {
      coreCourses: [
        'Programming Fundamentals',
        'Data Structures and Algorithms',
        'Digital Logic Design',
        'Computer Architecture',
        'Operating Systems',
        'Database Systems',
        'Computer Networks',
        'Software Engineering'
      ],
      electiveCourses: [
        'Machine Learning',
        'Computer Graphics',
        'Network Security',
        'Distributed Systems',
        'Mobile Application Development'
      ]
    }
  },
  {
    id: 'msc-cse',
    title: 'MSc in Computer Science and Engineering',
    level: 'graduate',
    description: 'An advanced program focusing on specialized areas of computer science for students seeking to enhance their expertise in the field.',
    creditsRequired: 36,
    duration: '1.5-2 years',
    concentrations: ['Advanced Computing', 'Data Science', 'Cyber Security'],
    admissionRequirements: [
      'BSc in Computer Science/Engineering or related field',
      'Minimum CGPA of 3.0 (out of 4.0)',
      'Admission test',
      'Interview'
    ],
    careerOpportunities: [
      'Senior Software Engineer',
      'Data Scientist',
      'Research Engineer',
      'Project Manager',
      'University Lecturer'
    ],
    curriculum: {
      coreCourses: [
        'Advanced Algorithms',
        'Machine Learning',
        'Advanced Operating Systems',
        'Research Methodology',
        'Thesis/Project'
      ],
      electiveCourses: [
        'Big Data Analytics',
        'Cloud Computing',
        'Artificial Intelligence',
        'Computer Vision',
        'Wireless Networks'
      ]
    }
  },
  {
    id: 'pmics',
    title: 'Professional Masters in Information and Cyber Security (PMICS)',
    level: 'graduate',
    description: 'A specialized program focused on information security and cybersecurity for professionals seeking expertise in securing digital systems and networks.',
    creditsRequired: 30,
    duration: '1.5 years',
    concentrations: ['Network Security', 'Application Security', 'Security Management'],
    admissionRequirements: [
      'BSc in Computer Science/Engineering or related field',
      'Minimum 2 years of professional experience',
      'Minimum CGPA of 3.0 (out of 4.0)',
      'Interview'
    ],
    careerOpportunities: [
      'Security Engineer',
      'Security Analyst',
      'Cybersecurity Consultant',
      'Information Security Officer',
      'Security Architect'
    ],
    curriculum: {
      coreCourses: [
        'Cryptography and Network Security',
        'Secure Software Development',
        'Digital Forensics',
        'Security Risk Assessment',
        'Security Governance and Compliance'
      ],
      electiveCourses: [
        'Penetration Testing',
        'Malware Analysis',
        'Secure Cloud Computing',
        'Internet of Things Security',
        'Security Operations Center Management'
      ]
    }
  },
  {
    id: 'mphil-cse',
    title: 'MPhil in Computer Science and Engineering',
    level: 'graduate',
    description: 'A research-focused program designed for students interested in pursuing advanced research in specialized areas of computer science and engineering.',
    creditsRequired: 45,
    duration: '2-3 years',
    admissionRequirements: [
      'BSc/MSc in Computer Science/Engineering or related field',
      'Minimum CGPA of 3.5 (out of 4.0)',
      'Research proposal',
      'Interview with potential supervisor'
    ],
    careerOpportunities: [
      'Research Scientist',
      'University Lecturer',
      'R&D Specialist',
      'PhD Candidate',
      'Research Consultant'
    ],
    curriculum: {
      coreCourses: [
        'Advanced Research Methodology',
        'Specialized Seminar Courses',
        'Directed Research',
        'Thesis'
      ]
    }
  },
  {
    id: 'phd-cse',
    title: 'PhD in Computer Science and Engineering',
    level: 'doctorate',
    description: 'The highest academic degree program in computer science, focused on conducting original research that significantly contributes to the field.',
    creditsRequired: 60,
    duration: '3-5 years',
    admissionRequirements: [
      'MSc/MPhil in Computer Science/Engineering or related field',
      'Excellent academic record',
      'Detailed research proposal',
      'Publications (preferred)',
      'Interview with potential supervisor'
    ],
    careerOpportunities: [
      'University Professor',
      'Senior Research Scientist',
      'R&D Director',
      'Chief Technology Officer',
      'Research Lab Director'
    ],
    curriculum: {
      coreCourses: [
        'Advanced Research Methods',
        'Specialized Doctoral Seminars',
        'Comprehensive Examination',
        'Dissertation Research',
        'Publication Requirements'
      ]
    }
  }
]; 