const title = document.querySelector('.menu-title');
const items = [...document.querySelectorAll('.item')];

const animated = title ? [title, ...items] : items;

animated.forEach((el, i) => setTimeout(() => el.classList.add('show'), i * 300));

items.forEach(item => {

    const link = item.querySelector('.photo');

    link.addEventListener('click', (e) => {

        e.preventDefault();

        const href = link.getAttribute('href');

        animated.forEach((el, i) => {
            setTimeout(() => el.classList.add('hide'), i * 300);
        });

        const totalDelay = 2500 + (animated.length - 1) * 300;

        setTimeout(() => {
            window.location.href = href;
        }, totalDelay);

    });

});