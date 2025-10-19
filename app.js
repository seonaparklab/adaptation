// Application State
let currentSection = 'home';
let currentConcept = 0;
let matchingScore = 0;
let totalItems = 0;
let attempts = 0;
let matchingComplete = false;
let currentCase = 0;
let currentQuestion = 0;
let quizScore = 0;
let userAnswers = [];
let sectionsCompleted = {
    theory: false,
    interactive: false,
    cases: false,
    quiz: false
};

// Data
const data = {
    cid_examples: [
        "Heatwave", "Heavy rain", "Rising temperature", "Cold spell", "Sea level rise",
        "Drought", "Strong typhoon", "Air pollution", "Wildfire", "Large temperature swing"
    ],
    vulnerability_examples: [
        "Elderly population", "Chronic illness", "Low income", "Poor cooling", "Old drainage",
        "Single crop farming", "Urban heat island", "Weak health system", "Few emergency staff", "Poor information access"
    ],
    exposure_examples: [
        "Coastal area", "Riverside homes", "Crowded city", "Rural farmland", "Industrial zone",
        "School", "Hospital", "Road network", "Forest", "Tourist spot"
    ],
    impact_examples: [
        "Heat illness", "Crop loss", "Flood damage", "Water shortage", "High energy use",
        "Ecosystem change", "Traffic disruption", "Lower factory output", "Fewer tourists", "More inequality"
    ],
    policy_examples: [
        "Cooling shelters", "Better drainage", "Early warning", "New crop varieties", "More green space",
        "More emergency staff", "Support for poor", "Coastal barriers", "Energy saving", "Community education"
    ],
    case_studies: [
        {
            title: "Urban Heatwave Management",
            cid: "Extreme heat events affecting urban areas",
            exposure: "City residents, especially in densely populated areas",
            vulnerability: "Elderly population, people without air conditioning, outdoor workers",
            impact: "Increased heat-related illness, higher energy consumption, reduced productivity",
            policy: "Establishing cooling centers, expanding green spaces, heat warning systems",
            description: "Cities around the world are experiencing more frequent and intense heatwaves due to climate change, combined with urban heat island effects."
        },
        {
            title: "Coastal Flooding Adaptation",
            cid: "Sea level rise and storm surge",
            exposure: "Coastal communities, infrastructure, and economic activities",
            vulnerability: "Low-lying areas, aging infrastructure, limited evacuation routes",
            impact: "Property damage, displacement of residents, economic losses, ecosystem disruption",
            policy: "Building sea barriers, implementing early warning systems, managed retreat policies",
            description: "Coastal regions face increasing risks from sea level rise and more intense storms, requiring comprehensive adaptation strategies."
        },
        {
            title: "Agricultural Drought Resilience",
            cid: "Reduced rainfall and increased temperature",
            exposure: "Farming communities, agricultural areas, food supply chains",
            vulnerability: "Single crop systems, limited irrigation infrastructure, small-scale farmers",
            impact: "Crop failure, economic losses, food insecurity, rural migration",
            policy: "Promoting drought-resistant crops, improving water management, providing financial support",
            description: "Agricultural regions are adapting to changing precipitation patterns and increased drought frequency through various strategies."
        }
    ]
};

// Quiz Questions
const quizQuestions = [
    {
        question: "Which of the following is a Climate Impact Driver (CID)?",
        options: [
            "Elderly population",
            "Rising sea levels",
            "Coastal communities",
            "Heat illness"
        ],
        correct: 1,
        explanation: "Rising sea levels is a physical climate condition that directly influences human and natural systems, making it a Climate Impact Driver."
    },
    {
        question: "Vulnerability in climate adaptation refers to:",
        options: [
            "The physical location of people and assets",
            "The climate change itself",
            "The propensity to be adversely affected by climate impacts",
            "The policy responses to climate change"
        ],
        correct: 2,
        explanation: "Vulnerability is the propensity or predisposition to be adversely affected by climate impacts, encompassing sensitivity and adaptive capacity."
    },
    {
        question: "An example of Exposure would be:",
        options: [
            "Poor drainage system",
            "Hospitals located in flood-prone areas",
            "Early warning system",
            "Drought conditions"
        ],
        correct: 1,
        explanation: "Hospitals in flood-prone areas represent exposure - the presence of people, infrastructure, and services in places that could be adversely affected."
    },
    {
        question: "Which represents an appropriate policy response to urban heat vulnerability?",
        options: [
            "Building more roads",
            "Creating cooling centers and green spaces",
            "Increasing population density",
            "Reducing public transportation"
        ],
        correct: 1,
        explanation: "Cooling centers and green spaces directly address urban heat by providing relief and reducing temperatures, making them effective adaptation policies."
    },
    {
        question: "The relationship between CID, Exposure, and Vulnerability results in:",
        options: [
            "Policy responses only",
            "Climate impacts",
            "Reduced vulnerability",
            "Better adaptation"
        ],
        correct: 1,
        explanation: "Climate impacts result from the interaction of Climate Impact Drivers with the exposure and vulnerability of human and natural systems."
    }
];

