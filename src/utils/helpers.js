export function toDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read the selected image."));
    reader.readAsDataURL(file);
  });
}

export function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function formatTags(tags) {
  return Array.isArray(tags) ? tags.join(" • ") : "";
}
