import { OptionValues, program } from "commander";
import { config } from "dotenv";
import puppeteer from "puppeteer-extra";
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import 'puppeteer-extra-plugin-stealth/evasions/chrome.app'
import 'puppeteer-extra-plugin-stealth/evasions/chrome.csi'
import 'puppeteer-extra-plugin-stealth/evasions/chrome.loadTimes'
import 'puppeteer-extra-plugin-stealth/evasions/chrome.runtime'
import 'puppeteer-extra-plugin-stealth/evasions/iframe.contentWindow'
import 'puppeteer-extra-plugin-stealth/evasions/media.codecs'
import 'puppeteer-extra-plugin-stealth/evasions/navigator.hardwareConcurrency'
import 'puppeteer-extra-plugin-stealth/evasions/navigator.languages'
import 'puppeteer-extra-plugin-stealth/evasions/navigator.permissions'
import 'puppeteer-extra-plugin-stealth/evasions/navigator.plugins'
import 'puppeteer-extra-plugin-stealth/evasions/navigator.vendor'
import 'puppeteer-extra-plugin-stealth/evasions/navigator.webdriver'
import 'puppeteer-extra-plugin-stealth/evasions/sourceurl'
import 'puppeteer-extra-plugin-stealth/evasions/user-agent-override'
import 'puppeteer-extra-plugin-stealth/evasions/webgl.vendor'
import 'puppeteer-extra-plugin-stealth/evasions/window.outerdimensions'
import 'puppeteer-extra-plugin-stealth/evasions/defaultArgs'


import { log, replaceLog } from "./modules/log";
import { getResources } from "./modules/getResources";
import { checkResources } from "./modules/checkResources";



function setupCLI () : OptionValues {
    program
    .name("Vittascience-Resources-Checker")
    .description("CLI tool to easily look for dead media in Vittascience's resources")
    .version("0.0.0")

    program
    .option('-e, --env-file <path>', 'set env file to setup env variables')
    .option('-o, --output-file <path>', 'sets a path onto which write the report', "report.json")
    .option('-l, --log <path>', 'sets a path for the logs', "logs.txt")
    .parse()
    return program.opts()
}

async function main () {
    const programOptions = setupCLI()
    if (programOptions.envFile) config({path : programOptions.envFile})
    
    
    log("Fetching the resources...")
    const resources = await getResources()
    log(`Found ${resources.length} resources in total.`)
    log("Starting resources checking...")

    const browser = await puppeteer.use(StealthPlugin()).use(AdblockerPlugin()).launch({headless : false})
    const reports = await checkResources(resources, browser)
    await browser.close()
}

// main ()
async function wait(ms : number) {
    return new Promise (resolve => setTimeout(resolve, ms))
}

async function main2() {
    console.clear()
    process.stdout.write("test\n")
    await wait(1000)
    process.stdout.write("test2\n")
    await wait(1000)
    process.stdout.cursorTo(0,0)
    process.stdout.clearLine(0)
    process.stdout.write("test3\n")
}

main2()