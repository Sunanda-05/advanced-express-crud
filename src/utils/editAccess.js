export const hasEditAccess = (document, userId) => {
  const isOwner = document.owner.toString() === userId.toString();
  const hasEditAccess = document.sharedWith.some(
    (shared) =>
      shared.user?._id.toString() === userId.toString() &&
      shared.permission === "edit"
  );
  return isOwner || hasEditAccess;
};
