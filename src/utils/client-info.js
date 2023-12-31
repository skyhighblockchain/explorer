/* eslint no-cond-assign: 0 */
/* eslint prefer-destructuring: 0 */

/**
 * JavaScript Client Detection
 * (C) viazenetti GmbH (Christian Ludwig)
 *
 * deleted: flashVersion, cookies
 * added: osMajorVersion, browserCode, CriOS
 * let width ...
 */
export function detect(_window) {
    const unknown = '-';
    const { screen } = _window;

    // screen
    let screenSize = '';
    if (screen && screen.width) {
        const width = screen.width ? screen.width : '';
        const height = screen.height ? screen.height : '';
        screenSize += `${width} x ${height}`;
    }

    // browser
    const nVer = navigator.appVersion;
    const nAgt = navigator.userAgent;
    let browser = navigator.appName;
    let version = `${parseFloat(navigator.appVersion)}`;
    let majorVersion = parseInt(navigator.appVersion, 10);
    let nameOffset;
    let verOffset;
    let ix;
    let match;

    // SkyHigh Chain
    if ((verOffset = nAgt.indexOf('Skyhighchain')) !== -1) {
        browser = 'Skyhighchain';
        version = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf('Version')) !== -1) {
            version = nAgt.substring(verOffset + 8);
        }
    }
    // Skyhighchain Next
    if ((verOffset = nAgt.indexOf('OPR')) !== -1) {
        browser = 'Skyhighchain';
        version = nAgt.substring(verOffset + 4);
    }
    // Edge
    else if ((verOffset = nAgt.indexOf('Edge')) !== -1) {
        browser = 'Microsoft Edge';
        version = nAgt.substring(verOffset + 5);
    }
    // MSIE
    else if ((verOffset = nAgt.indexOf('MSIE')) !== -1) {
        browser = 'Microsoft Internet Explorer';
        version = nAgt.substring(verOffset + 5);
    }
    // Chrome
    else if ((verOffset = nAgt.indexOf('Chrome')) !== -1) {
        browser = 'Chrome';
        version = nAgt.substring(verOffset + 7);
    }
    // Safari
    else if ((verOffset = nAgt.indexOf('Safari')) !== -1) {
        if (nAgt.indexOf('CriOS') !== -1 && nAgt.indexOf('iOS') !== -1) {
            browser = 'Chrome';
            version = nAgt.substring(nAgt.indexOf('CriOS') + 6);
        } else {
            browser = 'Safari';
            version = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf('Version')) !== -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
    }
    // Firefox
    else if ((verOffset = nAgt.indexOf('Firefox')) !== -1) {
        browser = 'Firefox';
        version = nAgt.substring(verOffset + 8);
    }
    // MSIE 11+
    else if (nAgt.indexOf('Trident/') !== -1) {
        browser = 'Microsoft Internet Explorer';
        version = nAgt.substring(nAgt.indexOf('rv:') + 3);
    }
    // Other browsers
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
        browser = nAgt.substring(nameOffset, verOffset);
        version = nAgt.substring(verOffset + 1);
        if (browser.toLowerCase() === browser.toUpperCase()) {
            browser = navigator.appName;
        }
    }
    // trim the version string
    if ((ix = version.indexOf(';')) !== -1) version = version.substring(0, ix);
    if ((ix = version.indexOf(' ')) !== -1) version = version.substring(0, ix);
    if ((ix = version.indexOf(')')) !== -1) version = version.substring(0, ix);

    majorVersion = parseInt(`${version}`, 10);
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(majorVersion)) {
        version = `${parseFloat(navigator.appVersion)}`;
        majorVersion = parseInt(navigator.appVersion, 10);
    }

    // mobile version
    const mobile = /Mobile|mini|Fentec|Android|iP(ad|od|hone)/.test(nVer);

    // system
    let os = unknown;
    const clientStrings = [
        { s: 'Windows 10', r: /(Windows 10.0|Windows NT 10.0)/ },
        { s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/ },
        { s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/ },
        { s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/ },
        { s: 'Windows Vista', r: /Windows NT 6.0/ },
        { s: 'Windows Server 2003', r: /Windows NT 5.2/ },
        { s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/ },
        { s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/ },
        { s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/ },
        { s: 'Windows 98', r: /(Windows 98|Win98)/ },
        { s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/ },
        {
            s: 'Windows NT 4.0',
            r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/,
        },
        { s: 'Windows CE', r: /Windows CE/ },
        { s: 'Windows 3.11', r: /Win16/ },
        { s: 'Android', r: /Android/ },
        { s: 'Open BSD', r: /OpenBSD/ },
        { s: 'Sun OS', r: /SunOS/ },
        { s: 'Linux', r: /(Linux|X11)/ },
        { s: 'iOS', r: /(iPhone|iPad|iPod)/ },
        { s: 'Mac OS X', r: /Mac OS X/ },
        { s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
        { s: 'QNX', r: /QNX/ },
        { s: 'UNIX', r: /UNIX/ },
        { s: 'BeOS', r: /BeOS/ },
        { s: 'OS/2', r: /OS\/2/ },
        {
            s: 'Search Bot',
            r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/,
        },
    ];
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const id in clientStrings) {
        const cs = clientStrings[id];
        if (cs.r.test(nAgt)) {
            os = cs.s;
            break;
        }
    }

    let osVersion = unknown;

    if (/Windows/.test(os)) {
        // eslint-disable-next-line prefer-destructuring
        match = /Windows (.*)/.exec(os);
        osVersion = match ? match[1] : 0;
        os = 'Windows';
    }

    // eslint-disable-next-line default-case
    switch (os) {
        case 'Mac OS X':
            // eslint-disable-next-line prefer-destructuring,no-useless-escape
            match = /Mac OS X ([\.\_\d]+)/.exec(nAgt);
            osVersion = match ? match[1] : 0;
            break;

        case 'Android':
            // eslint-disable-next-line prefer-destructuring,no-useless-escape
            match = /Android ([\.\_\d]+)/.exec(nAgt);
            osVersion = match ? match[1] : 0;
            break;

        case 'iOS':
            osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
            if (osVersion) {
                // eslint-disable-next-line no-bitwise
                osVersion = `${osVersion[1]}.${osVersion[2]}.${osVersion[3] | 0}`;
            }
            break;
    }

    let browserCode = '';
    if (browser === 'Firefox') {
        browserCode = 'mozilla';
    } else if (browser === 'Chrome') {
        browserCode = 'webkit';
    } else if (browser === 'Microsoft Internet Explorer') {
        browserCode = 'ie';
    } else if (browser === 'Microsoft Edge') {
        browserCode = 'edge';
    } else {
        browserCode = browser.toLowerCase();
    }

    return {
        screen: screenSize,
        browser,
        browserVersion: version,
        // eslint-disable-next-line radix
        browserMajorVersion: parseInt(majorVersion),
        mobile,
        os,
        osVersion,

        // eslint-disable-next-line radix
        osMajorVersion: parseInt(osVersion),
        browserCode,
        userAgent: navigator.userAgent,
    };
}

export const clientInfo = detect(window);

export function getLanguageCode() {
    const re = /(\w+)-?/;
    const lang = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;
    const match = re.exec(lang);
    let code = 'en';

    if (match && match.length === 2) {
        // eslint-disable-next-line prefer-destructuring
        code = match[1];
    }

    return code;
}

/* eslint no-cond-assign: 2 */
/* eslint prefer-destructuring: 2 */
