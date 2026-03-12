export function authorToSlug(author: string) {
  return author
    .toLowerCase()
    .replace(/@/g, "-at-")
    .replace(/\./g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}