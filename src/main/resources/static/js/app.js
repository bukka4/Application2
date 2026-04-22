/* ════════════════════════════════════════════════════════
   app.js
   All JavaScript for the Kannaya Birthday Surprise
   Sections:
   1.  Petal Canvas (floating rose petals background)
   2.  Page Navigation (switching between screens)
   3.  Page 0 — Secret Code Unlock
   4.  Page 1 — Kiss Animation
   5.  Page 2 — Confetti
   6.  Page 3 — Kidnap Game
   7.  Page 4 — Love Letter Typewriter
   8.  Page 5 — Flip Cards (touch support)
   9.  Page 6 — Couples Quiz
   10. Page 6.5 — Bunny Final Unlock
   11. Page 7 — Close / Replay
════════════════════════════════════════════════════════ */


/* ══════════════════════════════════════════════════════
   1. PETAL CANVAS
   Draws floating rose petals in the background
═══════════════════════════════════════════════════════ */

const canvas  = document.getElementById('petal-canvas');
const ctx     = canvas.getContext('2d');
let   petals  = [];

// Make canvas fill the whole window
function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Create one petal object
function createPetal() {
    return {
        x:     Math.random() * canvas.width,    // random horizontal start
        y:     canvas.height + 20,              // start below screen
        r:     Math.random() * 13 + 5,          // petal size
        speed: Math.random() * 0.55 + 0.2,      // falling speed
        drift: (Math.random() - 0.5) * 0.38,    // left/right sway
        rot:   Math.random() * Math.PI * 2,     // rotation angle
        rotSpeed: (Math.random() - 0.5) * 0.022,// rotation speed
        opacity:  Math.random() * 0.22 + 0.05, // transparency
        hue:      338 + Math.random() * 22      // pink colour range
    };
}

// Draw one petal on the canvas
function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle   = `hsl(${p.hue}, 60%, 60%)`;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.r * 0.52, p.r, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

// Animation loop — runs 60 times per second
(function petalLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Add a new petal occasionally (max 28 on screen)
    if (petals.length < 28 && Math.random() < 0.036) {
        petals.push(createPetal());
    }

    // Remove petals that floated off the top
    petals = petals.filter(p => p.y > -30);

    // Move and draw each petal
    petals.forEach(p => {
        p.y   -= p.speed;
        p.x   += p.drift;
        p.rot += p.rotSpeed;
        drawPetal(p);
    });

    requestAnimationFrame(petalLoop);
})();


/* ══════════════════════════════════════════════════════
   2. PAGE NAVIGATION
   Shows / hides pages and triggers page-specific actions
═══════════════════════════════════════════════════════ */

function goToPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // Show the target page
    document.getElementById(pageId).classList.add('active');

    // Scroll to top
    window.scrollTo(0, 0);

    // Trigger special effects for certain pages
    if (pageId === 'page-kiss')   initKissAnimation();
    if (pageId === 'page-hero')   spawnConfetti();
    if (pageId === 'page-letter') startTypewriter();
}


/* ══════════════════════════════════════════════════════
   3. PAGE 0 — SECRET CODE UNLOCK
   4 individual number boxes. Correct code goes to kiss page.
   Change SECRET_CODE below to match his birthday 
═══════════════════════════════════════════════════════ */

// This will hold the secret code fetched from the server
let SECRET_CODE = null;
 
