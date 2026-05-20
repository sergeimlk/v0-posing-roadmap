import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import BackgroundGrid from './BackgroundGrid';
import { buildTimeline } from '../utils/buildTimeline';
import { generatePDF } from '../utils/generatePDF';

const LEVEL_LABELS = ['Débutant total', 'Novice', 'Intermédiaire', 'Confirmé', 'Avancé', 'Expert'];
const NEEDS_LABELS = {
  routine_libre: 'Routine Libre',
  presentation_individuelle: 'Présentation Individuelle',
  accompagnement_1_1: 'Accompagnement 1:1',
};

function escHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default function RoadmapScreen({ data, onRestart }) {
  const [downloading, setDownloading] = useState(false);
  const timeline = buildTimeline(data);

  const needsDisplay = data.needs.length
    ? data.needs.map(n => NEEDS_LABELS[n] || n).join(' · ')
    : 'Aucun besoin spécifique sélectionné';

  const today = new Date();
  const dateStr = today.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    const success = await generatePDF('roadmap-pdf-content', data.fullname);
    if (!success) {
      alert('Erreur lors de la génération du PDF. Essaye à nouveau.');
    }
    setDownloading(false);
  }, [data.fullname]);

  return (
    <main className="screen active">
      <BackgroundGrid />

      {/* Action Buttons */}
      <motion.div
        className="roadmap-actions-top"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.button
          className="btn-primary-gold btn-download"
          onClick={handleDownload}
          disabled={downloading}
          whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(212,168,67,0.4)' }}
          whileTap={{ y: 0 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          <span>{downloading ? 'Génération en cours...' : 'Télécharger ma Roadmap PDF'}</span>
        </motion.button>
        <motion.button
          className="btn-secondary-gold btn-restart"
          onClick={onRestart}
          whileHover={{ y: -1 }}
          whileTap={{ y: 0 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 4v6h6M23 20v-6h-6"/>
            <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/>
          </svg>
          <span>Recommencer</span>
        </motion.button>
      </motion.div>

      {/* PDF-RENDERABLE ROADMAP */}
      <motion.div
        id="roadmap-pdf-content"
        className="roadmap-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="roadmap-page">
          {/* HEADER */}
          <div className="roadmap-header">
            <div className="roadmap-logo-container">
              <img src="/posing-empire.svg" alt="Posing Empire Logo" className="roadmap-logo" />
            </div>
            <div className="roadmap-brand">
              <span className="text-white-gradient">POSING </span>
              <span className="text-gold-gradient">EMPIRE</span>
            </div>
            <div className="roadmap-program-label">ROAD MAP — PROGRAMME PERSONNALISÉ</div>
          </div>

          {/* CLIENT INFO */}
          <div className="roadmap-client-info">
            <div className="info-item">
              <span className="info-label">Athlète</span>
              <span className="info-value gold">{data.fullname}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Date</span>
              <span className="info-value">{dateStr}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Catégorie</span>
              <span className="info-value">{data.category}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Fédération</span>
              <span className="info-value">{data.federation}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Niveau</span>
              <span className="info-value gold">{data.level}/5 — {LEVEL_LABELS[data.level]}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Temps quotidien</span>
              <span className="info-value">{data.time}</span>
            </div>
            <div className="info-item" style={{ gridColumn: '1 / -1' }}>
              <span className="info-label">Objectifs</span>
              <span className="info-value">{data.objectives}</span>
            </div>
            <div className="info-item" style={{ gridColumn: '1 / -1' }}>
              <span className="info-label">Problématiques</span>
              <span className="info-value">{data.problems}</span>
            </div>
            <div className="info-item" style={{ gridColumn: '1 / -1' }}>
              <span className="info-label">Besoins</span>
              <span className="info-value">{needsDisplay}</span>
            </div>
          </div>

          {/* TIMELINE */}
          <div className="roadmap-section-title">📋 Ta Roadmap Semaine par Semaine</div>
          <div className="roadmap-timeline">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                className="timeline-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
              >
                <div className="timeline-left">
                  <div className="timeline-number">S{String(i + 1).padStart(2, '0')}</div>
                  <div className="timeline-line"></div>
                </div>
                <div className="timeline-content">
                  <div className="timeline-phase">{item.phase}</div>
                  <div className="timeline-title">{item.title}</div>
                  <div className="timeline-tasks">
                    {item.tasks.map((task, j) => {
                      if (!task) return null;
                      const content = (
                        <>
                          <span className="task-icon">{task.icon}</span>
                          <span className="task-text">{task.text}</span>
                        </>
                      );
                      if (task.link) {
                        return (
                          <a
                            key={j}
                            href={task.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="timeline-task timeline-task-link"
                          >
                            {content}
                            <span className="link-arrow">↗</span>
                          </a>
                        );
                      }
                      return (
                        <div key={j} className="timeline-task">
                          {content}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* FOOTER */}
          <div className="roadmap-footer">
            <div className="roadmap-footer-brand">POSING EMPIRE — COACHING PROFESSIONNEL DE POSE</div>
            <div className="roadmap-footer-url">www.posingempire.com · skool.com/posing-empire-groupe-prive-6566</div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