// Initialize Application
function initializeApp() {
    setupNavigation();
    setupDragAndDrop();
    setupCaseStudies();
    setupQuiz();
    updateProgress();
}

// Navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('href').substring(1);
            navigateToSection(section);
        });
    });
}

function navigateToSection(section) {
    // Hide current section
    document.querySelector('.section.active').classList.remove('active');
    
    // Show new section
    document.getElementById(section).classList.add('active');
    
    // Update navigation
    document.querySelector('.nav-link.active').classList.remove('active');
    document.querySelector(`[href="#${section}"]`).classList.add('active');
    
    currentSection = section;
    updateProgress();
}

function startLearning() {
    navigateToSection('theory');
}

// Progress Tracking
function updateProgress() {
    const sections = ['home', 'theory', 'interactive', 'cases', 'quiz'];
    const currentIndex = sections.indexOf(currentSection);
    const progress = ((currentIndex + 1) / sections.length) * 100;
    
    document.getElementById('progressBar').style.width = `${progress}%`;
    
    // Check completion
    if (Object.values(sectionsCompleted).every(completed => completed)) {
        showCompletionModal();
    }
}

function markSectionComplete(section) {
    sectionsCompleted[section] = true;
    updateProgress();
}

// Theory Section
const concepts = ['cid', 'exposure', 'vulnerability', 'impact', 'policy'];

function nextConcept() {
    if (currentConcept < concepts.length - 1) {
        currentConcept++;
        showConcept(currentConcept);
    } else {
        markSectionComplete('theory');
        navigateToSection('interactive');
    }
}

function previousConcept() {
    if (currentConcept > 0) {
        currentConcept--;
        showConcept(currentConcept);
    }
}

function showConcept(index) {
    // Hide all concept cards
    document.querySelectorAll('.concept-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Show current concept
    document.getElementById(`concept-${concepts[index]}`).classList.add('active');
    
    // Highlight framework item
    document.querySelectorAll('.framework-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-concept="${concepts[index]}"]`).classList.add('active');
}

// Interactive Activities - Now only supports matching
function initializeInteractiveSection() {
    initializeMatching();
}

// Drag and Drop Matching Game
function setupDragAndDrop() {
    initializeMatching();
}

function initializeMatching() {
    const pool = document.getElementById('examplesPool');
    pool.innerHTML = '';
    
    // Reset state
    matchingScore = 0;
    totalItems = 0;
    attempts = 0;
    matchingComplete = false;
    
    // Combine more examples for better practice (3 from each category)
    const allExamples = [
        ...data.cid_examples.slice(0, 3).map(ex => ({ text: ex, category: 'cid' })),
        ...data.vulnerability_examples.slice(0, 3).map(ex => ({ text: ex, category: 'vulnerability' })),
        ...data.exposure_examples.slice(0, 3).map(ex => ({ text: ex, category: 'exposure' })),
        ...data.impact_examples.slice(0, 3).map(ex => ({ text: ex, category: 'impact' })),
        ...data.policy_examples.slice(0, 3).map(ex => ({ text: ex, category: 'policy' }))
    ];
    
    totalItems = allExamples.length;
    
    // Shuffle examples
    const shuffled = allExamples.sort(() => Math.random() - 0.5);
    
    shuffled.forEach(example => {
        const item = document.createElement('div');
        item.className = 'example-item';
        item.textContent = example.text;
        item.draggable = true;
        item.dataset.category = example.category;
        item.dataset.correctCategory = getCategoryDisplayName(example.category);
        
        // Add both mouse and touch event listeners
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
        
        // Touch support
        item.addEventListener('touchstart', handleTouchStart, { passive: false });
        item.addEventListener('touchmove', handleTouchMove, { passive: false });
        item.addEventListener('touchend', handleTouchEnd, { passive: false });
        
        pool.appendChild(item);
    });
    
    // Reset and setup drop zones
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.innerHTML = '';
        zone.classList.remove('correct-zone', 'incorrect-zone');
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
        zone.addEventListener('dragenter', handleDragEnter);
        zone.addEventListener('dragleave', handleDragLeave);
    });
    
    // Reset feedback and controls
    document.getElementById('matching-feedback').innerHTML = '';
    document.getElementById('show-answers-btn').style.display = 'none';
    
    updateScore();
}

