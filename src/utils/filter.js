import Vue from 'vue';
import moment from "moment";
Vue.filter('dateTime', function(value, outputFormat='DD-MMM-YYYY hh:mm:ss') {
    if (!value) return '';
    return moment(value).format(outputFormat)
  });