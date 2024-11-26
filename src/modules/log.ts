import { openSync, OpenMode } from "fs"

class Logger {
    lines : Log[]
    lastLineId : number
    maxHistory : number

    constructor (maxHistory : number = 1000) {
        this.lines = []
        this.lastLineId = 0
        this.maxHistory = maxHistory
    }

    writeLine(message : string) : number {
        let lineId = this.lastLineId
        if (this.lastLineId < this.maxHistory) 
            lineId = this.lastLineId++
        else
            this.lines.shift()
        this.lines.push({ timestamp : new Date().toLocaleTimeString(), message : message })
        this.redrawConsole()
        process.stdout.cursorTo(1,2)
        return lineId
    }
    replaceLine(lineId : number, message : string) : number {
        this.lines[lineId] = {timestamp : new Date().toLocaleTimeString(), message : message}
        this.redrawConsole()
        return lineId
    }

    redrawConsole() {
        console.clear()
        for (let line of this.lines) {
            console.log(`${line.timestamp} ${line.message}`)
        }
    }


}

type Log = {
    timestamp : string,
    message : string
}

const logger = new Logger()

export function log(message : string) : number {
    return logger.writeLine(message)
}

export function replaceLog(id : number, message : string) : number {
    return logger.replaceLine(id, message)
}