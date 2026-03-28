/// <reference lib="webworker" />

export type WorkerResizeAction = "kept" | "resized" | "reencoded";

export type WorkerResizeRequest = {
  id: string;
  name: string;
  type: string;
  lastModified: number;
  buffer: ArrayBuffer;
  opts: {
    maxDimension: number;
    mimeType: string;
    quality: number;
    reencodeMinBytes: number;
  };
};

export type WorkerResizeResponse =
  | {
      id: string;
      ok: true;
      result: {
        action: WorkerResizeAction;
        srcWidth: number;
        srcHeight: number;
        dstWidth: number;
        dstHeight: number;
        outName: string;
        outType: string;
        outBuffer: ArrayBuffer;
      };
    }
  | {
      id: string;
      ok: false;
      error: string;
    };

function withFileExtension(originalName: string, ext: string) {
  const baseName = originalName.replace(/\.[^.]+$/, "");
  return `${baseName}.${ext}`;
}

async function resizeInWorker(
  req: WorkerResizeRequest,
): Promise<WorkerResizeResponse> {
  try {
    // Decode
    const inputBlob = new Blob([req.buffer], { type: req.type });

    if (typeof createImageBitmap !== "function") {
      return {
        id: req.id,
        ok: false,
        error: "createImageBitmap not available in worker",
      };
    }

    let bitmap: ImageBitmap | null = null;
    try {
      // Note: `imageOrientation` option support varies; keep it simple in worker.
      bitmap = await createImageBitmap(inputBlob);

      const srcW = bitmap.width;
      const srcH = bitmap.height;
      const maxSide = Math.max(srcW, srcH);
      const scale = Math.min(1, req.opts.maxDimension / maxSide);

      const didResize = scale !== 1;
      const shouldReencode =
        !didResize &&
        req.type !== req.opts.mimeType &&
        inputBlob.size >= req.opts.reencodeMinBytes;

      if (!didResize && !shouldReencode) {
        // Keep original bytes (but still return them so main thread can unify flow)
        return {
          id: req.id,
          ok: true,
          result: {
            action: "kept",
            srcWidth: srcW,
            srcHeight: srcH,
            dstWidth: srcW,
            dstHeight: srcH,
            outName: req.name,
            outType: req.type,
            outBuffer: req.buffer,
          },
        };
      }

      const dstW = Math.max(1, Math.round(srcW * scale));
      const dstH = Math.max(1, Math.round(srcH * scale));

      if (typeof OffscreenCanvas === "undefined") {
        return {
          id: req.id,
          ok: false,
          error: "OffscreenCanvas not available in worker",
        };
      }

      const canvas = new OffscreenCanvas(dstW, dstH);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return {
          id: req.id,
          ok: false,
          error: "2D canvas context not available in worker",
        };
      }

      // Reduce aliasing when downscaling.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ctx as any).imageSmoothingEnabled = true;

      ctx.drawImage(bitmap, 0, 0, dstW, dstH);

      const outBlob = await canvas.convertToBlob({
        type: req.opts.mimeType,
        quality: req.opts.quality,
      });
      const outBuffer = await outBlob.arrayBuffer();

      const outName =
        req.opts.mimeType === "image/jpeg"
          ? withFileExtension(req.name, "jpg")
          : req.name;

      return {
        id: req.id,
        ok: true,
        result: {
          action: didResize ? "resized" : "reencoded",
          srcWidth: srcW,
          srcHeight: srcH,
          dstWidth: dstW,
          dstHeight: dstH,
          outName,
          outType: outBlob.type,
          outBuffer,
        },
      };
    } finally {
      try {
        bitmap?.close();
      } catch {
        // ignore
      }
    }
  } catch (error) {
    return {
      id: req.id,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

self.onmessage = async (event: MessageEvent<WorkerResizeRequest>) => {
  const response = await resizeInWorker(event.data);

  if (response.ok) {
    // Transfer the output buffer back to the main thread.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (self as any).postMessage(response, [response.result.outBuffer]);
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (self as any).postMessage(response);
};
