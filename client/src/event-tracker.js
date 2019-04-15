import ReactGA from 'react-ga';

class GA {
    constructor(ga) {
        this.GA = ga;
    }

    sendEvent(category, action, label) {
        const event = {
            hitType: 'event',
            eventCategory: category,
            eventAction: action,
            eventLabel: label,
        };
        this.GA.send(event);
    }

    recordPageView(pathname) {
        this.GA.set({ page: pathname })
        this.GA.pageview(pathname)
    }
}

const Analytics = GA(ReactGA);
export default Analytics;