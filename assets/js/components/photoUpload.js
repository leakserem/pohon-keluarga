/**
 * Family Tree v2.9 - Photo upload/compression
 * Target: <= 20 KiB after browser compression.
 */

export const MAX_PHOTO_BYTES = 20 * 1024;

function dataUrlBytes(dataUrl) {
    const base64 = String(dataUrl).split(",")[1] || "";
    return Math.floor(base64.length * 3 / 4) - (base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0);
}

async function readImage(file) {
    const url = URL.createObjectURL(file);
    try {
        const image = new Image();
        image.decoding = "async";
        image.src = url;
        await image.decode();
        return image;
    } finally {
        URL.revokeObjectURL(url);
    }
}

function canvasDataUrl(image, size, quality) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("Browser tidak mendukung canvas");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    const sourceRatio = image.width / image.height;
    let sx = 0;
    let sy = 0;
    let sw = image.width;
    let sh = image.height;

    if (sourceRatio > 1) {
        sw = image.height;
        sx = Math.floor((image.width - sw) / 2);
    } else if (sourceRatio < 1) {
        sh = image.width;
        sy = Math.floor((image.height - sh) / 2);
    }

    ctx.drawImage(image, sx, sy, sw, sh, 0, 0, size, size);
    return canvas.toDataURL("image/jpeg", quality);
}

export async function compressPhoto(file) {
    if (!(file instanceof File)) throw new Error("File foto tidak valid.");
    if (!file.type.startsWith("image/")) throw new Error("File harus berupa gambar.");

    const image = await readImage(file);
    const sizes = [512, 420, 360, 320, 280, 240, 200, 180, 160, 144, 128, 112, 96];
    const qualities = [0.82, 0.72, 0.62, 0.52, 0.44, 0.36];

    let best = null;

    for (const size of sizes) {
        for (const quality of qualities) {
            const dataUrl = canvasDataUrl(image, size, quality);
            const bytes = dataUrlBytes(dataUrl);
            best = { dataUrl, bytes, width: size, height: size };
            if (bytes <= MAX_PHOTO_BYTES) return best;
        }
    }

    throw new Error("Foto tidak dapat dikompres di bawah 20 KB. Pilih foto yang lebih sederhana.");
}

export function applyPhotoPreview(img, dataUrl) {
    if (!img) return;
    img.src = dataUrl || "";
    img.style.width = "120px";
    img.style.height = "120px";
    img.style.objectFit = "cover";
    img.style.borderRadius = "50%";
    img.style.display = dataUrl ? "block" : "none";
}
