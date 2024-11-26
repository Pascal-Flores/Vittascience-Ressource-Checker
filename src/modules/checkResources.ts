import  { Browser } from 'puppeteer'

import { Resource } from "./Resource";
import { log } from "./log";
import { checkImages } from "./checkUtils/checkImages"

export async function checkResources (resources : Resource[], browser : Browser) : Promise<Report[]> {
    let reports : Report[] = []
    for (let resource of resources) {
        const maybeReport = await checkResource(resource, browser)
        if (maybeReport !== null)
            reports.push(maybeReport)
    }
    return reports
}

export async function checkResource(resource: Resource, browser : Browser) : Promise<Report | null> {
    function generateResourcePageFromId(id: number) {
        return `https://fr.vittascience.com/learn/tutorial.php?id=${id}`
    }

    let maybeReport : Report | null = null;
    log(`${resource.title} ==> Checking resource...`)
    const page = await browser.newPage()
    await page.goto(generateResourcePageFromId(resource.id))
    const deadImages = await checkImages(page)
    if (deadImages.length === 0) log(`${resource.title} ==> No dead images found`)
    else {
        log(`${resource.title} ==> ${deadImages.length} dead images found :` )
        deadImages.forEach((deadImage) => console.log(JSON.stringify(deadImage)))
    }
    await page.close()
    return null
}