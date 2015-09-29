require('babel/polyfill');

import core from './core';
import z from './z';
import {g} from 'generator-trees';

const {toGenerator, loop, map, take} = g;

console.log({core});

const leagueTemplate = (() => {
  const handlers = (() => {
    const candidates = {},
          members = {},
          schedule = {twitter:{tweet:1}};

    return {
      $state: {candidates, members},
      $update: (...args) => {
        console.log('$update', ...args);
        calculatePoints();

        function calculatePoints() {
          for (let id in members) {
            const member = members[id];

            let twitter = 0;
            for (let cId in member.candidates) {
              const candidate = candidates[cId];

              twitter += candidate.tweets || 0;
            }
            member.points.twitter = twitter * schedule.twitter.tweet;
          }
        }
      },
      test(event) {
        return {wut:'sup'};
      },
      add(event, clock) {
        const {candidate, member} = event;

        if (candidate && member) return assignCandidate(candidate, member);
        if (candidate) return addCandidate(candidate);
        if (member) return addMember(member);

        function assignCandidate(candidateRef, memberRef) {
          const {id: cId} = candidateRef,
                {id: mId} = memberRef,
                candidate = candidates[cId],
                member = members[mId];

          if (!candidate) {}
          if (!member) {}

          member.candidates[cId] = true;
        }

        function addCandidate(candidate) {
          const {id} = candidate;

          if (candidates[id]) {} // notify error?

          candidates[id] = {};

          return {added: id};
        }

        function addMember(member) {
          const {id} = member;

          if (members[id]) {}

            members[id] = {candidates: {}, points: {}};

          return {added: id};
        }
      },
      tweet(event, clock) {
        const {candidate:{id}} = event,
              candidate = candidates[id];

        if (!candidate) {}

        candidate.tweets = (candidate.tweets || 0) + 1;

        return {tweeted: event};
      }
    };
  })();

  const events = {
    'candidate': {
      'twitter': ['tweet', 'mention']
    },
    'league': {
      'add': ['candidate', 'member']
    }
  };

  return {handlers, events};
});


// const tick = core(handlers, null, (...args) => console.log('update', ...args));
const {handlers} = leagueTemplate();
const tick = core(handlers, null, handlers.$update);

console.log({tick});

const outgoing = [];

const stream = loop(toGenerator([
  toGenerator([
    {type: 'add', candidate: {id: 1}},
    {type: 'add', candidate: {id: 2}},
    {type: 'add', candidate: {id: 3}},
    {type: 'add', candidate: {id: 4}},
  ]),
  toGenerator([
    {type: 'add', member: {id: 1}},
    {type: 'add', member: {id: 2}},
    {type: 'add', member: {id: 3}},
    {type: 'add', member: {id: 4}},
    {type: 'add', member: {id: 1}, candidate: {id: 1}},
    {type: 'add', member: {id: 3}, candidate: {id: 3}},
    {type: 'add', member: {id: 2}, candidate: {id: 1}},
    {type: 'add', member: {id: 1}, candidate: {id: 2}},
    {type: 'add', member: {id: 1}, candidate: {id: 4}}
  ]),
  toGenerator([
    {type: 'tweet', candidate: {id: 1, }, tweet: {id: 5}},
    {type: 'tweet', candidate: {id: 1, }, tweet: {id: 6}},
    {type: 'tweet', candidate: {id: 3, }, tweet: {id: 7}},
    {type: 'tweet', candidate: {id: 2, }, tweet: {id: 8}},
    {type: 'tweet', candidate: {id: 2, }, tweet: {id: 11}},
    {type: 'tweet', candidate: {id: 1, }, tweet: {id: 28}},
    {type: 'tweet', candidate: {id: 1, }, tweet: {id: 39}},
    {type: 'tweet', candidate: {id: 2, }, tweet: {id: 59}},
    {type: 'tweet', candidate: {id: 3, }, tweet: {id: 60}},
  ]),
  toGenerator([
    {type: 'tweet', candidate: {id: 1, }, tweet: {id: 5}},
    {type: 'tweet', candidate: {id: 1, }, tweet: {id: 6}},
    {type: 'tweet', candidate: {id: 3, }, tweet: {id: 7}},
    {type: 'tweet', candidate: {id: 2, }, tweet: {id: 8}},
    {type: 'tweet', candidate: {id: 2, }, tweet: {id: 11}},
    {type: 'tweet', candidate: {id: 1, }, tweet: {id: 28}},
    {type: 'tweet', candidate: {id: 1, }, tweet: {id: 39}},
    {type: 'tweet', candidate: {id: 2, }, tweet: {id: 59}},
    {type: 'tweet', candidate: {id: 3, }, tweet: {id: 60}},
  ])
]));

const outgoingGenerator = map(loop(toGenerator([createOutgoing, createOutgoing])), fn => fn());

function createOutgoing() {
  console.log('create');
  return [];
}

// run(take(loop(toGenerator([createOutgoing, createOutgoing]))), 3);

function run(g) {
  console.log('running');
  do {
    const {value, done} = g.next();

    console.log('run', {value, done});

    if (done) break;
  } while(true);
}

const gen = map(
              map(z(stream, outgoingGenerator), ([events, outgoing]) => [tick(events, outgoing), outgoing]),
              ([tick, outgoing]) => something(tick, outgoing));

// const gen = tick((function*() {
//   yield {type: 'test'};
//   return {type: 'test'};
// })(), outgoing);


const results = something(take(gen, 6));

function something(gen, outgoing) {
  console.log({gen});
  const results = [];
  do {
    let {value, done} = gen.next({});

    if (value !== outgoing) results.push(value);
    else console.log('Tick complete!');

    if (done) break;
  } while (true);

  return results;
}

const {candidates, members} = handlers.$state;

console.log(JSON.stringify({results, candidates, members}, null, '  '));