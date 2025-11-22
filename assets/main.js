// Simple script to highlight the current post link in navigation (if needed)
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        if (window.location.pathname.endsWith(link.getAttribute('href'))) {
            link.style.fontWeight = 'bold';
            link.style.textDecoration = 'none';
        }
    });
});

// Reading progress bar, likes and simple gamification
document.addEventListener('DOMContentLoaded', () => {
    // Points counter in header
    const pointsEl = document.getElementById('points-count');
    function readPoints(){
        return Number(localStorage.getItem('site_points') || 0);
    }
    function setPoints(n){
        localStorage.setItem('site_points', String(n));
        if(pointsEl) pointsEl.textContent = n;
    }
    if(pointsEl) pointsEl.textContent = readPoints();

    // Like buttons
    document.querySelectorAll('.like-btn').forEach(btn=>{
        const id = btn.dataset.id;
        const key = 'like_'+id;
        const countEl = btn.querySelector('.like-count');
        let count = Number(localStorage.getItem(key) || 0);
        if(countEl) countEl.textContent = count;
        btn.addEventListener('click', ()=>{
            count += 1;
            localStorage.setItem(key, String(count));
            if(countEl) countEl.textContent = count;
            animateConfetti(btn);
        });
    });

    // Mark as read -> award points
    document.querySelectorAll('.mark-read').forEach(btn=>{
        btn.addEventListener('click', ()=>{
            const already = btn.dataset.done === '1';
            if(already) return;
            const pts = 5; // reward
            const newPoints = readPoints() + pts;
            setPoints(newPoints);
            btn.dataset.done = '1';
            btn.textContent = 'Leído ✓ (+'+pts+')';
            btn.classList.add('done');
            animateConfetti(btn);
        });
    });

    // Scroll reading progress for article pages
    const progress = document.getElementById('reading-progress');
    if(progress){
        window.addEventListener('scroll', ()=>{
            const article = document.querySelector('article');
            if(!article) return;
            const height = article.scrollHeight - window.innerHeight;
            const scrolled = Math.min(Math.max(window.scrollY - (article.offsetTop - 20),0), height);
            const pct = height>0 ? (scrolled/height)*100 : 0;
            progress.style.width = pct + '%';
            // small reward when reaching bottom
            if(pct>98 && !localStorage.getItem('reward_'+location.pathname)){
                const bonus = 10;
                setPoints(readPoints()+bonus);
                localStorage.setItem('reward_'+location.pathname,'1');
                // flash
                progress.classList.add('flash');
                setTimeout(()=>progress.classList.remove('flash'),1200);
            }
        }, {passive:true});
    }

    // Confetti animation (simple colored squares)
    function animateConfetti(target){
        const colors = ['#6a11cb','#2575fc','#ff6b6b','#ffd36b','#7bffb2'];
        for(let i=0;i<16;i++){
            const el = document.createElement('span');
            el.className = 'confetti';
            el.style.left = (Math.random()*100)+'%';
            el.style.background = colors[Math.floor(Math.random()*colors.length)];
            el.style.transform = 'translateY(0) rotate('+ (Math.random()*360) +'deg)';
            const rect = target.getBoundingClientRect();
            el.style.top = (rect.top + window.scrollY - 20) + 'px';
            document.body.appendChild(el);
            setTimeout(()=> el.style.transform = 'translateY(180px) rotate('+ (Math.random()*720) +'deg)', 20);
            setTimeout(()=> el.remove(), 1600 + Math.random()*400);
        }
    }
});
