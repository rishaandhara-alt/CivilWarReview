const CEREBRAS_API_KEY = "csk-jwxjh3j8h6pfkrx8vcm39ejcfmx24t29nd4h56wf8hf689r8";
const CEREBRAS_API_URL = "https://api.cerebras.ai/v1/chat/completions";
const CEREBRAS_MODEL = "llama3.1-8b";

const ALL_QUESTIONS = [
  { cat: "Vocabulary", q: "Define: blockade", a: "Preventing goods or people from entering or leaving an area, especially by sea." },
  { cat: "Vocabulary", q: "Define: emancipate", a: "To set free, especially from slavery." },
  { cat: "Vocabulary", q: "Define: Rebel (Civil War context)", a: "A person from the Confederacy (South)." },
  { cat: "Vocabulary", q: "Define: Yankee (Civil War context)", a: "A person from the Union (North)." },
  { cat: "Vocabulary", q: "Define: total war", a: "War on the enemy's will to fight and ability to support an army, destroying everything of value to the enemy." },
  { cat: "Vocabulary", q: "Define: Draft Riots", a: "Violent protests in the North, especially NYC, against military conscription (the draft)." },
  { cat: "Vocabulary", q: "What does 'casualty' mean in a war context?", a: "A soldier who is killed or injured in war." },
  { cat: "Vocabulary", q: "What does 'offensive' mean in a military context?", a: "Attacking the enemy instead of defending." },
  { cat: "Key People", q: "Who was Abraham Lincoln?", a: "The 16th President of the United States who led the Union during the Civil War." },
  { cat: "Key People", q: "Who was Ulysses S. Grant?", a: "General of the Union Army; he later became U.S. president." },
  { cat: "Key People", q: "Who was Robert E. Lee?", a: "General of the Confederate Army." },
  { cat: "Key People", q: "Who was Jefferson Davis?", a: "President of the Confederacy." },
  { cat: "Key People", q: "Who was Frederick Douglass and what was his role in relation to the Emancipation Proclamation?", a: "Frederick Douglass was a formerly enslaved abolitionist leader. Lincoln asked him to help spread word of the Emancipation Proclamation to slaves in the South and encourage them to escape." },
  { cat: "Places & Events", q: "What happened at Appomattox Court House?", a: "Lee surrendered to Grant in 1865, ending the Civil War." },
  { cat: "Places & Events", q: "What was the capital of the Confederacy?", a: "Richmond, Virginia." },
  { cat: "Places & Events", q: "Why was the Battle of Gettysburg a turning point?", a: "Lee lost one-third of his army and was forced to withdraw to Virginia. It stopped the South's invasion of the North and shifted momentum to the Union." },
  { cat: "Places & Events", q: "Why was the Union victory at Vicksburg important?", a: "The Union gained control of traffic on the Mississippi River, effectively dividing the Confederacy." },
  { cat: "Places & Events", q: "What was significant about the Battle of Antietam?", a: "Lee's defeat prevented him from convincing Maryland to join the Confederacy and stopped European nations from supporting the South." },
  { cat: "Places & Events", q: "Why were Northerners surprised by the outcome of the Battle of Bull Run?", a: "They expected a quick Union victory and an early end to the war, but the Confederates defeated Union troops and drove them back to Washington, D.C." },
  { cat: "North vs. South", q: "Name THREE advantages the North (Union) had.", a: "Any three of: larger population, more factories, more railroads, stronger economy, stronger finances, more food production." },
  { cat: "North vs. South", q: "Name THREE advantages the South (Confederacy) had.", a: "Any three of: only needed to defend, more motivated soldiers, experienced generals, fighting on home territory." },
  { cat: "North vs. South", q: "What was the North's main goal at the start of the Civil War?", a: "To preserve the Union." },
  { cat: "North vs. South", q: "What was the South's main goal at the start of the Civil War?", a: "Independence, to become their own country." },
  { cat: "Emancipation Proclamation", q: "Which slaves did the Emancipation Proclamation free?", a: "Slaves in Confederate states only. Slaves in border states like Delaware, Maryland, Kentucky, and Missouri were not freed." },
  { cat: "Emancipation Proclamation", q: "Give TWO reasons Lincoln issued the Emancipation Proclamation.", a: "Any two of: to weaken the South by encouraging enslaved people to escape, to add moral purpose to the war, to prevent Britain and France from supporting the Confederacy." },
  { cat: "Emancipation Proclamation", q: "Why did Lincoln call the Emancipation Proclamation a 'military necessity'?", a: "Because enslaved people were helping the South fight the war. Freeing them would weaken the South's war effort and also discourage European support for the Confederacy." },
  { cat: "Emancipation Proclamation", q: "What did Douglass conclude about Lincoln's true feelings toward slavery after their White House meeting?", a: "Douglass concluded that Lincoln had a deeper moral conviction against slavery than he had publicly shown and genuinely wanted to free as many enslaved people as possible." },
  { cat: "Emancipation Proclamation", q: "How might the passage of nearly 20 years have affected Douglass's account of his meeting with Lincoln?", a: "He may have forgotten details, added details over time, or his opinion of Lincoln may have changed by the time he wrote about it." },
  { cat: "Groups in the War", q: "Name FOUR ways women contributed to the Civil War.", a: "Any four of: ran farms and businesses, worked in factories, became teachers, became government workers, served as nurses, messengers, guides, scouts, smugglers, soldiers, or spies." },
  { cat: "Groups in the War", q: "What was important about the Massachusetts 54th Regiment at Fort Wagner?", a: "Although they were forced to retreat after losing many men, their bravery earned respect and proved African Americans could fight courageously." },
  { cat: "Groups in the War", q: "How did African Americans contribute to the Union war effort overall?", a: "African American regiments fought in nearly 500 battles and showed great courage despite poor training, equipment, and pay." },
  { cat: "End of the War", q: "What were the terms Grant offered Lee at Appomattox?", a: "Confederate soldiers could go home if they stopped fighting. They could keep their horses and mules, officers kept their sidearms, and Grant ordered food sent to Lee's army." },
  { cat: "End of the War", q: "What did the Union army do during their campaign of total war?", a: "They destroyed railroad lines and other things of value, including crops and livestock." },
  { cat: "End of the War", q: "True or False: All Confederate weapons were taken at Appomattox. Explain.", a: "False. Officers were allowed to keep their sidearms, and soldiers could keep horses and mules." },
  { cat: "Home Front", q: "What problems developed on the Union home front during the war?", a: "Copperheads opposed the war, some Northerners sympathized with the Confederacy, and the draft led to violent riots." },
  { cat: "Home Front", q: "What problems developed on the Confederate home front during the war?", a: "Bombing raids forced people into caves, the blockade caused shortages, railroad lines were cut, crops were destroyed, and clothing wore out without replacement." },
  { cat: "Effects of the War", q: "Name THREE lasting effects of the Civil War.", a: "Any three of: the 13th Amendment ended slavery, the U.S. remained one country, the federal government became stronger than the states, the South needed rebuilding during Reconstruction, about 600,000 soldiers died, Virginia split into two states." },
  { cat: "Effects of the War", q: "What is meant by the 'Anaconda Plan'?", a: "The Union strategy to blockade Southern ports, control the Mississippi River, and squeeze the Confederacy." }
];

