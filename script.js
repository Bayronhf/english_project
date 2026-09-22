const page1Items = [...document.querySelectorAll('#page-1 .item')];
const page2Items = [...document.querySelectorAll('#page-2 .item')];
const allMenuItems = [...page1Items, ...page2Items];

const menuPages = document.getElementById('menu-pages');
const nextBtn = document.getElementById('next-btn');
const backBtn = document.getElementById('back-btn');

page1Items.forEach((el, i) => setTimeout(() => el.classList.add('show'), i * 300));
page2Items.forEach(el => el.classList.add('show'));

allMenuItems.forEach(item => {

    const link = item.querySelector('.photo');
    if(!link) return;

    link.addEventListener('click', (e) => {

        e.preventDefault();

        const href = link.getAttribute('href');
        const isPage2 = menuPages.classList.contains('show-page-2');
        const activeItems = isPage2 ? page2Items.filter(el => el.querySelector('.photo')) : page1Items;

        activeItems.forEach((el, i) => {
            setTimeout(() => el.classList.add('hide'), i * 300);
        });

        if(isPage2){
            backBtn.classList.add('hide-btn');
        }

        const totalDelay = 2500 + (activeItems.length - 1) * 300;

        setTimeout(() => {
            window.location.href = href;
        }, totalDelay);

    });

});

nextBtn.addEventListener('click', () => {
    menuPages.classList.add('show-page-2');
    nextBtn.hidden = true;
    backBtn.hidden = false;
});

backBtn.addEventListener('click', () => {
    menuPages.classList.remove('show-page-2');
    backBtn.hidden = true;
    nextBtn.hidden = false;
});