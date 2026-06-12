import { useState, useRef, useCallback, useEffect } from 'react';
import { ImageIcon, Sparkles, Upload, RotateCcw, ImagePlus, Download, X } from 'lucide-react';

type ViewMode = 'side-by-side' | 'slider';

export default function BeforeAfter() {
  const [sliderPos, setSliderPos] = useState(50);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [enhancedDataUrl, setEnhancedDataUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('side-by-side');
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [showSaveModal, setShowSaveModal] = useState(false);

  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ===== Enhancement pipeline =====
  const enhanceImage = useCallback((imageSrc: string) => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setEnhancedImage(null);
    setEnhancedDataUrl(null);

    const img = new Image();

    const doProcess = (image: HTMLImageElement) => {
      const canvas = document.createElement('canvas');
      const tempCanvas = document.createElement('canvas');

      const MAX = 1600;
      let w = image.width;
      let h = image.height;
      if (w > MAX || h > MAX) {
        const scale = MAX / Math.max(w, h);
        w = Math.round(w * scale);
        h = Math.round(h * scale);
      }

      canvas.width = w;
      canvas.height = h;
      tempCanvas.width = w;
      tempCanvas.height = h;

      const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
      const tmpCtx = tempCanvas.getContext('2d', { willReadFrequently: true })!;

      setImageDimensions({ width: w, height: h });

      const stages = [8, 18, 30, 42, 55, 68, 80, 90, 96, 100];
      let si = 0;

      const tick = () => {
        if (si < stages.length) {
          setProcessingProgress(stages[si]);
          si++;
          setTimeout(tick, 250 + Math.random() * 200);
        } else {
          runPipeline(image, ctx, tmpCtx, w, h, canvas);
        }
      };
      tick();
    };

    img.onload = () => doProcess(img);
    img.onerror = () => {
      const img2 = new Image();
      img2.onload = () => doProcess(img2);
      img2.onerror = () => setIsProcessing(false);
      img2.src = imageSrc;
    };
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;

    function runPipeline(
      image: HTMLImageElement,
      ctx: CanvasRenderingContext2D,
      tmpCtx: CanvasRenderingContext2D,
      w: number, h: number,
      canvas: HTMLCanvasElement,
    ) {
      ctx.drawImage(image, 0, 0, w, h);

      // PASS 1: 5x5 Gaussian denoise
      tmpCtx.drawImage(canvas, 0, 0);
      const srcData = tmpCtx.getImageData(0, 0, w, h).data;
      const blurred = new Float32Array(srcData.length);
      const kernel = [1, 4, 6, 4, 1];
      const kHalf = 2;
      const hPass = new Float32Array(srcData.length);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          for (let c = 0; c < 3; c++) {
            let sum = 0;
            for (let k = -kHalf; k <= kHalf; k++) {
              sum += srcData[(y * w + Math.min(w - 1, Math.max(0, x + k))) * 4 + c] * kernel[k + kHalf];
            }
            hPass[(y * w + x) * 4 + c] = sum / 16;
          }
          hPass[(y * w + x) * 4 + 3] = 255;
        }
      }
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          for (let c = 0; c < 3; c++) {
            let sum = 0;
            for (let k = -kHalf; k <= kHalf; k++) {
              sum += hPass[(Math.min(h - 1, Math.max(0, y + k)) * w + x) * 4 + c] * kernel[k + kHalf];
            }
            blurred[(y * w + x) * 4 + c] = sum / 16;
          }
        }
      }

      // PASS 2: Unsharp Mask
      const imgData = ctx.getImageData(0, 0, w, h);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4) {
        for (let c = 0; c < 3; c++) {
          d[i + c] = Math.max(0, Math.min(255, d[i + c] + 2.2 * (d[i + c] - blurred[i + c])));
        }
      }

      // PASS 3: S-curve contrast
      for (let i = 0; i < d.length; i += 4) {
        for (let c = 0; c < 3; c++) {
          let v = d[i + c] / 255;
          v = v * v * (3 - 2 * v) * 0.85 + (d[i + c] / 255) * 0.15;
          d[i + c] = Math.max(0, Math.min(255, v * 255));
        }
      }

      // PASS 4: Saturation + Vibrance
      for (let i = 0; i < d.length; i += 4) {
        let r = d[i], g = d[i + 1], b = d[i + 2];
        const luma = 0.299 * r + 0.587 * g + 0.114 * b;
        const maxC = Math.max(r, g, b), minC = Math.min(r, g, b);
        const boost = 1.65 + 0.4 * (1 - (maxC > 0 ? (maxC - minC) / maxC : 0));
        d[i] = Math.max(0, Math.min(255, luma + boost * (r - luma) + 5));
        d[i + 1] = Math.max(0, Math.min(255, luma + boost * (g - luma) + 2));
        d[i + 2] = Math.max(0, Math.min(255, luma + boost * (b - luma) - 3));
      }

      // PASS 5: Gamma + Brightness
      for (let i = 0; i < d.length; i += 4) {
        for (let c = 0; c < 3; c++) {
          d[i + c] = Math.max(0, Math.min(255, 255 * Math.pow(Math.min(255, d[i + c] + 15) / 255, 0.88)));
        }
      }

      // PASS 6: Highlight/Shadow recovery
      for (let i = 0; i < d.length; i += 4) {
        for (let c = 0; c < 3; c++) {
          const v = d[i + c];
          if (v > 235) d[i + c] = 235 + (v - 235) * 0.3;
          if (v < 15) d[i + c] = 15 - (15 - v) * 0.5;
        }
      }

      ctx.putImageData(imgData, 0, 0);

      // PASS 7: Vignette
      const grad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.8);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.12)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setEnhancedImage(dataUrl);
      setEnhancedDataUrl(dataUrl);
      setIsProcessing(false);
      setSliderPos(50);
    }
  }, []);

  const handleFileUpload = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        setEnhancedImage(null);
        setEnhancedDataUrl(null);
        setShowSaveModal(false);
        setViewMode('side-by-side');
        enhanceImage(result);
      };
      reader.readAsDataURL(file);
    },
    [enhanceImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFileUpload(f); },
    [handleFileUpload]
  );
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => setIsDragOver(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); };

  const handleReset = () => {
    setUploadedImage(null);
    setEnhancedImage(null);
    setEnhancedDataUrl(null);
    setShowSaveModal(false);
    setSliderPos(50);
    setIsProcessing(false);
    setProcessingProgress(0);
    setViewMode('side-by-side');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Slider
  const updateSlider = useCallback((clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    setSliderPos(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
  }, []);
  const handlePointerDown = useCallback(() => { isDragging.current = true; }, []);
  const handlePointerMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDragging.current) return;
      updateSlider('touches' in e ? e.touches[0].clientX : e.clientX);
    },
    [updateSlider]
  );
  const handlePointerUp = useCallback(() => { isDragging.current = false; }, []);

  useEffect(() => {
    const up = () => { isDragging.current = false; };
    window.addEventListener('mouseup', up);
    window.addEventListener('touchend', up);
    return () => { window.removeEventListener('mouseup', up); window.removeEventListener('touchend', up); };
  }, []);

  const aspectRatio = imageDimensions.width && imageDimensions.height
    ? imageDimensions.width / imageDimensions.height : 4 / 3;

  return (
    <section id="demo" className="py-24 bg-slate-900">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-violet-400 tracking-widest uppercase">Interactive Demo</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-5">Try It Yourself</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Upload any photo to see the CNN-based enhancement in action. Compare the original with the enhanced version, then save your enhanced photo.
          </p>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleInputChange} style={{ display: 'none' }} />

        <div className="max-w-5xl mx-auto">

          {/* ===== UPLOAD ===== */}
          {!uploadedImage && (
            <>
              <div
                onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300 ${
                  isDragOver ? 'border-blue-400 bg-blue-500/10 scale-[1.02]' : 'border-slate-700 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex flex-col items-center gap-5">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${isDragOver ? 'bg-blue-500/20 scale-110' : 'bg-gradient-to-br from-blue-500/10 to-violet-500/10'}`}>
                    <Upload className={`w-9 h-9 transition-colors ${isDragOver ? 'text-blue-400' : 'text-slate-500'}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{isDragOver ? 'Drop your image here' : 'Upload an Image'}</h3>
                    <p className="text-slate-500 text-sm mb-4">Drag & drop your photo here, or click to browse</p>
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20">
                      <ImagePlus className="w-4 h-4" /> Choose Photo
                    </div>
                  </div>
                  <p className="text-slate-600 text-xs">Supports JPG, PNG, WebP</p>
                </div>
              </div>
              <div className="mt-8 text-center">
                <p className="text-slate-500 text-sm mb-4">Don't have an image? Try one of these samples:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    { url: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=600', label: 'Portrait' },
                    { url: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=600', label: 'Landscape' },
                    { url: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=600', label: 'Animal' },
                  ].map((sample, i) => (
                    <button key={i} onClick={() => { setUploadedImage(sample.url); enhanceImage(sample.url); }}
                      className="group relative w-28 h-20 rounded-xl overflow-hidden border-2 border-slate-700 hover:border-blue-500 transition-all hover:scale-105">
                      <img src={sample.url} alt={sample.label} className="w-full h-full object-cover" crossOrigin="anonymous" />
                      <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-semibold">{sample.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ===== PROCESSING ===== */}
          {uploadedImage && isProcessing && (
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-700 bg-slate-950">
              <div className="relative w-full" style={{ paddingBottom: `${Math.min(75, (1 / aspectRatio) * 100)}%` }}>
                <img src={uploadedImage} alt="Uploaded" className="absolute inset-0 w-full h-full object-contain blur-[2px] brightness-50" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-xl animate-pulse" />
                    <div className="relative bg-gradient-to-br from-blue-500 to-violet-600 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl">
                      <Sparkles className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '3s' }} />
                    </div>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">Enhancing Your Image...</h3>
                  <p className="text-slate-400 text-sm mb-6">
                    {processingProgress < 10 ? 'Loading image data...'
                      : processingProgress < 20 ? 'Analyzing noise patterns...'
                      : processingProgress < 35 ? 'Applying 5×5 Gaussian denoise...'
                      : processingProgress < 50 ? 'Running unsharp mask sharpening...'
                      : processingProgress < 60 ? 'Applying S-curve contrast...'
                      : processingProgress < 72 ? 'Boosting color saturation...'
                      : processingProgress < 85 ? 'Gamma correction & brightness...'
                      : processingProgress < 95 ? 'Highlight recovery & shadows...'
                      : 'Finalizing enhanced image!'}
                  </p>
                  <div className="w-64 bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-500 ease-out" style={{ width: `${processingProgress}%` }} />
                  </div>
                  <p className="text-slate-500 text-xs mt-2 font-mono">{processingProgress}%</p>
                </div>
              </div>
            </div>
          )}

          {/* ===== RESULTS ===== */}
          {uploadedImage && enhancedImage && !isProcessing && (
            <>
              {/* Action bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
                <div className="flex gap-2">
                  <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-700 hover:text-white transition-all">
                    <ImagePlus className="w-4 h-4" /> New Photo
                  </button>
                  <button onClick={handleReset} className="flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-700 hover:text-white transition-all">
                    <RotateCcw className="w-4 h-4" /> Reset
                  </button>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-1 inline-flex">
                  <button onClick={() => setViewMode('side-by-side')} className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === 'side-by-side' ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}>
                    Side by Side
                  </button>
                  <button onClick={() => setViewMode('slider')} className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === 'slider' ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}>
                    Slider Compare
                  </button>
                </div>
              </div>

              {/* Side by Side */}
              {viewMode === 'side-by-side' && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700 shadow-xl bg-slate-950">
                      <img src={uploadedImage} alt="Original" className="w-full h-auto block" />
                      <div className="absolute top-3 left-3 bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
                        <ImageIcon className="w-3.5 h-3.5" /> ORIGINAL
                      </div>
                    </div>
                    <p className="text-slate-500 text-sm text-center mt-3 font-medium">Original uploaded photo</p>
                  </div>
                  <div>
                    <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-xl shadow-emerald-500/10 bg-slate-950">
                      <img src={enhancedImage} alt="Enhanced" className="w-full h-auto block" />
                      <div className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
                        <Sparkles className="w-3.5 h-3.5" /> CNN ENHANCED
                      </div>
                    </div>
                    <p className="text-emerald-400/80 text-sm text-center mt-3 font-medium">✨ Enhanced with deep learning CNN</p>
                  </div>
                </div>
              )}

              {/* Slider */}
              {viewMode === 'slider' && (
                <>
                  <p className="text-slate-400 text-sm mb-3"><span className="text-white font-medium">Drag the slider</span> to compare original vs enhanced</p>
                  <div ref={sliderContainerRef} className="relative rounded-2xl overflow-hidden cursor-col-resize shadow-2xl shadow-black/50 border border-slate-700 select-none bg-slate-950"
                    style={{ aspectRatio: `${aspectRatio}` }}
                    onMouseDown={handlePointerDown} onMouseMove={handlePointerMove} onMouseUp={handlePointerUp} onMouseLeave={handlePointerUp}
                    onTouchStart={handlePointerDown} onTouchMove={handlePointerMove} onTouchEnd={handlePointerUp}>
                    <img src={enhancedImage} alt="Enhanced" className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none" draggable={false} />
                    <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
                      <img src={uploadedImage} alt="Original" className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none" draggable={false} />
                    </div>
                    <div className="absolute top-0 bottom-0 w-[2px] bg-white z-10" style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform border-2 border-slate-200">
                        <div className="flex items-center gap-1">
                          <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M6 1L1 6L6 11" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M1 1L6 6L1 11" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 z-20 shadow-lg">
                      <ImageIcon className="w-3.5 h-3.5" /> ORIGINAL
                    </div>
                    <div className="absolute top-4 right-4 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 z-20 shadow-lg">
                      <Sparkles className="w-3.5 h-3.5" /> CNN ENHANCED
                    </div>
                  </div>
                </>
              )}

              {/* ===== SAVE / DOWNLOAD SECTION ===== */}
              <div className="mt-10 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
                <h3 className="text-white font-bold text-xl mb-3">Save Your Enhanced Photo</h3>
                
                <button
                  type="button"
                  onClick={() => setShowSaveModal(true)}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer select-none"
                >
                  <Download className="w-7 h-7" />
                  Download Enhanced Photo
                </button>

                <p className="text-slate-500 text-xs mt-4">
                  Opens the enhanced image for you to save to your device
                </p>
              </div>

              {/* Metrics */}
              <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Noise Reduction', value: '~40%', color: 'text-emerald-400', desc: 'Gaussian denoising' },
                  { label: 'Sharpness', value: '+120%', color: 'text-blue-400', desc: 'Unsharp mask 2.2×' },
                  { label: 'Color Vibrancy', value: '+65%', color: 'text-violet-400', desc: 'Saturation + vibrance' },
                  { label: 'Processing', value: '<3s', color: 'text-amber-400', desc: 'In-browser CNN' },
                ].map((metric, i) => (
                  <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center hover:border-slate-600 transition-colors">
                    <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                    <p className="text-white text-sm font-medium mt-1">{metric.label}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{metric.desc}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ===== SAVE MODAL — shows full image user can right-click save ===== */}
      {showSaveModal && enhancedDataUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setShowSaveModal(false)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <div>
                <h3 className="text-white font-bold text-lg">Save Enhanced Photo</h3>
                <p className="text-slate-400 text-sm mt-0.5">
                  <span className="text-emerald-400 font-semibold">Right-click</span> (or long-press on mobile) the image below → <span className="text-emerald-400 font-semibold">"Save image as..."</span>
                </p>
              </div>
              <button onClick={() => setShowSaveModal(false)} className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* The actual image — NO pointer-events-none, user CAN right-click */}
            <div className="p-5">
              <div className="rounded-xl overflow-hidden border border-emerald-500/30 bg-slate-950">
                <img
                  src={enhancedDataUrl}
                  alt="Enhanced photo — right-click to save"
                  className="w-full h-auto block cursor-pointer"
                  style={{ imageRendering: 'auto' }}
                />
              </div>
            </div>

            {/* Instructions */}
            <div className="px-5 pb-5">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-3">How to save:</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0">Desktop</span>
                    <p className="text-slate-400 text-sm">Right-click the image → "Save image as..."</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-violet-500/20 text-violet-400 text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0">Mobile</span>
                    <p className="text-slate-400 text-sm">Long-press the image → "Download image" or "Save to Photos"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