let questions = [];
let current = 0;
let score = 0;
let answered = false;
let gradingMode = "local";

const el = {
  localModeBtn: document.getElementById("localModeBtn"),
  cerebrasModeBtn: document.getElementById("cerebrasModeBtn"),
  categoryTag: document.getElementById("categoryTag"),
  qNum: document.getElementById("qNum"),
  questionText: document.getElementById("questionText"),
  answerInput: document.getElementById("answerInput"),
  submitBtn: document.getElementById("submitBtn"),
  nextBtn: document.getElementById("nextBtn"),
  feedbackBox: document.getElementById("feedbackBox"),
  gradingBox: document.getElementById("gradingBox"),
  progressFill: document.getElementById("progressFill"),
  progressLabel: document.getElementById("progressLabel"),
  scoreLive: document.getElementById("scoreLive"),
  mainQuiz: document.getElementById("mainQuiz"),
  scoreScreen: document.getElementById("scoreScreen"),
  scoreFinal: document.getElementById("scoreFinal"),
  scoreDenom: document.getElementById("scoreDenom"),
  scoreMsg: document.getElementById("scoreMsg"),
  restartBtn: document.getElementById("restartBtn")
};

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function normalizeText(text) {
  return text.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function stem(word) {
  let w = word;
  if (w.endsWith("ies") && w.length > 4) w = w.slice(0, -3) + "y";
  else if (w.endsWith("ing") && w.length > 5) w = w.slice(0, -3);
  else if (w.endsWith("ed") && w.length > 4) w = w.slice(0, -2);
  else if (w.endsWith("es") && w.length > 4) w = w.slice(0, -2);
  else if (w.endsWith("s") && w.length > 3) w = w.slice(0, -1);

  const aliasMap = {
    union: "north", northern: "north", confederate: "south", confederacy: "south", southern: "south",
    states: "state", soldiers: "soldier", factories: "factory", railroads: "railroad", generals: "general",
    slaves: "slave", enslaved: "slave", freedom: "free", freed: "free", britain: "british", france: "french"
  };
  return aliasMap[w] || w;
}

function tokenize(text) {
  return normalizeText(text).split(" ").map(stem).filter(token => token && token.length > 1);
}

function uniqueTokens(text) {
  return [...new Set(tokenize(text))];
}

function parseAnyCount(answer) {
  const match = answer.match(/^Any\s+(\w+)\s+of:/i);
  if (!match) return null;
  const map = { one:1, two:2, three:3, four:4, five:5, six:6, seven:7, eight:8, nine:9, ten:10 };
  return map[match[1].toLowerCase()] || Number(match[1]) || null;
}

function parseChoiceList(answer) {
  const idx = answer.indexOf(":");
  if (idx === -1) return [];
  return answer.slice(idx + 1).split(/,|;/).map(item => item.trim()).filter(Boolean);
}

function phraseMatch(userTokensSet, phrase) {
  const tokens = uniqueTokens(phrase);
  if (!tokens.length) return false;
  let matches = 0;
  for (const token of tokens) {
    if (userTokensSet.has(token)) matches++;
  }
  return matches >= Math.max(1, Math.ceil(tokens.length * 0.5));
}

function gradeListQuestion(userAnswer, idealAnswer) {
  const requested = parseAnyCount(idealAnswer);
  const choices = parseChoiceList(idealAnswer);
  const userTokenSet = new Set(uniqueTokens(userAnswer));
  let matches = 0;
  for (const choice of choices) {
    if (phraseMatch(userTokenSet, choice)) matches++;
  }
  const needed = requested <= 2 ? requested : requested - 1;
  const correct = matches >= needed;
  return {
    correct,
    feedback: correct
      ? `Nice work. You included ${matches} solid point${matches === 1 ? "" : "s"}, which is enough for credit.`
      : "This one needs more specific examples from the lesson.",
    key_points: choices.slice(0, Math.min(4, choices.length)).join(", ")
  };
}

function gradeTrueFalse(userAnswer, idealAnswer) {
  const user = normalizeText(userAnswer);
  const ideal = normalizeText(idealAnswer);
  const expected = ideal.startsWith("true") ? "true" : "false";
  const got = user.startsWith("true") ? "true" : user.startsWith("false") ? "false" : "";
  const correct = got === expected;
  return {
    correct,
    feedback: correct ? "Correct. You chose the right statement." : "That statement is not correct for this event.",
    key_points: idealAnswer
  };
}

function gradeStandard(userAnswer, idealAnswer) {
  const userTokens = uniqueTokens(userAnswer);
  const idealTokens = uniqueTokens(idealAnswer);
  const userSet = new Set(userTokens);
  const overlapCount = idealTokens.filter(token => userSet.has(token)).length;
  const overlapRatio = idealTokens.length ? overlapCount / idealTokens.length : 0;
  const correct = overlapCount >= 2 || overlapRatio >= 0.45 || (idealTokens.length <= 3 && overlapCount >= 1);
  return {
    correct,
    feedback: correct ? "Well done. Your answer shows the main idea clearly enough for credit." : "This answer misses the main point the question was asking for.",
    key_points: idealAnswer
  };
}

function gradeLocally(question, userAnswer) {
  if (!userAnswer.trim()) {
    return { correct: false, feedback: "Please write an answer before submitting.", key_points: question.a };
  }
  if (/^Any\s+\w+\s+of:/i.test(question.a)) return gradeListQuestion(userAnswer, question.a);
  if (/^True or False:/i.test(question.q) || /^(True|False)\./i.test(question.a)) return gradeTrueFalse(userAnswer, question.a);
  return gradeStandard(userAnswer, question.a);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function gradeWithCerebras(question, userAnswer) {
  const response = await fetch(CEREBRAS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${CEREBRAS_API_KEY}`
    },
    body: JSON.stringify({
      model: CEREBRAS_MODEL,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are a friendly middle school social studies teacher grading a Civil War quiz. Be generous with synonyms, paraphrasing, and minor spelling mistakes. Return only a JSON object with keys correct, feedback, and key_points."
        },
        {
          role: "user",
          content:
            `Question: ${question.q}\n` +
            `Ideal answer: ${question.a}\n` +
            `Student answer: ${userAnswer}\n\n` +
            'Return JSON only in this exact shape: {"correct":true,"feedback":"...","key_points":"..."}'
        }
      ]
    })
  });

  const raw = await response.text();
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${raw.slice(0, 300)}`);
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`Cerebras returned non-JSON: ${raw.slice(0, 300)}`);
  }

  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Cerebras returned no message content.");
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    const match = String(content).match(/\{[\s\S]*\}/);
    if (!match) throw new Error(`Cerebras returned non-JSON content: ${String(content).slice(0, 300)}`);
    parsed = JSON.parse(match[0]);
  }

  return {
    correct: Boolean(parsed.correct),
    feedback: parsed.feedback || "Cerebras grading completed.",
    key_points: parsed.key_points || question.a
  };
}