// Fetch the secret code from Spring Boot when page loads
fetch('/api/secret-code')
    .then(function(response) { return response.text(); })
    .then(function(code) {
        // Remove any quotes Spring Boot may add around the string
        SECRET_CODE = code.replace(/"/g, '').trim();
    })
    .catch(function() {
        console.error('Could not load secret code from server.');
    });
 
// Move focus to next box after typing a digit
const codeBoxes = document.querySelectorAll('.code-box');
codeBoxes.forEach(function(box, index) {
 
    box.addEventListener('input', function() {
        // Allow only one digit
        box.value = box.value.replace(/\D/g, '').slice(-1);
        // Jump to next box automatically
        if (box.value && index < codeBoxes.length - 1) {
            codeBoxes[index + 1].focus();
        }
    });
 
    box.addEventListener('keydown', function(e) {
        // Backspace goes to previous box
        if (e.key === 'Backspace' && !box.value && index > 0) {
            codeBoxes[index - 1].focus();
        }
        // Press Enter on last box to submit
        if (e.key === 'Enter' && index === codeBoxes.length - 1) {
            checkSecretCode();
        }
    });
 
});
 
function checkSecretCode() {
    const entered = [...codeBoxes].map(function(b) { return b.value; }).join('');
    const errorEl = document.getElementById('code-error');
 
    if (!SECRET_CODE) {
        errorEl.textContent = 'Still loading… please try again in a moment 💕';
        setTimeout(function() { errorEl.textContent = ''; }, 2000);
        return;
    }
 
    if (entered === SECRET_CODE) {
        // Correct! Go to kiss animation
        goToPage('page-kiss');
    } else {
        // Wrong — show error and clear boxes
        errorEl.textContent = 'Hmm, that\'s not right! Try again 💕';
        setTimeout(function() { errorEl.textContent = ''; }, 2500);
        codeBoxes.forEach(function(b) { b.value = ''; });
        codeBoxes[0].focus();
    }
}
 

/* ══════════════════════════════════════════════════════
   4. PAGE 1 — KISS ANIMATION
   Girl cartoon slides in from left and kisses boy's cheek
═══════════════════════════════════════════════════════ */

function initKissAnimation() {
    const girl    = document.getElementById('char-girl-kiss');
    const hearts  = document.getElementById('cheek-hearts');
    const msg     = document.getElementById('kiss-msg');
    const sub     = document.getElementById('kiss-sub');
    const btnWrap = document.getElementById('kiss-btn-wrap');

    // Reset everything (in case user replays)
    girl.classList.remove('walk-in');
    hearts.classList.remove('show');
    msg.classList.remove('show');
    sub.classList.remove('show');
    btnWrap.classList.remove('show');

    // Step 1: Girl walks in after 300ms
    setTimeout(() => girl.classList.add('walk-in'), 300);

    // Step 2: Hearts pop up after 2 seconds
    setTimeout(() => hearts.classList.add('show'), 2000);

    // Step 3: Caption text fades in
    setTimeout(() => msg.classList.add('show'), 2500);
    setTimeout(() => sub.classList.add('show'), 2900);

    // Step 4: Button appears
    setTimeout(() => btnWrap.classList.add('show'), 3500);
}


/* ══════════════════════════════════════════════════════
   5. PAGE 2 — CONFETTI
   Colourful pieces rain down on the birthday hero page
═══════════════════════════════════════════════════════ */

function spawnConfetti() {
    const wrap = document.getElementById('confetti-wrap');
    if (!wrap) return;
    wrap.innerHTML = '';  // clear old confetti

    const colours = ['#e8728f', '#d4a84b', '#f0c97a', '#c9446a', '#ffffff', '#a78bfa'];

    for (let i = 0; i < 55; i++) {
        const piece = document.createElement('div');
        piece.className = 'conf';
        piece.style.cssText = `
            left:             ${Math.random() * 100}%;
            background:       ${colours[Math.floor(Math.random() * colours.length)]};
            animation-duration:  ${2 + Math.random() * 3}s;
            animation-delay:     ${Math.random() * 2}s;
            transform:        rotate(${Math.random() * 360}deg);
            border-radius:    ${Math.random() > 0.5 ? '50%' : '2px'};
        `;
        wrap.appendChild(piece);
    }
}


/* ══════════════════════════════════════════════════════
   6. PAGE 3 — KIDNAP GAME
   "No" button runs away when you try to hover/tap it!
═══════════════════════════════════════════════════════ */

let noButtonMoves = 0;  // count how many times No has moved

function runNoButtonAway() {
    const btn = document.getElementById('btn-no');
    noButtonMoves++;

    // Move in a random direction each time
    const moveX = (Math.random() * 120) - 60;
    const moveY = noButtonMoves % 2 === 0 ? -55 : 55;

    btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
    // Slowly fade out
    btn.style.opacity = Math.max(0.08, 1 - noButtonMoves * 0.13);
}

function onClickYes() {
    // Hide buttons, show yes message
    document.getElementById('kidnap-btns').style.display = 'none';
    document.getElementById('kidnap-yes-msg').style.display = 'block';

    // Show "Next" button after 1.2 seconds
    setTimeout(() => {
        document.getElementById('kidnap-next').style.display = 'block';
    }, 1200);
}


/* ══════════════════════════════════════════════════════
   7. PAGE 4 — LOVE LETTER TYPEWRITER
   Types the letter one character at a time
═══════════════════════════════════════════════════════ */

// The love letter text — edit this!
const LOVE_LETTER = `I may not always find the perfect words, but on your birthday I want you to know — I love you always, no matter how hard life gets.

You are my calm, my laughter, my favourite person. The way you care quietly, the way you make me feel safe — it is everything to me, Kannaya.As days passing our relationship is becoming stronger Kannaya.

Happy Birthday, Sravan Kumar. May this year be as beautiful as the joy you bring into my life every single day. 💕
Edo chinnaga try chesa Kannaya....`;


let typewriterTimer = null;

function startTypewriter() {
    const letterBody = document.getElementById('letter-body');
    const signature  = document.getElementById('letter-sig');
    const nextBtn    = document.getElementById('letter-next');

    // Clear any previous timer
    if (typewriterTimer) clearTimeout(typewriterTimer);

    // Reset
    letterBody.innerHTML = '<span class="cursor-blink"></span>';
    signature.style.display = 'none';
    nextBtn.style.display   = 'none';

    let charIndex = 0;
    const cursor  = letterBody.querySelector('.cursor-blink');

    function typeNextChar() {
        if (charIndex < LOVE_LETTER.length) {
            const ch = LOVE_LETTER[charIndex];

            if (ch === '\n') {
                // New paragraph = <br> tag
                letterBody.insertBefore(document.createElement('br'), cursor);
            } else {
                // Normal character
                letterBody.insertBefore(document.createTextNode(ch), cursor);
            }

            charIndex++;

            // Pause longer on punctuation for dramatic effect
            const delay = (ch === '.' || ch === '!' || ch === ',') ? 60 : 30;
            typewriterTimer = setTimeout(typeNextChar, delay);

        } else {
            // Typing finished — show signature and next button
            signature.style.display = 'block';
            setTimeout(() => { nextBtn.style.display = 'block'; }, 700);
        }
    }

    // Short pause before starting
    setTimeout(typeNextChar, 500);
}


/* ══════════════════════════════════════════════════════
   8. PAGE 5 — FLIP CARDS
   Hover flips on desktop. Click/tap flips on mobile.
═══════════════════════════════════════════════════════ */

// Add click-to-flip for touch screens
document.querySelectorAll('.flip-item').forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
    });
});


