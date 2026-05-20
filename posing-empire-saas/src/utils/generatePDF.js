import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function generatePDF(elementId, fullname) {
  try {
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Element not found');

    // Add CSS class for html2canvas compatibility (solid fallbacks, fixed width)
    element.classList.add('html2canvas-container');

    // Wait a tiny bit for layout recalculation
    await new Promise(resolve => setTimeout(resolve, 150));

    // Dynamic intelligent page splitting with spacers
    const pageHeightPx = 1130; // A4 aspect ratio height at 800px width
    const blocks = [];
    const header = element.querySelector('.roadmap-header');
    const clientInfo = element.querySelector('.roadmap-client-info');
    const sectionTitle = element.querySelector('.roadmap-section-title');
    const timelineItems = Array.from(element.querySelectorAll('.timeline-item'));
    const footer = element.querySelector('.roadmap-footer');

    if (header) blocks.push(header);
    if (clientInfo) blocks.push(clientInfo);
    if (sectionTitle) blocks.push(sectionTitle);
    blocks.push(...timelineItems);
    if (footer) blocks.push(footer);

    const spacers = [];
    let idx = 0;

    while (idx < blocks.length) {
      const block = blocks[idx];
      const containerTop = element.getBoundingClientRect().top;
      const rect = block.getBoundingClientRect();
      const blockTop = rect.top - containerTop;
      const blockHeight = rect.height;
      const blockBottom = blockTop + blockHeight;

      const currentPage = Math.floor(blockTop / pageHeightPx);
      const nextPage = Math.floor((blockBottom - 4) / pageHeightPx); // 4px tolerance margin

      if (nextPage > currentPage) {
        // The block crosses the page boundary!
        // Push it to start at the next page boundary
        const targetY = nextPage * pageHeightPx;
        const spaceNeeded = targetY - blockTop;

        if (spaceNeeded > 0) {
          const spacer = document.createElement('div');
          spacer.className = 'pdf-page-spacer';
          spacer.style.height = `${spaceNeeded}px`;
          spacer.style.width = '100%';
          spacer.style.background = '#050505'; // Match background color exactly
          block.parentNode.insertBefore(spacer, block);
          spacers.push(spacer);
          
          // Recheck this block since its position has now shifted
          continue;
        }
      }
      idx++;
    }

    // Capture canvas
    const canvas = await html2canvas(element, {
      backgroundColor: '#050505',
      scale: 2,
      useCORS: true,
      logging: false,
    });

    // Cleanup spacers immediately
    spacers.forEach(spacer => spacer.parentNode?.removeChild(spacer));
    element.classList.remove('html2canvas-container');

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    const pageHeight = pdf.internal.pageSize.getHeight();
    let position = 0;

    if (pdfHeight <= pageHeight) {
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    } else {
      let remaining = pdfHeight;
      while (remaining > 1) { // 1mm threshold to avoid empty end pages
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        remaining -= pageHeight;
        position -= pageHeight;
        if (remaining > 1) pdf.addPage();
      }
    }

    const name = (fullname || 'athlete').trim().replace(/\s+/g, '_');
    pdf.save(`Roadmap_PosingEmpire_${name}.pdf`);
    return true;
  } catch (err) {
    console.error('PDF generation error:', err);
    return false;
  }
}
