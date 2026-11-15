export function onRequest({request}) {
  return Response.redirect(new URL('/#/admin', request.url).href, 302);
}
