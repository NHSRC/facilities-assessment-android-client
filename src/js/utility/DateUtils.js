import moment from 'moment';
export let formatDate = (date) => moment(date).format("DD-MM-YYYY HH:mm:ss");
export let minDate = new Date(-8640000000000000);