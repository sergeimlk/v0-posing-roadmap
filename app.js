// ══════════════════════════════════════════════════
// POSING EMPIRE — ONBOARDING QUESTIONNAIRE ENGINE
// ══════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  // ── Screen Management ──
  const screens = {
    form: document.getElementById('screen-form'),
    loading: document.getElementById('screen-loading'),
    roadmap: document.getElementById('screen-roadmap'),
  };

  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Selector Buttons ──
  document.querySelectorAll('.selector-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.group;
      const value = btn.dataset.value;
      // Deselect siblings
      document.querySelectorAll(`.selector-btn[data-group="${group}"]`).forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      // Update hidden input
      const hiddenInput = document.getElementById(group);
      if (hiddenInput) hiddenInput.value = value;

      // Federation "Autre" → show text field
      if (group === 'federation') {
        const otherField = document.getElementById('federation-other');
        if (value === 'Autre') {
          otherField.classList.add('visible');
          otherField.focus();
        } else {
          otherField.classList.remove('visible');
          otherField.value = '';
        }
      }
    });
  });

  // ── Level Selector ──
  const levelDots = document.querySelectorAll('.level-dot');
  const levelFill = document.getElementById('level-fill');
  const levelInput = document.getElementById('level');

  levelDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const level = parseInt(dot.dataset.level);
      levelInput.value = level;
      const pct = (level / 5) * 100;
      levelFill.style.width = pct + '%';

      levelDots.forEach(d => {
        const l = parseInt(d.dataset.level);
        d.classList.remove('active', 'passed');
        if (l === level) d.classList.add('active');
        else if (l < level) d.classList.add('passed');
      });
    });
  });

  // ── Form Submission ──
  const form = document.getElementById('onboarding-form');
  form.addEventListener('submit', e => {
    e.preventDefault();

    // Validate required selectors
    const category = document.getElementById('category').value;
    const federation = document.getElementById('federation').value;
    const level = document.getElementById('level').value;
    const time = document.getElementById('time').value;

    if (!category || !federation || level === '' || !time) {
      // Find first missing and shake it
      if (!category) shakeGroup('category');
      else if (!federation) shakeGroup('federation');
      else if (level === '') shakeGroup('level');
      else if (!time) shakeGroup('time');
      return;
    }

    // Collect data
    const formData = {
      fullname: document.getElementById('fullname').value.trim(),
      category,
      federation: federation === 'Autre'
        ? document.getElementById('federation-other').value.trim() || 'Autre'
        : federation,
      level: parseInt(level),
      objectives: document.getElementById('objectives').value.trim(),
      problems: document.getElementById('problems').value.trim(),
      time,
      needs: Array.from(document.querySelectorAll('input[name="needs"]:checked')).map(c => c.value),
    };

    // Show loading
    showScreen('loading');
    runLoadingSequence(formData);
  });

  function shakeGroup(groupName) {
    const btns = document.querySelectorAll(`.selector-btn[data-group="${groupName}"]`);
    if (btns.length) {
      const parent = btns[0].closest('.form-group');
      parent.classList.add('shake');
      setTimeout(() => parent.classList.remove('shake'), 400);
      parent.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // ── Loading Sequence ──
  function runLoadingSequence(formData) {
    const bar = document.getElementById('loading-bar');
    const steps = [
      document.getElementById('lstep-1'),
      document.getElementById('lstep-2'),
      document.getElementById('lstep-3'),
    ];
    // Reset
    bar.style.width = '0';
    steps.forEach(s => { s.classList.remove('done'); s.querySelector('.step-check').textContent = '⏳'; });

    setTimeout(() => {
      bar.style.width = '33%';
      steps[0].classList.add('done');
      steps[0].querySelector('.step-check').textContent = '✅';
    }, 600);

    setTimeout(() => {
      bar.style.width = '66%';
      steps[1].classList.add('done');
      steps[1].querySelector('.step-check').textContent = '✅';
    }, 1400);

    setTimeout(() => {
      bar.style.width = '100%';
      steps[2].classList.add('done');
      steps[2].querySelector('.step-check').textContent = '✅';
    }, 2200);

    setTimeout(() => {
      generateRoadmap(formData);
      showScreen('roadmap');
    }, 3000);
  }

  // ══════════════════════════════════════
  // ROADMAP GENERATION ENGINE
  // ══════════════════════════════════════

  function generateRoadmap(data) {
    const roadmapEl = document.getElementById('roadmap-pdf-content');
    const timeline = buildTimeline(data);

    const levelLabels = ['Débutant total', 'Novice', 'Intermédiaire', 'Confirmé', 'Avancé', 'Expert'];
    const needsLabels = {
      routine_libre: 'Routine Libre',
      presentation_individuelle: 'Présentation Individuelle'
    };
    const needsDisplay = data.needs.length
      ? data.needs.map(n => needsLabels[n] || n).join(' · ')
      : 'Aucun besoin spécifique sélectionné';

    const today = new Date();
    const dateStr = today.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

    roadmapEl.innerHTML = `
      <div class="roadmap-page">
        <!-- HEADER -->
        <div class="roadmap-header">
          <div class="roadmap-header-stars">✦ ✦</div>
          <div class="roadmap-brand">
            <span class="text-white-gradient">POSING </span>
            <span class="text-gold-gradient">EMPIRE</span>
          </div>
          <div class="roadmap-program-label">ROAD MAP — PROGRAMME PERSONNALISÉ</div>
        </div>

        <!-- CLIENT INFO -->
        <div class="roadmap-client-info">
          <div class="info-item">
            <span class="info-label">Athlète</span>
            <span class="info-value gold">${escHtml(data.fullname)}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Date</span>
            <span class="info-value">${dateStr}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Catégorie</span>
            <span class="info-value">${escHtml(data.category)}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Fédération</span>
            <span class="info-value">${escHtml(data.federation)}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Niveau</span>
            <span class="info-value gold">${data.level}/5 — ${levelLabels[data.level]}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Temps quotidien</span>
            <span class="info-value">${escHtml(data.time)}</span>
          </div>
          <div class="info-item" style="grid-column: 1 / -1;">
            <span class="info-label">Objectifs</span>
            <span class="info-value">${escHtml(data.objectives)}</span>
          </div>
          <div class="info-item" style="grid-column: 1 / -1;">
            <span class="info-label">Problématiques</span>
            <span class="info-value">${escHtml(data.problems)}</span>
          </div>
          <div class="info-item" style="grid-column: 1 / -1;">
            <span class="info-label">Besoins</span>
            <span class="info-value">${needsDisplay}</span>
          </div>
        </div>

        <!-- TIMELINE -->
        <div class="roadmap-section-title">📋 Ta Roadmap Semaine par Semaine</div>
        <div class="roadmap-timeline">
          ${timeline.map((item, i) => `
            <div class="timeline-item">
              <div class="timeline-left">
                <span class="timeline-week">S${String(i + 1).padStart(2, '0')}</span>
                <div class="timeline-number">${String(i + 1).padStart(2, '0')}</div>
                <div class="timeline-line"></div>
              </div>
              <div class="timeline-content">
                <div class="timeline-phase">${escHtml(item.phase)}</div>
                <div class="timeline-title">${escHtml(item.title)}</div>
                <div class="timeline-tasks">
                  ${item.tasks.map(t => `<div class="timeline-task">${escHtml(t)}</div>`).join('')}
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- FOOTER -->
        <div class="roadmap-footer">
          <div class="roadmap-footer-brand">POSING EMPIRE — COACHING PROFESSIONNEL DE POSE</div>
          <div class="roadmap-footer-url">www.posingempire.com · skool.com/manael</div>
        </div>
      </div>
    `;
  }

  // ══════════════════════════════════════
  // TIMELINE BUILDER (SMART LOGIC)
  // ══════════════════════════════════════

  function buildTimeline(data) {
    const weeks = [];
    const cat = data.category;
    const lvl = data.level;
    const hasRoutine = data.needs.includes('routine_libre');
    const hasPres = data.needs.includes('presentation_individuelle');
    const problems = data.problems.toLowerCase();

    // Detect issues
    const hasShoulderPain = /[ée]paule|shoulder/i.test(problems);
    const hasMobility = /mobilit[ée]|omoplate|hanche|colonne|raideur|souplesse/i.test(problems);
    const hasVacuum = /vacuum|abdo|ventre|sangle/i.test(problems);
    const hasSymmetry = /sym[ée]tr|d[ée]s[ée]quilibr/i.test(problems);
    const hasTransitions = /transition|flu|enchaine/i.test(problems);

    // ── WEEKS 1-2: FONDATIONS (always) ──
    if (lvl <= 2) {
      weeks.push({
        phase: 'Fondations',
        title: 'Apprentissage des Quarts de Tour',
        tasks: [
          '📹 Module 1 : Vocabulaire du poseur & méthodologie',
          '📹 Vidéo : Setup de base, placement des pieds',
          '🏋️ Exercice : Pratiquer les 4 quarts de tour face miroir',
          ...(hasMobility ? ['🧘 Mobilité : Stretching épaules & omoplates (15 min/jour)'] : []),
          ...(hasShoulderPain ? ['⚠️ Priorité : Échauffement doux épaule avant chaque session'] : []),
        ]
      });
      weeks.push({
        phase: 'Fondations',
        title: 'Apprentissage des Mandatories',
        tasks: [
          '📹 Module 1 : Les mandatories de ta catégorie (' + cat + ')',
          '📹 Vidéo : Sangle abdominale & contraction musculaire',
          '🏋️ Exercice : Répéter chaque mandatory 10× en séquence',
          ...(hasVacuum ? ['📹 Bonus : Introduction au Vacuum (technique de base)'] : []),
          ...(hasSymmetry ? ['📐 Focus symétrie : Analyse photo front/back (auto-éval)'] : []),
        ]
      });
    } else {
      weeks.push({
        phase: 'Fondations',
        title: 'Révision Rapide des Bases',
        tasks: [
          '📹 Révision express : Quarts de tour & mandatories',
          '📐 Auto-évaluation : Identifier tes points faibles actuels',
          '🏋️ Drill : Enchaîner toutes les mandatories en 2 min chrono',
          ...(hasMobility ? ['🧘 Routine mobilité quotidienne (épaules, hanches, colonne)'] : []),
        ]
      });
    }

    // ── WEEKS 3-4: DÉVELOPPEMENT ──
    if (cat === "Men's Physique") {
      weeks.push({
        phase: 'Développement',
        title: 'Transitions & Quarts de Tour MP',
        tasks: [
          "📹 Module 2 : Spécificités Men's Physique",
          '📹 Vidéo : Placements jambes & hand-on-hip',
          '🏋️ Exercice : Transitions fluides entre chaque quart',
          ...(hasTransitions ? ["🔄 Focus transitions : Slow-motion drill (3×10 min)"] : []),
        ]
      });
    } else if (cat === 'Classic Physique') {
      weeks.push({
        phase: 'Développement',
        title: 'Front Poses & Transitions Classic',
        tasks: [
          '📹 Module 3 : The Classic Class — Front poses',
          '📹 Vidéo : Front double biceps, front lat spread',
          '🏋️ Exercice : Tenir chaque pose 10 sec × 5 sets',
          ...(hasShoulderPain ? ['⚠️ Adaptation : Variantes front poses épaule sensible'] : []),
        ]
      });
    } else if (cat === 'Bodybuilding') {
      weeks.push({
        phase: 'Développement',
        title: 'Mandatories Bodybuilding Avancé',
        tasks: [
          '📹 Module 2 : Toutes les mandatories BB',
          '📹 Vidéo : Most Muscular, Lat Spread, Abs & Thigh',
          '🏋️ Exercice : Séquence complète 8 poses enchaînées',
          ...(hasVacuum ? ['📹 Vacuum : Progression semaine 3 (hold 15 sec)'] : []),
        ]
      });
    } else {
      weeks.push({
        phase: 'Développement',
        title: 'Poses Figure & Élégance',
        tasks: [
          '📹 Module 2 : Placements spécifiques Figure',
          '📹 Vidéo : Quarts de tour, model walk, T-walk',
          '🏋️ Exercice : Travailler la fluidité des transitions',
          ...(hasMobility ? ['🧘 Mobilité hanches & colonne pour la marche scénique'] : []),
        ]
      });
    }

    weeks.push({
      phase: 'Développement',
      title: 'Transitions des Mandatories',
      tasks: [
        '📹 Vidéo : Enchaînements fluides entre mandatories',
        '🏋️ Exercice : Routine complète mandatories (minutée)',
        '📐 Auto-filmage : Analyser et corriger les imperfections',
        ...(hasSymmetry ? ['📐 Focus : Correction asymétrie droite/gauche'] : []),
      ]
    });

    // ── WEEK 5: CONSOLIDATION ──
    weeks.push({
      phase: 'Consolidation',
      title: 'Révision des Poses',
      tasks: [
        '📹 Revoir les modules 1 à 3 (points clés uniquement)',
        '🏋️ Mini-compétition simulée : toutes les mandatories',
        '📐 Analyse vidéo : comparer semaine 1 vs maintenant',
        ...(hasVacuum ? ['📹 Vacuum : Hold 20 sec, intégrer dans les poses front'] : []),
        ...(hasMobility ? ['🧘 Routine mobilité complète (30 min)'] : []),
      ]
    });

    // ── WEEKS 6-7: CRÉATION ──
    if (hasPres) {
      weeks.push({
        phase: 'Création',
        title: 'Création Présentation Individuelle',
        tasks: [
          '📹 Module 5 : Sessions & Accompagnement',
          "📹 Vidéo : Construire ton entrée en scène",
          "🏋️ Exercice : Chorégraphier ta présentation (60-90 sec)",
          '🎵 Choisir ta musique et caler les transitions',
        ]
      });
    }

    if (hasRoutine) {
      weeks.push({
        phase: 'Création',
        title: 'Création Routine Libre',
        tasks: [
          '📹 Module 2 : Section Routine libre',
          '📹 Vidéo : Structure d\'une routine gagnante',
          '🏋️ Exercice : Chorégraphier ta routine (60-90 sec)',
          '🎵 Synchroniser musique + transitions + poses highlight',
        ]
      });
    }

    if (!hasPres && !hasRoutine) {
      weeks.push({
        phase: 'Création',
        title: 'Perfectionnement des Poses Clés',
        tasks: [
          "📹 Revoir les poses où tu as le plus de marge de progression",
          "🏋️ Drill : 3 sets de 10 reps sur tes 3 poses les plus faibles",
          '📐 Filmer et comparer avec les références du module',
          ...(hasShoulderPain ? ['⚠️ Renforcement épaule : exercices correctifs ciblés'] : []),
        ]
      });
    }

    // ── WEEK 8: PERFORMANCE ──
    if (hasRoutine || hasPres) {
      weeks.push({
        phase: 'Performance',
        title: 'Amélioration ' + (hasRoutine ? 'Routine Libre' : 'Présentation'),
        tasks: [
          '📹 Vidéo : Peaufiner les transitions',
          '🏋️ Run-through complet × 5 (filmé)',
          '📐 Analyse : fluidity score, timing, expressions',
          ...(hasTransitions ? ['🔄 Focus : Micro-transitions entre chaque pose'] : []),
        ]
      });
    } else {
      weeks.push({
        phase: 'Performance',
        title: 'Endurance & Maintien des Poses',
        tasks: [
          "📹 Module 2 : Round d'endurance",
          '🏋️ Exercice : Tenir chaque pose 30 sec sans trembler',
          '💪 Pump session : Simuler les conditions backstage',
        ]
      });
    }

    // ── WEEKS 9-10: OPTIMISATION ──
    weeks.push({
      phase: 'Optimisation',
      title: 'Optimisation Quarts de Tour & Mandatories',
      tasks: [
        '📹 Revoir module 2 : points de détail avancés',
        '🏋️ Drill précision : micro-ajustements sur chaque pose',
        '📐 Comparer avec des références pro (même catégorie)',
        ...(hasSymmetry ? ['📐 Session symétrie : correction finale avant compétition'] : []),
      ]
    });

    if (lvl <= 2 && (hasMobility || hasShoulderPain || hasVacuum)) {
      weeks.push({
        phase: 'Optimisation',
        title: 'Mobilité & Vacuum — Module Bonus',
        tasks: [
          '📹 Module Bonus : Mobilité complète',
          ...(hasShoulderPain ? ['🧘 Protocole épaule : renforcement + mobilité active'] : []),
          ...(hasMobility ? ['🧘 Mobilité hanches, colonne, rotations'] : []),
          ...(hasVacuum ? ['📹 Vacuum avancé : hold 30 sec, intégration dans la routine'] : []),
          '🏋️ Activation musculaire pré-posing',
        ]
      });
    }

    // ── WEEKS 11-12: PERFECTION ──
    weeks.push({
      phase: 'Perfection',
      title: 'Révision des Difficultés',
      tasks: [
        '📹 Revoir uniquement les passages difficiles',
        '🏋️ Exercice : Run-through complet (conditions réelles)',
        '📐 Dernières corrections avec feedback vidéo',
        ...(hasVacuum ? ['📹 Vacuum : intégration finale dans la séquence complète'] : []),
      ]
    });

    weeks.push({
      phase: 'Perfection',
      title: 'Révision Globale & Préparation Scène',
      tasks: [
        '📹 Module 4 : Déroulement compétition, attitude scénique',
        '🏋️ Simulation complète : du backstage au stage',
        '📐 Checklist finale : tan, pump, respiration, timing',
        '🏆 Tu es prêt(e) pour la scène !',
      ]
    });

    return weeks;
  }

  // ── HTML Escape ──
  function escHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── PDF Download ──
  document.getElementById('btn-download-pdf').addEventListener('click', async () => {
    const btn = document.getElementById('btn-download-pdf');
    const originalText = btn.querySelector('span').textContent;
    btn.querySelector('span').textContent = 'Génération en cours...';
    btn.style.pointerEvents = 'none';

    try {
      const element = document.getElementById('roadmap-pdf-content');
      const canvas = await html2canvas(element, {
        backgroundColor: '#050505',
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // If content is taller than one page, split across pages
      const pageHeight = pdf.internal.pageSize.getHeight();
      let position = 0;

      if (pdfHeight <= pageHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      } else {
        let remaining = pdfHeight;
        while (remaining > 0) {
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
          remaining -= pageHeight;
          position -= pageHeight;
          if (remaining > 0) pdf.addPage();
        }
      }

      const name = document.getElementById('fullname').value.trim().replace(/\s+/g, '_') || 'athlete';
      pdf.save(`Roadmap_PosingEmpire_${name}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Erreur lors de la génération du PDF. Essaye à nouveau.');
    }

    btn.querySelector('span').textContent = originalText;
    btn.style.pointerEvents = '';
  });

  // ── Restart ──
  document.getElementById('btn-restart').addEventListener('click', () => {
    form.reset();
    document.querySelectorAll('.selector-btn').forEach(b => b.classList.remove('selected'));
    document.querySelectorAll('.level-dot').forEach(d => d.classList.remove('active', 'passed'));
    document.getElementById('level-fill').style.width = '0';
    document.getElementById('federation-other').classList.remove('visible');
    ['category', 'federation', 'level', 'time'].forEach(id => document.getElementById(id).value = '');
    showScreen('form');
  });
});
