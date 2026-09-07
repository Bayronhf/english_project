function initQuiz(){

    const matchPairs = [
        { left:"If you heat ice,", right:"it melts." },
        { left:"If you mix red and blue,", right:"you get purple." },
        { left:"If you don't water plants,", right:"they die." },
        { left:"If the sun sets,", right:"it gets dark." },
        { left:"If you touch fire,", right:"you get burned." },
        { left:"If water reaches 0°C,", right:"it freezes." }
    ];

    const fillQuestions = [
        { text:"If you heat water to 100°C, it ___ (boil).", options:["boil","boils","boiled","will boil"], correct:1 },
        { text:"If people eat too much sugar, they ___ (gain) weight.", options:["gains","gained","gain","will gain"], correct:2 },
        { text:"If it ___ (rain), the ground gets wet.", options:["rain","rains","rained","raining"], correct:1 },
        { text:"Ice ___ (melt) if you heat it.", options:["melt","melting","melts","melted"], correct:2 },
        { text:"If you don't sleep enough, you ___ (feel) tired.", options:["feels","felt","feeling","feel"], correct:3 }
    ];

    const tfQuestions = [
        { text:"If you heat ice, it melts.", answer:true },
        { text:"If you touch fire, you got burned.", answer:false },
        { text:"If plants don't get sunlight, they die.", answer:true },
        { text:"If water freezes, it turn to ice.", answer:false },
        { text:"If people don't eat, they feel hungry.", answer:true },
        { text:"If you will mix yellow and blue, you get green.", answer:false }
    ];

    const builderSentences = [
        ["If","you","heat","ice,","it","melts."],
        ["If","water","reaches","100°C,","it","boils."],
        ["If","you","don't","water","plants,","they","die."],
        ["If","the","sun","sets,","it","gets","dark."]
    ];

    const container = document.getElementById('game-container');
    const tabs = document.querySelectorAll('.game-tab');

    if(!container) return;

    function setActiveTab(name){
        tabs.forEach(t => t.classList.toggle('active', t.dataset.game === name));
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            setActiveTab(tab.dataset.game);
            renderGame(tab.dataset.game);
        });
    });

    function renderGame(name){

        container.innerHTML = '';

        if(name === 'match') renderMatch();
        else if(name === 'fill') renderFill();
        else if(name === 'truefalse') renderTrueFalse();
        else if(name === 'builder') renderBuilder();
        else if(name === 'memory') renderMemory();

    }

    function shuffle(arr){
        return [...arr].sort(() => Math.random() - .5);
    }

    // GAME 1: MATCH
    function renderMatch(){

        const leftItems = shuffle(matchPairs.map((p,i) => ({text:p.left, id:i})));
        const rightItems = shuffle(matchPairs.map((p,i) => ({text:p.right, id:i})));

        const wrap = document.createElement('div');
        wrap.innerHTML = `
            <p style="margin-bottom:20px;color:#bfbfbf;">Click a sentence on the left, then its matching result on the right.</p>
            <div class="match-grid">
                <div class="match-col" id="match-left"></div>
                <div class="match-col" id="match-right"></div>
            </div>
            <div class="game-score" id="match-score"></div>
        `;
        container.appendChild(wrap);

        const leftCol = document.getElementById('match-left');
        const rightCol = document.getElementById('match-right');
        const scoreEl = document.getElementById('match-score');

        let selectedLeft = null;
        let matched = 0;

        leftItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'match-card';
            card.textContent = item.text;
            card.dataset.id = item.id;
            card.addEventListener('click', () => {
                if(card.classList.contains('correct')) return;
                leftCol.querySelectorAll('.match-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                selectedLeft = card;
            });
            leftCol.appendChild(card);
        });

        rightItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'match-card';
            card.textContent = item.text;
            card.dataset.id = item.id;
            card.addEventListener('click', () => {

                if(!selectedLeft || card.classList.contains('correct')) return;

                if(selectedLeft.dataset.id === card.dataset.id){
                    selectedLeft.classList.remove('selected');
                    selectedLeft.classList.add('correct');
                    card.classList.add('correct');
                    matched++;
                    scoreEl.textContent = `${matched} / ${matchPairs.length}`;
                } else {
                    card.classList.add('wrong');
                    setTimeout(() => card.classList.remove('wrong'), 400);
                }

                selectedLeft = null;

            });
            rightCol.appendChild(card);
        });

        scoreEl.textContent = `0 / ${matchPairs.length}`;

    }

    // GAME 2: FILL
    function renderFill(){

        container.innerHTML = '';

        fillQuestions.forEach((q, qi) => {

            const qDiv = document.createElement('div');
            qDiv.className = 'fill-question';

            const title = document.createElement('h3');
            title.textContent = `${qi + 1}. ${q.text}`;
            qDiv.appendChild(title);

            const optsDiv = document.createElement('div');
            optsDiv.className = 'fill-options';

            q.options.forEach((opt, oi) => {
                const btn = document.createElement('button');
                btn.className = 'fill-option';
                btn.textContent = opt;
                btn.addEventListener('click', () => {
                    if(optsDiv.classList.contains('answered')) return;
                    optsDiv.classList.add('answered');
                    optsDiv.querySelectorAll('.fill-option')[q.correct].classList.add('correct');
                    if(oi !== q.correct) btn.classList.add('wrong');
                });
                optsDiv.appendChild(btn);
            });

            qDiv.appendChild(optsDiv);
            container.appendChild(qDiv);

        });

    }

    // GAME 3: TRUE OR FALSE
    function renderTrueFalse(){

        container.innerHTML = '';

        let score = 0;

        tfQuestions.forEach((q, qi) => {

            const qDiv = document.createElement('div');
            qDiv.className = 'tf-question';

            qDiv.innerHTML = `<p>${qi + 1}. ${q.text}</p>`;

            const btnRow = document.createElement('div');
            btnRow.className = 'tf-buttons';

            ['True','False'].forEach(label => {
                const btn = document.createElement('button');
                btn.className = 'tf-btn';
                btn.textContent = label;
                btn.addEventListener('click', () => {
                    if(btnRow.classList.contains('answered')) return;
                    btnRow.classList.add('answered');
                    const isTrue = label === 'True';
                    const correct = isTrue === q.answer;
                    btn.classList.add(correct ? 'correct' : 'wrong');
                    if(!correct){
                        const correctLabel = q.answer ? 'True' : 'False';
                        [...btnRow.children].find(b => b.textContent === correctLabel).classList.add('correct');
                    }
                });
                btnRow.appendChild(btn);
            });

            qDiv.appendChild(btnRow);
            container.appendChild(qDiv);

        });

    }

    // GAME 4: BUILDER
    function renderBuilder(){

        let current = 0;

        function loadSentence(){

            container.innerHTML = '';

            const target = builderSentences[current];
            const shuffled = shuffle(target);

            const wrap = document.createElement('div');
            wrap.innerHTML = `
                <p style="margin-bottom:15px;color:#bfbfbf;">Sentence ${current + 1} of ${builderSentences.length} — click the words in the right order.</p>
                <div class="builder-sentence-area" id="sentence-area"></div>
                <div class="builder-chips" id="chips-area"></div>
                <button class="builder-btn" id="check-btn">Check</button>
                <button class="builder-btn" id="reset-btn">Reset</button>
                <div class="builder-feedback" id="builder-feedback"></div>
            `;
            container.appendChild(wrap);

            const sentenceArea = document.getElementById('sentence-area');
            const chipsArea = document.getElementById('chips-area');
            const feedback = document.getElementById('builder-feedback');

            let placedWords = [];

            function renderChips(){
                chipsArea.innerHTML = '';
                shuffled.forEach((word, i) => {
                    const chip = document.createElement('div');
                    chip.className = 'chip';
                    chip.textContent = word;
                    if(placedWords.includes(i)) chip.classList.add('placed');
                    chip.addEventListener('click', () => {
                        if(placedWords.includes(i)) return;
                        placedWords.push(i);
                        renderSentence();
                        renderChips();
                    });
                    chipsArea.appendChild(chip);
                });
            }

            function renderSentence(){
                sentenceArea.innerHTML = placedWords.map(i => shuffled[i]).join(' ');
            }

            document.getElementById('check-btn').addEventListener('click', () => {
                const built = placedWords.map(i => shuffled[i]).join(' ');
                const correct = built === target.join(' ');
                feedback.textContent = correct ? '✅ Correct!' : '❌ Not quite, try again.';
                feedback.style.color = correct ? '#4caf6b' : '#e05a5a';
            });

            document.getElementById('reset-btn').addEventListener('click', () => {
                placedWords = [];
                renderSentence();
                renderChips();
                feedback.textContent = '';
            });

            renderChips();

            if(builderSentences.length > 1){
                const nextBtn = document.createElement('button');
                nextBtn.className = 'builder-btn';
                nextBtn.textContent = 'Next Sentence →';
                nextBtn.addEventListener('click', () => {
                    current = (current + 1) % builderSentences.length;
                    loadSentence();
                });
                wrap.appendChild(nextBtn);
            }

        }

        loadSentence();

    }

    // GAME 5: MEMORY
    function renderMemory(){

        container.innerHTML = '';

        const cards = shuffle(
            matchPairs.flatMap((p, i) => [
                { text:p.left, pairId:i },
                { text:p.right, pairId:i }
            ])
        );

        const grid = document.createElement('div');
        grid.className = 'memory-grid';
        container.appendChild(grid);

        const scoreEl = document.createElement('div');
        scoreEl.className = 'game-score';
        scoreEl.textContent = `0 / ${matchPairs.length} pairs`;
        container.appendChild(scoreEl);

        let flipped = [];
        let matched = 0;
        let lock = false;

        cards.forEach((cardData, idx) => {

            const card = document.createElement('div');
            card.className = 'memory-card hidden-face';
            card.textContent = '?';
            card.dataset.idx = idx;

            card.addEventListener('click', () => {

                if(lock || card.classList.contains('matched') || flipped.includes(card)) return;

                card.classList.remove('hidden-face');
                card.textContent = cardData.text;
                flipped.push(card);

                if(flipped.length === 2){

                    lock = true;

                    const [a, b] = flipped;
                    const aData = cards[a.dataset.idx];
                    const bData = cards[b.dataset.idx];

                    if(aData.pairId === bData.pairId){
                        a.classList.add('matched');
                        b.classList.add('matched');
                        matched++;
                        scoreEl.textContent = `${matched} / ${matchPairs.length} pairs`;
                        flipped = [];
                        lock = false;
                    } else {
                        setTimeout(() => {
                            a.classList.add('hidden-face');
                            a.textContent = '?';
                            b.classList.add('hidden-face');
                            b.textContent = '?';
                            flipped = [];
                            lock = false;
                        }, 700);
                    }

                }

            });

            grid.appendChild(card);

        });

    }

    // Iniciar con el primer juego
    setActiveTab('match');
    renderGame('match');

}

if(document.getElementById('game-container')){
    initQuiz();
}