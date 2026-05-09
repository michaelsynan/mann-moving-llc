export default defineEventHandler((event) => {
  // SMS notifications have been removed. We keep this endpoint returning a
  // deterministic response to avoid breaking any old clients/bookmarks.
  setResponseStatus(event, 410);
  return {
    status: "gone",
    error: "SMS notifications are no longer supported.",
  };
});
