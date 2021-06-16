export default function (count = 60) {
  const timer = setInterval(() => {
    count --;
  }, 1000);
  if(count < 0){
    clearInterval(timer);
  }
}