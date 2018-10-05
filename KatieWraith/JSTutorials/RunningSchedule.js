let raceNumber = Math.floor(Math.random() * 1000);
let earlyReg = false;
let runnerAge = 18;
if(runnerAge >= 18 && earlyReg){
  raceNumber += 1000;
}
if(runnerAge > 18 && earlyReg){
  console.log(`Runner ${raceNumber}: You will race at 9:30 am`);
} else if(runnerAge > 18 && !earlyReg){
  console.log(`Runner ${raceNumber}: You will race at 11:00 am`);
} else if(runnerAge < 18){
  console.log(`Runner ${raceNumber}: You will race at 12:30 pm`);
} else{
  console.log('Please see the registration desk');
}
