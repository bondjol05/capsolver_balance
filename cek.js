import TelegramBot from "node-telegram-bot-api";
import axios from "axios";

// Ganti dengan token bot Telegram Anda
const token = '7410890534:AAG6QbCV_W35c98FkEUVspaqdV1F0tWjODs';
const bot = new TelegramBot(token, { polling: true });

// Fungsi untuk cek saldo capsolver
async function cekSaldoCapsolver(apiKey) {
    try {
        const response = await axios.post('https://api.capsolver.com/getBalance', {
            "clientKey": apiKey
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        return '$' + response.data.balance
    } catch (error) {
        console.error('Error fetching balance:', error.message);
        return null;
    }
}

// Command /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const name = msg.chat.first_name
    bot.sendMessage(chatId, `Hallo *${name}.*\nTo check your capsolver balance, please type the command /check APIKEY \n\nfor example:\n/check CAP-E4E2707B9CBNCB19F38876\n\n*Don't worry, this bot does not save your apikey data.*`, { parse_mode: 'Markdown' });
    console.log(`Bot started by ${name}`)
});

// Command /cek
bot.onText(/\/check (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const name = msg.chat.first_name
    const apiKey = match[1];
    bot.sendMessage(chatId, 'Checking balance...');
    const saldo = await cekSaldoCapsolver(apiKey);
    if (saldo !== null) {
        bot.sendMessage(chatId, `*[CONFIRMED]*\n\nYour Capsolver balance: *${saldo}*\n\n*NOTE*: Please change your apikey regularly to avoid data leaks.`, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🛒 ORDER ANOTHER BOT', url: 'https://t.me/si_bondjol' }]
                ]
            }
        });
        console.log(`Check saldo success by ${name}`)
    } else {
        bot.sendMessage(chatId, '*[FAILED]*\n\nFailed to check balance. Make sure your API key is correct.', { parse_mode: 'Markdown' });
    }
});