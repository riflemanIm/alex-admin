/* @flow */

import { sanitizeHtml } from '../sanitizeHtml';

test('it does not close self closed tags', () => {
  expect(
    sanitizeHtml(`
    hello<br>world
  `)
  ).toMatchInlineSnapshot(`
"
    hello<br>world
  "
`);

  expect(
    sanitizeHtml(`
    hello<BR>world
  `)
  ).toMatchInlineSnapshot(`
"
    hello<BR>world
  "
`);

  expect(
    sanitizeHtml(`
    hello<br/>world
  `)
  ).toMatchInlineSnapshot(`
"
    hello<br/>world
  "
`);
});
