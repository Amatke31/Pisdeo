import path from 'path'
import fs from 'fs'
import yaml from 'yaml'
import { app } from 'electron'
import WinSize from '../types/WinSize'

const configFilePath = path.join(app.getPath('userData'), 'config.yaml')

type Config = {
    language: string
    winSize: WinSize
    theme: string
    updateCheck: 'ask' | boolean
}

let config: Config

export const saveConfigFile = () => fs.writeFileSync(configFilePath, yaml.stringify(config), 'utf8')
export const getConfig = () => config