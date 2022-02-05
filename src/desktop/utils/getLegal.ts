import getStaticPath from '@/utils/getStaticPath'
import fs from 'fs'
import path from 'path'
import { getConfig } from './configManager'

async function getLegal() {
    let lang = getConfig().language
    if (lang.indexOf('zh_') == 0) lang = 'zh'
    else lang = 'en'
    return await fs.readFileSync(path.join(getStaticPath(), 'legal', `legal_${lang}.md`), 'utf8')
}

export default getLegal