import moment from 'moment';

const time = (timestamp: string | number | Date) => {
  const thatTime = moment(timestamp);
  if (thatTime.isSame(moment(), 'day')) {
    return thatTime.fromNow().toString();
  }
  if (thatTime.isAfter(moment().subtract(1, 'day'), 'day')) {
    return thatTime.calendar().toString();
  }
  return moment(timestamp).format('DD-MM-YYYY h:mm A').toString();
};

export default time;
