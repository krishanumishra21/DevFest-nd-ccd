/**
 * DevFest & CCD Post Generator - Main Application Script
 * Precision Composite Engine using official flyer artwork for 100% exact fidelity.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const participantNameInput = document.getElementById('participantName');
  const imageFileInput = document.getElementById('imageFileInput');
  const dropzone = document.getElementById('dropzone');
  const dropzonePrompt = document.getElementById('dropzonePrompt');
  const errorBox = document.getElementById('errorBox');
  const generateBtn = document.getElementById('generateBtn');
  const postCanvas = document.getElementById('postCanvas');
  const canvasLoading = document.getElementById('canvasLoading');
  const downloadBtn = document.getElementById('downloadBtn');
  const copyCaptionBtn = document.getElementById('copyCaptionBtn');
  const nativeShareBtn = document.getElementById('nativeShareBtn');
  const captionTextarea = document.getElementById('captionTextarea');
  const toastContainer = document.getElementById('toastContainer');

  // Sliders
  const zoomSlider = document.getElementById('zoomSlider');
  const panXSlider = document.getElementById('panXSlider');
  const panYSlider = document.getElementById('panYSlider');
  const resetImageBtn = document.getElementById('resetImageBtn');
  const imageControls = document.getElementById('imageControls');

  // Social Sharing Buttons
  const shareLinkedInBtn = document.getElementById('shareLinkedInBtn');
  const shareXBtn = document.getElementById('shareXBtn');
  const shareWhatsAppBtn = document.getElementById('shareWhatsAppBtn');

  // Preset Avatars
  const presetBtns = document.querySelectorAll('.avatar-preset-btn');

  // App State
  let currentTemplate = 'devfest'; // Default: DevFest Chandigarh
  let userImage = null;
  let userImageTransform = { zoom: 1.0, panX: 0, panY: 0 };
  let isDraggingCanvas = false;
  let dragStartX = 0, dragStartY = 0;
  let initialPanX = 0, initialPanY = 0;

  // Preload Original Flyer Artwork
  // These filenames match the assets in the project folder.
  const devfestOriginalImg = new Image();
  const ccdOriginalImg = new Image();
  const defaultAvatarImg = new Image();

  devfestOriginalImg.onload = () => {
    console.log(
      'DevFest loaded:',
      devfestOriginalImg.naturalWidth,
      devfestOriginalImg.naturalHeight
    );
    renderCanvas();
  };

  devfestOriginalImg.onerror = () => {
    console.error('FAILED TO LOAD DevFest:', devfestOriginalImg.src);
    showError('Could not load DevFest poster. Check assets/devfest-original.jpg');
  };

  ccdOriginalImg.onload = () => {
    console.log(
      'CCD loaded:',
      ccdOriginalImg.naturalWidth,
      ccdOriginalImg.naturalHeight
    );
    renderCanvas();
  };

  ccdOriginalImg.onerror = () => {
    console.error('FAILED TO LOAD CCD:', ccdOriginalImg.src);
    showError('Could not load CCD poster. Check assets/ccd-original.png');
  };

  defaultAvatarImg.onload = () => renderCanvas();
  defaultAvatarImg.onerror = () => {
    console.warn('Default avatar could not be loaded:', defaultAvatarImg.src);
  };

  // Exact filenames from the assets folder.
  devfestOriginalImg.src = './assets/devfest-original.png';
  ccdOriginalImg.src = './assets/ccd-original.png';
  defaultAvatarImg.src = './assets/default-avatar.svg';

  // Canvas Context
  const ctx = postCanvas.getContext('2d');

  initEventListeners();
  updateCaptionText();
  renderCanvas();

  /* ==========================================================================
     Event Listener Bindings
     ========================================================================== */
  function initEventListeners() {
    // Template Selection (DevFest vs CCD)
    document.querySelectorAll('input[name="templateChoice"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        currentTemplate = e.target.value;
        document.querySelectorAll('.template-card').forEach(card => {
          card.classList.toggle('active', card.dataset.template === currentTemplate);
        });
        updateCaptionText();
        renderCanvas();
      });
    });

    // Name Input Change
    participantNameInput.addEventListener('input', () => {
      updateCaptionText();
      renderCanvas();
    });

    // Dropzone
    dropzone.addEventListener('click', () => imageFileInput.click());
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-over');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleImageUpload(e.dataTransfer.files[0]);
      }
    });

    imageFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleImageUpload(e.target.files[0]);
      }
    });

    // Sliders
    zoomSlider.addEventListener('input', (e) => {
      userImageTransform.zoom = parseFloat(e.target.value);
      renderCanvas();
    });
    panXSlider.addEventListener('input', (e) => {
      userImageTransform.panX = parseInt(e.target.value, 10);
      renderCanvas();
    });
    panYSlider.addEventListener('input', (e) => {
      userImageTransform.panY = parseInt(e.target.value, 10);
      renderCanvas();
    });

    resetImageBtn.addEventListener('click', () => {
      userImageTransform = { zoom: 1.0, panX: 0, panY: 0 };
      zoomSlider.value = 1.0;
      panXSlider.value = 0;
      panYSlider.value = 0;
      renderCanvas();
    });

    // Sample Avatar Presets
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const svgSrc = btn.dataset.src;
        const img = new Image();
        img.onload = () => {
          userImage = img;
          userImageTransform = { zoom: 1.0, panX: 0, panY: 0 };
          zoomSlider.value = 1.0;
          panXSlider.value = 0;
          panYSlider.value = 0;
          imageControls.style.display = 'block';
          hideError();
          renderCanvas();
          showToast('Sample avatar loaded!');
        };
        img.src = svgSrc;
      });
    });

    // Generate Button Action
    generateBtn.addEventListener('click', () => {
      showLoading(true);
      setTimeout(() => {
        renderCanvas();
        showLoading(false);
        postCanvas.scrollIntoView({ behavior: 'smooth', block: 'center' });
        showToast('Poster generated successfully! 🚀');
      }, 350);
    });

    // Download PNG
    downloadBtn.addEventListener('click', downloadCanvasImage);

    // Copy Caption
    copyCaptionBtn.addEventListener('click', () => {
      captionTextarea.select();
      navigator.clipboard.writeText(captionTextarea.value).then(() => {
        showToast('Caption copied to clipboard! 📋');
      }).catch(() => {
        showToast('Failed to copy. Please select manually.');
      });
    });

    // Native Share
    if (navigator.share) {
      nativeShareBtn.style.display = 'inline-flex';
      nativeShareBtn.addEventListener('click', async () => {
        try {
          postCanvas.toBlob(async (blob) => {
            const nameStr = participantNameInput.value.trim() || 'Participant';
            const file = new File([blob], `Poster_${nameStr.replace(/\s+/g, '_')}.png`, { type: 'image/png' });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              await navigator.share({
                title: 'DevFest & CCD Chandigarh',
                text: captionTextarea.value,
                files: [file]
              });
            } else {
              await navigator.share({
                title: 'DevFest & CCD Chandigarh',
                text: captionTextarea.value,
                url: window.location.href
              });
            }
          });
        } catch (err) {
          console.log('Share canceled:', err);
        }
      });
    }

    // Social Links
    shareLinkedInBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const officialWebsite =
        (window.CONFIG && window.CONFIG.officialWebsite) || window.location.href;
      const url = encodeURIComponent(officialWebsite);
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    });

    shareXBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = encodeURIComponent(captionTextarea.value);
      window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    });

    shareWhatsAppBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = encodeURIComponent(captionTextarea.value);
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    });

    // Mouse Drag on Canvas to Pan
    postCanvas.addEventListener('mousedown', (e) => {
      if (!userImage) return;
      isDraggingCanvas = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      initialPanX = userImageTransform.panX;
      initialPanY = userImageTransform.panY;
      postCanvas.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDraggingCanvas) return;
      const dx = (e.clientX - dragStartX) * (postCanvas.width / postCanvas.clientWidth);
      const dy = (e.clientY - dragStartY) * (postCanvas.height / postCanvas.clientHeight);
      userImageTransform.panX = Math.min(250, Math.max(-250, initialPanX + dx));
      userImageTransform.panY = Math.min(250, Math.max(-250, initialPanY + dy));
      panXSlider.value = userImageTransform.panX;
      panYSlider.value = userImageTransform.panY;
      renderCanvas();
    });

    window.addEventListener('mouseup', () => {
      if (isDraggingCanvas) {
        isDraggingCanvas = false;
        postCanvas.style.cursor = 'default';
      }
    });
  }

  /* ==========================================================================
     Image Upload Handling
     ========================================================================== */
  function handleImageUpload(file) {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showError('Please upload a valid image file (PNG, JPG, JPEG, or WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showError('File size exceeds 10MB limit.');
      return;
    }

    hideError();
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        userImage = img;
        userImageTransform = { zoom: 1.0, panX: 0, panY: 0 };
        zoomSlider.value = 1.0;
        panXSlider.value = 0;
        panYSlider.value = 0;
        dropzonePrompt.innerHTML = `<span style="color: var(--neon-cyan); font-weight: 700;">✓ Photo Loaded: ${file.name}</span><br><small style="color: var(--text-muted);">Click or drag to change</small>`;
        imageControls.style.display = 'block';
        renderCanvas();
        showToast('Photo loaded into poster template!');
      };
      img.onerror = () => showError('Failed to load image file.');
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.classList.add('active');
  }

  function hideError() {
    errorBox.textContent = '';
    errorBox.classList.remove('active');
  }

  function updateCaptionText() {
    const participantName = participantNameInput.value.trim() || '[YOUR NAME]';

    // Use config.js when available, but don't let a missing config file
    // prevent the poster itself from rendering.
    const templates =
      window.CONFIG && window.CONFIG.templates
        ? window.CONFIG.templates
        : {};

    const fallbackCaptions = {
      devfest:
        `I'm joining DevFest Chandigarh 2026! 🚀\n\nMeet developers, builders, and tech enthusiasts at DevFest Chandigarh.\n\n[NAME]`,
      ccd:
        `I'm joining Cloud Community Day Chandigarh 2026! ☁️\n\nConnect, learn, and build with the Google Cloud community.\n\n[NAME]`
    };

    const templateConfig = templates[currentTemplate] || {};
    const captionTemplate =
      templateConfig.caption ||
      fallbackCaptions[currentTemplate] ||
      '';

    captionTextarea.value = captionTemplate.replace(
      /\[NAME\]/g,
      participantName
    );
  }

  /* ==========================================================================
     MAIN CANVAS COMPOSITOR
     ========================================================================== */
  function renderCanvas() {
    const name = participantNameInput.value.trim() || 'YOUR NAME HERE';

    if (currentTemplate === 'ccd') {
      renderCCDExactTemplate(name);
    } else {
      renderDevFestExactTemplate(name);
    }
  }

  /* --------------------------------------------------------------------------
     1. DevFest Chandigarh Poster (507 x 1024 Base Template, Scaled 2x = 1014 x 2048)
     -------------------------------------------------------------------------- */
  function renderDevFestExactTemplate(name) {
    if (!devfestOriginalImg.complete || devfestOriginalImg.naturalWidth === 0) return;

    const scaleFactor = 2.0;
    const baseW = devfestOriginalImg.naturalWidth;   // 507
    const baseH = devfestOriginalImg.naturalHeight;  // 1024

    postCanvas.width = baseW * scaleFactor;
    postCanvas.height = baseH * scaleFactor;

    ctx.save();
    ctx.scale(scaleFactor, scaleFactor);

    // Step 1: Draw Official Original DevFest Flyer Background
    ctx.drawImage(devfestOriginalImg, 0, 0, baseW, baseH);

    // Step 2: Draw Participant Photo Inside Bounding Box (x: 160, y: 256, w: 187, h: 247, r: 20)
    const photoX = 300;
    const photoY = 450;
    const photoW = 400;
    const photoH = 400;
    const photoR = 20;

    ctx.save();
    drawRoundedRect(ctx, photoX, photoY, photoW, photoH, photoR);
    ctx.fillStyle = '#0E172A';
    ctx.fill(); // Dark background for avatar
    ctx.clip(); // Clip photo inside frame

    const imgToDraw = userImage || defaultAvatarImg;
    if (imgToDraw && imgToDraw.complete) {
      drawCoverImage(imgToDraw, photoX, photoY, photoW, photoH, userImageTransform);
    }
    ctx.restore();

    // Step 3: Draw Clean White Name Pill covering original [PARTICIPANT NAME] text
    // Pixel-precise: original pill spans x=57..458, y=484..525
    const nameX = 260;
    const nameY = 880;
    const nameW = 480;
    const nameH = 50;
    const nameR = 21;
    const centerX = nameX + nameW / 2;

    ctx.save();
    drawRoundedRect(ctx, nameX, nameY, nameW, nameH, nameR);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill(); // Fill solid white pill to fully cover placeholder text

    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let fontSize = 30;
    if (name.length > 20) fontSize = 13;
    else if (name.length > 15) fontSize = 15;

   ctx.font = `bold ${fontSize}px "Arial Black", sans-serif`;
    ctx.fillText(name.toUpperCase(), centerX, nameY + nameH / 2 + 1);
    ctx.restore();

    ctx.restore();
  }

  /* --------------------------------------------------------------------------
     2. Cloud Community Day Poster (682 x 1024 Base Template, Scaled 2x = 1364 x 2048)
     -------------------------------------------------------------------------- */
