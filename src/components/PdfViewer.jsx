import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useRef, useEffect } from "react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function PdfViewer({
  pdfFile,
  setPdfFile,
  currentPage,
  setCurrentPage,
  numPages,
  setNumPages,
  onPdfClick,
}) {
  const pageContainerRef = useRef(null);
  function handlePageClick(event) {
    if (!pageContainerRef.current) return;

    const rect = pageContainerRef.current.getBoundingClientRect();

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const normalizedX = mouseX / rect.width;
    const normalizedY = mouseY / rect.height;

    onPdfClick({
      page: currentPage,
      x: normalizedX,
      y: normalizedY,
    });
  }
  useEffect(() => {
    if (!pageContainerRef.current) return;

    const rect = pageContainerRef.current.getBoundingClientRect();

    console.log(rect.width, rect.height);
  }, [currentPage]);

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    setPdfFile(file);

    setCurrentPage(1);
  }

  return (
    <div className="pdf-viewer">
      {!pdfFile && (
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
      )}

      {pdfFile && (
        <>
          <Document
            file={pdfFile}
            onLoadSuccess={({ numPages }) => {
              setNumPages(numPages);
            }}
          >
            <div
              ref={pageContainerRef}
              className="pdf-page-container"
              onClick={handlePageClick}
            >
              <Page
                pageNumber={currentPage}
                width={800}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                onRenderSuccess={() => {
                  requestAnimationFrame(() => {
                    if (!pageContainerRef.current) return;

                    const rect =
                      pageContainerRef.current.getBoundingClientRect();
                  });
                }}
              />
            </div>
          </Document>

          <div className="pdf-controls">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => page - 1)}
            >
              ◀
            </button>

            <span>
              {currentPage} / {numPages}
            </span>

            <button
              disabled={currentPage === numPages}
              onClick={() => setCurrentPage((page) => page + 1)}
            >
              ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default PdfViewer;
