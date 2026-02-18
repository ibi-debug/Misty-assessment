/**
 * The Decision Code.
 * 10 multiple-choice questions (A/B/C/D), result = one of 4 decision states.
 * Expects DECISION_CODE_CONFIG.SUBMIT_ENDPOINT in config.js.
 */
(function () {
  var RESULT_KEYS = ['pausedYes', 'overthinkingYes', 'almostYes', 'activatedYes'];
  var ANSWER_TO_RESULT = { A: 'pausedYes', B: 'overthinkingYes', C: 'almostYes', D: 'activatedYes' };

  var QUESTIONS = [
    { id: 1, text: 'An opportunity lights you up. 48 hours later, you\'re:', options: [
      { value: 'A', label: 'Still excited but haven\'t moved' },
      { value: 'B', label: 'Researching alternatives or gathering more info' },
      { value: 'C', label: 'Planning when you\'ll start' },
      { value: 'D', label: 'Already taking action' }
    ]},
    { id: 2, text: 'Right now, the biggest thing slowing your momentum is:', options: [
      { value: 'A', label: 'Fear of choosing wrong' },
      { value: 'B', label: 'Feeling like you need more clarity first' },
      { value: 'C', label: 'Starting things you don\'t finish' },
      { value: 'D', label: 'Honestly? Not much—I\'m moving' }
    ]},
    { id: 3, text: 'Which statement lands hardest?', options: [
      { value: 'A', label: '"I know what I want but I\'m waiting to feel certain"' },
      { value: 'B', label: '"I keep refining the plan instead of executing it"' },
      { value: 'C', label: '"I start strong but lose steam"' },
      { value: 'D', label: '"I move even when it\'s messy"' }
    ]},
    { id: 4, text: 'After making a big decision, you typically feel:', options: [
      { value: 'A', label: 'Relief... followed by doubt' },
      { value: 'B', label: 'Mentally exhausted' },
      { value: 'C', label: 'Energized... then pulled in other directions' },
      { value: 'D', label: 'Grounded and clear' }
    ]},
    { id: 5, text: 'When something doesn\'t work right away, your instinct is to:', options: [
      { value: 'A', label: 'Question whether you made the right call' },
      { value: 'B', label: 'Reopen the decision and reconsider options' },
      { value: 'C', label: 'Delay or deprioritize the next step' },
      { value: 'D', label: 'Adjust your approach and keep going' }
    ]},
    { id: 6, text: 'Someone asks about your big goal. You:', options: [
      { value: 'A', label: 'Keep it vague or say "I\'m exploring"' },
      { value: 'B', label: 'Explain the concept but not what you\'re doing' },
      { value: 'C', label: 'Talk about your plan' },
      { value: 'D', label: 'Talk about what you\'re already building' }
    ]},
    { id: 7, text: 'How many decisions are you currently sitting on?', options: [
      { value: 'A', label: 'Too many to count' },
      { value: 'B', label: 'A few major ones' },
      { value: 'C', label: 'One that keeps coming back up' },
      { value: 'D', label: 'Very few—I decide quickly' }
    ]},
    { id: 8, text: 'Your relationship with confidence is:', options: [
      { value: 'A', label: 'I\'m capable, but I wait for the "right time"' },
      { value: 'B', label: 'I trust logic more than intuition' },
      { value: 'C', label: 'I believe in myself but hesitate anyway' },
      { value: 'D', label: 'Confidence comes from taking action' }
    ]},
    { id: 9, text: 'Which sentence hits you in the chest?', options: [
      { value: 'A', label: '"I\'m waiting until I feel ready"' },
      { value: 'B', label: '"I need to understand this better first"' },
      { value: 'C', label: '"I know what to do—I just haven\'t done it"' },
      { value: 'D', label: '"I decide, then I figure it out"' }
    ]},
    { id: 10, text: 'Finish this sentence instinctively: If I fully trusted myself, I would:', options: [
      { value: 'A', label: 'Stop waiting for permission' },
      { value: 'B', label: 'Decide faster and stop second-guessing' },
      { value: 'C', label: 'Actually follow through' },
      { value: 'D', label: 'Go all in without hesitation' }
    ]}
  ];

  var RESULT_COPY = {
    pausedYes: 'THE PAUSED YES\n"I feel the pull, but I\'m waiting for something before I claim it."\n\nYou sense what\'s next. You know the move. But you\'re waiting—for readiness, for certainty, for permission.\nHere\'s the truth: none of those come first.\n\nYou\'re not indecisive. You\'re just choosing not to choose. And that hesitation? It\'s training your brain that decisions are dangerous, that momentum requires certainty, that clarity comes before commitment.\nIt doesn\'t.\n\nThe Reframe:\nClarity doesn\'t come before the decision. The decision creates the clarity.\n\nThe Truth You Need:\nIndecision is a decision. You\'re already deciding—just not in your favor.\n\nWhat Changes Everything:\nStop waiting to "feel ready." Ready is a place you arrive at by deciding. Choose once. Then protect that choice from your doubt.',
    overthinkingYes: 'THE OVERTHINKING YES\n"If I just understood this better, then I could move."\n\nYou\'re brilliant. And your intelligence is keeping you stuck.\nYou analyze instead of execute. You research instead of commit. You mistake thinking for progress. You reopen decisions that were already made because "new information" always feels relevant.\nBut here\'s what\'s actually happening: you\'re using your mind to protect yourself from risk.\nAnd in doing so, you\'re avoiding the one thing that creates momentum: a closed decision.\n\nThe Reframe:\nInformation informs. Decisions transform.\n\nThe Truth You Need:\nYour next level isn\'t waiting on more clarity. It\'s waiting on you to stop needing it.\n\nWhat Changes Everything:\nSet a decision deadline. Gather input until that moment—then close the loop. No new data after that point. Decide with what you have. You\'ll learn more in 48 hours of action than 6 months of analysis.',
    almostYes: 'THE ALMOST YES\n"I decide emotionally—but I don\'t protect the decision."\n\nYou don\'t struggle to start. You struggle to sustain.\nYou say YES with your whole chest. Then life happens. Distractions creep in. Energy dips. And because your decision wasn\'t anchored to a structure, it evaporates.\nThis isn\'t a discipline problem. It\'s a decision architecture problem.\nYou\'re making emotional commitments without building the container that holds them. So your yeses leak. Your momentum scatters. And you end up feeling like you can\'t trust yourself—when really, you just need better scaffolding.\n\nThe Reframe:\nIntensity doesn\'t build momentum. Structure does.\n\nThe Truth You Need:\nDeciding once isn\'t enough. You have to keep deciding—and that requires systems, standards, and boundaries around your yes.\n\nWhat Changes Everything:\nAfter you decide, immediately answer: What does protecting this decision look like? Then build that. Calendar it. Communicate it. Remove competing priorities. Your decision needs a defense system.',
    activatedYes: 'THE ACTIVATED YES\n"I decide. I move. I adjust as I go."\n\nYou don\'t wait for perfect clarity. You trust action to teach you.\nYou make decisions quickly, self-correct without drama, and lead yourself with confidence. Your relationship with momentum is healthy. You know that deciding is a skill—and you\'ve built it.\nHere\'s your edge:\nYour next evolution isn\'t about motivation or discipline. It\'s about precision.\nThe more refined your decisions, the faster they compound. The clearer your standards, the less energy you waste. The sharper your focus, the bigger your impact.\n\nThe Reframe:\nGood decision-makers move fast. Great decision-makers move intentionally.\n\nThe Truth You Need:\nYou\'re already winning. Now it\'s about raising the standard of what you say YES to—and being ruthless about what you say NO to.\n\nWhat Changes Everything:\nAudit your open loops. Anything you\'re tolerating, delaying, or "sort of" doing—close it or cut it.\nYour momentum accelerates when your decisions are clean.'
  };

  var TOTAL_QUESTIONS = QUESTIONS.length;
  var currentStep = 0;
  var currentQuestionIndex = 0;

  var flow = document.getElementById('pulse-flow');
  var payloadForm = document.getElementById('payload-form');
  var pulseStatement = document.getElementById('pulse-statement');
  var pulseProgressText = document.getElementById('pulse-progress-text');
  var pulseProgressFill = document.getElementById('pulse-progress-fill');
  var pulseOptions = document.getElementById('pulse-options');
  var btnPulseNext = document.getElementById('btn-pulse-next');

  function getConfig() {
    return (typeof DECISION_CODE_CONFIG !== 'undefined' && DECISION_CODE_CONFIG) ? DECISION_CODE_CONFIG : {};
  }

  function showStep(stepIndex) {
    currentStep = stepIndex;
    var steps = flow ? flow.querySelectorAll('.step') : [];
    for (var i = 0; i < steps.length; i++) {
      steps[i].classList.remove('step-active', 'step-prev', 'step-next');
      if (i === stepIndex) steps[i].classList.add('step-active');
      else if (i < stepIndex) steps[i].classList.add('step-prev');
      else steps[i].classList.add('step-next');
    }
  }

  function getAnswer(qNum) {
    var name = 'q' + qNum;
    var checked = payloadForm ? payloadForm.querySelector('input[name="' + name + '"]:checked') : null;
    return checked ? checked.value : null;
  }

  function setAnswer(qNum, value) {
    var name = 'q' + qNum;
    var input = payloadForm ? payloadForm.querySelector('input[name="' + name + '"][value="' + value + '"]') : null;
    if (input) input.checked = true;
  }

  function renderQuestion() {
    var q = QUESTIONS[currentQuestionIndex];
    if (pulseStatement) pulseStatement.textContent = q.text;
    if (pulseProgressText) pulseProgressText.textContent = (currentQuestionIndex + 1) + ' of ' + TOTAL_QUESTIONS;
    var pct = ((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100;
    if (pulseProgressFill) pulseProgressFill.style.width = pct + '%';

    if (pulseOptions) {
      pulseOptions.innerHTML = '';
      var selected = getAnswer(q.id);
      q.options.forEach(function (opt) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pulse-option' + (selected === opt.value ? ' selected' : '');
        btn.setAttribute('data-value', opt.value);
        btn.setAttribute('aria-checked', selected === opt.value ? 'true' : 'false');
        btn.setAttribute('role', 'radio');
        btn.textContent = opt.label;
        btn.addEventListener('click', function () {
          setAnswer(q.id, opt.value);
          pulseOptions.querySelectorAll('.pulse-option').forEach(function (b) {
            b.classList.remove('selected');
            b.setAttribute('aria-checked', 'false');
          });
          btn.classList.add('selected');
          btn.setAttribute('aria-checked', 'true');
          if (btnPulseNext) btnPulseNext.disabled = false;
        });
        pulseOptions.appendChild(btn);
      });
    }
    if (btnPulseNext) btnPulseNext.disabled = !getAnswer(q.id);
  }

  function goToStep(stepIndex) {
    if (stepIndex === 2) {
      currentQuestionIndex = 0;
      renderQuestion();
    }
    showStep(stepIndex);
  }

  function validateLead() {
    var name = document.getElementById('name');
    var email = document.getElementById('email');
    var phone = document.getElementById('phone');
    var valid = true;
    function showErr(id, msg) {
      var el = document.getElementById('error-' + id);
      if (el) el.textContent = msg || '';
    }
    showErr('name', '');
    showErr('email', '');
    showErr('phone', '');
    var nameVal = (name && name.value) ? name.value.trim() : '';
    if (!nameVal) { showErr('name', 'Please enter your name.'); valid = false; }
    var emailVal = (email && email.value) ? email.value.trim() : '';
    if (!emailVal) { showErr('email', 'Please enter your email.'); valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) { showErr('email', 'Please enter a valid email.'); valid = false; }
    var phoneVal = (phone && phone.value) ? phone.value.trim() : '';
    if (!phoneVal) { showErr('phone', 'Please enter your phone number.'); valid = false; }
    return valid;
  }

  function computeResult() {
    var counts = { A: 0, B: 0, C: 0, D: 0 };
    for (var i = 1; i <= 10; i++) {
      var a = getAnswer(i);
      if (a && counts.hasOwnProperty(a)) counts[a]++;
    }
    var order = ['A', 'B', 'C', 'D'];
    var maxCount = 0;
    var winner = 'D';
    for (var j = 0; j < order.length; j++) {
      var letter = order[j];
      if (counts[letter] >= maxCount) {
        maxCount = counts[letter];
        winner = letter;
      }
    }
    var resultType = ANSWER_TO_RESULT[winner];
    return { resultType: resultType, resultCopy: RESULT_COPY[resultType] || '' };
  }

  function getAnswers() {
    var answers = {};
    for (var i = 1; i <= 10; i++) {
      var a = getAnswer(i);
      if (a) answers['q' + i] = a;
    }
    return answers;
  }

  function buildPayload() {
    var name = document.getElementById('name');
    var email = document.getElementById('email');
    var phone = document.getElementById('phone');
    var result = computeResult();
    return {
      name: (name && name.value) ? name.value.trim() : '',
      email: (email && email.value) ? email.value.trim() : '',
      phone: (phone && phone.value) ? phone.value.trim() : '',
      answers: getAnswers(),
      resultType: result.resultType,
      resultCopy: result.resultCopy
    };
  }

  function submitPayload() {
    var config = getConfig();
    var endpoint = (config.SUBMIT_ENDPOINT || '').trim();
    var errorForm = document.getElementById('error-form');
    if (!endpoint) {
      if (errorForm) errorForm.textContent = 'Results endpoint is not configured.';
      return;
    }
    var btn = document.getElementById('btn-submit');
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
    if (errorForm) errorForm.textContent = '';
    var payload = buildPayload();
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.text().then(function (t) {
          if (!res.ok) {
            var msg = t || 'Something went wrong.';
            try {
              var data = JSON.parse(t);
              if (data.error) msg = data.error;
              if (data.detail) msg = msg + ' (' + data.detail + ')';
            } catch (_) {}
            throw new Error(msg);
          }
        });
      })
      .then(function () { showStep(4); })
      .catch(function (err) {
        if (errorForm) errorForm.textContent = err.message || 'Something went wrong. Try again.';
        if (btn) { btn.disabled = false; btn.textContent = 'Send my results'; }
      });
  }

  var btnBegin = document.getElementById('btn-begin');
  if (btnBegin) btnBegin.addEventListener('click', function () { goToStep(1); });

  var btnLeadNext = document.getElementById('btn-lead-next');
  if (btnLeadNext) btnLeadNext.addEventListener('click', function () {
    if (!validateLead()) return;
    goToStep(2);
  });

  if (btnPulseNext) btnPulseNext.addEventListener('click', function () {
    var q = QUESTIONS[currentQuestionIndex];
    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      currentQuestionIndex++;
      renderQuestion();
    } else {
      showStep(3);
    }
  });

  var btnPulseBack = document.getElementById('btn-pulse-back');
  if (btnPulseBack) btnPulseBack.addEventListener('click', function () {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      renderQuestion();
    } else {
      goToStep(1);
    }
  });

  var btnSubmit = document.getElementById('btn-submit');
  if (btnSubmit) btnSubmit.addEventListener('click', submitPayload);

  showStep(0);
})();
