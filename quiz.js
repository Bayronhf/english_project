function initQuiz(){

    const questions = [
        {
            question:"Choose the correct sentence.",
            options:["She don't like coffee.","She doesn't likes coffee.","She doesn't like coffee.","She not like coffee."],
            correct:2
        },
        {
            question:"Which sentence is in the Present Perfect tense?",
            options:["I went to London last year.","I have visited London twice.","I am visiting London.","I visit London every year."],
            correct:1
        },
        {
            question:"What is the synonym of \"happy\"?",
            options:["Angry","Excited","Sad","Tired"],
            correct:1
        },
        {
            question:"Complete the sentence. If I _____ more time, I would learn another language.",
            options:["have","had","has","having"],
            correct:1
        },
        {
            question:"Which sentence is in the passive voice?",
            options:["The students completed the project.","The project was completed by the students.","The students are completing the project.","The students complete the project every year."],
            correct:1
        },
        {
            question:"Choose the correct reported speech. Direct speech: She said, \"I am tired.\"",
            options:["She said that she is tired.","She said that she was tired.","She said she tired.","She said that she has tired."],
            correct:1
        },
        {
            question:"Which word is correctly spelled?",
            options:["Enviroment","Environment","Environement","Envirnoment"],
            correct:1
        },
        {
            question:"What does the phrasal verb \"turn down\" mean?",
            options:["Increase the volume.","Reject or refuse.","Start a machine.","Continue working."],
            correct:1
        },
        {
            question:"Choose the correct option. By the time we arrived, the movie _____.",
            options:["starts","had started","has started","starting"],
            correct:1
        },
        {
            question:"Choose the correct sentence.",
            options:["If I will have time, I will help you.","If I have time, I will help you.","If I had time, I help you.","If I have time, I helping you."],
            correct:1
        }
    ];

    let answered = 0;
    let score = 0;

    const container = document.getElementById('quiz');
    const resultEl = document.getElementById('quiz-result');

    if(!container) return;

    container.innerHTML = '';
    if(resultEl) resultEl.textContent = '';

    questions.forEach((q, qi) => {

        const qDiv = document.createElement('div');
        qDiv.className = 'quiz-question';

        const title = document.createElement('h3');
        title.textContent = `${qi + 1}. ${q.question}`;
        qDiv.appendChild(title);

        const optsDiv = document.createElement('div');
        optsDiv.className = 'quiz-options';

        q.options.forEach((opt, oi) => {

            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.textContent = opt;

            btn.addEventListener('click', () => selectAnswer(qi, oi, btn, optsDiv));

            optsDiv.appendChild(btn);

        });

        qDiv.appendChild(optsDiv);
        container.appendChild(qDiv);

    });

    function selectAnswer(qi, oi, btn, optsDiv){

        if(optsDiv.classList.contains('answered')) return;

        optsDiv.classList.add('answered');

        const correct = questions[qi].correct;
        const buttons = optsDiv.querySelectorAll('.quiz-option');

        buttons[correct].classList.add('correct');

        if(oi !== correct){
            btn.classList.add('wrong');
        } else {
            score++;
        }

        answered++;

        if(answered === questions.length){
            resultEl.textContent = `Puntaje: ${score} / ${questions.length}`;
        }

    }

}

if(document.getElementById('quiz')){
    initQuiz();
}