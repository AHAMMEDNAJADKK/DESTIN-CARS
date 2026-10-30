import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { preloadAllContainerImages, convertToSafeDataUrl, isValidDataUrl } from './imageProcessor';

/**
 * Generates and downloads an official Destin Cabs corporate A4 portrait PDF trip voucher.
 * Implements a bulletproof rendering pipeline with image verification, layout validation,
 * format fail-safes (PNG -> JPEG -> direct canvas), and single-page A4 auto-fit.
 * 
 * @param {HTMLElement} element - The DOM element containing the voucher preview
 * @param {string} voucherNumber - Voucher identifier for filename
 * @returns {Promise<boolean>} Resolves true when PDF is generated and downloaded
 */
export const generateVoucherPDF = async (element, voucherNumber = 'VOUCHER') => {
  if (!element) {
    throw new Error('Voucher preview element not available for PDF generation');
  }

  // Fallback if target element has zero dimensions (e.g. if mistakenly hidden)
  const rect = element.getBoundingClientRect();
  const hasZeroDimensions = (element.offsetWidth <= 0 || element.offsetHeight <= 0 || rect.width <= 0);
  
  let originalStyles = null;
  if (hasZeroDimensions) {
    console.warn('[PDF Generator] Target element has 0 dimensions. Applying temporary layout styles.');
    originalStyles = {
      display: element.style.display,
      visibility: element.style.visibility,
      position: element.style.position,
      left: element.style.left,
      width: element.style.width
    };
    element.style.display = 'block';
    element.style.visibility = 'visible';
    element.style.position = 'fixed';
    element.style.left = '-9999px';
    element.style.width = '800px';
  }

  try {
    // 1. Wait for document fonts to load
    if (document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch (e) {
        // Continue even if font ready promise rejects
      }
    }

    // 2. Preload and decode all images (signatures, logos) inside the container
    await preloadAllContainerImages(element);

    // Give browser a microtask tick to complete any pending layout recalculations
    await new Promise((res) => setTimeout(res, 50));

    const elementWidth = element.offsetWidth || 800;
    const elementHeight = element.offsetHeight || 1120;

    // 3. High-resolution canvas capture via html2canvas
    const canvas = await html2canvas(element, {
      scale: 2.0, // 2x scale: crisp 300 DPI equivalent print fidelity with safe memory usage
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      width: elementWidth,
      height: elementHeight,
      windowWidth: elementWidth,
      windowHeight: elementHeight,
      onclone: (clonedDoc, clonedElement) => {
        // Ensure cloned element is visible and properly sized
        if (clonedElement) {
          clonedElement.style.display = 'block';
          clonedElement.style.visibility = 'visible';
          clonedElement.style.width = `${elementWidth}px`;
          clonedElement.style.margin = '0 auto';
        }

        // Hide no-print elements in cloned document
        const noPrints = clonedDoc.querySelectorAll('.no-print');
        noPrints.forEach((el) => el.style.setProperty('display', 'none', 'important'));

        // Reset shadows and borders for crisp print
        const voucher = clonedDoc.querySelector('.voucher-container');
        if (voucher) {
          voucher.style.boxShadow = 'none';
          voucher.style.borderRadius = '0px';
          voucher.style.margin = '0 auto';
          voucher.style.width = '100%';
          voucher.style.maxWidth = '100%';
        }
      }
    });

    // 4. Validate resulting canvas
    if (!canvas || canvas.width <= 0 || canvas.height <= 0) {
      throw new Error(`Canvas rendering resulted in an invalid canvas size (${canvas ? canvas.width : 0}x${canvas ? canvas.height : 0})`);
    }

    // 5. Initialize A4 Portrait jsPDF (210mm x 297mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pdfPageWidth = 210;
    const pdfPageHeight = 297;
    const margin = 6; // 6mm margin
    const usableWidth = pdfPageWidth - margin * 2; // 198mm
    const usableHeight = pdfPageHeight - margin * 2; // 285mm

    // Calculate aspect ratio height in mm
    let finalWidth = usableWidth;
    let finalHeight = (canvas.height * usableWidth) / canvas.width;
    let posX = margin;
    let posY = margin;

    // Single-page A4 Fit: If height exceeds single page, scale down proportionally
    if (finalHeight > usableHeight) {
      const scaleFactor = usableHeight / finalHeight;
      finalWidth = usableWidth * scaleFactor;
      finalHeight = usableHeight;
      posX = (pdfPageWidth - finalWidth) / 2;
      posY = margin;
    } else {
      // Center vertically if there is excess vertical space
      posY = Math.max(margin, (pdfPageHeight - finalHeight) / 2);
    }

    // 6. Reliable Image Embedding with Multi-Tier Fallback
    let imageEmbedded = false;

    // Tier 1: High-Fidelity PNG embedding
    try {
      const pngData = canvas.toDataURL('image/png');
      if (isValidDataUrl(pngData, 'PNG')) {
        pdf.addImage(pngData, 'PNG', posX, posY, finalWidth, finalHeight, undefined, 'FAST');
        imageEmbedded = true;
      }
    } catch (pngErr) {
      console.warn('[PDF Generator] Tier 1 PNG embedding failed:', pngErr.message);
    }

    // Tier 2: Ultra-High Quality JPEG embedding (100% immune to PNG corruption bugs)
    if (!imageEmbedded) {
      try {
        const jpegData = canvas.toDataURL('image/jpeg', 0.98);
        if (isValidDataUrl(jpegData, 'JPEG')) {
          pdf.addImage(jpegData, 'JPEG', posX, posY, finalWidth, finalHeight, undefined, 'FAST');
          imageEmbedded = true;
          console.info('[PDF Generator] Successfully used high-quality JPEG pipeline.');
        }
      } catch (jpegErr) {
        console.warn('[PDF Generator] Tier 2 JPEG embedding failed:', jpegErr.message);
      }
    }

    // Tier 3: Direct Canvas Object embedding
    if (!imageEmbedded) {
      try {
        pdf.addImage(canvas, 'JPEG', posX, posY, finalWidth, finalHeight, undefined, 'FAST');
        imageEmbedded = true;
        console.info('[PDF Generator] Successfully embedded using direct canvas reference.');
      } catch (directCanvasErr) {
        console.error('[PDF Generator] Tier 3 Direct Canvas embedding failed:', directCanvasErr.message);
        throw new Error(`Failed to embed voucher image into PDF: ${directCanvasErr.message}`);
      }
    }

    // 7. Save PDF with sanitized official filename
    const cleanNumber = (voucherNumber || 'voucher').replace(/[\/\\:*?"<>|]/g, '-').trim();
    const fileName = `DESTIN-CABS-${cleanNumber || 'VOUCHER'}.pdf`;
    pdf.save(fileName);

    return true;
  } catch (error) {
    console.error('[PDF Generation Error]', error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  } finally {
    // Revert any temporary layout overrides
    if (hasZeroDimensions && originalStyles) {
      element.style.display = originalStyles.display;
      element.style.visibility = originalStyles.visibility;
      element.style.position = originalStyles.position;
      element.style.left = originalStyles.left;
      element.style.width = originalStyles.width;
    }
  }
};

/**
 * Triggers standard browser print dialog styled for A4
 */
export const printVoucher = () => {
  window.print();
};
