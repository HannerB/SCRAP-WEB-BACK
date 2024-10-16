import puppeteer from 'puppeteer-core';
import os from 'os';

export const launchBrowser = async () => {
    let executablePath;
    let userDataDir;

    if (os.platform() === 'darwin') {
        executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
        userDataDir = '/Users/tu_usuario/Library/Application Support/Google/Chrome/Default';
    } else if (os.platform() === 'win32') {
        executablePath = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';
        userDataDir = 'C:\\Users\\hanne\\AppData\\Local\\BraveSoftware\\Brave-Browser\\User Data\\Default';
    } else {
        throw new Error('Sistema operativo no compatible.');
    }

    return await puppeteer.launch({
        headless: false,
        executablePath,
        userDataDir
    });
};

export const extractDataFromPage = async (page, url, teamSelector, quotaSelector) => {
    await page.goto(url, { timeout: 180000 });
    await page.waitForSelector(teamSelector);
    await page.waitForSelector(quotaSelector);

    return await page.evaluate((teamSelector, quotaSelector) => {
        const teamsElements = document.querySelectorAll(teamSelector);
        const quotaElements = document.querySelectorAll(quotaSelector);
        const teams = Array.from(teamsElements).map(element => element.innerText);
        const quotas = Array.from(quotaElements).map(element => element.innerText);

        const filteredQuotas = [];
        for (let i = 0; i < quotas.length; i += 6) {
            filteredQuotas.push(quotas[i], quotas[i + 1]);
        }

        return teams.map((team, i) => ({ team, quota: filteredQuotas[i] }));
    }, teamSelector, quotaSelector);
};
