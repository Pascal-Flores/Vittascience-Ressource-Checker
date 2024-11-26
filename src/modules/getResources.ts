import { log, replaceLog } from "./log";
import { Resource } from "./Resource";

export async function getResources () : Promise<Resource[]> {
    let resources : Resource[] = []
    let page = 1
    let logIndex : number = 0
    while (true) {
        let bodyData = new URLSearchParams()
        bodyData.append("page", page.toString())
        const pageResources : Resource[] = (await (await fetch("https://fr.vittascience.com/routing/Routing.php?controller=course&action=get_by_filter", {
            method  : "POST",
            headers : {"Content-Type" : "application/x-www-form-urlencoded"},
            body    : bodyData
        })).json())
        if (!pageResources || pageResources.length === 0) break;
        else {
            if (page === 1 )
                logIndex = log(`Page ${page} : Found ${pageResources.length} new resources (${resources.length} in total)`)
            else
                replaceLog(logIndex, `Page ${page} : Found ${pageResources.length} new resources (${resources.length} in total)`)
            resources = resources.concat(pageResources)
        }
        page += 1
    }
    return resources
}