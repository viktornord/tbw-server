module.exports = {
  proofOfWork
};

function proofOfWork(lastProof) {
  let incrementor = lastProof + 1;
  while (incrementor % 9 !== 0 && incrementor % lastProof !== 0) {
    incrementor++;
  }

  return incrementor;
}