function renderCCDExactTemplate(name) {
  if (
    !ccdOriginalImg.complete ||
    ccdOriginalImg.naturalWidth === 0
  ) return;

  const scaleFactor = 2.0;

  const baseW = ccdOriginalImg.naturalWidth;
  const baseH = ccdOriginalImg.naturalHeight;

  postCanvas.width = baseW * scaleFactor;
  postCanvas.height = baseH * scaleFactor;

  ctx.save();
  ctx.scale(scaleFactor, scaleFactor);

  // Background
  ctx.drawImage(
    ccdOriginalImg,
    0,
    0,
    baseW,
    baseH
  );


  // ==========================================================
  // CCD PHOTO
  // ==========================================================

  const photoX = 332;
  const photoY = 480;
  const photoW = 360;
  const photoH = 360;
  const photoR = 20;

  ctx.save();

  drawRoundedRect(
    ctx,
    photoX,
    photoY,
    photoW,
    photoH,
    photoR
  );

  ctx.fillStyle = '#E2E8F0';
  ctx.fill();

  ctx.clip();

  const imgToDraw =
    userImage || defaultAvatarImg;

  if (
    imgToDraw &&
    imgToDraw.complete
  ) {
    drawCoverImage(
      imgToDraw,
      photoX,
      photoY,
      photoW,
      photoH,
      userImageTransform
    );
  }

  ctx.restore();


  // ==========================================================
  // CCD NAME
  // ==========================================================

  const nameX = 228;
  const nameY = 843;
  const nameW = 550;
  const nameH = 75;
  const nameR = 21;

  const centerX =
    nameX + nameW / 2;

  ctx.save();

  drawRoundedRect(
    ctx,
    nameX,
    nameY,
    nameW,
    nameH,
    nameR
  );

  ctx.fillStyle = '#FFFFFF';
  ctx.fill();

  ctx.lineWidth = 3;
  ctx.strokeStyle = '#3B82F6';
  ctx.stroke();

  ctx.fillStyle = '#0F2B5B';

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  let fontSize = 30;

  if (name.length > 20) {
    fontSize = 14;
  } else if (name.length > 15) {
    fontSize = 17;
  }

 ctx.font = `bold ${fontSize}px "Arial Black", sans-serif`;

  ctx.fillText(
    name.toUpperCase(),
    centerX,
    nameY + nameH / 2 + 1
  );

  ctx.restore();

  ctx.restore();
}

  /* ==========================================================================
     Canvas Draw Helpers
     ========================================================================== */
  function drawCoverImage(img, fx, fy, fw, fh, transform) {
    const scale = transform.zoom;
    const px = transform.panX;
    const py = transform.panY;

    let nw = img.naturalWidth || img.width;
    let nh = img.naturalHeight || img.height;

    const aspect = nw / nh;
    const frameAspect = fw / fh;

    let renderW, renderH;
    if (aspect > frameAspect) {
      renderH = fh * scale;
      renderW = renderH * aspect;
    } else {
      renderW = fw * scale;
      renderH = renderW / aspect;
    }

    const renderX = fx + (fw - renderW) / 2 + px;
    const renderY = fy + (fh - renderH) / 2 + py;
    ctx.drawImage(img, renderX, renderY, renderW, renderH);
  }

  function drawRoundedRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
  }

  function downloadCanvasImage() {
    const nameStr = participantNameInput.value.trim() || 'Participant';
    const cleanName = nameStr.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${currentTemplate.toUpperCase()}_${cleanName}.png`;

    const link = document.createElement('a');
    link.download = filename;
    link.href = postCanvas.toDataURL('image/png', 1.0);
    link.click();
    showToast(`Downloaded ${filename}! 🎁`);
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>⚡</span> ${message}`;
    toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  function showLoading(active) {
    if (active) canvasLoading.classList.add('active');
    else canvasLoading.classList.remove('active');
  }
});
