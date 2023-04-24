export const printBill = (link) => {
    let contentType = 'application/pdf'
    const content = link
    console.log(content)
    const sliceSize = 512
    // method which converts base64 to binary
    const byteCharacters = window.atob(content)

    const byteArrays = []
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize)
        // console.log(slice)
        const byteNumbers = new Array(slice.length)
        // console.log(byteNumbers)
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i)
        }
        // console.log(byteNumbers)
        const byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
    }
    // console.log(byteArrays)
    const blob = new Blob(byteArrays, {
        type: contentType,
    })

    const blobURL = URL.createObjectURL(blob)
    if (isTouchDevice()) {
        var printWindow = window.open(blobURL, '', 'width=800,height=500')
        printWindow.print()
    } else {
        const iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        iframe.src = blobURL
        document.body.appendChild(iframe)
        iframe.contentWindow.print()
    }
}

const isTouchDevice = () => {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i,
    ]

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem)
    })
}
