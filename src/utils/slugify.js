// utils/slugify.js
export function slugifyKorean(text) {
    return text
        .toLowerCase() // keep consistent casing
        .replace(/[^가-힣a-z0-9\s-]/g, "") // allow Hangul, English, numbers
        .trim()
        .replace(/\s+/g, "-") // spaces -> dashes
        .replace(/-+/g, "-"); // collapse multiple dashes
}
