//import WDIOReporter from '@wdio/reporter';
//import { Mailer } from './src/mailer.js';
//import { getFeatures, addScenarioStatus, closeFeature } from './src/dataHandler';
const WDIOReporter = require('@wdio/reporter').default;
const Mailer = require('./src/mailer.js').Mailer;
const dataHanlder = require('./src/dataHandler');
const getFeatures = dataHanlder.getFeatures; 
const addScenarioStatus = dataHanlder.addScenarioStatus; 
const closeFeature = dataHanlder.closeFeature;



class ReportMailer extends WDIOReporter {
    constructor(options) {
        /*
        * make reporter to write to the output stream by default
        */
        options = Object.assign(options, { stdout: true});
        super(options);

        this.mailer = new Mailer(options['mail']);
        this.isWaiting = false;
    }

    get isSynchronised() {
        return !this.isWaiting
    }

    onSuiteEnd(suite) {
        if(suite.type === 'scenario') {
            const state = suite.tests.map(el => el.state);
            if (state.includes('failed')) {
                addScenarioStatus(suite.title, 'fail');
            } else if(state.includes('skipped')) {
                addScenarioStatus(suite.title, 'skip');
            } else {
                addScenarioStatus(suite.title, 'pass');
            }
        } else if(suite.type === 'feature') {
            closeFeature(suite.title);
        }
    }

    async onRunnerEnd(runner) {
        const lastSpec = runner.config.specs[runner.config.specs.length - 1];
        const currentSpec = runner.specs[0];
        if(lastSpec.slice(1, lastSpec.length) === currentSpec) {
            this.isWaiting = true;
            try{
                await this.mailer.sendMail(getFeatures());
            } catch(err) {
                this.write(`Sorry, an error was throw: ${err}`)
            }
            this.write(JSON.stringify(getFeatures()));
            this.isWaiting = false;
        }
    }
};

exports.ReportMailer = ReportMailer;