function applyScoreForCurrent(correct) {
  const q = questions[current];
  const previouslyAwarded = q._awarded === true;
  if (previouslyAwarded === correct) return;
  if (correct) score += 1;
  else if (previouslyAwarded) score -= 1;
  q._awarded = correct;
  el.scoreLive.textContent = score;
}

function renderFeedback(result) {
  el.feedbackBox.style.display = "block";
  if (result.correct) {
    el.feedbackBox.className = "feedback-box correct";
    el.feedbackBox.innerHTML = `✔ ${escapeHtml(result.feedback)}`;
  } else {
    el.feedbackBox.className = "feedback-box wrong";
    el.feedbackBox.innerHTML = `✘ ${escapeHtml(result.feedback)}<div class="answer-reveal">📜 Key points: ${escapeHtml(result.key_points)}</div>`;
  }
}

function renderGrading(apiHtml) {
  el.gradingBox.style.display = "block";
  el.gradingBox.className = "feedback-box";
  el.gradingBox.innerHTML = `
    <div class="grading-title">Grading</div>
    ${apiHtml}
  `;
}

function updateModeButtons() {
  el.localModeBtn.classList.toggle("active", gradingMode === "local");
  el.cerebrasModeBtn.classList.toggle("active", gradingMode === "cerebras");
}

