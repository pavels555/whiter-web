import { ls, config } from 'npm-remote-ls'
import JSZip from 'jszip'



function lsPromise(name, version, flatten) {
    return new Promise((resolve, reject) => {
        ls(name, version, flatten, result => {
            resolve(result)
        })
    })
}

let makeTgzUrl = (packageVersion) => {

    let splits = packageVersion.split(/\/|@/).reverse();
    let version = splits[0];
    let name = splits[1];
    let scope = splits[2];
    if (scope) {
        return `https://registry.npmjs.cf/@${scope}/${name}/-/${name}-${version}.tgz`
    } else {
        return `https://registry.npmjs.cf/${name}/-/${name}-${version}.tgz`
    }
}

export async function getAllDependecies(name) {
    config({
        registry: "https://registry.npmjs.cf",
        development: true
    })

    return await lsPromise(name, '', true);
}

export async function downloadFiles(packages) {
    let files = packages.map(entry => {
        return {
            name: entry,
            url: makeTgzUrl(entry)
        }
    });

    let blobPromises = files.map(file => fetch(file.url).then(result => result.blob()));

    let blobs = await Promise.all(blobPromises);

    return files.map((file, index) => {
        return {...file, blob: blobs[index]}
    })
}

export async function createZip(files) {
    let zip = new JSZip();

    files.forEach(file => {
        zip.file(file.name, file.blob, { binary: true })
    });

    return await zip.generateAsync({ type: "blob" });
}