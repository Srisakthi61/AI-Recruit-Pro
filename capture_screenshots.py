import os
import time
from playwright.sync_api import sync_playwright

os.makedirs('screenshots', exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe', headless=True)
    context = browser.new_context(viewport={'width': 1280, 'height': 800})
    page = context.new_page()

    # 1. Landing Page
    page.goto('http://localhost:3000/')
    time.sleep(2)
    page.screenshot(path='screenshots/1_landing_page.png')
    print('1. Landing page captured')

    # 2. Login Page
    page.goto('http://localhost:3000/login')
    time.sleep(1.5)
    page.screenshot(path='screenshots/2_login_page.png')
    print('2. Login page captured')

    # 3. Recruiter Login & Dashboard
    # Click recruiter demo button
    recruiter_btn = page.locator("button:has-text('Sarah Jenkins'), button:has-text('Recruiter')").first
    if recruiter_btn.count() > 0:
        recruiter_btn.click()
    else:
        page.fill("input[type='email']", 'recruiter@airecruit.pro')
        page.fill("input[type='password']", 'password123')
        page.click("button[type='submit']")
    time.sleep(2.5)
    page.screenshot(path='screenshots/3_recruiter_dashboard.png')
    print('3. Recruiter dashboard captured')

    # 4. Job Listings
    page.goto('http://localhost:3000/jobs')
    time.sleep(2)
    page.screenshot(path='screenshots/4_job_listings.png')
    print('4. Job listings captured')

    # 5. Pipeline Kanban
    page.goto('http://localhost:3000/pipeline')
    time.sleep(2)
    page.screenshot(path='screenshots/5_kanban_pipeline.png')
    print('5. Kanban pipeline captured')

    # 6. Candidate Ranking
    page.goto('http://localhost:3000/recruiter-dashboard')
    time.sleep(1.5)
    rank_link = page.locator("a[href*='/matching/job/']").first
    if rank_link.count() > 0:
        rank_link.click()
        time.sleep(2)
        page.screenshot(path='screenshots/6_candidate_ranking.png')
        print('6. Candidate ranking captured')

    # 7. Candidate Flow
    context.clear_cookies()
    page.evaluate('() => localStorage.clear()')
    page.goto('http://localhost:3000/login')
    time.sleep(1.5)
    cand_btn = page.locator("button:has-text('Alex Rivera'), button:has-text('Candidate')").first
    if cand_btn.count() > 0:
        cand_btn.click()
    else:
        page.fill("input[type='email']", 'alex.dev@example.com')
        page.fill("input[type='password']", 'password123')
        page.click("button[type='submit']")
    time.sleep(2.5)
    page.screenshot(path='screenshots/7_candidate_dashboard.png')
    print('7. Candidate dashboard captured')

    # 8. Resume Upload
    page.goto('http://localhost:3000/resume-upload')
    time.sleep(2)
    page.screenshot(path='screenshots/8_resume_upload.png')
    print('8. Resume upload captured')

    # 9. Candidate My Applications
    page.goto('http://localhost:3000/my-applications')
    time.sleep(2)
    page.screenshot(path='screenshots/9_my_applications.png')
    print('9. My applications captured')

    browser.close()
    print('All screenshots captured successfully!')
