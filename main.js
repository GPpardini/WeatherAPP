//start 

//main program loop

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  readline.question('Digite seu comando: ', (comando) => {
    console.log(`Você digitou: ${comando}`);
    readline.close();
  });
