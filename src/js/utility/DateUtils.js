import moment from 'moment';
export let formatDate = (date) => moment(date).format("DD-MM-YYYY HH:mm:ss");
export let formatDateHuman = (date) => moment(date).format("Do MMMM YYYY, h:mm:ss a");
export let minDate = new Date('1900-01-01');