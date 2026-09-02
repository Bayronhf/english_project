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

        if(isPage2){

            item.classList.add('hide');
            backBtn.classList.add('hide-btn');

            setTimeout(() => {
                window.location.href = href;
            }, 2500);

        } else {

            page1Items.forEach((el, i) => {
                setTimeout(() => el.classList.add('hide'), i * 300);
            });

            const totalDelay = 2500 + (page1Items.length - 1) * 300;

            setTimeout(() => {
                window.location.href = href;
            }, totalDelay);

        }

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