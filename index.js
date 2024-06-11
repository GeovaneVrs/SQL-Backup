const { EmbedBuilder, WebhookClient } = require('discord.js');
const mysqldump = require('mysqldump');
const config = require('./config');
const chalk = require('chalk');

const webhookId = config.webhook.split('https://discord.com/api/webhooks/')[1].split('/')[0];
const webhookToken = config.webhook.split('https://discord.com/api/webhooks/')[1].split('/')[1];
const webhookClient = new WebhookClient({ id: webhookId, token: webhookToken });

setInterval(async () => {
    await mysqldump({
        connection: {
            host: config.connection.host,
            user: config.connection.user,
            password: config.connection.password,
            database: config.connection.database,
        },
        dumpToFile: './dump.sql'
    });

    let time = Math.round(+new Date() / 1000);

    const embed = new EmbedBuilder()
        .setTitle(`SQL BACKUP | ${config.connection.database}`)
        .setColor(config.embed.color)
        .setDescription(`Database salva do dia: <t:${time}>`);

    setTimeout(() => {
        webhookClient.send({
            username: 'SQL Backup',
            embeds: [embed],
            files: ['./dump.sql']
        });
    }, 15000);

}, 1000 * 60 * config.time);

console.log(chalk.green(`[ONLINE]`) + chalk.white(` Analisando o Banco de Dados`));