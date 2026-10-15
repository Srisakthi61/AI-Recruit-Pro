const natural = require('natural');

// Standard skill alias / synonym map
const SKILL_ALIASES = {
  react: ['reactjs', 'react.js', 'react framework'],
  'react.js': ['react', 'reactjs'],
  nodejs: ['node.js', 'node', 'node js'],
  'node.js': ['nodejs', 'node', 'node js'],
  express: ['express.js', 'expressjs'],
  'express.js': ['express', 'expressjs'],
  mongodb: ['mongo', 'mongoose', 'nosql'],
  postgres: ['postgresql', 'psql'],
  postgresql: ['postgres', 'psql'],
  aws: ['amazon web services', 'ec2', 's3', 'lambda', 'aws cloud'],
  gcp: ['google cloud platform', 'google cloud'],
  k8s: ['kubernetes'],
  kubernetes: ['k8s'],
  docker: ['containerization', 'containers'],
  js: ['javascript', 'es6', 'ecmascript'],
  javascript: ['js', 'es6', 'ecmascript'],
  ts: ['typescript'],
  typescript: ['ts'],
  py: ['python', 'python3'],
  python: ['py', 'python3'],
  'vue.js': ['vue', 'vuejs'],
  vue: ['vue.js', 'vuejs'],
  'angular.js': ['angular', 'angularjs'],
  angular: ['angular.js', 'angularjs'],
  'next.js': ['nextjs', 'next'],
  next: ['next.js', 'nextjs'],
  tailwind: ['tailwindcss', 'tailwind css'],
  'tailwind css': ['tailwind', 'tailwindcss'],
  ml: ['machine learning', 'ai', 'deep learning'],
  'machine learning': ['ml', 'ai', 'deep learning'],
  nlp: ['natural language processing'],
  'natural language processing': ['nlp'],
  llm: ['large language models', 'generative ai', 'genai', 'langchain'],
  ci_cd: ['ci/cd', 'continuous integration', 'github actions', 'jenkins', 'gitlab ci'],
  'ci/cd': ['continuous integration', 'github actions', 'jenkins', 'gitlab ci'],
};

const DEGREE_RANKS = {
  Any: 0,
  None: 0,
  'High School': 1,
  Associate: 2,
  Bachelor: 3,
  Master: 4,
  PhD: 5,
};

/**
 * Check if candidate has a required skill (considering synonyms & substrings)
 */
