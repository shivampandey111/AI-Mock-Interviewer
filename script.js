const landingSection = document.getElementById("landingSection");
const InterviewSection = document.getElementById("interviewSection");
const start = document.getElementById('startInterviewBtn')
const submit = document.getElementById('submitAnswerBtn')
const nextBtn = document.getElementById('nextQuestionBtn')
const retryBtn = document.getElementById('retryQuestionBtn')
const statBtn = document.getElementById('stats-btn')
const skipQuestionBtn = document.getElementById('skipQuestionBtn')
const statsPanel = document.getElementById('session-stats-panel')
const statsBackLink = document.querySelector('.stats-back-link')

let selectedTrack = null;
let currentTrack = null;
let noOfQue = 0;
let sessionData = [];
let queAttempted = 0;

submit.disabled = true;
skipQuestionBtn.disabled = true;
nextBtn.classList.add('is-hidden')
retryBtn.classList.add('is-hidden')

const tracks = document.querySelectorAll('.track-card')
tracks.forEach((card) => {
    card.addEventListener('click', (e) => {
        tracks.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected')
        selectedTrack = (e.currentTarget.dataset.track);
    });
})

start.addEventListener('click', (e)=>{
    if(selectedTrack===null){
        alert('Please Select a Topic')
    }
    else{
        landingSection.classList.add("is-hidden")
        start.classList.add("is-hidden")
        InterviewSection.classList.remove("is-hidden")
        document.querySelector('.question-meta').innerHTML = `${selectedTrack} | JUNIOR ROLE`

        getQuestion()
    }
})

const fallbackQuestions = {
    DSA: [
        "What is a linked list?",
        "Explain time complexity of binary search.",
        "What is a stack and queue?",
        "What is recursion?"
    ],
    Web: [
        "What is the DOM?",
        "Difference between let, var, const?",
        "What is event bubbling?",
        "What is closure in JavaScript?"
    ],
    DBMS: [
        "What is normalization?",
        "Difference between SQL and NoSQL?",
        "What is indexing?",
    ],
    OS: [
        "What is a process vs thread?",
        "What is deadlock?",
        "Explain scheduling algorithms."
    ],
    HR: [
        "Tell me about yourself.",
        "Why should we hire you?",
        "What are your strengths?"
    ]
};
let index;
function getOfflineQue(){
    const arr = fallbackQuestions[`${selectedTrack}`] || ["No Questions Available"]
    index = Math.floor(Math.random()*arr.length)
    const fallBack = arr[index];
    return fallBack;
};

//Offline questions answers
const fallbackAnswers = {
    DSA: [
        "A linked list is a dynamic data structure where each node stores data and a reference to the next node. It allows efficient insertion and deletion without shifting elements like arrays.",
        "Binary search works on sorted data and reduces the search space by half at each step, giving it a time complexity of O(log n).",
        "A stack follows LIFO (Last In First Out) where the last inserted element is removed first. A queue follows FIFO (First In First Out) where the first inserted element is removed first.",
        "Recursion is a technique where a function calls itself to solve smaller instances of a problem. It requires a base case to stop execution and prevent infinite calls."
    ],

    Web: [
        "The DOM is a tree representation of an HTML document that allows JavaScript to access and manipulate elements, structure, and styles dynamically.",
        "var is function-scoped and can be redeclared, let is block-scoped and cannot be redeclared, and const is block-scoped and cannot be reassigned after initialization.",
        "Event bubbling is a mechanism where an event starts from the target element and propagates upward to its parent elements.",
        "A closure is a function that remembers its lexical scope even when executed outside that scope, allowing it to access variables from its outer function."
    ],

    DBMS: [
        "Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity by dividing tables into smaller related tables.",
        "SQL databases are relational and use structured schemas, while NoSQL databases are non-relational and handle unstructured or semi-structured data.",
        "Indexing improves query performance by creating a data structure that allows faster retrieval of records without scanning the entire table."
    ],

    OS: [
        "A process is an independent program in execution with its own memory space, while a thread is a smaller unit of execution within a process that shares memory.",
        "Deadlock is a situation where multiple processes are stuck waiting for each other's resources, causing none of them to proceed.",
        "Scheduling algorithms decide the order of process execution in CPU, such as FCFS, SJF, and Round Robin, aiming to optimize CPU utilization and response time."
    ],

    HR: [
        "I am a motivated individual with a strong interest in technology and problem-solving, currently building my skills in software development and continuously learning through projects.",
        "You should hire me because I am eager to learn, adaptable, and committed to improving my skills while contributing effectively to the team.",
        "My strengths include consistency, problem-solving ability, and a willingness to learn and adapt to new challenges."
    ]
};

function fallbackAns(){
    const ans = fallbackAnswers[`${selectedTrack}`][index]
    return ans;
}

let queGenerated;

let progress = 0;
const currProgress = document.querySelector('.progress-value')
function update(){
    progress++;
    let percent = (progress / 5) * 100;
    currProgress.style.width = percent + '%';
}
let question;
const answerbox = document.querySelector('#answerInput')
function typing(e){
        e.preventDefault();
}


