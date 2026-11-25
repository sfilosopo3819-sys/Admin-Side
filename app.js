/* Only job: open/close popups. data-open="id" opens a dialog, data-close closes it. */
document.addEventListener('click', e => {
    const c = e.target.closest('[data-close]'), o = e.target.closest('[data-open]');
    if (c) c.closest('dialog').close();
    if (o) { document.querySelectorAll('dialog[open]').forEach(d => d.close()); document.getElementById(o.dataset.open).showModal() }
});
/* Dashboard: show month pickers for "Custom". Students: filter rows by program (also from ?program= link). */
const pre = document.getElementById('pre'); if (pre) pre.onchange = () => document.getElementById('cus').hidden = pre.value != 'custom';
const fp = document.getElementById('fp'); if (fp) {
    const f = () => document.querySelectorAll('tr[data-p]').forEach(r => r.hidden = fp.value && r.dataset.p != fp.value);
    const q = new URLSearchParams(location.search).get('program'); if (q) fp.value = q; fp.onchange = f; f()
}
