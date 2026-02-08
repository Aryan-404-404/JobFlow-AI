/* global chrome */
console.log("JobFlow AI Scraper Loaded 🚀");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "SCRAPE_JOB") {
        try {
            const rawData = getPageContent();
            console.log("📦 JobFlow Scraped Data:", rawData);
            sendResponse({ success: true, data: rawData });
        } catch (error) {
            console.error("❌ Scraping Failed:", error);
            sendResponse({ success: false, error: error.message });
        }
    }
    return true;
});

const getPageContent = () => {
    const hostname = window.location.hostname;
    if (hostname.includes('linkedin.com')) {
        console.log("🕵️‍♂️ Detected LinkedIn. Using Special Strategy.");
        return getLinkedInText();
    }
    console.log("🕵️‍♂️ Detected Generic Site. Using Universal Strategy.");
    return getGenericText();
}

const getLinkedInText = () => {
    const topCard =
        document.querySelector('.job-details-jobs-unified-top-card__content--two-pane') ||
        document.querySelector('.jobs-unified-top-card') ||
        document.querySelector('.job-view-layout');

    const description =
        document.querySelector('#job-details') ||
        document.querySelector('.jobs-description__content');

    return {
        headerText: topCard ? topCard.innerText.replace(/\n\s*\n/g, '\n') : "",
        descriptionText: description ? description.innerText : "",
        url: window.location.href
    };
}

const getGenericText = () => {
    const h1 = document.querySelector('h1')
    const mainBody = document.querySelector('main') ||
        document.querySelector('article') ||
        document.querySelector('#jobDescriptionText') ||
        document.querySelector('.job-desc') ||
        document.body;

    return {
        headerText: h1 ? h1.innerText : document.title,
        descriptionText: mainBody ? mainBody.innerText : "",
        url: window.location.href
    }
}