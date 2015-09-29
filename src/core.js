import {g} from 'generator-trees';

const {map} = g;

export default (handlers, eventGenerator, update) => {
  let clock = 0;

  return tick;

  function* tick(events, outgoing) {
    clock++;
    console.log('Processing tick', clock);

    outgoing.$clock = clock;

    yield* map(events, process);

    update(clock);

    return outgoing;
  }

  function process(event) {
    console.log('Processing', {event});

    return (handlers[event.type] || defaultHandler)(event, clock);
  }

  function defaultHandler() {
    console.log('Default!');
  }
};