// ===== RUNTIME shared behavior =====

// Terminal boot-line typing effect
function typeLine(el, text, speed = 28, onDone) {
  if (!el) return;
  let i = 0;
  el.textContent = '';
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  function step() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      el.appendChild(cursor);
      i++;
      setTimeout(step, speed);
    } else if (onDone) {
      onDone();
    }
  }
  step();
}

document.addEventListener('DOMContentLoaded', () => {
  const bootEl = document.querySelector('[data-boot-line]');
  if (bootEl) {
    const text = bootEl.getAttribute('data-boot-line');
    typeLine(bootEl, text, 22);
  }

  // Contact form (posts to n8n webhook if configured, else demo-confirms)
  const form = document.querySelector('#leadForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = form.querySelector('.form-msg');
      const btn = form.querySelector('button[type="submit"]');
      const webhookUrl = form.getAttribute('data-webhook');
      btn.textContent = 'SENDING...';
      const data = Object.fromEntries(new FormData(form).entries());

      try {
        if (webhookUrl) {
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
        }
        msg.textContent = '> 200 OK — request received. We\'ll reply within 1 business day.';
        msg.classList.add('show', 'ok');
        form.reset();
      } catch (err) {
        msg.textContent = '> submission logged locally — connect the n8n webhook in script.js to go live.';
        msg.classList.add('show', 'ok');
        form.reset();
      } finally {
        btn.textContent = 'RUN →';
      }
    });
  }
});
