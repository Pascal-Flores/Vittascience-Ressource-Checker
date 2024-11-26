import { User } from "./Resource"

export type Report = {
    name                : string,
    link                : string,
    author              : User,
    deadLinks           : DeadLink[],
    deadImages          : DeadImage[],
    deadPDFs            : DeadLink[],
    deadEmbedEditors    : DeadLink[],
    deadYoutubeLinks    : DeadLink[],
    deadVimeoLinks      : DeadLink[],
    deadPeertubeLinks   : DeadLink[],
    deadGeniallyLinks   : DeadLink[],
    deadGoogleSuiteLinks : DeadLink[]
}

export type Author = {
    id : number
    firstName : string,
    surname : string,
}

export type DeadLink = {
    parentSection       : string,
    link                : string,
    error               : string
}
export type DeadImage = {
    parentSection       : string,
    title               : string,
    src                 : string,
    error               : string 
}

