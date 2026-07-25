/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  X, 
  Maximize2,
  Minimize2,
  RotateCcw,
  Moon,
  Sun,
  LayoutGrid,
  Search,
  Menu,
  MoreVertical,
  Type,
  ArrowLeft,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import QuickPinchZoom, { make3dTransformValue } from 'react-quick-pinch-zoom';
import { useNavigationStore } from '../providers/navigation.store';
import { useReadingStore } from '../providers/reading.store';
import { useSettingsStore } from '../providers/settings.store';
import { toast } from 'react-hot-toast';

// Set up worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const PdfReaderScreen = () => {
  const { currentBook, closeReader } = useNavigationStore();
  const { updateProgress, getProgress, incrementOpenCount } = useReadingStore();
  const { darkMode } = useSettingsStore();
  
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const [nightMode, setNightMode] = useState(darkMode);
  const [brightness, setBrightness] = useState(100);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [jumpToPage, setJumpToPage] = useState('');
  
  const pinchZoomRef = useRef<QuickPinchZoom>(null);
  const pdfPageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [direction, setDirection] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Update nightMode when darkMode changes
  useEffect(() => {
    setNightMode(darkMode);
  }, [darkMode]);

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const onUpdate = useCallback(({ x, y, scale: pinchScale }: { x: number, y: number, scale: number }) => {
    if (pdfPageRef.current) {
      pdfPageRef.current.style.transform = make3dTransformValue({ x, y, scale: pinchScale });
    }
  }, []);

  // Initialize page and increment open count
  useEffect(() => {
    if (currentBook) {
      incrementOpenCount(currentBook.fileId);
      const saved = getProgress(currentBook.fileId);
      if (saved) {
        setPageNumber(saved.pageNumber);
      }
    }
  }, [currentBook, incrementOpenCount, getProgress]);

  // Handle auto-save
  useEffect(() => {
    if (currentBook && numPages > 0) {
      updateProgress({
        bookId: currentBook.fileId,
        bookName: currentBook.bookName,
        category: currentBook.category,
        pageNumber: pageNumber,
        progress: Math.round((pageNumber / numPages) * 100),
      });
    }
  }, [pageNumber, numPages, currentBook]);

  if (!currentBook) return null;

  const fileUrl = `/api/proxy/pdf/${currentBook.fileId}`;

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= numPages) {
      setDirection(newPage > pageNumber ? 1 : -1);
      setPageNumber(newPage);
    }
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handlePageChange(pageNumber + 1);
    } else if (isRightSwipe) {
      handlePageChange(pageNumber - 1);
    }
  };

  const pageVariants = {
    initial: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      rotateY: direction > 0 ? 45 : -45,
      opacity: 0,
      scale: 0.9
    }),
    animate: {
      x: 0,
      rotateY: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 30
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      rotateY: direction > 0 ? -45 : 45,
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.3
      }
    })
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const toggleToolbar = () => {
    setIsToolbarVisible(!isToolbarVisible);
  };

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(jumpToPage);
    if (!isNaN(p) && p >= 1 && p <= numPages) {
      setPageNumber(p);
      setJumpToPage('');
      setShowThumbnails(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col overflow-hidden transition-colors duration-700 ${nightMode ? 'bg-[#0f0f0f]' : 'bg-[#f4f4f2]'}`}>
      {/* Brightness Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[101] bg-black" 
        style={{ opacity: (100 - brightness) / 100 * 0.75 }}
      />

      {/* Top App Bar - Refined for a more premium look */}
      <AnimatePresence>
        {isToolbarVisible && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="absolute top-0 left-0 right-0 z-[110] px-4 pt-4 pb-8 bg-gradient-to-b from-black/60 to-transparent pointer-events-none"
          >
            <div className="flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-2">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeReader}
                  className="p-3 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl text-white shadow-xl"
                >
                  <ArrowLeft size={22} />
                </motion.button>
                <div className="bg-white/10 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl text-white shadow-xl max-w-[180px] md:max-w-md font-bangla">
                  <h1 className="font-black text-xs truncate uppercase tracking-wider">{currentBook.bookName}</h1>
                  <div className="flex items-center gap-1 opacity-60">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest">পড়ার মোড</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowThumbnails(!showThumbnails)}
                  className="p-3 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl text-white shadow-xl"
                >
                  <LayoutGrid size={20} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        ref={containerRef}
        className="flex-1 overflow-hidden flex justify-center items-center relative cursor-pointer pt-4 perspective-1000"
        onClick={toggleToolbar}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Invisible Tap Zones for Page Turning */}
        <div 
          className="absolute left-0 top-20 bottom-20 w-20 z-20 cursor-w-resize"
          onClick={(e) => { e.stopPropagation(); handlePageChange(pageNumber - 1); }}
        />
        <div 
          className="absolute right-0 top-20 bottom-20 w-20 z-20 cursor-e-resize"
          onClick={(e) => { e.stopPropagation(); handlePageChange(pageNumber + 1); }}
        />

        <AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-warm/20 backdrop-blur-md"
            >
              <div className="relative">
                <div className="w-20 h-20 border-4 border-primary/10 rounded-full" />
                <div className="absolute top-0 w-20 h-20 border-4 border-transparent border-t-primary rounded-full animate-spin" />
                <BookOpen className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" size={32} />
              </div>
              <motion.p 
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-6 text-sm font-black text-gray-400 font-bangla uppercase tracking-[0.3em]"
              >
                বই খোলা হচ্ছে...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`w-full h-full transition-all duration-700 ${nightMode ? 'invert brightness-90 contrast-110' : ''}`}>
          <QuickPinchZoom
            ref={pinchZoomRef}
            onUpdate={onUpdate}
            wheelScaleFactor={0.002}
            draggableUnZoomed={true}
          >
            <div ref={pdfPageRef} className="flex justify-center items-center w-full h-full">
              <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={null}
                error={
                  <div className="text-red-500 p-12 text-center bg-white rounded-[2rem] m3-shadow-lg border-2 border-red-50 font-bangla">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <X className="text-red-500" size={32} />
                    </div>
                    <h3 className="text-lg font-black mb-2">পিডিএফ লোড করা যায়নি</h3>
                    <p className="text-xs font-bold text-gray-400 max-w-[200px] mx-auto">অনুগ্রহ করে আপনার ইন্টারনেট কানেকশন চেক করুন এবং আবার চেষ্টা করুন।</p>
                  </div>
                }
              >
                <AnimatePresence custom={direction}>
                  <motion.div 
                    key={pageNumber}
                    custom={direction}
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="m3-shadow-lg rounded-xl overflow-hidden bg-white ring-1 ring-black/5 origin-center"
                  >
                    <Page 
                      pageNumber={pageNumber} 
                      width={containerWidth ? containerWidth * 0.92 : undefined}
                      scale={scale}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="max-w-full"
                      loading={
                        <div className="flex items-center justify-center bg-white" style={{ width: containerWidth * 0.92, height: containerWidth * 1.3 }}>
                          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        </div>
                      }
                    />
                  </motion.div>
                </AnimatePresence>
              </Document>
            </div>
          </QuickPinchZoom>
        </div>
      </div>

      {/* Bottom Controls - Optimized for reachability and elegance */}
      <AnimatePresence>
        {isToolbarVisible && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-0 left-0 right-0 z-[110] p-6 pb-safe-offset-4 pointer-events-none"
          >
            <div className="max-w-xl mx-auto flex flex-col gap-4 pointer-events-auto">
              {/* Floating Page Indicator and Zoom */}
              <div className="flex items-center justify-between">
                <div className="glass-dark rounded-2xl px-4 py-2 flex items-center gap-3 shadow-2xl">
                   <div className="flex items-center gap-1.5">
                    <Sun size={14} className="text-white/40" />
                    <input 
                      type="range" 
                      min="20" 
                      max="100" 
                      value={brightness} 
                      onChange={(e) => setBrightness(parseInt(e.target.value))}
                      className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-primary"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Sun size={14} className="text-white/80" />
                  </div>
                  <div className="w-px h-4 bg-white/10" />
                  <button 
                    onClick={(e) => { e.stopPropagation(); setNightMode(!nightMode); }}
                    className={`p-1.5 rounded-lg transition-colors ${nightMode ? 'text-accent' : 'text-white/60'}`}
                  >
                    {nightMode ? <Sun size={16} /> : <Moon size={16} />}
                  </button>
                </div>

                <div className="glass-dark rounded-2xl px-2 py-2 flex items-center gap-1 shadow-2xl">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setScale(s => Math.max(s - 0.1, 0.5)); }}
                    className="p-2 text-white/60 hover:text-white transition-colors"
                  >
                    <ZoomOut size={16} />
                  </button>
                  <span className="text-[10px] font-black text-white/80 w-10 text-center uppercase tracking-tighter">
                    {Math.round(scale * 100)}%
                  </span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setScale(s => Math.min(s + 0.1, 2.5)); }}
                    className="p-2 text-white/60 hover:text-white transition-colors"
                  >
                    <ZoomIn size={16} />
                  </button>
                </div>
              </div>

              {/* Main Navigation Controller - Simplified as requested */}
              <div className="glass-dark rounded-[2.5rem] p-3 flex items-center justify-between gap-2 shadow-2xl border border-white/5">
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); handlePageChange(pageNumber - 1); }}
                  disabled={pageNumber <= 1}
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-2xl flex items-center justify-center transition-colors disabled:opacity-10"
                >
                  <ChevronLeft size={24} />
                </motion.button>
                
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-white font-bangla leading-none">{pageNumber}</span>
                    <span className="text-white/20 font-light text-lg">/</span>
                    <span className="text-xs font-bold text-white/40 mb-[-2px]">{numPages}</span>
                  </div>
                  <div className="w-full max-w-[120px] h-1 bg-white/5 rounded-full overflow-hidden mt-1">
                    <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${(pageNumber / numPages) * 100}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mt-2 font-bangla">পৃষ্ঠা উল্টাতে সোয়াইপ করুন</span>
                </div>

                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); handlePageChange(pageNumber + 1); }}
                  disabled={pageNumber >= numPages}
                  className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 disabled:opacity-10"
                >
                  <ChevronRight size={24} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thumbnails Sidebar/Modal */}
      <AnimatePresence>
        {showThumbnails && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute inset-y-0 right-0 w-80 z-[120] glass-dark shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between text-white font-bangla">
              <h2 className="font-black text-xl">পৃষ্ঠাগুলো</h2>
              <button onClick={() => setShowThumbnails(false)} className="p-2 hover:bg-white/10 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 border-b border-white/10 font-bangla">
              <form onSubmit={handleJumpToPage} className="relative">
                <input 
                  type="number" 
                  value={jumpToPage}
                  onChange={(e) => setJumpToPage(e.target.value)}
                  placeholder="পৃষ্ঠায় যান..."
                  className="w-full bg-white/10 rounded-xl py-3 pl-4 pr-12 text-white font-bold text-sm focus:ring-2 focus:ring-primary border-none outline-none"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary">
                  <ChevronRight size={20} />
                </button>
              </form>
            </div>

            <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
              <Document file={fileUrl} loading={null}>
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: numPages }, (_, i) => i + 1).map((p) => (
                    <motion.div
                      key={p}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { handlePageChange(p); setShowThumbnails(false); }}
                      className={`relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                        pageNumber === p ? 'border-primary shadow-lg shadow-primary/30' : 'border-transparent opacity-60'
                      }`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/40 z-10">
                        <span className="text-white font-black text-lg">{p}</span>
                      </div>
                      <Page 
                        pageNumber={p} 
                        width={140} 
                        renderTextLayer={false} 
                        renderAnnotationLayer={false}
                        loading={null}
                      />
                    </motion.div>
                  ))}
                </div>
              </Document>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