/* ══════════════════════════════════════════════════════
   //9. PAGE 6 — COUPLES QUIZ
  // ALL questions come ONLY from Spring Boot API (/api/quiz)
   //Edit questions in BirthdayController.java — changes
   //will reflect here immediately on next page load.
═══════════════════════════════════════════════════════ */
 
// Questions are loaded from the server — DO NOT hardcode here
let quizQuestions    = [];
let currentQuestion  = 0;
let score            = 0;
let questionAnswered = false;
 
// ── Load questions from Spring Boot API ──────────────
// This runs when the page first loads.
// Always fetches fresh from BirthdayController.java
function loadQuizFromServer() {
    // Show a loading message while waiting for the server
    document.getElementById('question-text').textContent = 'Loading questions…';
    document.getElementById('options-grid').innerHTML    = '';
 
    fetch('/api/quiz')
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Server returned: ' + response.status);
            }
            return response.json();
        })
        .then(function(data) {
            // Map server field names to our local names
            // Server sends: question, options, answer, funFact
            quizQuestions = data.map(function(q) {
                return {
                    question: q.question,
                    options:  q.options,
                    answer:   q.answer,
                    funFact:  q.funFact
                };
            });
            // Now render the first question
            renderQuestion();
        })
        .catch(function(error) {
            // Server is not reachable — show a clear error
            document.getElementById('question-text').textContent =
                '⚠️ Could not load questions. Make sure Spring Boot is running!';
            console.error('Quiz API error:', error);
        });
}
 
// Call this once when page loads
loadQuizFromServer();
 
// Display the current question
function renderQuestion() {
    questionAnswered = false;
    const q = quizQuestions[currentQuestion];
 
    // Update progress bar
    const pct = (currentQuestion / quizQuestions.length) * 100;
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('progress-label').textContent =
        `${currentQuestion + 1} / ${quizQuestions.length}`;
 
    // Set question text
    document.getElementById('question-text').textContent = q.question;
 
    // Clear feedback and hide Next button
    const feedback = document.getElementById('quiz-feedback');
    feedback.className = 'quiz-feedback';
    feedback.textContent = '';
    document.getElementById('quiz-next').className = 'quiz-next';
 
    // Build option buttons
    const optGrid = document.getElementById('options-grid');
    optGrid.innerHTML = q.options.map((opt, i) =>
        `<button class="option-btn" onclick="selectAnswer(${i})">${opt}</button>`
    ).join('');
}
 
// Called when user clicks an answer
function selectAnswer(chosenIndex) {
    if (questionAnswered) return;   // prevent double-clicking
    questionAnswered = true;
 
    const q       = quizQuestions[currentQuestion];
    const buttons = document.querySelectorAll('.option-btn');
 
    // Disable all buttons
    buttons.forEach(b => b.disabled = true);
 
    const isCorrect = chosenIndex === q.answer;
    if (isCorrect) score++;
 
    // Highlight correct / wrong
    buttons[chosenIndex].classList.add(isCorrect ? 'correct' : 'wrong');
    if (!isCorrect) buttons[q.answer].classList.add('correct');
 
    // Show feedback message
    const feedback = document.getElementById('quiz-feedback');
    feedback.className = `quiz-feedback show ${isCorrect ? 'correct-fb' : 'wrong-fb'}`;
    feedback.textContent = isCorrect
        ? `✅ ${q.funFact}`
        : `❌ "${q.options[q.answer]}" — ${q.funFact}`;
 
    // Show Next button
    const nextBtn = document.getElementById('quiz-next');
    nextBtn.className = 'quiz-next show';
    document.getElementById('quiz-next-btn').textContent =
        currentQuestion === quizQuestions.length - 1 ? 'See Results 🎂' : 'Next →';
}
 
