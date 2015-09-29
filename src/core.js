export default (handlers, eventGenerator, update) => {
  let clock = 0;

  return tick;

  function* tick(events, outgoing) {
    clock++;
    console.log('Processing tick', clock);

    outgoing.$clock = clock;

    do {
      let {value, done} = events.next(),
          result = process(value);

      console.log({result});
      if (result) {
        outgoing.push(result); // this could be more complicated...returns null, multiple results?
        yield result;
      }

      //something should be different here?
      // yield result;

      if (done) break;
    } while (true);

    update(clock);

    return outgoing;
  }

  function process(event) {
    console.log('Processing', {event});

    return (handlers[event.type] || defaultHandler)(event, clock);

    // while(let {value, done} = events.next()) {
    //   const result = (handlers[type] || defaultHandler)(value);

    //   if (done) return result;
    //   else yield result;
    // }
  }

  function defaultHandler() {
    console.log('Default!');
  }

  // function tick(transport) {
  //   clock++;

  //   transport.clock = clock;
  //   transport.events = processEventQ();

  //   update(clock);

  //   transport.output = swapQ();

  //   return transport;
  // }

  // function processEventQ() {
  //   let events = swapQ(getEventsFn());
  // }

  // function swapQ(newQ) {
  //   let events = newQ || eventQ;
  //   eventQ = [];
  //   return events;
  // }
};

// export default (handlers, eventGenerator, update) => {
//   let clock = 0,
//       eventQ = [];

//   return tick;

//   function tick(transport) {
//     clock++;

//     transport.clock = clock;
//     transport.events = processEventQ();

//     update(clock);

//     transport.output = swapQ();

//     return transport;
//   }

//   function processEventQ() {
//     let events = swapQ(getEventsFn());
//   }

//   function swapQ(newQ) {
//     let events = newQ || eventQ;
//     eventQ = [];
//     return events;
//   }
// };