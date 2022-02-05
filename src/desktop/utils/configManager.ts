import path from 'path'
import fs from 'fs'
import yaml from 'yaml'
import { app } from 'electron'
import WinSize from '../../types/WinSize'

const configFilePath = path.join(app.getPath('userData'), 'config.yaml')

type Config = {
    init: Boolean
    configVersion: string
    language: 'ask' | string
    winSize: WinSize
    theme: string
    updateCheck: 'ask' | boolean
}

let config: Config

export const saveConfigFile = async() => await fs.writeFileSync(configFilePath, yaml.stringify(config), 'utf8')
export const getConfig = () => config


const defaultWinSize: WinSize = {
    width: 1366,
    height: 768,
    max: false
}

const defaultConfig: Config = {
    init: false,
    configVersion: 'Manual Build',
    language: 'en_us',
    winSize: defaultWinSize,
    theme: 'auto',
    updateCheck: 'ask'
}

if (fs.existsSync(configFilePath)) {
    config = yaml.parse(fs.readFileSync(configFilePath, 'utf8'))
    for (const i in defaultConfig) {
        if (!(i in config)) {
            config[i as keyof typeof config] = getKey(defaultConfig, i)
        }
    }
    saveConfigFile()
} else {
    config = defaultConfig
    saveConfigFile()
}

function getKey(obj: any, i: string | number) {
    return obj[i as keyof typeof obj] || undefined
}