// Go to next question or show results
function goToNextQuestion() {
    currentQuestion++;
    if (currentQuestion >= quizQuestions.length) {
        showQuizResult();
    } else {
        renderQuestion();
    }
}
 
// Show final score
function showQuizResult() {
    document.getElementById('quiz-area').style.display   = 'none';
    document.getElementById('quiz-result').className     = 'quiz-result show';
    document.getElementById('score-number').textContent  = score;
 
    const resultMessages = [
        "We have so many more stories to make 🌸",
        "Getting warmer! I love you all the same 💛",
        "Pretty wonderful — just like you 🌹",
        "You know my heart so well 💕",
        "Perfect! You are my person, Kannaya ❤️🎉"
    ];
    document.getElementById('result-msg').textContent =
        resultMessages[Math.min(score, resultMessages.length - 1)];
}
 
// Restart quiz from question 1
function restartQuiz() {
    currentQuestion  = 0;
    score            = 0;
    document.getElementById('quiz-result').className    = 'quiz-result';
    document.getElementById('quiz-area').style.display  = 'block';
    loadQuizFromServer();   // always reload fresh from server
}


/* ══════════════════════════════════════════════════════
   10. PAGE 6.5 — BUNNY FINAL UNLOCK
   Type the love phrase to reveal the final surprise
═══════════════════════════════════════════════════════ */

// Change this phrase to whatever you want Sravan to type!
const FINAL_PHRASE = 'type as nikithasravan';

function checkFinalPhrase() {
    const input   = document.getElementById('phrase-input');
    const errorEl = document.getElementById('phrase-error');
    const entered = input.value.trim().toLowerCase();

    if (entered === FINAL_PHRASE) {
        goToPage('page-final');
    } else {
        errorEl.textContent = 'Almost! Type the magic words 💕';
        setTimeout(() => { errorEl.textContent = ''; }, 2500);
    }
}

// Allow pressing Enter to submit
document.getElementById('phrase-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') checkFinalPhrase();
});


/* ══════════════════════════════════════════════════════
   11. PAGE 7 — CLOSE / REPLAY
═══════════════════════════════════════════════════════ */

// Reset all game states and go back to start
function replayFromStart() {
    // Clear code boxes
    document.querySelectorAll('.code-box').forEach(b => b.value = '');

    // Clear phrase inputs
    document.getElementById('phrase-input').value = '';

    // Reset kidnap game
    noButtonMoves = 0;
    document.getElementById('kidnap-btns').style.display  = 'flex';
    document.getElementById('kidnap-yes-msg').style.display = 'none';
    document.getElementById('kidnap-next').style.display   = 'none';
    const btnNo = document.getElementById('btn-no');
    btnNo.style.transform = '';
    btnNo.style.opacity   = '1';

    // Reset quiz
    currentQuestion  = 0;
    score            = 0;
    document.getElementById('quiz-result').className    = 'quiz-result';
    document.getElementById('quiz-area').style.display  = 'block';
    renderQuestion();

    // Go to start
    goToPage('page-unlock');
}

// Show a simple "closed" screen
function closeSurprise() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    const closeScreen = document.createElement('div');
    closeScreen.style.cssText = `
        position: fixed; inset: 0;
        background: #1c0d15;
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        z-index: 999; text-align: center; padding: 40px;
    `;
    closeScreen.innerHTML = `
        <div style="font-size:5rem; margin-bottom:20px">💕</div>
        <p style="font-family:'Cormorant Garamond',serif; font-size:2rem; color:#fff; margin-bottom:8px">
            Happy Birthday, Kannaya
        </p>
        <p style="font-family:'Cormorant Garamond',serif; font-style:italic;
                  color:rgba(245,236,232,0.5); font-size:1.1rem; margin-bottom:32px">
            Made with all my love, just for you 🌹
        </p>
        <button onclick="location.reload()" style="
            background: linear-gradient(135deg, #c9446a, #e8728f);
            color: #fff; border: none; border-radius: 50px;
            padding: 13px 36px; font-size: 0.82rem;
            letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer;
        ">Replay 🔄</button>
    `;
    document.body.appendChild(closeScreen);
}