//Skip Question Logic


document.querySelector('#PopupBtn').addEventListener('click', ()=>{
        document.querySelector('#Overlay').classList.add('is-hidden')
    })
document.querySelector('#ConfirmYes').addEventListener('click', ()=>{
        document.querySelector('#Overlay').classList.add('is-hidden')
        
        getQuestion()
    })
skipQuestionBtn.addEventListener('click', ()=>{
    document.querySelector('#PopupBtn').textContent = 'No'
    console.log('Hello')
    document.querySelector('#ConfirmYes').textContent = 'Yes'
    console.log('After yes')
    document.querySelector('#Message').textContent = 'Are You Sure You Want To Skip This Question?'
    document.querySelector('#Overlay').classList.remove('is-hidden')
    
    
})


async function getQuestion(){
    update()
    noOfQue += 1;
    
    answerbox.removeEventListener('keydown', typing)
    answerbox.removeEventListener('paste', typing)
    console.log(noOfQue)
    console.log('getQuestion called')
    document.querySelector('.question-title').textContent = 'Getting your Question...' 
    const prompt = `Generate one junior level ${selectedTrack} question for software engineer role. Return only question, nothing else.`

    try{
        const response = await fetch("/api/generate", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ prompt })
});
    const data = await response.json()
    question = data.candidates[0].content.parts[0].text
    document.querySelector('.question-title').textContent = question
    submit.disabled = false;
    skipQuestionBtn.disabled = false;
    queGenerated = true;
    }
    catch(error){
        question = getOfflineQue() + `  (Offline Questions)`
        document.querySelector('.question-title').textContent = question

        submit.disabled = false;
        skipQuestionBtn.disabled = false;
        queGenerated = false;
        
    }
    if(noOfQue===5){
        nextBtn.classList.add('is-hidden')
        retryBtn.classList.add('is-hidden')
        statBtn.classList.remove('is-hidden')
        skipQuestionBtn.classList.add('is-hidden')
}
}

let ans;
function checkAns(answer){
    if(answer.length === 0){
        
        document.querySelector('#ConfirmYes').classList.add('is-hidden')
        document.getElementById('PopupBtn').textContent = 'Okay'
        document.getElementById('Message').textContent = 'Please Write An Answer'
        document.querySelector('#Overlay').classList.remove('is-hidden');
        
        document.getElementById('PopupBtn')
            .addEventListener('click', ()=>{
                document.querySelector('#Overlay').classList.add('is-hidden');
                document.querySelector('#ConfirmYes').classList.remove('is-hidden')
        })
    }
    else if(answer.length<=20){
        document.querySelector('#ConfirmYes').classList.add('is-hidden')
        document.querySelector('#PopupBtn').textContent = 'Okay'
        document.getElementById('Message').textContent = 'Please Explain More'
        document.querySelector('#Overlay').classList.remove('is-hidden');

        document.getElementById('PopupBtn')
            .addEventListener('click', ()=>{
                document.querySelector('#Overlay').classList.add('is-hidden');
                document.querySelector('#ConfirmYes').classList.remove('is-hidden')
        })
    }
    else{
        submit.classList.add('is-hidden')
        skipQuestionBtn.classList.add('is-hidden')
        queAttempted += 1;
        answerbox.addEventListener('keydown', typing)
        answerbox.addEventListener('paste', typing)
        ans = answer;
        feedback()
    }
}

submit.addEventListener('click', (e)=>{
    console.log('submit button clicked')
    
    e = document.getElementById('answerInput').value
    checkAns(e)
})

let feedbackGenerated;

