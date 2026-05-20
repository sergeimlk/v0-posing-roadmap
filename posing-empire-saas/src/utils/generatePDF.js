import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function generatePDF(elementId, fullname) {
  try {
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Element not found');

    // Add CSS class for html2canvas compatibility (solid fallbacks, fixed width)
    element.classList.add('html2canvas-container');

    // Wait a tiny bit for layout recalculation
    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(element, {
      backgroundColor: '#050505',
      scale: 2,
      useCORS: true,
      logging: false,
    });

    // Remove class immediately after rendering
    element.classList.remove('html2canvas-container');

    const imgData = canvas.toDataURL('image/png');
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

    const name = (fullname || 'athlete').trim().replace(/\s+/g, '_');
    pdf.save(`Roadmap_PosingEmpire_${name}.pdf`);
    return true;
  } catch (err) {
    console.error('PDF generation error:', err);
    return false;
  }
}