function startQuiz() {
  questions = shuffle(ALL_QUESTIONS.map(q => ({ ...q, _awarded: false })));
  current = 0;
  score = 0;
  answered = false;
  el.scoreScreen.style.display = "none";
  el.mainQuiz.style.display = "block";
  loadQuestion();
}

function loadQuestion() {
  answered = false;
  const q = questions[current];
  el.categoryTag.textContent = q.cat;
  el.qNum.textContent = `Question ${current + 1} of ${questions.length}`;
  el.questionText.textContent = q.q;
  el.answerInput.value = "";
  el.answerInput.disabled = false;
  el.submitBtn.disabled = false;
  el.feedbackBox.style.display = "none";
  el.gradingBox.style.display = "none";
  el.gradingBox.innerHTML = "";
  el.nextBtn.style.display = "none";
  updateProgress();
  el.answerInput.focus();
}

function updateProgress() {
  const pct = (current / questions.length) * 100;
  el.progressFill.style.width = `${pct}%`;
  el.progressLabel.textContent = `Question ${Math.min(current + 1, questions.length)} of ${questions.length}`;
  el.scoreLive.textContent = score;
}

async function submitAnswer() {
  if (answered) return;
  const userAnswer = el.answerInput.value.trim();
  if (!userAnswer) return;

  answered = true;
  el.answerInput.disabled = true;
  el.submitBtn.disabled = true;

  const q = questions[current];
  if (gradingMode === "local") {
    const localResult = gradeLocally(q, userAnswer);
    applyScoreForCurrent(localResult.correct);
    renderFeedback(localResult);
    renderGrading(`<div class="grading-line"><strong>Local:</strong> ${localResult.correct ? "Correct" : "Incorrect"} - ${escapeHtml(localResult.feedback)}</div><div class="grading-line"><strong>Key points:</strong> ${escapeHtml(localResult.key_points)}</div><div class="grading-note">Score uses local grading in this mode.</div>`);
  } else {
    el.feedbackBox.style.display = "block";
    el.feedbackBox.className = "feedback-box";
    el.feedbackBox.innerHTML = 'Checking your answer<span class="loading-dots"><span></span><span></span><span></span></span>';
    renderGrading('<div class="grading-line"><strong>AI Grading:</strong> Checking<span class="loading-dots"><span></span><span></span><span></span></span></div>');

    try {
      const apiResult = await gradeWithCerebras(q, userAnswer);
      applyScoreForCurrent(apiResult.correct);
      renderFeedback(apiResult);
      renderGrading(
        `<div class="grading-line"><strong>AI Grading:</strong> ${apiResult.correct ? "Correct" : "Incorrect"} - ${escapeHtml(apiResult.feedback)}</div><div class="grading-line"><strong>AI key points:</strong> ${escapeHtml(apiResult.key_points)}</div><div class="grading-note">Score uses the AI result in this mode.</div>`
      );
    } catch (error) {
      el.feedbackBox.className = "feedback-box wrong";
      el.feedbackBox.innerHTML = `✘ ${escapeHtml(error.message)}<div class="answer-reveal">Unable to grade this answer right now.</div>`;
      renderGrading(
        `<div class="grading-line"><strong>AI Grading:</strong> Failed - ${escapeHtml(error.message)}</div><div class="grading-note">No score was awarded for this question because the API grading failed.</div>`
      );
    }
  }

  el.nextBtn.style.display = "block";
}

