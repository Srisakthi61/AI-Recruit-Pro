require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Job = require('./src/models/Job');
const CandidateProfile = require('./src/models/CandidateProfile');
const Application = require('./src/models/Application');
const { evaluateMatch } = require('./src/services/matchingEngine');

const seedData = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai-recruit-pro';
    await mongoose.connect(connUri);
    console.log('[Seed] Connected to MongoDB...');

    // Clear existing collections
    await User.deleteMany({});
    await Job.deleteMany({});
    await CandidateProfile.deleteMany({});
    await Application.deleteMany({});
    console.log('[Seed] Cleared existing data.');

    // 1. Create Recruiters
    const recruiter1 = await User.create({
      name: 'Sarah Jenkins',
      email: 'recruiter@airecruit.pro',
      password: 'password123',
      role: 'recruiter',
      company: 'CloudScale Technologies',
      title: 'Head of Technical Talent',
      phone: '+1 (555) 234-5678',
    });

    const recruiter2 = await User.create({
      name: 'Marcus Chen',
      email: 'recruiter2@airecruit.pro',
      password: 'password123',
      role: 'recruiter',
      company: 'Apex AI Labs',
      title: 'Senior Engineering Recruiter',
      phone: '+1 (555) 876-5432',
    });

    console.log('[Seed] Created Recruiters.');

    // 2. Create Candidates
    const cand1User = await User.create({
      name: 'Alex Rivera',
      email: 'alex.dev@example.com',
      password: 'password123',
      role: 'candidate',
      title: 'Senior Full Stack Engineer',
      phone: '+1 (555) 345-6789',
    });

    const cand2User = await User.create({
      name: 'Sarah Lin',
      email: 'sarah.data@example.com',
      password: 'password123',
      role: 'candidate',
      title: 'AI / Machine Learning Engineer',
      phone: '+1 (555) 456-7890',
    });

    const cand3User = await User.create({
      name: 'David Miller',
      email: 'david.cloud@example.com',
      password: 'password123',
      role: 'candidate',
      title: 'Senior DevOps & Cloud Architect',
      phone: '+1 (555) 567-8901',
    });

    const cand4User = await User.create({
      name: 'Priya Sharma',
      email: 'priya.fullstack@example.com',
      password: 'password123',
      role: 'candidate',
      title: 'Frontend React Specialist',
      phone: '+1 (555) 678-9012',
    });

    const cand5User = await User.create({
      name: 'Emily Watson',
      email: 'emily.junior@example.com',
      password: 'password123',
      role: 'candidate',
      title: 'Junior Web Developer',
      phone: '+1 (555) 789-0123',
    });

    console.log('[Seed] Created Candidates.');

    // 3. Create Candidate Profiles
    const profile1 = await CandidateProfile.create({
      user: cand1User._id,
      originalFileName: 'Alex_Rivera_Senior_FullStack_Resume.pdf',
      fileUrl: '/uploads/sample_alex_rivera_resume.pdf',
      mimeType: 'application/pdf',
      fileSize: 104200,
      parsedData: {
        name: 'Alex Rivera',
        email: 'alex.dev@example.com',
        phone: '+1 (555) 345-6789',
        location: 'San Francisco, CA (Remote)',
        summary: 'Seasoned Full-Stack Software Engineer with 6+ years of experience designing, architecting, and deploying resilient web services, microservices, and React frontends at scale.',
        skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL', 'Tailwind CSS', 'Jest', 'CI/CD', 'Git'],
        technicalSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL', 'Tailwind CSS', 'Jest'],
        softSkills: ['Leadership', 'Problem Solving', 'Communication', 'Mentorship'],
        totalYearsExperience: 6.0,
        highestEducation: 'Master',
        experience: [
          {
            company: 'NextGen Cloud Systems',
            title: 'Senior Full Stack Engineer',
            location: 'San Francisco, CA',
            startDate: '2021',
            endDate: 'Present',
            durationYears: 3,
            description: 'Leading engineering team building high-concurrency microservices and responsive dashboards.',
            bullets: [
              'Designed and maintained React/Node.js web application handling 50k+ daily active users.',
              'Spearheaded transition to TypeScript and Dockerized microservices on AWS ECS.',
            ],
          },
          {
            company: 'Vanguard Web Apps',
            title: 'Full Stack Developer',
            location: 'Austin, TX',
            startDate: '2018',
            endDate: '2021',
            durationYears: 3,
            description: 'Built RESTful APIs and UI components using Express and React.',
            bullets: [
              'Optimized database queries in MongoDB and PostgreSQL, reducing latency by 35%.',
              'Implemented automated test pipelines using Jest and GitHub Actions.',
            ],
          },
        ],
        education: [
          {
            institution: 'University of Washington',
            degree: "Master of Science in Computer Science",
            fieldOfStudy: 'Computer Science & Distributed Systems',
            startYear: '2016',
            endYear: '2018',
          },
        ],
        certifications: ['AWS Certified Solutions Architect', 'MongoDB Certified Developer'],
        links: [
          { type: 'github', url: 'https://github.com/alexrivera-dev' },
          { type: 'linkedin', url: 'https://linkedin.com/in/alex-rivera-pro' },
        ],
      },
      rawText: 'Alex Rivera Senior Full Stack Engineer Alex.dev@example.com React Node.js TypeScript MongoDB Docker AWS 6 years experience Master MS CS',
      parsingMetadata: {
        parserVersion: '1.0.0-nlp-modular',
        confidenceScore: 0.98,
        processingTimeMs: 42,
      },
    });

    const profile2 = await CandidateProfile.create({
      user: cand2User._id,
      originalFileName: 'Sarah_Lin_AI_ML_Resume.pdf',
      fileUrl: '/uploads/sample_sarah_lin_resume.pdf',
      mimeType: 'application/pdf',
      fileSize: 112000,
      parsedData: {
        name: 'Sarah Lin',
        email: 'sarah.data@example.com',
        phone: '+1 (555) 456-7890',
        location: 'Seattle, WA (Remote)',
        summary: 'AI / Machine Learning Engineer with 5+ years of specialized experience in NLP, Large Language Models (LLM), Prompt Engineering, Fine-tuning, and PyTorch deep learning systems.',
        skills: ['Python', 'PyTorch', 'TensorFlow', 'NLP', 'LLM', 'Machine Learning', 'Deep Learning', 'LangChain', 'Hugging Face', 'Scikit-Learn', 'FastAPI', 'Docker', 'AWS', 'Pandas'],
        technicalSkills: ['Python', 'PyTorch', 'TensorFlow', 'NLP', 'LLM', 'Machine Learning', 'Deep Learning', 'LangChain', 'Hugging Face', 'Scikit-Learn', 'FastAPI', 'Docker'],
        softSkills: ['Critical Thinking', 'Analytical Skills', 'Research', 'Collaboration'],
        totalYearsExperience: 5.0,
        highestEducation: 'PhD',
        experience: [
          {
            company: 'Cognitive Neural Labs',
            title: 'Lead AI Engineer',
            location: 'Seattle, WA',
            startDate: '2022',
            endDate: 'Present',
            durationYears: 2,
            description: 'Fine-tuned custom LLMs and built enterprise RAG pipelines using LangChain and vector databases.',
            bullets: [
              'Trained multi-modal NLP transformer models reducing inference latency by 40%.',
              'Developed FastAPI model serving microservices deployed on Kubernetes.',
            ],
          },
        ],
        education: [
          {
            institution: 'Stanford University',
            degree: 'PhD in Artificial Intelligence',
            fieldOfStudy: 'Machine Learning & NLP',
            startYear: '2015',
            endYear: '2019',
          },
        ],
        certifications: ['DeepLearning.AI NLP Specialization', 'TensorFlow Certified Developer'],
        links: [
          { type: 'github', url: 'https://github.com/sarahlin-ml' },
          { type: 'linkedin', url: 'https://linkedin.com/in/sarah-lin-ai' },
        ],
      },
      rawText: 'Sarah Lin AI Machine Learning Engineer sarah.data@example.com Python PyTorch NLP LLM LangChain Docker FastAPI PhD Stanford',
      parsingMetadata: {
        parserVersion: '1.0.0-nlp-modular',
        confidenceScore: 0.99,
        processingTimeMs: 38,
      },
    });

    const profile3 = await CandidateProfile.create({
      user: cand3User._id,
      originalFileName: 'David_Miller_DevOps_Resume.pdf',
      fileUrl: '/uploads/sample_david_miller_resume.pdf',
      mimeType: 'application/pdf',
      fileSize: 98000,
      parsedData: {
        name: 'David Miller',
        email: 'david.cloud@example.com',
        phone: '+1 (555) 567-8901',
        location: 'Denver, CO (Hybrid)',
        summary: 'Cloud Infrastructure & DevOps Engineer with 7+ years managing multi-region Kubernetes clusters, Terraform IaC, AWS cloud security, and robust CI/CD deployment pipelines.',
        skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'CI/CD', 'GitHub Actions', 'Jenkins', 'Linux', 'Bash', 'Python', 'Prometheus', 'Grafana', 'Ansible', 'Nginx'],
        technicalSkills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'CI/CD', 'GitHub Actions', 'Jenkins', 'Linux', 'Bash', 'Python', 'Prometheus', 'Grafana'],
        softSkills: ['Problem Solving', 'Time Management', 'Leadership'],
        totalYearsExperience: 7.0,
        highestEducation: 'Bachelor',
        experience: [
          {
            company: 'Skyline Cloud Infrastructure',
            title: 'Staff DevOps Engineer',
            location: 'Denver, CO',
            startDate: '2020',
            endDate: 'Present',
            durationYears: 4,
            description: 'Automated infrastructure deployments for 80+ microservices on AWS EKS with Terraform.',
            bullets: [
              'Achieved 99.99% uptime SLA across 4 global cloud regions.',
              'Engineered end-to-end GitHub Actions CI/CD workflows for 100+ engineers.',
            ],
          },
        ],
        education: [
          {
            institution: 'Colorado State University',
            degree: 'Bachelor of Science in Information Technology',
            fieldOfStudy: 'Cloud Computing & Networks',
            startYear: '2013',
            endYear: '2017',
          },
        ],
        certifications: ['Certified Kubernetes Administrator (CKA)', 'AWS DevOps Engineer Professional'],
        links: [{ type: 'github', url: 'https://github.com/davidm-cloud' }],
      },
      rawText: 'David Miller DevOps Engineer david.cloud@example.com Kubernetes Docker AWS Terraform CI/CD Linux Bash 7 years experience BS IT',
      parsingMetadata: {
        parserVersion: '1.0.0-nlp-modular',
        confidenceScore: 0.96,
        processingTimeMs: 40,
      },
    });

    const profile4 = await CandidateProfile.create({
      user: cand4User._id,
      originalFileName: 'Priya_Sharma_Frontend_Resume.pdf',
      fileUrl: '/uploads/sample_priya_sharma_resume.pdf',
      mimeType: 'application/pdf',
      fileSize: 89000,
      parsedData: {
        name: 'Priya Sharma',
        email: 'priya.fullstack@example.com',
        phone: '+1 (555) 678-9012',
        location: 'New York, NY',
        summary: 'Frontend Engineer focused on React, Next.js, TypeScript, Tailwind CSS, accessibility, performance optimization, and beautiful responsive UI architectures.',
        skills: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Redux', 'HTML5', 'CSS3', 'Jest', 'Webpack', 'Vite', 'Git'],
        technicalSkills: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Redux', 'HTML5', 'CSS3', 'Jest', 'Webpack', 'Vite'],
        softSkills: ['Attention to Detail', 'Creativity', 'Teamwork', 'Communication'],
        totalYearsExperience: 4.0,
        highestEducation: 'Bachelor',
        experience: [
          {
            company: 'PixelCraft Studios',
            title: 'Senior Frontend Developer',
            location: 'New York, NY',
            startDate: '2021',
            endDate: 'Present',
            durationYears: 3,
            description: 'Built customer-facing web apps with React, Next.js, and Tailwind CSS.',
            bullets: [
              'Revamped main application web store resulting in a 45% increase in conversion.',
              'Architected reusable design system component library used across 6 product teams.',
            ],
          },
        ],
        education: [
          {
            institution: 'New York University',
            degree: 'Bachelor of Science in Computer Science',
            fieldOfStudy: 'Software Engineering',
            startYear: '2016',
            endYear: '2020',
          },
        ],
        certifications: ['Meta Frontend Developer Professional Certificate'],
        links: [
          { type: 'portfolio', url: 'https://priyasharma.design' },
          { type: 'github', url: 'https://github.com/priya-sharma' },
        ],
      },
      rawText: 'Priya Sharma Frontend Developer React Next.js TypeScript Tailwind CSS Redux Jest 4 years experience Bachelor NYU',
      parsingMetadata: {
        parserVersion: '1.0.0-nlp-modular',
        confidenceScore: 0.97,
        processingTimeMs: 35,
      },
    });

    const profile5 = await CandidateProfile.create({
      user: cand5User._id,
      originalFileName: 'Emily_Watson_Resume.pdf',
      fileUrl: '/uploads/sample_emily_watson_resume.pdf',
      mimeType: 'application/pdf',
      fileSize: 76000,
      parsedData: {
        name: 'Emily Watson',
        email: 'emily.junior@example.com',
        phone: '+1 (555) 789-0123',
        location: 'Chicago, IL',
        summary: 'Enthusiastic Junior Developer skilled in JavaScript, React, HTML5, CSS3, and Node.js with strong foundations in data structures and modern web fundamentals.',
        skills: ['JavaScript', 'React', 'HTML', 'CSS', 'Node.js', 'Express', 'Git', 'MongoDB'],
        technicalSkills: ['JavaScript', 'React', 'HTML', 'CSS', 'Node.js', 'Express', 'Git', 'MongoDB'],
        softSkills: ['Adaptability', 'Communication', 'Problem Solving'],
        totalYearsExperience: 1.5,
        highestEducation: 'Bachelor',
        experience: [
          {
            company: 'TechWave Solutions',
            title: 'Junior Web Developer',
            location: 'Chicago, IL',
            startDate: '2023',
            endDate: 'Present',
            durationYears: 1.5,
            description: 'Assisted in developing web UI components and backend REST endpoints.',
            bullets: [
              'Implemented responsive UI layouts using React and CSS.',
              'Wrote unit tests and documented internal APIs.',
            ],
          },
        ],
        education: [
          {
            institution: 'University of Illinois',
            degree: 'Bachelor of Science in Computer Science',
            fieldOfStudy: 'Computer Science',
            startYear: '2019',
            endYear: '2023',
          },
        ],
        certifications: [],
        links: [{ type: 'github', url: 'https://github.com/emily-watson' }],
      },
      rawText: 'Emily Watson Junior Developer JavaScript React Node.js HTML CSS Express 1.5 years experience BS Computer Science',
      parsingMetadata: {
        parserVersion: '1.0.0-nlp-modular',
        confidenceScore: 0.92,
        processingTimeMs: 30,
      },
    });

    console.log('[Seed] Created Candidate Profiles.');

    // 4. Create Job Postings
    const job1 = await Job.create({
      title: 'Senior Full-Stack Engineer',
      company: 'CloudScale Technologies',
      department: 'Core Platform',
      location: 'San Francisco, CA (Remote)',
      type: 'Full-Time',
      description: 'We are looking for a Senior Full-Stack Engineer to architect high-performance distributed web applications. You will collaborate with product and design teams to build scalable React frontends, robust Node.js microservices, and maintain cloud infrastructure on AWS.',
      requiredSkills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Docker'],
      optionalSkills: ['AWS', 'GraphQL', 'Tailwind CSS', 'Redis', 'CI/CD'],
      minExperience: 4,
      maxExperience: 9,
      educationRequirement: 'Bachelor',
      salaryMin: 140000,
      salaryMax: 185000,
      salaryCurrency: 'USD',
      status: 'active',
      recruiter: recruiter1._id,
      applicantsCount: 3,
    });

    const job2 = await Job.create({
      title: 'Lead AI / ML Systems Engineer',
      company: 'CloudScale Technologies',
      department: 'AI Innovations',
      location: 'Remote (US/Canada)',
      type: 'Full-Time',
      description: 'Join our cutting-edge AI team to develop, fine-tune, and deploy state-of-the-art Large Language Models (LLM) and Natural Language Processing pipelines. Experience in PyTorch, LangChain, vector databases, and scalable inference is highly desired.',
      requiredSkills: ['Python', 'PyTorch', 'NLP', 'LLM', 'Machine Learning', 'Docker'],
      optionalSkills: ['LangChain', 'FastAPI', 'AWS', 'TensorFlow', 'Kubernetes'],
      minExperience: 4,
      maxExperience: 10,
      educationRequirement: 'Master',
      salaryMin: 165000,
      salaryMax: 215000,
      salaryCurrency: 'USD',
      status: 'active',
      recruiter: recruiter1._id,
      applicantsCount: 2,
    });

    const job3 = await Job.create({
      title: 'Senior DevOps & Site Reliability Engineer',
      company: 'CloudScale Technologies',
      department: 'Infrastructure',
      location: 'Denver, CO (Remote Available)',
      type: 'Full-Time',
      description: 'Seeking a seasoned DevOps & SRE Engineer to manage our Kubernetes clusters, Terraform infrastructure-as-code, and automated CI/CD release engineering on AWS.',
      requiredSkills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'CI/CD'],
      optionalSkills: ['Prometheus', 'Grafana', 'Python', 'Linux', 'Ansible'],
      minExperience: 5,
      maxExperience: 12,
      educationRequirement: 'Bachelor',
      salaryMin: 145000,
      salaryMax: 190000,
      salaryCurrency: 'USD',
      status: 'active',
      recruiter: recruiter1._id,
      applicantsCount: 2,
    });

    const job4 = await Job.create({
      title: 'Frontend React Specialist',
      company: 'Apex AI Labs',
      department: 'User Experience',
      location: 'New York, NY (Hybrid)',
      type: 'Full-Time',
      description: 'Looking for a talented Frontend React Developer with deep passion for sleek animations, Tailwind CSS, TypeScript, and responsive design systems.',
      requiredSkills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      optionalSkills: ['Redux', 'Jest', 'Vite', 'GraphQL', 'Figma'],
      minExperience: 3,
      maxExperience: 7,
      educationRequirement: 'Bachelor',
      salaryMin: 125000,
      salaryMax: 160000,
      salaryCurrency: 'USD',
      status: 'active',
      recruiter: recruiter2._id,
      applicantsCount: 2,
    });

    const job5 = await Job.create({
      title: 'Junior Software Engineer',
      company: 'Apex AI Labs',
      department: 'Engineering Services',
      location: 'Chicago, IL (Remote)',
      type: 'Full-Time',
      description: 'An exciting opening for an ambitious Junior Software Developer to work across our web stack, build React components, write unit tests, and learn modern cloud development.',
      requiredSkills: ['JavaScript', 'React', 'Node.js', 'Git'],
      optionalSkills: ['MongoDB', 'Express', 'HTML', 'CSS', 'Tailwind CSS'],
      minExperience: 1,
      maxExperience: 3,
      educationRequirement: 'Bachelor',
      salaryMin: 75000,
      salaryMax: 95000,
      salaryCurrency: 'USD',
      status: 'active',
      recruiter: recruiter2._id,
      applicantsCount: 2,
    });

    console.log('[Seed] Created Job Postings.');

    // 5. Create Applications & Evaluate AI Match Scores across Pipeline Stages
    // Job 1 (Senior Full-Stack Engineer)
    // Application 1: Alex Rivera -> Stage: Shortlisted
    const match1_1 = evaluateMatch(job1, profile1);
    await Application.create({
      job: job1._id,
      candidate: cand1User._id,
      candidateProfile: profile1._id,
      stage: 'Shortlisted',
      stageHistory: [
        { stage: 'Applied', updatedBy: cand1User._id, updatedAt: new Date(Date.now() - 5 * 86400000), note: 'Applied via portal.' },
        { stage: 'Screened', updatedBy: recruiter1._id, updatedAt: new Date(Date.now() - 3 * 86400000), note: 'AI Match Score 98%. All required skills present.' },
        { stage: 'Shortlisted', updatedBy: recruiter1._id, updatedAt: new Date(Date.now() - 1 * 86400000), note: 'Top candidate for technical screen.' },
      ],
      matchAnalysis: match1_1,
      recruiterNotes: 'Exceptional match. 6 years full-stack experience with React, TypeScript, Node.js, Docker, and AWS.',
    });

    // Application 2: Priya Sharma -> Stage: Screened
    const match1_2 = evaluateMatch(job1, profile4);
    await Application.create({
      job: job1._id,
      candidate: cand4User._id,
      candidateProfile: profile4._id,
      stage: 'Screened',
      stageHistory: [
        { stage: 'Applied', updatedBy: cand4User._id, updatedAt: new Date(Date.now() - 4 * 86400000), note: 'Applied via portal.' },
        { stage: 'Screened', updatedBy: recruiter1._id, updatedAt: new Date(Date.now() - 2 * 86400000), note: 'Strong frontend background, check Node/backend proficiency.' },
      ],
      matchAnalysis: match1_2,
      recruiterNotes: 'Strong frontend skills (React, TS, Tailwind). Reviewing backend readiness.',
    });

    // Application 3: Emily Watson -> Stage: Applied
    const match1_3 = evaluateMatch(job1, profile5);
    await Application.create({
      job: job1._id,
      candidate: cand5User._id,
      candidateProfile: profile5._id,
      stage: 'Applied',
      stageHistory: [
        { stage: 'Applied', updatedBy: cand5User._id, updatedAt: new Date(Date.now() - 1 * 86400000), note: 'Applied via portal.' },
      ],
      matchAnalysis: match1_3,
    });

    // Job 2 (Lead AI / ML Systems Engineer)
    // Application 4: Sarah Lin -> Stage: Interview Scheduled
    const match2_1 = evaluateMatch(job2, profile2);
    await Application.create({
      job: job2._id,
      candidate: cand2User._id,
      candidateProfile: profile2._id,
      stage: 'Interview Scheduled',
      stageHistory: [
        { stage: 'Applied', updatedBy: cand2User._id, updatedAt: new Date(Date.now() - 7 * 86400000), note: 'Applied via portal.' },
        { stage: 'Screened', updatedBy: recruiter1._id, updatedAt: new Date(Date.now() - 5 * 86400000), note: 'PhD Stanford AI, PyTorch & LLMs.' },
        { stage: 'Shortlisted', updatedBy: recruiter1._id, updatedAt: new Date(Date.now() - 3 * 86400000), note: 'Priority invite for system design.' },
        { stage: 'Interview Scheduled', updatedBy: recruiter1._id, updatedAt: new Date(Date.now() - 1 * 86400000), note: 'Scheduled technical architecture interview.' },
      ],
      matchAnalysis: match2_1,
      interviewDetails: {
        scheduledAt: new Date(Date.now() + 2 * 86400000 + 3600000 * 4), // 2 days from now
        type: 'Technical',
        meetingLink: 'https://meet.google.com/rec-ai-tech-interview',
        interviewer: 'Dr. Arthur Vance (VP of AI Research)',
        notes: 'Prepare deep dive into RAG pipelines, quantization, and PyTorch transformer serving.',
      },
      recruiterNotes: 'Star candidate. 99% AI fit score.',
    });

    // Job 3 (Senior DevOps & SRE Specialist)
    // Application 5: David Miller -> Stage: Selected
    const match3_1 = evaluateMatch(job3, profile3);
    await Application.create({
      job: job3._id,
      candidate: cand3User._id,
      candidateProfile: profile3._id,
      stage: 'Selected',
      stageHistory: [
        { stage: 'Applied', updatedBy: cand3User._id, updatedAt: new Date(Date.now() - 14 * 86400000), note: 'Applied via portal.' },
        { stage: 'Screened', updatedBy: recruiter1._id, updatedAt: new Date(Date.now() - 10 * 86400000), note: '7 yrs DevOps, CKA certified.' },
        { stage: 'Shortlisted', updatedBy: recruiter1._id, updatedAt: new Date(Date.now() - 8 * 86400000), note: 'Passed technical round.' },
        { stage: 'Interview Scheduled', updatedBy: recruiter1._id, updatedAt: new Date(Date.now() - 5 * 86400000), note: 'Final cultural and exec round.' },
        { stage: 'Selected', updatedBy: recruiter1._id, updatedAt: new Date(Date.now() - 1 * 86400000), note: 'Offer extended and accepted!' },
      ],
      matchAnalysis: match3_1,
      recruiterNotes: 'Offer extended: $175,000 + Equity. Candidate accepted.',
    });

    // Job 4 (Frontend React Specialist)
    // Application 6: Priya Sharma -> Stage: Shortlisted
    const match4_1 = evaluateMatch(job4, profile4);
    await Application.create({
      job: job4._id,
      candidate: cand4User._id,
      candidateProfile: profile4._id,
      stage: 'Shortlisted',
      stageHistory: [
        { stage: 'Applied', updatedBy: cand4User._id, updatedAt: new Date(Date.now() - 3 * 86400000), note: 'Applied via portal.' },
        { stage: 'Screened', updatedBy: recruiter2._id, updatedAt: new Date(Date.now() - 2 * 86400000), note: 'Impressive UI portfolio and Next.js experience.' },
        { stage: 'Shortlisted', updatedBy: recruiter2._id, updatedAt: new Date(Date.now() - 1 * 86400000), note: 'Advancing to live coding session.' },
      ],
      matchAnalysis: match4_1,
      recruiterNotes: 'Top pick for Frontend role.',
    });

    // Job 5 (Junior Software Engineer)
    // Application 7: Emily Watson -> Stage: Screened
    const match5_1 = evaluateMatch(job5, profile5);
    await Application.create({
      job: job5._id,
      candidate: cand5User._id,
      candidateProfile: profile5._id,
      stage: 'Screened',
      stageHistory: [
        { stage: 'Applied', updatedBy: cand5User._id, updatedAt: new Date(Date.now() - 2 * 86400000), note: 'Applied via portal.' },
        { stage: 'Screened', updatedBy: recruiter2._id, updatedAt: new Date(Date.now() - 1 * 86400000), note: 'Strong fundamental knowledge, good CS degree.' },
      ],
      matchAnalysis: match5_1,
      recruiterNotes: 'Solid entry level candidate for Junior position.',
    });

    console.log('[Seed] Created Applications with Stage Histories and Match Analyses.');

    console.log('\n======================================================');
    console.log(' SEEDING COMPLETED SUCCESSFULLY!');
    console.log(' Demo Accounts:');
    console.log(' ----------------------------------------------------');
    console.log(' Recruiter 1: recruiter@airecruit.pro  | password123');
    console.log(' Recruiter 2: recruiter2@airecruit.pro | password123');
    console.log(' Candidate 1: alex.dev@example.com     | password123 (Senior Full Stack)');
    console.log(' Candidate 2: sarah.data@example.com   | password123 (AI/ML Engineer, PhD)');
    console.log(' Candidate 3: david.cloud@example.com  | password123 (DevOps Architect)');
    console.log(' Candidate 4: priya.fullstack@example.com | password123 (Frontend Specialist)');
    console.log(' Candidate 5: emily.junior@example.com | password123 (Junior Developer)');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
