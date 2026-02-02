/**
 * Readiness Pulse – step flow, slider, submit.
 * Expects READINESS_CHECK_CONFIG.SUBMIT_ENDPOINT in config.js.
 */
(function () {
  var DIMENSION_IDS = ['incomeFlexibility', 'timeAutonomy', 'skillLeverage', 'riskTolerance', 'missionAlignment'];

  var QUESTIONS = [
    { dimension: 'incomeFlexibility', qIndex: 0, text: 'I could adjust my spending for 6–12 months to pursue something new without jeopardizing my family’s security.' },
    { dimension: 'incomeFlexibility', qIndex: 1, text: 'I have some savings or flexibility that would allow me to invest time or money in a side path.' },
    { dimension: 'incomeFlexibility', qIndex: 2, text: 'My household could tolerate a temporary dip in income if it meant building toward something I believe in.' },
    { dimension: 'timeAutonomy', qIndex: 0, text: 'I have at least 5–10 hours per week I could redirect toward something new without harming my current commitments.' },
    { dimension: 'timeAutonomy', qIndex: 1, text: 'I have some control over when and where I work (schedule, location, or both).' },
    { dimension: 'timeAutonomy', qIndex: 2, text: 'I could protect a few hours each week for learning or building something alongside my current role.' },
    { dimension: 'skillLeverage', qIndex: 0, text: 'My skills could create value in more than one context (e.g. my employer and a side project or community).' },
    { dimension: 'skillLeverage', qIndex: 1, text: 'I have experience or expertise that others would pay for or benefit from outside my current job.' },
    { dimension: 'skillLeverage', qIndex: 2, text: 'I’m curious about ways to use what I already know in new settings rather than starting from zero.' },
    { dimension: 'riskTolerance', qIndex: 0, text: 'I’m open to building something alongside my current role rather than an all-or-nothing leap.' },
    { dimension: 'riskTolerance', qIndex: 1, text: 'I’m willing to try something new even if it might not work out.' },
    { dimension: 'riskTolerance', qIndex: 2, text: 'I prefer exploring options and optionality over waiting for a single “perfect” moment.' },
    { dimension: 'missionAlignment', qIndex: 0, text: 'I think about impact and optionality even when my current situation is generally fine.' },
    { dimension: 'missionAlignment', qIndex: 1, text: 'I sometimes wonder whether there’s more I could do with my skills and time.' },
    { dimension: 'missionAlignment', qIndex: 2, text: 'I’m drawn to the idea of building something that matters to me, not just earning a paycheck.' }
  ];

  var TOTAL_PULSES = QUESTIONS.length;
  var currentStep = 0;
  var currentPulseIndex = 0;

  var flow = document.getElementById('pulse-flow');
  var payloadForm = document.getElementById('payload-form');
  var pulseStatement = document.getElementById('pulse-statement');
  var pulseSlider = document.getElementById('pulse-slider');
  var pulseProgressText = document.getElementById('pulse-progress-text');
  var pulseProgressFill = document.getElementById('pulse-progress-fill');

  function getConfig() {
    return (typeof READINESS_CHECK_CONFIG !== 'undefined' && READINESS_CHECK_CONFIG) ? READINESS_CHECK_CONFIG : {};
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

  function getRadioValue(dimension, qIndex) {
    var name = dimension + '_' + qIndex;
    var checked = payloadForm ? payloadForm.querySelector('input[name="' + name + '"]:checked') : null;
    return checked ? parseInt(checked.value, 10) : null;
  }

  function setRadioValue(dimension, qIndex, value) {
    var name = dimension + '_' + qIndex;
    var input = payloadForm ? payloadForm.querySelector('input[name="' + name + '"][value="' + value + '"]') : null;
    if (input) input.checked = true;
  }

  function renderPulse() {
    var q = QUESTIONS[currentPulseIndex];
    if (pulseStatement) pulseStatement.textContent = q.text;
    var val = getRadioValue(q.dimension, q.qIndex);
    if (pulseSlider) {
      pulseSlider.value = val !== null ? val : 3;
    }
    if (pulseProgressText) pulseProgressText.textContent = (currentPulseIndex + 1) + ' of ' + TOTAL_PULSES;
    var pct = ((currentPulseIndex + 1) / TOTAL_PULSES) * 100;
    if (pulseProgressFill) pulseProgressFill.style.width = pct + '%';
  }

  function goToStep(stepIndex) {
    if (stepIndex === 2) {
      currentPulseIndex = 0;
      renderPulse();
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

  function getDimensionScores() {
    var dimensions = {};
    DIMENSION_IDS.forEach(function (dimId) {
      var sum = 0, count = 0;
      for (var qi = 0; qi < 3; qi++) {
        var v = getRadioValue(dimId, qi);
        if (v !== null) { sum += v; count++; }
      }
      dimensions[dimId] = count > 0 ? Math.round((sum / count) * 10) / 10 : 0;
    });
    return dimensions;
  }

  function getTotalScore(dimensions) {
    var total = 0;
    DIMENSION_IDS.forEach(function (dimId) { total += dimensions[dimId] || 0; });
    return Math.round(total * 10) / 10;
  }

  function buildPayload() {
    var name = document.getElementById('name');
    var email = document.getElementById('email');
    var phone = document.getElementById('phone');
    var dimensions = getDimensionScores();
    var totalScore = getTotalScore(dimensions);
    return {
      name: (name && name.value) ? name.value.trim() : '',
      email: (email && email.value) ? email.value.trim() : '',
      phone: (phone && phone.value) ? phone.value.trim() : '',
      dimensions: dimensions,
      totalScore: totalScore
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

  // Begin
  var btnBegin = document.getElementById('btn-begin');
  if (btnBegin) btnBegin.addEventListener('click', function () { goToStep(1); });

  // Lead next
  var btnLeadNext = document.getElementById('btn-lead-next');
  if (btnLeadNext) btnLeadNext.addEventListener('click', function () {
    if (!validateLead()) return;
    goToStep(2);
  });

  // Slider sync
  if (pulseSlider) {
    pulseSlider.addEventListener('input', function () {
      var q = QUESTIONS[currentPulseIndex];
      if (q) setRadioValue(q.dimension, q.qIndex, parseInt(pulseSlider.value, 10));
    });
  }

  // Pulse next
  var btnPulseNext = document.getElementById('btn-pulse-next');
  if (btnPulseNext) btnPulseNext.addEventListener('click', function () {
    var q = QUESTIONS[currentPulseIndex];
    if (q) setRadioValue(q.dimension, q.qIndex, parseInt(pulseSlider.value, 10));
    if (currentPulseIndex < TOTAL_PULSES - 1) {
      currentPulseIndex++;
      renderPulse();
    } else {
      showStep(3);
    }
  });

  // Pulse back
  var btnPulseBack = document.getElementById('btn-pulse-back');
  if (btnPulseBack) btnPulseBack.addEventListener('click', function () {
    if (currentPulseIndex > 0) {
      currentPulseIndex--;
      renderPulse();
    } else {
      goToStep(1);
    }
  });

  // Submit
  var btnSubmit = document.getElementById('btn-submit');
  if (btnSubmit) btnSubmit.addEventListener('click', submitPayload);

  showStep(0);
})();
