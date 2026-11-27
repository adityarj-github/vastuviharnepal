'use client';

import { useEffect, useRef, useState } from 'react';
import type { PdfTemplate, PriceListProject } from '@/lib/priceListTypes';
import styles from './PriceLists.module.css';

type PdfJs = typeof import('pdfjs-dist');

let pdfjsPromise: Promise<PdfJs> | null = null;

/**
 * pdf.js draws the PDF onto a canvas. An iframe would need the browser's PDF viewer,
 * which the site's CSP (object-src 'none', no blob: frames) blocks and phones lack.
 */
function loadPdfJs() {
  pdfjsPromise ??= import('pdfjs-dist').then((pdfjs) => {
    pdfjs.GlobalWorkerOptions.workerPort = new Worker(new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url), {
      type: 'module',
    });
    return pdfjs;
  });
  return pdfjsPromise;
}

/** Live preview of the PDF as it will download, rebuilt shortly after each change. */
export default function PdfPreview({ project, template }: { project: PriceListProject; template: PdfTemplate }) {
  const holder = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'working' | 'ready' | 'failed'>('working');
  const [error, setError] = useState('');
  const [pageInfo, setPageInfo] = useState('');

  useEffect(() => {
    let cancelled = false;
    setState('working');
    const timer = window.setTimeout(async () => {
      let task: ReturnType<PdfJs['getDocument']> | null = null;
      try {
        const [{ buildPriceListPdf }, pdfjs] = await Promise.all([import('@/lib/priceListPdf'), loadPdfJs()]);
        const doc = await buildPriceListPdf(project, template);
        const bytes = new Uint8Array(doc.output('arraybuffer'));
        task = pdfjs.getDocument({ data: bytes });
        const pdf = await task.promise;
        const page = await pdf.getPage(1);
        if (cancelled || !holder.current) return;

        // Rendered at the holder's width, sharp on high-density screens.
        const base = page.getViewport({ scale: 1 });
        const ratio = window.devicePixelRatio || 1;
        const cssWidth = holder.current.clientWidth || 600;
        const viewport = page.getViewport({ scale: (cssWidth / base.width) * ratio });
        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = '100%';
        canvas.style.display = 'block';
        const canvasContext = canvas.getContext('2d')!;
        const renderParameters = { canvas: null, canvasContext, viewport };
        await page.render(renderParameters).promise;
        if (cancelled || !holder.current) return;

        holder.current.replaceChildren(canvas);
        const heightMm = Math.round((base.height / 72) * 25.4);
        setPageInfo(heightMm > 298 ? `Tall page (${heightMm} mm)` : 'A4');
        setState('ready');
      } catch (err) {
        if (cancelled) return;
        console.error('PDF preview failed', err);
        setError((err as Error).message || 'Unknown error');
        setState('failed');
      } finally {
        // Frees this document; the shared worker keeps running for the next preview.
        task?.destroy().catch(() => { });
      }
    }, 500);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [project, template]);

  async function download() {
    const { downloadPriceListPdf } = await import('@/lib/priceListPdf');
    await downloadPriceListPdf(project, template);
  }

  return (
    <div className={styles.preview}>
      <div className={styles.previewHead}>
        <span>
          PDF preview{state === 'working' ? ' · updating…' : pageInfo ? ` · ${pageInfo}` : ''}
        </span>
        <button type="button" className={styles.small} onClick={download}>
          Download test PDF
        </button>
      </div>
      {state === 'failed' ? <p className={`${styles.message} ${styles.error}`}>Could not draw the preview: {error}</p> : null}
      <div ref={holder} aria-label="PDF preview" style={{ opacity: state === 'working' ? 0.6 : 1, minHeight: 200 }} />
    </div>
  );
}
