// Quick script to sanity-check reaction behavior for posts
// Usage: node ./scripts/test-reaction-migration.js
// Requires the dev server to be running at http://localhost:3000

const fetch =
  globalThis.fetch ||
  (async (...args) => {
    throw new Error(
      "Please run in Node 18+ or configure fetch in your environment"
    );
  });

async function main() {
  const base = "http://localhost:3000";
  const postsRes = await fetch(`${base}/api/blogs`);
  if (!postsRes.ok) {
    console.error("Failed to list posts", await postsRes.text());
    process.exit(1);
  }
  const body = await postsRes.json();
  // Normalize possible paginated responses or raw arrays/objects
  let posts = null;
  if (Array.isArray(body)) posts = body;
  else if (body?.data?.items && Array.isArray(body.data.items))
    posts = body.data.items;
  else if (body?.items && Array.isArray(body.items)) posts = body.items;
  else if (body?.data && Array.isArray(body.data)) posts = body.data;
  else if (body?.data) posts = [body.data];
  else posts = [body];
  if (!posts || posts.length === 0) {
    console.error("No posts found to test against");
    process.exit(1);
  }
  const post = posts[0];
  const slug =
    post.slug || post._doc?.slug || (post?.slug && post.slug) || post?.slug;
  console.log("Testing on post", slug);

  const visitorA = "test-v1-" + Date.now();
  const visitorB = "test-v2-" + Date.now();
  const ip = "203.0.113.42"; // arbitrary test IP

  // Helper to react
  async function react(visitorId, reaction, includeCookie, forwardedIp) {
    const headers = { "Content-Type": "application/json" };
    if (includeCookie && visitorId)
      headers["cookie"] = `visitor-id=${visitorId}`;
    if (forwardedIp) headers["x-forwarded-for"] = forwardedIp;
    const res = await fetch(`${base}/api/blogs/${slug}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ action: "reaction", reaction }),
      credentials: "include",
    });
    const json = await res.json().catch(() => null);
    return { status: res.status, body: json };
  }

  // First: visitor A reacts with 1
  console.log("Visitor A reacts with 1");
  await react(visitorA, 1, true, ip);

  // Second: visitor B (different visitor-id cookie) reacts with 4 from same IP
  console.log("Visitor B reacts with 4");
  await react(visitorB, 4, true, ip);

  // Fetch post and inspect reactions
  const postRes = await fetch(`${base}/api/blogs/${slug}`);
  const postJson = await postRes.json();
  const resData = postJson?.data || postJson;
  console.log(
    "Reactions after two distinct visitors:",
    resData.reactionsCount,
    "visitorReaction:",
    resData.visitorReaction
  );

  // Third: generated visitor (no cookie) reacts with 3 from same IP — should NOT migrate visitor A's 1
  console.log(
    "Generated visitor (no cookie) reacts with 3 from same IP — should not migrate"
  );
  await react(null, 3, false, ip);

  // Fetch post and inspect reactions again
  const postRes2 = await fetch(`${base}/api/blogs/${slug}`);
  const postJson2 = await postRes2.json();
  const resData2 = postJson2?.data || postJson2;
  console.log(
    "Reactions after generated visitor:",
    resData2.reactionsCount,
    "visitorReaction:",
    resData2.visitorReaction
  );

  console.log("Done.");
}

main().catch((e) => {
  console.error("Test script failed", e);
  process.exit(1);
});
