function mergeSort(ar, level = 0) {
  let result;

  if (ar.length > 2) {
    const midIndex = Math.ceil(ar.length / 2);
    const ar1 = mergeSort(ar.slice(0, midIndex), level + 1);
    const ar2 = mergeSort(ar.slice(midIndex), level + 1);

    result = merge(ar1, ar2);
  } else if (ar.length === 2) {
    if (ar[0] <= ar[1]) {
      result = new Uint32Array(ar);
    } else {
      result = new Uint32Array([ar[1], ar[0]]);
    }
  } else if (ar.length === 1) {
    result = new Uint32Array(ar);
  }

  return result;
}

function merge(ar1, ar2) {
  const result = new Uint32Array(ar1.length + ar2.length);

  let ar1Index = 0;
  let ar2Index = 0;
  let resIndex = 0;

  while (ar1Index < ar1.length && ar2Index < ar2.length) {
    if (ar1[ar1Index] < ar2[ar2Index]) {
      result[resIndex] = ar1[ar1Index];
      ar1Index++;
    } else {
      result[resIndex] = ar2[ar2Index];
      ar2Index++;
    }

    resIndex++;
  }

  if (ar1Index >= ar1.length) {
    for (let i = resIndex; i < result.length; i++) {
      result[i] = ar2[ar2Index++];
    }
  } else if (ar2Index >= ar2.length) {
    for (let i = resIndex; i < result.length; i++) {
      result[i] = ar1[ar1Index++];
    }
  }

  return result;
}

module.exports = mergeSort;
