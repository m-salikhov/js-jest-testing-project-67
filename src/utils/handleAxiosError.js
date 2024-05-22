import chalk from 'chalk';

export function handleAxiosError(error) {
  if (error.response) {
    // Запрос был сделан, и сервер ответил кодом состояния, который
    // выходит за пределы 2xx
    console.error(
      chalk.red(`Request to ${error.config.url} failed: ${error.response.status} ${error.response.statusText}`)
    );
  } else if (error.request) {
    // Запрос был сделан, но ответ не получен
    // `error.request`- это экземпляр XMLHttpRequest в браузере и экземпляр
    // http.ClientRequest в node.js
    console.error(chalk.red(`Request failed. Check if there is a typo in ${error.config.url} `));
  } else {
    // Произошло что-то при настройке запроса, вызвавшее ошибку
    console.error(chalk.red(error.stack));
  }
}