function hasSkillMatch(requiredSkill, candidateSkills = [], rawText = '') {
  const reqLower = requiredSkill.toLowerCase().trim();
  const lowerCandSkills = candidateSkills.map((s) => s.toLowerCase().trim());
  const lowerRawText = rawText.toLowerCase();

  // 1. Direct match in candidate skills
  if (lowerCandSkills.includes(reqLower)) {
    return true;
  }

  // 2. Check aliases
  const aliases = SKILL_ALIASES[reqLower] || [];
  for (const alias of aliases) {
    if (lowerCandSkills.includes(alias) || lowerCandSkills.some((s) => s.includes(alias))) {
      return true;
    }
  }

  // 3. Substring match in skills
  if (lowerCandSkills.some((s) => s.includes(reqLower) || reqLower.includes(s))) {
    return true;
  }

  // 4. Word boundary check in raw text
  const escaped = reqLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(?:^|[^a-zA-Z0-9#+])${escaped}(?:$|[^a-zA-Z0-9#+])`, 'i');
  if (regex.test(lowerRawText)) {
    return true;
  }

  return false;
}

/**
 * Calculate Skills Compatibility Score
 */
function calculateSkillsScore(requiredSkills = [], candidateSkills = [], rawText = '') {
  if (!requiredSkills || requiredSkills.length === 0) {
    return {
      score: 100,
      matchedSkills: candidateSkills.slice(0, 8),
      missingSkills: [],
      additionalSkills: candidateSkills.slice(8),
    };
  }

  const matchedSkills = [];
  const missingSkills = [];

  for (const skill of requiredSkills) {
    if (hasSkillMatch(skill, candidateSkills, rawText)) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  const ratio = matchedSkills.length / requiredSkills.length;
  let skillsScore = Math.round(ratio * 100);

  // Bonus for supplementary skills
  const additionalSkills = candidateSkills.filter(
    (s) => !matchedSkills.some((m) => m.toLowerCase() === s.toLowerCase())
  );

  if (additionalSkills.length > 3 && skillsScore > 0) {
    skillsScore = Math.min(100, skillsScore + 5);
  }

  return {
    score: skillsScore,
    matchedSkills,
    missingSkills,
    additionalSkills: additionalSkills.slice(0, 10),
  };
}

/**
 * Calculate Experience Compatibility Score
 */
function calculateExperienceScore(minRequiredYears = 0, candidateYears = 0) {
  const required = Number(minRequiredYears) || 0;
  const candidate = Number(candidateYears) || 0;

  let status = 'Meets';
  let score = 100;

  if (required === 0) {
    score = 100;
    status = candidate > 0 ? 'Exceeds' : 'Meets';
  } else if (candidate >= required) {
    status = candidate > required + 2 ? 'Exceeds' : 'Meets';
    score = 100;
  } else {
    status = 'Below';
    const ratio = candidate / required;
    // Curved drop-off
    score = Math.max(20, Math.round(ratio * 90));
  }

  return {
    score,
    candidateYears: candidate,
    requiredYears: required,
    status,
  };
}

/**
 * Calculate Education Compatibility Score
 */
function calculateEducationScore(requiredDegree = 'Bachelor', candidateDegree = 'Bachelor') {
  const reqRank = DEGREE_RANKS[requiredDegree] ?? 3;
  const candRank = DEGREE_RANKS[candidateDegree] ?? 3;

  let score = 100;
  let status = 'Meets';

  if (reqRank === 0 || candRank >= reqRank) {
    score = 100;
    status = candRank > reqRank ? 'Exceeds' : 'Meets';
  } else {
    status = 'Below';
    const diff = reqRank - candRank;
    score = Math.max(40, 100 - diff * 25);
  }

  return {
    score,
    candidateDegree,
    requiredDegree,
    status,
  };
}

/**
 * Calculate Semantic TF-IDF Similarity Score
 */
function calculateSemanticScore(jobDescription = '', jobTitle = '', rawText = '', summary = '') {
  const jobFullText = `${jobTitle} ${jobDescription}`;
  const candidateFullText = `${summary} ${rawText}`;

  if (!jobFullText.trim() || !candidateFullText.trim()) {
    return 70;
  }

  const TfIdf = natural.TfIdf;
  const tfidf = new TfIdf();

  tfidf.addDocument(jobFullText);
  tfidf.addDocument(candidateFullText);

  // Extract top terms from job description and see candidate coverage
  const terms = [];
  tfidf.listTerms(0).slice(0, 25).forEach((item) => {
    if (item.term.length > 2) {
      terms.push(item.term.toLowerCase());
    }
  });

  if (terms.length === 0) return 75;

  let hits = 0;
  const candLower = candidateFullText.toLowerCase();
  for (const term of terms) {
    if (candLower.includes(term)) {
      hits++;
    }
  }

  const coverage = hits / terms.length;
  const score = Math.min(100, Math.max(30, Math.round(coverage * 100 + 15)));
  return score;
}

/**
 * Main Candidate-Job Match Evaluator
 * @param {Object} job - Job document or object
 * @param {Object} candidateProfile - CandidateProfile document or object
 * @returns {Object} Comprehensive Match Analysis
 */
function evaluateMatch(job, candidateProfile) {
  const candidateParsed = candidateProfile?.parsedData || candidateProfile || {};
  const rawText = candidateProfile?.rawText || '';

  // 1. Skills
  const skillsRes = calculateSkillsScore(job.requiredSkills || [], candidateParsed.skills || [], rawText);

  // 2. Experience
  const expRes = calculateExperienceScore(job.minExperience || 0, candidateParsed.totalYearsExperience || 0);

  // 3. Education
  const eduRes = calculateEducationScore(
    job.educationRequirement || 'Bachelor',
    candidateParsed.highestEducation || 'Bachelor'
  );

  // 4. Semantic / Description fit
  const semanticScore = calculateSemanticScore(
    job.description || '',
    job.title || '',
    rawText,
    candidateParsed.summary || ''
  );

  // Weighted Total Score:
  // 50% Skills + 25% Experience + 15% Education + 10% Semantic Fit
  const overallScore = Math.round(
    skillsRes.score * 0.50 +
    expRes.score * 0.25 +
    eduRes.score * 0.15 +
    semanticScore * 0.10
  );

  // Recommendation Level
  let recommendation = 'Potential Match';
  if (overallScore >= 80) {
    recommendation = 'Strong Match';
  } else if (overallScore >= 65) {
    recommendation = 'Good Match';
  } else if (overallScore >= 50) {
    recommendation = 'Potential Match';
  } else {
    recommendation = 'Low Match';
  }

  // AI Narrative Summary
  let aiSummary = `Candidate has ${candidateParsed.totalYearsExperience || 0} years experience (${expRes.status.toLowerCase()} required ${job.minExperience || 0} yrs) and matches ${skillsRes.matchedSkills.length}/${(job.requiredSkills || []).length} required skills.`;

  if (skillsRes.missingSkills.length > 0) {
    aiSummary += ` Key missing: ${skillsRes.missingSkills.join(', ')}.`;
  } else {
    aiSummary += ` Matches all required technical skills for this role!`;
  }

  return {
    overallScore,
    skillsScore: skillsRes.score,
    experienceScore: expRes.score,
    educationScore: eduRes.score,
    semanticScore,
    matchedSkills: skillsRes.matchedSkills,
    missingSkills: skillsRes.missingSkills,
    additionalSkills: skillsRes.additionalSkills,
    experienceFit: {
      candidateYears: expRes.candidateYears,
      requiredYears: expRes.requiredYears,
      status: expRes.status,
    },
    educationFit: {
      candidateDegree: eduRes.candidateDegree,
      requiredDegree: eduRes.requiredDegree,
      status: eduRes.status,
    },
    recommendation,
    aiSummary,
  };
}

module.exports = {
  evaluateMatch,
  calculateSkillsScore,
  calculateExperienceScore,
  calculateEducationScore,
  calculateSemanticScore,
};
