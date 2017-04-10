import moment from 'moment';
export let formatDate = (date) => moment(date).format("DD-MM-YYYY HH:mm:ss");