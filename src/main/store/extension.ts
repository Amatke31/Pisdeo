import { CommonApi, UIApi } from "../utils/extension/extension-api";
import path from 'path'
import fs from 'fs'
import vm from 'vm'
import platform from '@/main/utils/platform/platform'
import axios from 'axios'
import JSZip from 'jszip'

const extension = {
    state() {
        return {
            extensionInfo: [],
            instance: []
        };
    },
    mutations: {},
    actions: {},
};

export default extension;
