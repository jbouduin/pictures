process.on('message', (m) => {
  console.log('Got message:', m);
  process.send(`echo ${m}`);
});
