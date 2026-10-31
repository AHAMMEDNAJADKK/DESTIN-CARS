import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { preloadAllContainerImages, isValidDataUrl } from './imageProcessor';

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
      top: element.style.top,
      width: element.style.width,
      zIndex: element.style.zIndex
    };
    element.style.display = 'block';
    element.style.visibility = 'visible';
    element.style.position = 'fixed';
    element.style.left = '0px';
    element.style.top = '0px';
    element.style.width = '800px';
    element.style.zIndex = '-9999';
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

    const elementWidth = 800;
    const elementHeight = element.scrollHeight || element.offsetHeight || 1120;

    // 3. High-resolution canvas capture via html2canvas
    const canvas = await html2canvas(element, {
      scale: 2.0, // 2x scale: crisp 300 DPI equivalent print fidelity with safe memory usage
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: elementWidth,
      height: elementHeight,
      windowWidth: 800,
      onclone: (clonedDoc, clonedElement) => {
        if (clonedElement) {
          // Isolate clonedElement into a dedicated wrapper at top-left of clonedDoc
          const isolatedContainer = clonedDoc.createElement('div');
          isolatedContainer.style.position = 'absolute';
          isolatedContainer.style.top = '0';
          isolatedContainer.style.left = '0';
          isolatedContainer.style.width = '800px';
          isolatedContainer.style.backgroundColor = '#ffffff';
          isolatedContainer.style.zIndex = '999999';
          isolatedContainer.style.margin = '0';
          isolatedContainer.style.padding = '0';

          // Reset positioning and styles on cloned element
          clonedElement.style.display = 'block';
          clonedElement.style.visibility = 'visible';
          clonedElement.style.position = 'relative';
          clonedElement.style.left = '0';
          clonedElement.style.top = '0';
          clonedElement.style.width = '800px';
          clonedElement.style.maxWidth = '800px';
          clonedElement.style.minWidth = '800px';
          clonedElement.style.margin = '0 auto';
          clonedElement.style.boxShadow = 'none';
          clonedElement.style.borderRadius = '0px';

          // Hide action buttons inside clonedElement
          const innerNoPrints = clonedElement.querySelectorAll('button, .no-print');
          innerNoPrints.forEach((el) => el.style.setProperty('display', 'none', 'important'));

          isolatedContainer.appendChild(clonedElement);
          clonedDoc.body.appendChild(isolatedContainer);
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

    // Tier 2: Ultra-High Quality JPEG embedding
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
      element.style.top = originalStyles.top;
      element.style.width = originalStyles.width;
      element.style.zIndex = originalStyles.zIndex;
    }
  }
};

/**
 * Triggers standard browser print dialog styled for A4
 */
export const printVoucher = () => {
  window.print();
};
