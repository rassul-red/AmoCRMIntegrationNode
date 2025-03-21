// const {AmoApiClient} = require('@mobilon/amotop');
const {AmoApiClient} = require('@mobilon-dev/amotop');

const {domain, accessToken, debug} = require('./_config.sample');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug});