async function feedback(){
    document.querySelector('#submitting').classList.remove('is-hidden')
    document.querySelector('#submitting').textContent = 'Submitting Your Answer'
    
    const prompt = `Question: ${question}
                    Student Answer: ${ans}
                    You are an experienced ${selectedTrack} professional. Act like a mentor. And give to the point answer.
                    Evaluate this answer and return ONLY a JSON object with:
                    - good: array of what was good, 3 elements only
                    - missing: array of what was missing, 3 elements only
                    - ideal: string with the ideal answer summary`
    try {
        const response = await fetch("/api/generate", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ prompt })
});
        const data = await response.json()

        const raw = data.candidates[0].content.parts[0].text
        const cleanText = raw.replace(/```json|```/gi, '').trim()
        const parsedText = JSON.parse(cleanText)
  

        document.querySelector('#submitting').classList.add('is-hidden')
        document.getElementById('feedback').classList.remove('is-hidden');

        // Good Answer
    
        const goodAns = document.querySelector('#good')
        const goodArr = parsedText["good"]
        console.log(goodArr)

       goodArr.forEach(element => {
            const li =  document.createElement('li')
            console.log(li)
            li.textContent = element
            console.log(li)
            goodAns.appendChild(li)
       });

       //Missing Answer

       const missAns = document.querySelector('#miss')
       const missArr = parsedText["missing"]

       missArr.forEach(element => {
            const li =  document.createElement('li')
            li.textContent = element
            missAns.appendChild(li)
       });
    
       //Ideal Answer

        document.querySelector('#Ideal').textContent = parsedText["ideal"]

        feedbackGenerated = true;
        sessionData.push({
            'question' : question,
            'answer' : ans,
            'good' : parsedText["good"],
            'missing' : parsedText["missing"],
            'ideal' : parsedText["ideal"]
        })
        
       nextBtn.classList.remove('is-hidden')
       retryBtn.classList.remove('is-hidden')

    } catch (error) {

        if(queGenerated){
            document.querySelector('#submitting').classList.add('is-hidden')
            document.querySelector('#offlineAns').classList.remove('is-hidden')
            document.querySelector('#offlineAns').textContent = 'Error generating the feedback. Please move forward.'
        }
        else{
            document.querySelector('#submitting').classList.add('is-hidden')
            document.querySelector('#offlineAns').classList.remove('is-hidden')
            document.querySelector('#offlineAns').textContent = fallbackAns()
        }
        feedbackGenerated = false;
        sessionData.push({
            'question' : question,
            'answer' : ans,
            'good' : [],
            'missing' : [],
            'ideal' : document.querySelector('#offlineAns').textContent
        })
        
        nextBtn.classList.remove('is-hidden')
       retryBtn.classList.remove('is-hidden')
    }
    if(noOfQue===5){
        nextBtn.classList.add('is-hidden')
        retryBtn.classList.add('is-hidden')
        statBtn.classList.remove('is-hidden')
}
}


nextBtn.addEventListener('click',function(){
    document.querySelector('#answerInput').value = ""
    document.getElementById('feedback').classList.add('is-hidden');
    document.getElementById('offlineAns').classList.add('is-hidden');
    if(feedbackGenerated){
        document.querySelector('#good').textContent = ""
        document.querySelector('#miss').textContent = ""
        document.querySelector('#Ideal').textContent = ""
    }
    
    
    nextBtn.classList.add('is-hidden')
    retryBtn.classList.add('is-hidden')
    submit.classList.remove('is-hidden')
    skipQuestionBtn.classList.remove('is-hidden')
    submit.disabled = true;
    skipQuestionBtn.disabled = true;   

    getQuestion();
})

retryBtn.addEventListener('click', ()=>{
    document.querySelector('#answerInput').value = ""
    document.getElementById('feedback').classList.add('is-hidden');
    submit.classList.remove('is-hidden')
    skipQuestionBtn.classList.remove('is-hidden')
    document.querySelector('#offlineAns').classList.add('is-hidden')
    submit.disabled = false;
    skipQuestionBtn.disabled = false;

    nextBtn.classList.add('is-hidden')
    retryBtn.classList.add('is-hidden')
})

const completeProgress = document.querySelector('.stats-progress-bar')

function showstats(){
    console.log(sessionData)
    const statSection = document.querySelector('.stats-question-list')
    statSection.innerHTML = ''

    sessionData.forEach((item, i) => {
        const li = document.createElement('li')
        li.classList.add('stats-q-card')

        const goodSection = item.good.length === 0 ? '' : `
            <div class="stats-feedback-col stats-feedback-col--good">
                <h4 class="stats-feedback-heading">Good</h4>
                <ul>${item.good.map(point => `<li>${point}</li>`).join('')}</ul>
            </div>
        `

        const missingSection = item.missing.length === 0 ? '' : `
            <div class="stats-feedback-col stats-feedback-col--missing">
                <h4 class="stats-feedback-heading">Missing</h4>
                <ul>${item.missing.map(point => `<li>${point}</li>`).join('')}</ul>
            </div>
        `

        li.innerHTML = `
            <div class="stats-q-head">
                <span class="stats-q-badge">Question ${i + 1}</span>
                <h3 class="stats-q-title">${item.question}</h3>
            </div>
            <div class="stats-q-block">
                <h4 class="stats-q-block-title">Your answer</h4>
                <p class="stats-q-answer">${item.answer}</p>
            </div>
            <div class="stats-q-feedback">
                ${goodSection}
                ${missingSection}
                <div class="stats-feedback-col stats-feedback-col--ideal">
                    <h4 class="stats-feedback-heading">Ideal answer</h4>
                    <p>${item.ideal}</p>
                </div>
            </div>
        `

        statSection.appendChild(li)
    })
}

statBtn.addEventListener('click', () => {
    document.querySelector('#noOfQuestions').textContent = `${queAttempted}`
    console.log(queAttempted)
    document.querySelector('#yourTrack').textContent = `${selectedTrack || ''}`
    const currentSessionProgress = (queAttempted / noOfQue) * 100 
    document.querySelector('#yourProgress').textContent = `${Math.floor(currentSessionProgress)}%`
    completeProgress.style.width = `${currentSessionProgress}%`

    showstats()
    InterviewSection.classList.add('is-hidden')
    statsPanel.style.display = 'block'
})

statsBackLink.addEventListener('click', () => {
    location.reload()
})





