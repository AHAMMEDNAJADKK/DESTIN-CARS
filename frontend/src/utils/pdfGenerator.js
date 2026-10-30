import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Generates and downloads a high-resolution A4 portrait PDF voucher
 * @param {HTMLElement} element - The DOM element containing the printable voucher
 * @param {string} voucherNumber - Voucher identifier for filename
 */
export const generateVoucherPDF = async (element, voucherNumber = 'VOUCHER') => {
  if (!element) {
    throw new Error('Voucher element not found for PDF generation');
  }

  try {
    // Scroll element into view smoothly before capture
    element.scrollIntoView();

    const canvas = await html2canvas(element, {
      scale: 2, // High resolution for crisp text & borders
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        // Ensure no-print elements are hidden in cloned DOM
        const noPrints = clonedDoc.querySelectorAll('.no-print');
        noPrints.forEach(el => el.style.display = 'none');

        // Ensure proper contrast and clean backgrounds
        const voucher = clonedDoc.querySelector('.voucher-container');
        if (voucher) {
          voucher.style.boxShadow = 'none';
          voucher.style.borderRadius = '0';
          voucher.style.margin = '0 auto';
        }
      }
    });

    const imgData = canvas.toDataURL('image/png');

    // A4 Portrait dimensions: 210 x 297 mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = 210;
    const pdfHeight = 297;
    const margin = 8; // 8mm margin
    const contentWidth = pdfWidth - (margin * 2);
    
    // Calculate aspect ratio height
    const contentHeight = (canvas.height * contentWidth) / canvas.width;

    // Center vertically if height is less than A4, otherwise start at margin
    const posX = margin;
    let posY = margin;
    if (contentHeight < (pdfHeight - (margin * 2))) {
      posY = Math.max(margin, (pdfHeight - contentHeight) / 2);
    }

    pdf.addImage(imgData, 'PNG', posX, posY, contentWidth, contentHeight, undefined, 'FAST');

    const cleanNumber = (voucherNumber || 'voucher').replace(/[\/\\]/g, '-');
    pdf.save(`DESTIN-CABS-${cleanNumber}.pdf`);

    return true;
  } catch (error) {
    console.error('[PDF Generation Error]', error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};

/**
 * Triggers standard browser print dialog styled for A4
 */
export const printVoucher = () => {
  window.print();
};
