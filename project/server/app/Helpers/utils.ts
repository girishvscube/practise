import Mail from '@ioc:Adonis/Addons/Mail'

export function generateRandomToken(length) {
    var result = ''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

export function NumInWords(number) {
    const first = [
        '',
        'one ',
        'two ',
        'three ',
        'four ',
        'five ',
        'six ',
        'seven ',
        'eight ',
        'nine ',
        'ten ',
        'eleven ',
        'twelve ',
        'thirteen ',
        'fourteen ',
        'fifteen ',
        'sixteen ',
        'seventeen ',
        'eighteen ',
        'nineteen ',
    ]
    const tens = [
        '',
        '',
        'twenty',
        'thirty',
        'forty',
        'fifty',
        'sixty',
        'seventy',
        'eighty',
        'ninety',
    ]
    const mad = ['', 'thousand', 'million', 'billion', 'trillion']
    let word = ''

    for (let i = 0; i < mad.length; i++) {
        let tempNumber = number % (100 * Math.pow(1000, i))
        if (Math.floor(tempNumber / Math.pow(1000, i)) !== 0) {
            if (Math.floor(tempNumber / Math.pow(1000, i)) < 20) {
                word = first[Math.floor(tempNumber / Math.pow(1000, i))] + mad[i] + ' ' + word
            } else {
                word =
                    tens[Math.floor(tempNumber / (10 * Math.pow(1000, i)))] +
                    '-' +
                    first[Math.floor(tempNumber / Math.pow(1000, i)) % 10] +
                    mad[i] +
                    ' ' +
                    word
            }
        }

        tempNumber = number % Math.pow(1000, i + 1)
        if (Math.floor(tempNumber / (100 * Math.pow(1000, i))) !== 0)
            word = first[Math.floor(tempNumber / (100 * Math.pow(1000, i)))] + 'hunderd ' + word
    }
    return word.toUpperCase()
}

export function sendTempPassword(user, tempPassword) {
    let htmlContent = `Hi, ${user.name}<br/><br/>
    Bellow you can find the Temporary Password For Login to ATD Dashboard
    <h2>EMAIL: ${user.email}</h2>
    <h2>Password: ${tempPassword}</h2>
    <br/><br/>

    
    Thank you, <br/>
    Team ATD <br/>
    <br/><br/>`

    Mail.sendLater((message) => {
        message
            .from('noreply@scube.me')
            .to(user.email)
            .subject(`ATD account credentials`)
            .html(htmlContent)
    })
}

export const statesList = [
    {
        code: 'AN',
        name: 'Andaman and Nicobar Islands',
    },
    {
        code: 'AP',
        name: 'Andhra Pradesh',
    },
    {
        code: 'AR',
        name: 'Arunachal Pradesh',
    },
    {
        code: 'AS',
        name: 'Assam',
    },
    {
        code: 'BR',
        name: 'Bihar',
    },
    {
        code: 'CG',
        name: 'Chandigarh',
    },
    {
        code: 'CH',
        name: 'Chhattisgarh',
    },
    {
        code: 'DH',
        name: 'Dadra and Nagar Haveli',
    },
    {
        code: 'DD',
        name: 'Daman and Diu',
    },
    {
        code: 'DL',
        name: 'Delhi',
    },
    {
        code: 'GA',
        name: 'Goa',
    },
    {
        code: 'GJ',
        name: 'Gujarat',
    },
    {
        code: 'HR',
        name: 'Haryana',
    },
    {
        code: 'HP',
        name: 'Himachal Pradesh',
    },
    {
        code: 'JK',
        name: 'Jammu and Kashmir',
    },
    {
        code: 'JH',
        name: 'Jharkhand',
    },
    {
        code: 'KA',
        name: 'Karnataka',
    },
    {
        code: 'KL',
        name: 'Kerala',
    },
    {
        code: 'LD',
        name: 'Lakshadweep',
    },
    {
        code: 'MP',
        name: 'Madhya Pradesh',
    },
    {
        code: 'MH',
        name: 'Maharashtra',
    },
    {
        code: 'MN',
        name: 'Manipur',
    },
    {
        code: 'ML',
        name: 'Meghalaya',
    },
    {
        code: 'MZ',
        name: 'Mizoram',
    },
    {
        code: 'NL',
        name: 'Nagaland',
    },
    {
        code: 'OR',
        name: 'Odisha',
    },
    {
        code: 'PY',
        name: 'Puducherry',
    },
    {
        code: 'PB',
        name: 'Punjab',
    },
    {
        code: 'RJ',
        name: 'Rajasthan',
    },
    {
        code: 'SK',
        name: 'Sikkim',
    },
    {
        code: 'TN',
        name: 'Tamil Nadu',
    },
    {
        code: 'TS',
        name: 'Telangana',
    },
    {
        code: 'TR',
        name: 'Tripura',
    },
    {
        code: 'UP',
        name: 'Uttar Pradesh',
    },
    {
        code: 'UK',
        name: 'Uttarakhand',
    },
    {
        code: 'WB',
        name: 'West Bengal',
    },
]
