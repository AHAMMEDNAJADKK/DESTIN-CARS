/**
 * Destin Cabs Image Processing & Verification Pipeline
 * Ensures all logos, signatures, and visual assets are completely decoded,
 * validated, and converted into PDF-compatible formats before embedding.
 */

/**
 * Loads and verifies an image asset from a URL or base64 data URL.
 * Guarantees that the image is completely loaded, decoded, and has positive dimensions.
 * 
 * @param {string} src - Image URL or base64 data string
 * @param {number} timeoutMs - Max wait time in ms (default 5000ms)
 * @returns {Promise<HTMLImageElement>} Verified image element
 */
export const loadAndVerifyImage = (src, timeoutMs = 5000) => {
  return new Promise((resolve, reject) => {
    if (!src || typeof src !== 'string' || src.trim() === '' || src === 'data:,') {
      return reject(new Error('Invalid or empty image source provided'));
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    let timer = null;

    const cleanup = () => {
      if (timer) clearTimeout(timer);
      img.onload = null;
      img.onerror = null;
    };

    timer = setTimeout(() => {
      cleanup();
      reject(new Error('Image load timed out after ' + timeoutMs + 'ms'));
    }, timeoutMs);

    img.onload = async () => {
      try {
        // Modern browser asynchronous image decode check
        if (typeof img.decode === 'function') {
          await img.decode();
        }

        if (img.naturalWidth <= 0 || img.naturalHeight <= 0) {
          cleanup();
          return reject(new Error('Image loaded with invalid dimensions (0x0)'));
        }

        cleanup();
        resolve(img);
      } catch (decodeErr) {
        // Fallback: If decode() rejects, but naturalWidth > 0, it's still usable
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
          cleanup();
          resolve(img);
        } else {
          cleanup();
          reject(new Error(`Failed to decode image data: ${decodeErr.message}`));
        }
      }
    };

    img.onerror = (err) => {
      cleanup();
      reject(new Error('Failed to load image asset (network error or invalid format)'));
    };

    img.src = src;
  });
};

/**
 * Pre-loads and decodes all <img> elements inside a DOM container before capture.
 * Catches errors on individual broken images so PDF generation never crashes.
 * 
 * @param {HTMLElement} container - The DOM container element
 * @returns {Promise<{ loaded: number, failed: number }>}
 */
export const preloadAllContainerImages = async (container) => {
  if (!container) return { loaded: 0, failed: 0 };

  const images = Array.from(container.querySelectorAll('img'));
  let loaded = 0;
  let failed = 0;

  await Promise.all(
    images.map(async (img) => {
      if (!img.src || img.src === '' || img.src === 'data:,') {
        failed++;
        return;
      }

      if (img.complete && img.naturalWidth > 0) {
        loaded++;
        return;
      }

      try {
        if (typeof img.decode === 'function') {
          await img.decode();
        } else {
          await new Promise((res, rej) => {
            img.onload = () => res();
            img.onerror = () => rej(new Error('Image failed to load'));
          });
        }
        loaded++;
      } catch (e) {
        console.warn('[Image Preloader] Image failed to decode:', img.src.substring(0, 50), e);
        failed++;
      }
    })
  );

  return { loaded, failed };
};

/**
 * Validates a base64 Data URL for PDF embedding.
 * Ensures the string is non-empty, contains valid MIME type, and minimum byte size.
 * 
 * @param {string} dataUrl - The data URL to test
 * @param {'PNG'|'JPEG'} expectedFormat - Expected format
 * @returns {boolean} True if data URL is valid and non-corrupt
 */
export const isValidDataUrl = (dataUrl, expectedFormat = 'PNG') => {
  if (!dataUrl || typeof dataUrl !== 'string') return false;
  if (dataUrl === 'data:,' || dataUrl.trim().length < 30) return false;

  if (expectedFormat === 'PNG') {
    // Valid PNG data URL must start with data:image/png;base64,
    return dataUrl.startsWith('data:image/png;base64,') && dataUrl.length > 30;
  }

  if (expectedFormat === 'JPEG') {
    return (
      (dataUrl.startsWith('data:image/jpeg;base64,') || dataUrl.startsWith('data:image/jpg;base64,')) &&
      dataUrl.length > 30
    );
  }

  return dataUrl.startsWith('data:image/');
};

/**
 * Converts a loaded Image or Canvas to a validated, high-quality Data URL with fallback.
 * 
 * @param {HTMLCanvasElement|HTMLImageElement} source - Canvas or Image
 * @param {Object} options - Options including format, quality, and background color
 * @returns {{ dataUrl: string, format: string, width: number, height: number }}
 */
export const convertToSafeDataUrl = (source, options = {}) => {
  const {
    format = 'PNG',
    quality = 0.95,
    backgroundColor = '#ffffff'
  } = options;

  let canvas = null;
  let width = 0;
  let height = 0;

  if (source instanceof HTMLCanvasElement) {
    canvas = source;
    width = canvas.width;
    height = canvas.height;
  } else if (source instanceof HTMLImageElement) {
    width = source.naturalWidth || source.width;
    height = source.naturalHeight || source.height;
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (backgroundColor) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
    }
    ctx.drawImage(source, 0, 0);
  } else {
    throw new Error('Unsupported source passed to convertToSafeDataUrl');
  }

  if (width <= 0 || height <= 0) {
    throw new Error(`Cannot export image with invalid dimensions: ${width}x${height}`);
  }

  // Primary attempt: Requested format
  let mimeType = format.toUpperCase() === 'JPEG' ? 'image/jpeg' : 'image/png';
  let dataUrl = canvas.toDataURL(mimeType, quality);
  let effectiveFormat = format.toUpperCase() === 'JPEG' ? 'JPEG' : 'PNG';

  // Validation & Fallback: If PNG generation resulted in corrupt or empty data URL, fall back to JPEG
  if (!isValidDataUrl(dataUrl, effectiveFormat)) {
    console.warn(`[Image Processor] ${effectiveFormat} data URL invalid, falling back to JPEG`);
    dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    effectiveFormat = 'JPEG';
  }

  if (!isValidDataUrl(dataUrl, effectiveFormat)) {
    throw new Error(`Failed to generate a valid data URL from canvas (${width}x${height})`);
  }

  return {
    dataUrl,
    format: effectiveFormat,
    width,
    height
  };
};
