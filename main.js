const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  function processarComando(cmd) {
    switch(cmd.toLowerCase()) {
      case 'ajuda':
        console.log('Comandos disponíveis: ajuda, hora, sair');
        break;
      case 'hora':
        console.log('Hora atual:', new Date().toLocaleTimeString());
        break;
      default:
        console.log('Comando não reconhecido. Digite "ajuda" para ver os comandos disponíveis.');
    }
  }
  
  function askCommand() {
    readline.question('Digite seu comando (ou "sair" para encerrar): ', (cmd) => {
      if (cmd.toLowerCase() === 'sair') {
        console.log('Encerrando o programa...');
        readline.close();
        return;
      }
      console.clear();
      console.log(`Você digitou: ${cmd}`);
      
      processarComando(cmd);
      
      // Chama a função novamente para continuar o loop
      askCommand();
    });
  }
  
  // Inicia o loop de comandos
  console.log('Bem-vindo! Digite seus comandos:');
  askCommand();