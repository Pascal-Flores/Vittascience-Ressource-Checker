import puppeteer from "puppeteer";
import { OptionValues, program } from "commander";
import { config } from "dotenv";

function setupCLI () : OptionValues {
    program
    .name("Vittascience-Resources-Checker")
    .description("CLI tool to easily look for dead media in Vittascience's resources")
    .version("0.0.0")

    program
    .option('-e, --env-file <path>', 'set env file to setup env variables')
    .option('-o, --output-file <path>', 'sets a path onto which write the report', "report.json")
    .parse()
    return program.opts()
}
async function main () {
    const programOptions = setupCLI()
    if (programOptions.envFile) config({path : programOptions.envFile})

}

main ()