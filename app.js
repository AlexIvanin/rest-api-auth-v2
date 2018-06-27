import moment from 'moment';
import chalk from 'chalk';
import config from './config';
import server from './core/server';

server.listen(config.port, config.ip, () => {
  if (config.mode === 'dev') {
    console.log(chalk.green.bold('---------------------[ Server starting at %s ]---------------------------'), moment().format('YYYY-MM-DD HH:mm'));
    console.log('----------------------------------------------');
    console.log(chalk.green.bold(`IP адрес:\t\t${config.ip}`));
    console.log(chalk.green.bold(`Порт:\t\t${config.port}`));
    console.log(chalk.green.bold(`База данных:\t\t${config.db}`));
    console.log(chalk.green.bold(`Режим приложения:${config.mode}`));
    console.log('----------------------------------------------');
  } else {
    console.log('%s listening at %s', config.ip, config.port);
  }
});
module.exports = server;
