export const generateRandomNumber = (numDigits, pointFlag = false) => {
  const min = Math.pow(10, numDigits - 1);
  const max = Math.pow(10, numDigits) - 1;

  const number = Math.random() * (max - min) + min;
  if (pointFlag === 1 || pointFlag === 2) {
    return parseFloat(number.toFixed(pointFlag));
  }

  return Math.floor(number);
};


export const generateAdditionQuestion = (horizontalDigits, verticalDigits, pointFlag = false) => {
  const verticalNumbers = Array.from({ length: verticalDigits }, () =>
    generateRandomNumber(horizontalDigits, pointFlag)
  );
  const totalSum = verticalNumbers.reduce((acc, num) => acc + num, 0);
  return {
    question: verticalNumbers,
    answer: pointFlag ? parseFloat(totalSum.toFixed(pointFlag)) : totalSum
  };
};

export const generateSubtractionQuestion = (horizontalDigits, subDigits, pointFlag = false) => {
  let startingNumber, subNumber, result;

  do {
    startingNumber = generateRandomNumber(horizontalDigits, pointFlag);
    subNumber = generateRandomNumber(subDigits, pointFlag);
    result = startingNumber - subNumber;
  } while (subNumber > startingNumber || result < 0);

  return {
    question: [
      parseFloat(startingNumber.toFixed(pointFlag)),
      parseFloat(subNumber.toFixed(pointFlag))
    ],
    answer: parseFloat(result.toFixed(pointFlag))
  };
};



export const generateMultiplicationQuestion = (horizontalDigits, subDigits, pointFlag = false) => {
  const horizontalNumber = generateRandomNumber(horizontalDigits, pointFlag);
  const subNumber = generateRandomNumber(subDigits, pointFlag);
  const totalMultiplication = horizontalNumber * subNumber;

  return {
    question: [horizontalNumber, subNumber],
    answer: pointFlag ? parseFloat(totalMultiplication.toFixed(pointFlag)) : totalMultiplication
  };
};


export const generateDivisionQuestion = (horizontalDigits, subDigits, pointFlag = false) => {
  let horizontalNumber;
  let subNumber;
  let totalDivision;

  do {
    subNumber = generateRandomNumber(subDigits);
    horizontalNumber = generateRandomNumber(horizontalDigits);
    totalDivision = horizontalNumber / subNumber;
    
    if (pointFlag) {
      break;
    } else {
      if (Number.isInteger(totalDivision)) {
        break;
      }
    }
  } while (true);

  const questionArray = [horizontalNumber, subNumber];
  
  return {
    question: questionArray,
    answer: pointFlag ? parseFloat(totalDivision.toFixed(pointFlag)) : totalDivision
  };
};

