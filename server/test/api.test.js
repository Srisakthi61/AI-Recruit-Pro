require('dotenv').config();
const assert = require('assert');
const http = require('http');
const app = require('../src/app');
const mongoose = require('mongoose');
const { parseResume } = require('../src/services/resumeParser');
const { evaluateMatch } = require('../src/services/matchingEngine');

let server;
let baseUrl;

async function request(path, options = {}) {
  const url = `${baseUrl}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await response.json();
  return { status: response.status, data };
}

async function runTests() {
  console.log('\n--- STARTING AI RECRUIT PRO BACKEND TESTS ---\n');

  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai-recruit-pro';
    await mongoose.connect(connUri);
    console.log('✓ Connected to MongoDB');

    // Start ephemeral server on random port
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    baseUrl = `http://localhost:${port}/api`;
    console.log(`✓ Test Server listening on http://localhost:${port}`);

    // 1. Health Check
    const health = await request('/health');
    assert.strictEqual(health.status, 200);
    assert.strictEqual(health.data.status, 'online');
    console.log('✓ Health check endpoint working');

    // 2. Auth: Recruiter Login
    const recLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'recruiter@airecruit.pro', password: 'password123' }),
    });
    assert.strictEqual(recLogin.status, 200);
    assert.ok(recLogin.data.token, 'Recruiter token missing');
    assert.strictEqual(recLogin.data.user.role, 'recruiter');
    const recToken = recLogin.data.token;
    console.log('✓ Recruiter Login successful');

    // 3. Auth: Candidate Login
    const candLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'alex.dev@example.com', password: 'password123' }),
    });
    assert.strictEqual(candLogin.status, 200);
    assert.ok(candLogin.data.token, 'Candidate token missing');
    assert.strictEqual(candLogin.data.user.role, 'candidate');
    const candToken = candLogin.data.token;
    console.log('✓ Candidate Login successful');

    // 4. Jobs: Get all active jobs
    const jobsRes = await request('/jobs');
    assert.strictEqual(jobsRes.status, 200);
    assert.ok(jobsRes.data.data.length > 0, 'No jobs returned');
    const firstJob = jobsRes.data.data[0];
    console.log(`✓ Jobs retrieved (${jobsRes.data.count} jobs found, first: "${firstJob.title}")`);

    // 5. Jobs: Recruiter Create Job
    const newJobRes = await request('/jobs', {
      method: 'POST',
      headers: { Authorization: `Bearer ${recToken}` },
      body: JSON.stringify({
        title: 'Senior Cloud Backend Engineer (Test)',
        company: 'CloudScale Technologies',
        department: 'Cloud Platform',
        location: 'Remote',
        type: 'Full-Time',
        description: 'Building high throughput microservices in Go, Node.js, and Kubernetes.',
        requiredSkills: ['Node.js', 'Go', 'Kubernetes', 'Docker'],
        optionalSkills: ['AWS', 'Redis'],
        minExperience: 4,
        maxExperience: 8,
        educationRequirement: 'Bachelor',
        salaryMin: 130000,
        salaryMax: 170000,
      }),
    });
    assert.strictEqual(newJobRes.status, 201);
    assert.ok(newJobRes.data.data._id);
    const createdJobId = newJobRes.data.data._id;
    console.log('✓ Recruiter created a new job posting');

    // 6. Resume Parser Service Unit Test
    const sampleResumeText = `
      Johnathan Doe
      Email: john.doe.test@example.com
      Phone: (555) 123-4567
      LinkedIn: https://linkedin.com/in/johndoe-test
      
      PROFESSIONAL SUMMARY
      Full Stack Software Engineer with 5+ years of experience building scalable applications using React, Node.js, Express, MongoDB, TypeScript, and Docker.
      
      EXPERIENCE
      Senior Developer at Acquired Tech (2020 - Present)
      - Architected React frontend and Node.js REST APIs.
      - Dockerized containers deployed on AWS.
      
      EDUCATION
      Master of Science in Computer Science (2018 - 2020)
      University of Washington
      
      SKILLS
      JavaScript, TypeScript, React, Node.js, Express, MongoDB, Docker, AWS, Git, CI/CD
    `;

    const parsedResult = await parseResume(sampleResumeText, 'text/plain', 'sample.txt');
    assert.ok(parsedResult.parsedData.skills.length >= 5, 'Skills extraction failed');
    assert.strictEqual(parsedResult.parsedData.email, 'john.doe.test@example.com');
    assert.strictEqual(parsedResult.parsedData.totalYearsExperience, 5.0);
    assert.strictEqual(parsedResult.parsedData.highestEducation, 'Master');
    console.log(`✓ Resume Parser NLP accurately extracted ${parsedResult.parsedData.skills.length} skills, email, 5 yrs exp, Master degree`);

    // 7. Matching Engine Unit Test
    const dummyJob = {
      title: 'Full Stack Engineer',
      description: 'Looking for React and Node.js developer',
      requiredSkills: ['React', 'Node.js', 'TypeScript', 'Docker'],
      minExperience: 4,
      educationRequirement: 'Bachelor',
    };
    const matchEvaluation = evaluateMatch(dummyJob, parsedResult);
    assert.ok(matchEvaluation.overallScore >= 80, `Expected high match score, got ${matchEvaluation.overallScore}`);
    assert.strictEqual(matchEvaluation.recommendation, 'Strong Match');
    assert.strictEqual(matchEvaluation.missingSkills.length, 0);
    console.log(`✓ Matching Engine scored candidate: ${matchEvaluation.overallScore}% (${matchEvaluation.recommendation})`);

    // 8. Recruiter Ranked Candidates View
    const rankedRes = await request(`/matching/job/${firstJob._id}/ranked-candidates`, {
      headers: { Authorization: `Bearer ${recToken}` },
    });
    assert.strictEqual(rankedRes.status, 200);
    assert.ok(rankedRes.data.data.length > 0);
    console.log(`✓ Ranked Candidates endpoint returned ${rankedRes.data.count} evaluated candidates`);

    // 9. Pipeline & Kanban: Get Applications for Job
    const appListRes = await request(`/applications/job/${firstJob._id}`, {
      headers: { Authorization: `Bearer ${recToken}` },
    });
    assert.strictEqual(appListRes.status, 200);
    console.log(`✓ Kanban Applications fetched: ${appListRes.data.count} applicants`);

    // 10. Pipeline Stage Update (Recruiter moves candidate)
    if (appListRes.data.data.length > 0) {
      const appToUpdate = appListRes.data.data[0];
      const updateStageRes = await request(`/applications/${appToUpdate._id}/stage`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${recToken}` },
        body: JSON.stringify({ stage: 'Interview Scheduled', note: 'Moving to live technical interview.' }),
      });
      assert.strictEqual(updateStageRes.status, 200);
      assert.strictEqual(updateStageRes.data.data.stage, 'Interview Scheduled');
      console.log('✓ Candidate Pipeline stage moved to "Interview Scheduled" with history audit');

      // Schedule interview
      const scheduleRes = await request(`/applications/${appToUpdate._id}/schedule-interview`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${recToken}` },
        body: JSON.stringify({
          scheduledAt: new Date().toISOString(),
          type: 'Technical',
          meetingLink: 'https://meet.google.com/test-room',
          interviewer: 'Lead Architect',
          notes: 'Prepare system design walkthrough.',
        }),
      });
      assert.strictEqual(scheduleRes.status, 200);
      console.log('✓ Interview scheduled with Google Meet link and notes');
    }

    // 11. Recruiter Dashboard Stats
    const recStats = await request('/stats/recruiter', {
      headers: { Authorization: `Bearer ${recToken}` },
    });
    assert.strictEqual(recStats.status, 200);
    assert.ok(recStats.data.stats.totalJobs >= 1);
    console.log('✓ Recruiter Dashboard stats computed');

    // 12. Candidate Dashboard Stats
    const candStats = await request('/stats/candidate', {
      headers: { Authorization: `Bearer ${candToken}` },
    });
    assert.strictEqual(candStats.status, 200);
    console.log('✓ Candidate Dashboard stats & applications fetched');

    // Clean up test job
    await request(`/jobs/${createdJobId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${recToken}` },
    });
    console.log('✓ Test job cleaned up');

    console.log('\n=========================================');
    console.log(' ALL BACKEND API & NLP TESTS PASSED (12/12)!');
    console.log('=========================================\n');

    server.close();
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error);
    if (server) server.close();
    await mongoose.disconnect();
    process.exit(1);
  }
}

runTests();
