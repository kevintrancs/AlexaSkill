const checkThatTwoPlusTwoEqualsFourAMillionTimes = () => {
  for(let i = 1; i <= 1000000; i++) {
    if ( (2 + 2) != 4) {
      console.log('Something has gone very wrong :( ');
    }
  }
};

const addTwo = num => num + 2;

const timeFuncRuntime = funcParameter => {
  let t1 = Date.now();
  funcParameter();
  let t2 = Date.now();
  return t2 - t1;
};

const time2p2 = timeFuncRuntime(checkThatTwoPlusTwoEqualsFourAMillionTimes);

function checkConsistentOutput(funcP, val){
  let a1 = funcP(val);
  let a2 = funcP(val);
  if(a1 === a2){
    return funcP(val);
  } else{
    return 'This function returned inconsistent results';
  }
}
checkConsistentOutput(addTwo, 5);
