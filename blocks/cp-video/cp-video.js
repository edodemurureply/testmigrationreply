/**
 * cp-video — /en/company-profile inline DAM video (live section .hweseinxzh, .video-dam-container
 * with --dam-video-iframe-aspect-ratio 56.25 %): the DAM player iframe across the content width
 * (cols 1-4 / 1-8 / 1-12, sides 40 / 64), no margins.
 *
 * Authoring: one cell with the DAM player link (dam-media.reply.com …/widget.html); the link text
 * is the video title. Without a player link the block keeps its authored content.
 * @ew-exempt player-url — the authored link is replaced by the player iframe.
 */
export default function decorate(block) {
  const link = block.querySelector('a[href*="dam-media.reply.com"]');
  if (!link) return;
  const href = link.getAttribute('href');
  const title = link.textContent.trim();
  const frame = document.createElement('div');
  frame.className = 'cp-video-frame';
  const iframe = document.createElement('iframe');
  iframe.src = href.replace(/^http:/, 'https:');
  iframe.title = title.startsWith('http') ? 'video' : title;
  iframe.loading = 'lazy';
  iframe.allow = 'autoplay; fullscreen';
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('frameborder', '0');
  iframe.referrerPolicy = 'no-referrer-when-downgrade';
  frame.append(iframe);
  const inner = document.createElement('div');
  inner.className = 'cp-video-inner';
  inner.append(frame);
  block.replaceChildren(inner);
}
