'use strict';

/**
 * Модуль подключает sequelize c параметрами окружения из .env
 */
const Sequelize = require(`sequelize`);
const {getLogger} = require(`./logger`);

/**
 * Забираем все необходимые переменные
 */
const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_POOL_MAX_CONNECTIONS,
  DB_POOL_MIN_CONNECTIONS,
  DB_POOL_ACQUIRE,
  DB_POOL_IDLE
} = process.env;

/**
 * Проверяем, что нам всего хватает для подключения, если нет, кидаем ошибку.
 * @type {Boolean}
 */
const someThingNotDefined = [DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_POOL_MAX_CONNECTIONS, DB_POOL_MIN_CONNECTIONS, DB_POOL_ACQUIRE, DB_POOL_IDLE].some((it) => it === undefined);

if (someThingNotDefined) {
  throw new Error(`Не хватает переменных окружения для подключения к БД, смотри 'environments.md'`);
}

const logger = getLogger({name: `DB`});

/**
 * Экспортируем экземпляр sequelize, передаем ему параметры для подключения и указываем настройки для пуля соединений.
 */
module.exports = new Sequelize(
    DB_NAME,
    DB_USER,
    DB_PASSWORD, {
      host: DB_HOST,
      port: DB_PORT,
      dialect: `postgres`,
      pool: {
        max: +DB_POOL_MAX_CONNECTIONS,
        min: +DB_POOL_MIN_CONNECTIONS,
        acquire: +DB_POOL_ACQUIRE,
        idle: +DB_POOL_IDLE
      },
      logging: logger.debug.bind(logger)
    }
);
