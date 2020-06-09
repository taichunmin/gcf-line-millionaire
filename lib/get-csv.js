const _ = require('lodash')
const axios = require('axios')
const Papa = require('papaparse')

module.exports = async url => {
  const csv = _.trim(_.get(await axios.get(url), 'data'))
  return _.get(Papa.parse(csv, {
    encoding: 'utf8',
    header: true,
  }), 'data', [])
}
