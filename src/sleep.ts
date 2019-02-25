const sleep = s => new Promise((resolve, _) => {
  setTimeout(() => {
    resolve();
  }, s);
});

export default sleep;
