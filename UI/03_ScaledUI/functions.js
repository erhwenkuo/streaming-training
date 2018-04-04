'use strict';

module.exports = {
  setMessage: setMessage
};

const MESSAGES = [
  'what a nice day',
  'how\'s everybody?',
  'how\'s it going?',
  'what a lovely socket.io chatroom',
  'to be or not to be, that is the question',
  'Romeo, Romeo! wherefore art thou Romeo?',
  'now is the winter of our discontent.',
  'get thee to a nunnery',
  'a horse! a horse! my kingdom for a horse!'
];

function setMessage(context, events, done) {
  // pick a message randomly
  const index = Math.floor(Math.random() * MESSAGES.length);
  // make it available to templates as "message"
  context.vars.message = MESSAGES[index];
  return done();
}