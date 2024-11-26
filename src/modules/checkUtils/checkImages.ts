import { ElementHandle, Page } from "puppeteer"
import { DeadImage } from "../Report"
import { log } from "../log"

export async function checkImages(page : Page) : Promise<DeadImage[]> {
    let deadImages : DeadImage[] = []
    try {
        await page.waitForSelector(".img-fluid", {timeout : 2000})
        const images = await page.$$('.img-fluid')
        for (let image of images) {
            const maybeDeadImage = await checkImage(await image.toElement("img"), page)
            console.log(makeDeadImage)
            if (maybeDeadImage !== null)
                deadImages.push(maybeDeadImage)
        }
    }
    catch (error) {
        // console.error(error)
    }
    finally {
        return deadImages
    }
}

async function checkImage(image : ElementHandle<HTMLImageElement>, page : Page) : Promise<DeadImage | null> {
    let maybeDeadImage : DeadImage | null = null
    try {
        const src = await (await image.getProperty("src")).jsonValue()
        log(`${src} ==> Image found. Checking image...`)
        const sanitizedURL = isValidURL(src) ?  src : (isValidURL(generateImageLinkFromPartialLink(src)) ? generateImageLinkFromPartialLink(src) : null)
        if (sanitizedURL === null) {
            // maybeDeadImage = await makeDeadImage(image, src, "Image URL is malformed")
            log(`${src} ==> Image URL is malformed`)
        }
        else {
            const response = await fetch(sanitizedURL)
            if (response.status >= 400) {
                // maybeDeadImage = await makeDeadImage(image, sanitizedURL, `Could not retrieve image : error code ${response.status}`)
                log(`${src} ==> Could not retrieve image : error code ${response.status}`)
            }
            else {
                log(`${src} ==> Image is valid`)
            }
        }
    }
    catch (error) {
        console.error(error)
    }
    return maybeDeadImage
}

function isValidURL(maybeURL : string) : boolean {
    var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
        '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
      return !!urlPattern.test(maybeURL);
}

async function getParentSection(element : Element) : Promise<string> {
    return element.closest(".tutorial-part")!.querySelector("h3 > span:[style]")!.textContent!
}

async function makeDeadImage(image : HTMLImageElement, src : string, error : string) : Promise<DeadImage> {
    return {
        parentSection : await getParentSection(image),
        title : image.getAttribute("title")!,
        src : src,
        error : error
    }
}

function generateImageLinkFromPartialLink(partialLink: string) {
    return `https://fr.vittascience.com${partialLink}`
}