function getCategoryDisplayName(category) {
    const names = {
        'cid': 'Climate Impact Drivers',
        'vulnerability': 'Vulnerability',
        'exposure': 'Exposure',
        'impact': 'Impact',
        'policy': 'Policy'
    };
    return names[category] || category;
}

let draggedElement = null;
let touchStartX = 0;
let touchStartY = 0;

function handleDragStart(e) {
    draggedElement = e.target;
    e.dataTransfer.setData('text/plain', e.target.dataset.category);
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedElement = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
    e.preventDefault();
    if (e.target.classList.contains('drop-zone')) {
        e.target.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    if (e.target.classList.contains('drop-zone')) {
        e.target.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    e.preventDefault();
    
    let dropZone = e.target;
    if (!dropZone.classList.contains('drop-zone')) {
        dropZone = dropZone.closest('.drop-zone');
    }
    
    if (!dropZone) return;
    
    dropZone.classList.remove('drag-over');
    
    const category = e.dataTransfer.getData('text/plain');
    const html = e.dataTransfer.getData('text/html');
    
    // Create new element in drop zone
    const newItem = document.createElement('div');
    newItem.innerHTML = html;
    const item = newItem.firstChild;
    item.draggable = true; // Keep draggable for repositioning
    item.classList.remove('dragging');
    
    // Re-add event listeners to the new item
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('touchstart', handleTouchStart, { passive: false });
    item.addEventListener('touchmove', handleTouchMove, { passive: false });
    item.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    dropZone.appendChild(item);
    
    // Remove original item
    if (draggedElement && draggedElement.parentNode) {
        draggedElement.remove();
    }
    
    // Provide immediate visual feedback
    const expectedCategory = dropZone.id.replace('-zone', '');
    const isCorrect = category === expectedCategory;
    
    if (isCorrect) {
        item.classList.add('correct');
        showQuickFeedback(dropZone, 'Correct!', 'success');
    } else {
        item.classList.add('incorrect');
        showQuickFeedback(dropZone, 'Try again', 'error');
    }
    
    updateScore();
}

// Touch support for mobile devices
function handleTouchStart(e) {
    draggedElement = e.target;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    e.target.classList.add('dragging');
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!draggedElement) return;
    
    const touch = e.touches[0];
    draggedElement.style.position = 'fixed';
    draggedElement.style.left = touch.clientX - 50 + 'px';
    draggedElement.style.top = touch.clientY - 20 + 'px';
    draggedElement.style.zIndex = '1000';
    draggedElement.style.pointerEvents = 'none';
}

function handleTouchEnd(e) {
    if (!draggedElement) return;
    
    // Reset styles
    draggedElement.style.position = '';
    draggedElement.style.left = '';
    draggedElement.style.top = '';
    draggedElement.style.zIndex = '';
    draggedElement.style.pointerEvents = '';
    
    const touch = e.changedTouches[0];
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    let dropZone = elementBelow;
    
    if (elementBelow && !elementBelow.classList.contains('drop-zone')) {
        dropZone = elementBelow.closest('.drop-zone');
    }
    
    if (dropZone && dropZone.classList.contains('drop-zone')) {
        // Simulate drop
        const category = draggedElement.dataset.category;
        const item = draggedElement.cloneNode(true);
        item.classList.remove('dragging');
        
        // Re-add event listeners
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('touchstart', handleTouchStart, { passive: false });
        item.addEventListener('touchmove', handleTouchMove, { passive: false });
        item.addEventListener('touchend', handleTouchEnd, { passive: false });
        
        dropZone.appendChild(item);
        draggedElement.remove();
        
        // Provide feedback
        const expectedCategory = dropZone.id.replace('-zone', '');
        const isCorrect = category === expectedCategory;
        
        if (isCorrect) {
            item.classList.add('correct');
            showQuickFeedback(dropZone, 'Correct!', 'success');
        } else {
            item.classList.add('incorrect');
            showQuickFeedback(dropZone, 'Try again', 'error');
        }
        
        updateScore();
    } else {
        draggedElement.classList.remove('dragging');
    }
    
    draggedElement = null;
}

function showQuickFeedback(element, message, type) {
    const feedback = document.createElement('div');
    feedback.textContent = message;
    feedback.style.cssText = `
        position: absolute;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? 'var(--color-success)' : 'var(--color-error)'};
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 1000;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.appendChild(feedback);
    
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.remove();
        }
    }, 1500);
}

function updateScore() {
    const allDroppedItems = document.querySelectorAll('.drop-zone .example-item');
    const correctItems = document.querySelectorAll('.drop-zone .example-item.correct');
    
    matchingScore = correctItems.length;
    const currentTotal = allDroppedItems.length;
    
    document.getElementById('current-score').textContent = `Score: ${matchingScore}/${totalItems}`;
    document.getElementById('attempts').textContent = `Placed: ${currentTotal}/${totalItems}`;
}

function resetMatching() {
    // Clear all items from drop zones first
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.innerHTML = '';
        zone.classList.remove('correct-zone', 'incorrect-zone');
    });
    
    // Clear feedback
    document.getElementById('matching-feedback').innerHTML = '';
    
    // Re-initialize
    initializeMatching();
}

function checkMatching() {
    if (matchingComplete) {
        return;
    }
    
    attempts++;
    
    const zones = document.querySelectorAll('.drop-zone');
    let correct = 0;
    let total = 0;
    let zoneResults = [];
    
    zones.forEach(zone => {
        const expectedCategory = zone.id.replace('-zone', '');
        const items = zone.querySelectorAll('.example-item');
        let zoneCorrect = 0;
        let zoneTotal = items.length;
        
        items.forEach(item => {
            total++;
            if (item.dataset.category === expectedCategory) {
                correct++;
                zoneCorrect++;
                item.classList.remove('incorrect');
                item.classList.add('correct');
            } else {
                item.classList.remove('correct');
                item.classList.add('incorrect');
            }
        });
        
        // Visual feedback for zones
        if (zoneTotal > 0) {
            if (zoneCorrect === zoneTotal) {
                zone.classList.add('correct-zone');
                zone.classList.remove('incorrect-zone');
            } else {
                zone.classList.add('incorrect-zone');
                zone.classList.remove('correct-zone');
            }
        }
        
        zoneResults.push({ category: expectedCategory, correct: zoneCorrect, total: zoneTotal });
    });
    
    const feedback = document.getElementById('matching-feedback');
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    
    let detailedResults = '<div style="margin-top: 12px; font-size: 14px;">';
    zoneResults.forEach(result => {
        const categoryName = getCategoryDisplayName(result.category);
        const status = result.correct === result.total ? '✅' : '❌';
        detailedResults += `<div>${status} ${categoryName}: ${result.correct}/${result.total}</div>`;
    });
    detailedResults += '</div>';
    
    if (total === 0) {
        feedback.innerHTML = `<h4>No items to check!</h4><p>Please drag some items to the categories first.</p>`;
        feedback.className = 'feedback warning';
        return;
    }
    
    if (percentage >= 80) {
        feedback.innerHTML = `
            <h4>🎉 Excellent! ${correct}/${total} correct (${percentage}%)</h4>
            <p>You have a strong understanding of the climate adaptation framework!</p>
            ${detailedResults}
        `;
        feedback.className = 'feedback success';
        matchingComplete = true;
        markSectionComplete('interactive');
    } else if (percentage >= 60) {
        feedback.innerHTML = `
            <h4>Good progress! ${correct}/${total} correct (${percentage}%)</h4>
            <p>You're getting there! Review the incorrect items and try repositioning them.</p>
            ${detailedResults}
        `;
        feedback.className = 'feedback warning';
        document.getElementById('show-answers-btn').style.display = 'inline-flex';
    } else {
        feedback.innerHTML = `
            <h4>Keep trying! ${correct}/${total} correct (${percentage}%)</h4>
            <p>Review the theory section and try again. You can also view the correct answers for guidance.</p>
            ${detailedResults}
        `;
        feedback.className = 'feedback error';
        document.getElementById('show-answers-btn').style.display = 'inline-flex';
    }
    
    updateScore();
}

function showAnswers() {
    const allItems = document.querySelectorAll('.example-item');
    
    allItems.forEach(item => {
        item.classList.remove('correct', 'incorrect');
        item.classList.add('show-answer');
    });
    
    const feedback = document.getElementById('matching-feedback');
    feedback.innerHTML = `
        <h4>📖 Answer Key Displayed</h4>
        <p>Each item now shows its correct category. Study these relationships and try the activity again!</p>
        <p><strong>Tip:</strong> Click "Reset Activity" to practice again.</p>
    `;
    feedback.className = 'feedback';
    
    // Hide the show answers button
    document.getElementById('show-answers-btn').style.display = 'none';
}

// Interactive Flowchart functionality removed as per requirements

// Case Studies
function setupCaseStudies() {
    showCase(0);
    populateCaseBuilder();
}

function showCase(index) {
    currentCase = index;
    const caseStudy = data.case_studies[index];
    
    // Update buttons
    document.querySelectorAll('.case-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.case-btn')[index].classList.add('active');
    
    // Update content
    const content = document.getElementById('case-study-content');
    content.innerHTML = `
        <h2>${caseStudy.title}</h2>
        <p>${caseStudy.description}</p>
        
        <div class="case-framework">
            <div class="case-element">
                <h4>🌡️ Climate Impact Driver</h4>
                <p>${caseStudy.cid}</p>
            </div>
            <div class="case-element">
                <h4>🏠 Exposure</h4>
                <p>${caseStudy.exposure}</p>
            </div>
            <div class="case-element">
                <h4>🔴 Vulnerability</h4>
                <p>${caseStudy.vulnerability}</p>
            </div>
            <div class="case-element">
                <h4>⚡ Impact</h4>
                <p>${caseStudy.impact}</p>
            </div>
            <div class="case-element">
                <h4>🛡️ Policy Response</h4>
                <p>${caseStudy.policy}</p>
            </div>
        </div>
    `;
    
    markSectionComplete('cases');
}

function populateCaseBuilder() {
    const cidSelect = document.getElementById('builder-cid');
    const exposureSelect = document.getElementById('builder-exposure');
    const vulnerabilitySelect = document.getElementById('builder-vulnerability');
    
    data.cid_examples.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        cidSelect.appendChild(option);
    });
    
    data.exposure_examples.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        exposureSelect.appendChild(option);
    });
    
    data.vulnerability_examples.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        vulnerabilitySelect.appendChild(option);
    });
}

function generateScenario() {
    const cid = document.getElementById('builder-cid').value;
    const exposure = document.getElementById('builder-exposure').value;
    const vulnerability = document.getElementById('builder-vulnerability').value;
    
    if (!cid || !exposure || !vulnerability) {
        alert('Please select all three components to generate a scenario.');
        return;
    }
    
    const scenarioDiv = document.getElementById('generated-scenario');
    
    // Generate likely impacts and policies based on selections
    const impacts = generateLikelyImpacts(cid, exposure, vulnerability);
    const policies = generateLikelyPolicies(cid, vulnerability);
    
    scenarioDiv.innerHTML = `
        <h4>Generated Climate Scenario</h4>
        <div class="case-framework">
            <div class="case-element">
                <h4>🌡️ Climate Impact Driver</h4>
                <p>${cid}</p>
            </div>
            <div class="case-element">
                <h4>🏠 Exposure</h4>
                <p>${exposure}</p>
            </div>
            <div class="case-element">
                <h4>🔴 Vulnerability</h4>
                <p>${vulnerability}</p>
            </div>
            <div class="case-element">
                <h4>⚡ Likely Impact</h4>
                <p>${impacts}</p>
            </div>
            <div class="case-element">
                <h4>🛡️ Suggested Policy</h4>
                <p>${policies}</p>
            </div>
        </div>
    `;
}

function generateLikelyImpacts(cid, exposure, vulnerability) {
    // Simple logic to suggest realistic impacts
    if (cid.includes('Heat') && exposure.includes('city')) {
        return 'Increased heat-related illness, higher energy consumption, urban heat island effects';
    } else if (cid.includes('rain') && exposure.includes('Riverside')) {
        return 'Flooding, property damage, disrupted transportation';
    } else if (cid.includes('Drought') && exposure.includes('farmland')) {
        return 'Crop failure, water shortages, economic losses';
    }
    return 'Context-specific impacts based on the interaction of climate drivers with local conditions';
}

function generateLikelyPolicies(cid, vulnerability) {
    if (cid.includes('Heat') && vulnerability.includes('Elderly')) {
        return 'Cooling centers, heat warning systems, community support programs';
    } else if (cid.includes('rain') && vulnerability.includes('drainage')) {
        return 'Improved drainage systems, flood barriers, early warning systems';
    } else if (cid.includes('Drought') && vulnerability.includes('crop')) {
        return 'Drought-resistant crops, water conservation, irrigation improvements';
    }
    return 'Tailored adaptation strategies addressing specific vulnerabilities';
}

// Quiz System
function setupQuiz() {
    currentQuestion = 0;
    quizScore = 0;
    userAnswers = [];
    showQuestion();
}

function showQuestion() {
    const question = quizQuestions[currentQuestion];
    
    document.getElementById('quiz-question').innerHTML = `
        <h3>Question ${currentQuestion + 1}</h3>
        <p>${question.question}</p>
    `;
    
    const optionsDiv = document.getElementById('quiz-options');
    optionsDiv.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'quiz-option';
        optionDiv.textContent = option;
        optionDiv.addEventListener('click', () => selectOption(index, optionDiv));
        optionsDiv.appendChild(optionDiv);
    });
    
    document.getElementById('question-counter').textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
    
    // Update button states
    document.getElementById('prevBtn').disabled = currentQuestion === 0;
    document.getElementById('nextBtn').textContent = currentQuestion === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next →';
    
    // Clear feedback
    document.getElementById('quiz-feedback').innerHTML = '';
}

function selectOption(selectedIndex, optionElement) {
    // Remove selection from all options
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selection to clicked option
    optionElement.classList.add('selected');
    
    // Store answer
    userAnswers[currentQuestion] = selectedIndex;
}

function nextQuestion() {
    if (userAnswers[currentQuestion] === undefined) {
        alert('Please select an answer before proceeding.');
        return;
    }
    
    // Show feedback
    const question = quizQuestions[currentQuestion];
    const userAnswer = userAnswers[currentQuestion];
    const isCorrect = userAnswer === question.correct;
    
    if (isCorrect) {
        quizScore++;
    }
    
    // Highlight correct/incorrect answers
    const options = document.querySelectorAll('.quiz-option');
    options[question.correct].classList.add('correct');
    if (!isCorrect) {
        options[userAnswer].classList.add('incorrect');
    }
    
    // Show explanation
    const feedback = document.getElementById('quiz-feedback');
    feedback.innerHTML = `
        <h4>${isCorrect ? 'Correct!' : 'Incorrect'}</h4>
        <p>${question.explanation}</p>
    `;
    feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    
    // Update button to continue
    const nextBtn = document.getElementById('nextBtn');
    if (currentQuestion === quizQuestions.length - 1) {
        nextBtn.textContent = 'View Results';
        nextBtn.onclick = showQuizResults;
    } else {
        nextBtn.textContent = 'Continue';
        nextBtn.onclick = continueToNextQuestion;
    }
}

function continueToNextQuestion() {
    currentQuestion++;
    showQuestion();
    // Reset next button
    document.getElementById('nextBtn').onclick = nextQuestion;
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
    }
}

function showQuizResults() {
    document.getElementById('quiz-container').classList.add('hidden');
    
    const resultsDiv = document.getElementById('quiz-results');
    resultsDiv.classList.remove('hidden');
    
    const percentage = Math.round((quizScore / quizQuestions.length) * 100);
    
    document.getElementById('final-score').innerHTML = `
        You scored ${quizScore} out of ${quizQuestions.length} (${percentage}%)
        <br>
        <span style="font-size: var(--font-size-lg); color: ${percentage >= 80 ? 'var(--color-success)' : 'var(--color-warning)'}">
            ${percentage >= 80 ? 'Excellent work!' : 'Good effort! Review the concepts and try again.'}
        </span>
    `;
    
    markSectionComplete('quiz');
}

function restartQuiz() {
    document.getElementById('quiz-container').classList.remove('hidden');
    document.getElementById('quiz-results').classList.add('hidden');
    setupQuiz();
}

// Completion Modal
function showCompletionModal() {
    document.getElementById('completion-modal').classList.remove('hidden');
}

function closeCompletionModal() {
    document.getElementById('completion-modal').classList.add('hidden');
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initializeApp);