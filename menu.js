function initComicZoom(){

    document.querySelectorAll('.comic-grid img').forEach(img => {

        img.addEventListener('click', () => {

            const wasZoomed = img.classList.contains('zoomed');

            document.querySelectorAll('.comic-grid img.zoomed').forEach(el => {
                el.classList.remove('zoomed');
            });

            if(!wasZoomed){
                img.classList.add('zoomed');
            }

        });

    });

}

const sections = [
    { name:"MAIN MENU", shortName:"MENU", href:"index.html", full:true },
    { name:"COMIC", shortName:"COMIC", href:"comic.html" },
    { name:"SOFTWARE JOBS", shortName:"JOBS", href:"jobs.html" },
    { name:"ORGANIZATION CHART", shortName:"CHART", href:"chart.html" },
    { name:"BONUS TRACK: QUIZ", shortName:"QUIZ", href:"quiz.html" },
    { name:"PROJECT CREDITS", shortName:"CREDITS", href:"credits.html" }
];

const secondarySections = [
    { name:"ZERO & FIRST CONDITIONAL", shortName:"COND", href:"conditionals.html" },
    null, null, null, null
];

let currentPage = location.pathname.split('/').pop();

function isMobile(){
    return window.matchMedia('(max-width:768px)').matches;
}

function makeFlag(item){

    const div = document.createElement('div');

    if(!item){
        div.className = 'item item-empty';
        return div;
    }

    div.className = 'item';

    const a = document.createElement('a');
    a.className = 'flag';
    if(item.href === currentPage) a.classList.add('active');
    a.href = item.href;
    a.dataset.href = item.href;
    a.dataset.full = item.full ? "true" : "false";

    a.innerHTML = `
        <svg viewBox="0 0 420 110" preserveAspectRatio="none">
            <polygon class="flag-shape" points="0,0 385,0 420,55 385,110 0,110"/>
        </svg>
        <span>${isMobile() ? item.shortName : item.name}</span>
    `;

    a.addEventListener('click', (e) => {
        e.preventDefault();
        handleClick(item.href, item.full);
    });

    div.appendChild(a);
    return div;

}

function buildMenu(){

    const menu = document.getElementById('menu');
    menu.innerHTML = '';

    if(isMobile()){

        const pages = document.createElement('div');
        pages.className = 'menu-pages';
        pages.id = 'flag-pages';

        const page1 = document.createElement('div');
        page1.className = 'menu-page';
        sections.forEach(item => page1.appendChild(makeFlag(item)));

        const page2 = document.createElement('div');
        page2.className = 'menu-page';
        secondarySections.forEach(item => page2.appendChild(makeFlag(item)));

        pages.appendChild(page1);
        pages.appendChild(page2);
        menu.appendChild(pages);

        setupSwipe(menu, pages);

    } else {

        const list = sections.filter(item => item.href !== currentPage);
        list.forEach(item => menu.appendChild(makeFlag(item)));

    }

    const allItems = [...menu.querySelectorAll('.item')];

    allItems.forEach((el, i) => setTimeout(() => el.classList.add('show'), i * 70));

    setTimeout(() => {
        document.querySelector('.content').classList.add('show');
    }, allItems.length * 70);

    initComicZoom();

}

function setupSwipe(menu, pages){

    let startX = 0;
    let currentPageIndex = 0;

    menu.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    menu.addEventListener('touchend', (e) => {

        const endX = e.changedTouches[0].clientX;
        const diff = endX - startX;

        if(Math.abs(diff) < 40) return;

        if(diff < 0 && currentPageIndex === 0){
            currentPageIndex = 1;
        } else if(diff > 0 && currentPageIndex === 1){
            currentPageIndex = 0;
        }

        pages.style.transform = `translateX(-${currentPageIndex * 50}%)`;

    });

}

function handleClick(href, full){

    if(href === currentPage) return;

    if(full || !isMobile()){
        fullNavigate(href);
    } else {
        spaSwap(href);
    }

}

function fullNavigate(href){

    const menuItems = [...document.querySelectorAll('#menu .item')];
    const content = document.querySelector('.content');

    menuItems.forEach((el, i) => {
        setTimeout(() => el.classList.add('hide'), i * 70);
    });

    content.classList.add('hide');

    const totalDelay = 500 + (menuItems.length - 1) * 70;

    setTimeout(() => {
        window.location.href = href;
    }, totalDelay);

}

function updateActiveFlag(){

    document.querySelectorAll('#menu .flag').forEach(a => {
        a.classList.toggle('active', a.dataset.href === currentPage);
    });

}

async function spaSwap(href){

    const content = document.querySelector('.content');

    content.classList.remove('show');
    content.classList.add('hide');

    try {

        const res = await fetch(href);
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const newContent = doc.querySelector('.content');
        const newStyleHref = doc.querySelector('#page-style').getAttribute('href');

        setTimeout(async () => {

            const currentLink = document.querySelector('#page-style');

            if(currentLink.getAttribute('href') !== newStyleHref){

                await new Promise((resolve) => {
                    const newLink = document.createElement('link');
                    newLink.id = 'page-style';
                    newLink.rel = 'stylesheet';
                    newLink.href = newStyleHref;
                    newLink.onload = () => {
                        currentLink.remove();
                        resolve();
                    };
                    document.head.appendChild(newLink);
                });

            }

            content.innerHTML = newContent.innerHTML;
            content.scrollTop = 0;
            window.scrollTo(0, 0);

            setTimeout(() => {
                window.scrollTo(0, 0);
                content.scrollTop = 0;
            }, 100);

            currentPage = href;
            history.pushState(null, '', href);
            document.title = doc.title;

            updateActiveFlag();
            initComicZoom();

            if(href === 'quiz.html'){
                await loadQuizScript();
            }

            content.classList.remove('hide');
            void content.offsetWidth;
            content.classList.add('show');

        }, 500);

    } catch(err){
        console.error('Error cargando la sección:', err);
        window.location.href = href;
    }

}

function loadQuizScript(){

    return new Promise((resolve) => {

        if(typeof window.initQuiz === 'function'){
            window.initQuiz();
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'quiz.js';
        script.onload = () => {
            window.initQuiz();
            resolve();
        };
        document.body.appendChild(script);

    });

}

buildMenu();