function calculateDiff(oldContent, newContent) {
  return newContent.length - oldContent.length;
}

module.exports = { calculateDiff };