function nextQuestion() {
  current++;
  if (current >= questions.length) showScore();
  else loadQuestion();
}

function showScore() {
  el.mainQuiz.style.display = "none";
  el.progressFill.style.width = "100%";
  el.progressLabel.textContent = `Complete - ${questions.length} of ${questions.length}`;
  const pct = Math.round((score / questions.length) * 100);
  el.scoreFinal.textContent = score;
  el.scoreDenom.textContent = `/${questions.length}`;

  let msg = "";
  if (pct >= 90) msg = '"A house divided against itself cannot stand." Excellent work.';
  else if (pct >= 75) msg = '"With malice toward none, with charity for all." Strong job.';
  else if (pct >= 60) msg = '"I will prepare and someday my chance will come." Keep studying.';
  else msg = "The war was not won in a day. Review your notes and try again.";

  el.scoreMsg.textContent = msg;
  el.scoreScreen.style.display = "block";
}

el.submitBtn.addEventListener("click", submitAnswer);
el.nextBtn.addEventListener("click", nextQuestion);
el.restartBtn.addEventListener("click", startQuiz);
el.localModeBtn.addEventListener("click", () => {
  gradingMode = "local";
  updateModeButtons();
});
el.cerebrasModeBtn.addEventListener("click", () => {
  gradingMode = "cerebras";
  updateModeButtons();
});

document.addEventListener("keydown", event => {
  if (event.target.id === "answerInput" && event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    if (!answered) submitAnswer();
    else if (el.nextBtn.style.display !== "none") nextQuestion();
  }
});

startQuiz();
updateModeButtons();
