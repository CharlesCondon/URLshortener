class URLShortener {
    constructor(longurl, urlData) {
        this.originalURL = longurl;
        this.clickCount = 0;
        this.urlData = urlData;
    }
    shorten() {
        const long = this.originalURL;
        let short = '';
        let protocol;
        if (long.includes('https')) {
            protocol = 'https';
        }
        else {
            protocol = 'http';
        }
        short += (protocol + '://localhost:3000/');

        for (let i = 0; i < 6; i++) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const rand = Math.floor(Math.random() * chars.length);
            short += chars.charAt(rand);
        }
        this.shortURL = short;
        return short;
    }
    updateClickCount() {
        this.clickCount += 1;
    }
}

module.exports = {
    URLShortener: URLShortener
};